const GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';
const GUMROAD_SALES_URL = 'https://api.gumroad.com/v2/sales';
const NEW_PRODUCT_ID = 'xjW3twDEIx4LJQrkpgz4fQ==';
const OLD_PRODUCT_ID = 'dK0Er2rZ-4VFBT6KD-VTYw==';
const ADMIN_SESSION_COOKIE = 'rtl_master_admin_session';
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function isAllowedDashboardOrigin(origin) {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && /^http:$/.test(url.protocol)) return true;
    if (hostname.endsWith('.vercel.app') && url.protocol === 'https:') return true;
    return false;
  } catch {
    return false;
  }
}

function buildCorsHeaders(request, { allowCredentials = false } = {}) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token'
  };
  const origin = request ? request.headers.get('Origin') || '' : '';

  if (isAllowedDashboardOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
    if (allowCredentials) headers['Access-Control-Allow-Credentials'] = 'true';
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}

function json(data, status = 200, request = null, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...buildCorsHeaders(request, { allowCredentials: true }),
      ...extraHeaders
    }
  });
}

function jsonPreflight(request) {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request, { allowCredentials: true })
  });
}

function schedule(ctx, promise) {
  if (ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(promise);
    return;
  }

  void promise;
}

function maskLicenseKey(licenseKey) {
  const key = String(licenseKey || '').trim();
  if (key.length <= 8) return key ? '••••' : '';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function compactString(value, maxLength = 120) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  if (!text) return null;
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function toIntegerOrNull(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.round(number));
}

function toSuccessInt(value) {
  return value === false ? 0 : 1;
}

function toIsoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatCount(value, unit) {
  return `${value.toLocaleString('en-US')} ${unit}`;
}

function countUnique(rows, predicate) {
  const ids = new Set();
  rows.forEach((row) => {
    if (predicate && !predicate(row)) return;
    if (row.figma_user_id) ids.add(row.figma_user_id);
  });
  return ids.size;
}

function labelFromEventType(eventType) {
  return String(eventType || '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Event';
}

function labelFromFeature(feature) {
  const labels = {
    'mirror-only': 'Mirror Layouts',
    'mirror-translate': 'Mirror & Translate',
    'translate-only': 'Translate Text Layers',
    'create-variant': 'Variant Creation',
    'change-font': 'Font Replacement',
    'mirror-main-components': 'Mirror Main Components'
  };
  return labels[feature] || labelFromEventType(feature || 'Other');
}

function safeMetadataJson(metadata) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;

  const allowed = {};
  [
    'translateText',
    'mirrorInstances',
    'createVariant',
    'shouldMirror',
    'autoFit',
    'provider',
    'source'
  ].forEach((key) => {
    const value = metadata[key];
    if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
      allowed[key] = typeof value === 'string' ? compactString(value, 60) : value;
    }
  });

  const json = JSON.stringify(allowed);
  return json === '{}' ? null : json.slice(0, 1000);
}

function isMissingColumnError(error) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /no such column|has no column named|no column named/i.test(message);
}

function isMissingTableError(error) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /no such table/i.test(message);
}

function normalizeSubscriptionPlan(value) {
  const text = compactString(value, 120);
  if (!text) return null;
  const normalized = text.toLowerCase();

  if (/annual|year|yearly|سنو|سنوي|سنة/.test(normalized)) return 'yearly';
  if (/month|monthly|شهر/.test(normalized)) return 'monthly';
  if (/one[-\s]?time|lifetime|مرة|مدى الحياة/.test(normalized)) return 'one_time';
  return null;
}

function getFirstPurchaseValue(purchase, keys) {
  for (const key of keys) {
    if (purchase && purchase[key] !== undefined && purchase[key] !== null && String(purchase[key]).trim() !== '') {
      return purchase[key];
    }
  }

  return null;
}

function inferSubscriptionPlan(purchase) {
  const directPlan = getFirstPurchaseValue(purchase, [
    'recurrence',
    'recurrence_label',
    'subscription_recurrence',
    'subscription_duration',
    'subscription_plan',
    'membership_duration'
  ]);
  const normalizedDirectPlan = normalizeSubscriptionPlan(directPlan);
  if (normalizedDirectPlan) return normalizedDirectPlan;

  const searchableText = [
    purchase && purchase.variants,
    purchase && purchase.variant,
    purchase && purchase.tier_name,
    purchase && purchase.product_name
  ].filter(Boolean).join(' ');
  const normalizedSearchPlan = normalizeSubscriptionPlan(searchableText);
  if (normalizedSearchPlan) return normalizedSearchPlan;

  return purchase && purchase.subscription_id ? 'subscription' : 'one_time';
}

function inferSubscriptionStatus(purchase) {
  if (!purchase) return null;
  if (purchase.chargebacked) return 'chargebacked';
  if (purchase.refunded) return 'refunded';
  if (purchase.subscription_failed_at) return 'payment_failed';
  if (purchase.subscription_ended_at || purchase.subscription_cancelled_at || purchase.subscription_canceled_at) return 'ended';
  return inferSubscriptionPlan(purchase) === 'one_time' ? 'one_time' : 'active';
}

function extractGumroadPurchaseDetails(gumroadData) {
  const purchase = gumroadData && gumroadData.purchase ? gumroadData.purchase : (gumroadData || {});
  const buyerName = purchase.full_name || purchase.name || purchase.purchaser_name || purchase.customer_name || null;
  const purchaseDate = purchase.created_at || purchase.sale_timestamp || purchase.purchase_date || purchase.created || null;
  const subscriptionEndsAt = getFirstPurchaseValue(purchase, [
    'subscription_ended_at',
    'subscription_cancelled_at',
    'subscription_canceled_at',
    'subscription_failed_at',
    'current_period_end',
    'current_period_ends_at',
    'period_end',
    'expires_at',
    'ended_at',
    'ends_at'
  ]);

  return {
    gumroadSaleId: purchase.sale_id || purchase.id ? String(purchase.sale_id || purchase.id) : null,
    gumroadEmail: compactString(purchase.email, 160),
    gumroadBuyerName: compactString(buyerName, 160),
    gumroadPurchaseCreatedAt: compactString(purchaseDate, 80),
    gumroadProductName: compactString(purchase.product_name, 180),
    gumroadSubscriptionPlan: inferSubscriptionPlan(purchase),
    gumroadSubscriptionStatus: inferSubscriptionStatus(purchase),
    gumroadSubscriptionEndsAt: compactString(subscriptionEndsAt, 80)
  };
}

function getAdminTokenFromRequest(request) {
  const authorization = request.headers.get('Authorization') || '';
  if (authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.slice(7).trim();
  }

  return (request.headers.get('X-Admin-Token') || '').trim();
}

function encodeBase64Url(bytes) {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(text) {
  const base64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4 || 4)) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function parseCookies(request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  return cookieHeader.split(';').reduce((cookies, part) => {
    const [name, ...rest] = part.trim().split('=');
    if (!name) return cookies;
    cookies[name] = rest.join('=');
    return cookies;
  }, {});
}

function getAdminSessionSecret(env) {
  return (env.ADMIN_SESSION_SECRET || env.ADMIN_TOKEN || '').trim();
}

function getAdminUsername(env) {
  return compactString(env.ADMIN_USERNAME, 80) || 'admin';
}

async function signSessionValue(value, env) {
  const secret = getAdminSessionSecret(env);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return encodeBase64Url(new Uint8Array(signature));
}

async function createAdminSessionCookie(env, payload = {}) {
  const sessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE
  };
  const encodedPayload = encodeBase64Url(new TextEncoder().encode(JSON.stringify(sessionPayload)));
  const signature = await signSessionValue(encodedPayload, env);
  return `${encodedPayload}.${signature}`;
}

async function readAdminSession(request, env) {
  const sessionValue = parseCookies(request)[ADMIN_SESSION_COOKIE];
  if (!sessionValue || !getAdminSessionSecret(env)) return null;

  const [encodedPayload, signature] = sessionValue.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await signSessionValue(encodedPayload, env);
  if (!constantTimeEqualHex(await sha256Hex(signature), await sha256Hex(expectedSignature))) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload)));
    if (!payload || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function buildAdminSessionSetCookie(value) {
  return [
    `${ADMIN_SESSION_COOKIE}=${value}`,
    'Path=/',
    `Max-Age=${ADMIN_SESSION_MAX_AGE}`,
    'HttpOnly',
    'Secure',
    'SameSite=None'
  ].join('; ');
}

function buildAdminSessionClearCookie() {
  return [
    `${ADMIN_SESSION_COOKIE}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'Secure',
    'SameSite=None'
  ].join('; ');
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeEqualHex(left, right) {
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return mismatch === 0;
}

async function isAdminAuthorized(request, env) {
  const session = await readAdminSession(request, env);
  if (session) return true;

  const configuredToken = (env.ADMIN_TOKEN || '').trim();
  const requestToken = getAdminTokenFromRequest(request);
  if (!configuredToken || !requestToken) return false;

  const [configuredDigest, requestDigest] = await Promise.all([
    sha256Hex(configuredToken),
    sha256Hex(requestToken)
  ]);

  return constantTimeEqualHex(configuredDigest, requestDigest);
}

async function verifyAdminCredentials(env, username, password) {
  const configuredUsername = getAdminUsername(env);
  const configuredPassword = (env.ADMIN_PASSWORD || env.ADMIN_TOKEN || '').trim();
  const submittedUsername = compactString(username, 80) || '';
  const submittedPassword = String(password || '').trim();
  if (!configuredPassword || !submittedUsername || !submittedPassword) return false;
  if (submittedUsername !== configuredUsername) return false;

  const [configuredDigest, requestDigest] = await Promise.all([
    sha256Hex(configuredPassword),
    sha256Hex(submittedPassword)
  ]);

  return constantTimeEqualHex(configuredDigest, requestDigest);
}

async function verifyWithGumroad(licenseKey, incrementUsesCount) {
  async function check(productId) {
    const response = await fetch(GUMROAD_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        license_key: licenseKey,
        increment_uses_count: incrementUsesCount
      })
    });
    return response.json();
  }

  let data = await check(NEW_PRODUCT_ID);
  if (!data.success) data = await check(OLD_PRODUCT_ID);
  return data;
}

function isPurchaseActive(data) {
  return !!(
    data &&
    data.success &&
    data.purchase &&
    !data.purchase.chargebacked &&
    !data.purchase.refunded &&
    !data.purchase.subscription_failed_at &&
    !data.purchase.subscription_ended_at
  );
}

async function getBindingByUser(env, figmaUserId) {
  try {
    return await env.DB
      .prepare(`
        SELECT
          figma_user_id,
          figma_user_name,
          license_key,
          gumroad_sale_id,
          gumroad_email,
          gumroad_buyer_name,
          gumroad_purchase_created_at,
          gumroad_product_name,
          gumroad_subscription_plan,
          gumroad_subscription_status,
          gumroad_subscription_ends_at
        FROM license_bindings
        WHERE figma_user_id = ?1
      `)
      .bind(figmaUserId)
      .first();
  } catch (error) {
    if (!isMissingColumnError(error)) throw error;

    return env.DB
      .prepare(`
        SELECT
          figma_user_id,
          figma_user_name,
          license_key,
          gumroad_sale_id,
          NULL AS gumroad_email,
          NULL AS gumroad_buyer_name,
          NULL AS gumroad_purchase_created_at,
          NULL AS gumroad_product_name,
          NULL AS gumroad_subscription_plan,
          NULL AS gumroad_subscription_status,
          NULL AS gumroad_subscription_ends_at
        FROM license_bindings
        WHERE figma_user_id = ?1
      `)
      .bind(figmaUserId)
      .first();
  }
}

async function handleLicenseStatus(env, ctx, figmaUserId) {
  if (!figmaUserId) return json({ success: false, message: 'Missing figmaUserId' }, 400);

  const binding = await getBindingByUser(env, figmaUserId);
  if (!binding) return json({ success: true, isPro: false });

  const gumroadData = await verifyWithGumroad(binding.license_key, false);
  if (!isPurchaseActive(gumroadData)) {
    await env.DB.prepare('DELETE FROM license_bindings WHERE figma_user_id = ?1').bind(figmaUserId).run();
    schedule(ctx, recordLicenseEvent(env, {
      type: 'license-status',
      figmaUserId,
      figmaUserName: binding.figma_user_name,
      licenseKey: binding.license_key,
      success: false,
      message: 'Inactive Gumroad purchase removed from D1'
    }));
    return json({ success: true, isPro: false });
  }

  await updateBindingPurchaseDetails(env, figmaUserId, extractGumroadPurchaseDetails(gumroadData));
  schedule(ctx, recordLicenseEvent(env, {
    type: 'license-status',
    figmaUserId,
    figmaUserName: binding.figma_user_name,
    licenseKey: binding.license_key,
    success: true,
    message: 'License status verified'
  }));
  return json({ success: true, isPro: true });
}

async function handleUnlinkLicense(env, ctx, figmaUserId) {
  if (!figmaUserId) return json({ success: false, message: 'Missing figmaUserId' }, 400);

  const binding = await getBindingByUser(env, figmaUserId);
  await env.DB.prepare('DELETE FROM license_bindings WHERE figma_user_id = ?1').bind(figmaUserId).run();
  schedule(ctx, recordLicenseEvent(env, {
    type: 'unlink-license',
    figmaUserId,
    figmaUserName: binding && binding.figma_user_name,
    licenseKey: binding && binding.license_key,
    success: true,
    message: 'License unlinked'
  }));
  return json({ success: true });
}

async function getBindingByLicense(env, licenseKey) {
  try {
    return await env.DB
      .prepare(`
        SELECT
          figma_user_id,
          figma_user_name,
          license_key,
          gumroad_sale_id,
          gumroad_email,
          gumroad_buyer_name,
          gumroad_purchase_created_at,
          gumroad_product_name,
          gumroad_subscription_plan,
          gumroad_subscription_status,
          gumroad_subscription_ends_at
        FROM license_bindings
        WHERE license_key = ?1
      `)
      .bind(licenseKey)
      .first();
  } catch (error) {
    if (!isMissingColumnError(error)) throw error;

    return env.DB
      .prepare(`
        SELECT
          figma_user_id,
          figma_user_name,
          license_key,
          gumroad_sale_id,
          NULL AS gumroad_email,
          NULL AS gumroad_buyer_name,
          NULL AS gumroad_purchase_created_at,
          NULL AS gumroad_product_name,
          NULL AS gumroad_subscription_plan,
          NULL AS gumroad_subscription_status,
          NULL AS gumroad_subscription_ends_at
        FROM license_bindings
        WHERE license_key = ?1
      `)
      .bind(licenseKey)
      .first();
  }
}

async function upsertBinding(env, {
  figmaUserId,
  figmaUserName,
  licenseKey,
  gumroadSaleId,
  gumroadEmail,
  gumroadBuyerName,
  gumroadPurchaseCreatedAt,
  gumroadProductName,
  gumroadSubscriptionPlan,
  gumroadSubscriptionStatus,
  gumroadSubscriptionEndsAt
}) {
  const tableColumns = await getTableColumns(env, 'license_bindings');
  const details = {
    gumroadEmail,
    gumroadBuyerName,
    gumroadPurchaseCreatedAt,
    gumroadProductName,
    gumroadSubscriptionPlan,
    gumroadSubscriptionStatus,
    gumroadSubscriptionEndsAt
  };
  const availableFields = getPurchaseFieldDefinitions()
    .filter((field) => tableColumns.includes(field.column));
  const columns = [
    'figma_user_id',
    'figma_user_name',
    'license_key',
    'gumroad_sale_id',
    ...availableFields.map((field) => field.column),
    'updated_at'
  ];
  const values = [
    figmaUserId,
    figmaUserName,
    licenseKey,
    gumroadSaleId,
    ...availableFields.map((field) => details[field.detailKey])
  ];
  const placeholders = values.map((_, index) => `?${index + 1}`).concat('CURRENT_TIMESTAMP');
  const updateFields = [
    'figma_user_name = excluded.figma_user_name',
    'license_key = excluded.license_key',
    'gumroad_sale_id = excluded.gumroad_sale_id',
    ...availableFields.map((field) => `${field.column} = excluded.${field.column}`),
    'updated_at = CURRENT_TIMESTAMP'
  ];

  return env.DB
    .prepare(`
      INSERT INTO license_bindings (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      ON CONFLICT(figma_user_id) DO UPDATE SET
        ${updateFields.join(',\n        ')}
    `)
    .bind(...values)
    .run();
}

async function updateBindingPurchaseDetails(env, figmaUserId, details) {
  const tableColumns = await getTableColumns(env, 'license_bindings');
  const availableFields = getPurchaseFieldDefinitions()
    .filter((field) => tableColumns.includes(field.column));
  const values = [figmaUserId, details.gumroadSaleId];
  const updates = ['gumroad_sale_id = COALESCE(?2, gumroad_sale_id)'];

  availableFields.forEach((field) => {
    values.push(details[field.detailKey]);
    updates.push(`${field.column} = COALESCE(?${values.length}, ${field.column})`);
  });
  updates.push('updated_at = CURRENT_TIMESTAMP');

  return env.DB
    .prepare(`
      UPDATE license_bindings
      SET
        ${updates.join(',\n        ')}
      WHERE figma_user_id = ?1
    `)
    .bind(...values)
    .run();
}

function getConfiguredGumroadProductIds(env) {
  const configured = [
    NEW_PRODUCT_ID,
    OLD_PRODUCT_ID,
    ...(env.GUMROAD_PRODUCT_IDS || '').split(','),
    env.GUMROAD_PRODUCT_ID
  ];

  return Array.from(new Set(configured.map((item) => compactString(item, 160)).filter(Boolean)));
}

function getGumroadSaleId(sale) {
  return compactString(sale.sale_id || sale.id || sale.order_id, 160);
}

function getGumroadSaleLicenseKey(sale) {
  return compactString(sale.license_key || sale.licenseKey || (sale.license && sale.license.key), 120);
}

async function fetchGumroadJson(env, url) {
  const accessToken = compactString(env.GUMROAD_ACCESS_TOKEN, 500);
  if (!accessToken) {
    throw new Error('Missing GUMROAD_ACCESS_TOKEN secret.');
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`Gumroad API request failed (${response.status}): ${message || response.statusText}`);
  }

  return response.json();
}

async function fetchGumroadSales(env, { limit = 500, allProducts = false } = {}) {
  const boundedLimit = Math.max(1, Math.min(toIntegerOrNull(limit) || 500, 5000));
  const productIds = allProducts ? [null] : getConfiguredGumroadProductIds(env);
  const sales = [];
  const failedProducts = [];

  for (const productId of productIds) {
    let nextUrl = new URL(GUMROAD_SALES_URL);
    if (productId) nextUrl.searchParams.set('product_id', productId);

    while (nextUrl && sales.length < boundedLimit) {
      try {
        const payload = await fetchGumroadJson(env, nextUrl.toString());
        sales.push(...(payload.sales || []));

        const nextPageUrl = payload.next_page_url || payload.next_page || null;
        nextUrl = nextPageUrl && sales.length < boundedLimit ? new URL(nextPageUrl, GUMROAD_SALES_URL) : null;
      } catch (error) {
        failedProducts.push({
          productId: productId || 'all',
          message: error instanceof Error ? error.message : String(error)
        });
        nextUrl = null;
      }
    }
  }

  return {
    sales: sales.slice(0, boundedLimit),
    failedProducts
  };
}

async function upsertGumroadSale(env, sale) {
  const saleId = getGumroadSaleId(sale);
  if (!saleId) return { skipped: true };

  const details = extractGumroadPurchaseDetails(sale);
  const licenseKey = getGumroadSaleLicenseKey(sale);
  const productId = compactString(sale.product_id, 160);
  const productPermalink = compactString(sale.product_permalink || sale.permalink, 180);

  await env.DB
    .prepare(`
      INSERT INTO gumroad_sales (
        gumroad_sale_id,
        license_key,
        email,
        buyer_name,
        product_name,
        product_id,
        product_permalink,
        purchase_created_at,
        subscription_plan,
        subscription_status,
        subscription_ends_at,
        refunded,
        chargebacked,
        imported_at,
        updated_at
      )
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(gumroad_sale_id) DO UPDATE SET
        license_key = excluded.license_key,
        email = excluded.email,
        buyer_name = excluded.buyer_name,
        product_name = excluded.product_name,
        product_id = excluded.product_id,
        product_permalink = excluded.product_permalink,
        purchase_created_at = excluded.purchase_created_at,
        subscription_plan = excluded.subscription_plan,
        subscription_status = excluded.subscription_status,
        subscription_ends_at = excluded.subscription_ends_at,
        refunded = excluded.refunded,
        chargebacked = excluded.chargebacked,
        updated_at = CURRENT_TIMESTAMP
    `)
    .bind(
      saleId,
      licenseKey,
      details.gumroadEmail,
      details.gumroadBuyerName,
      details.gumroadProductName,
      productId,
      productPermalink,
      details.gumroadPurchaseCreatedAt,
      details.gumroadSubscriptionPlan,
      details.gumroadSubscriptionStatus,
      details.gumroadSubscriptionEndsAt,
      sale.refunded ? 1 : 0,
      sale.chargebacked ? 1 : 0
    )
    .run();

  if (licenseKey) {
    const binding = await getBindingByLicense(env, licenseKey);
    if (binding && binding.figma_user_id) {
      await updateBindingPurchaseDetails(env, binding.figma_user_id, {
        ...details,
        gumroadSaleId: saleId
      });
    }
  }

  return { skipped: false };
}

async function importGumroadSales(env, options = {}) {
  const gumroadSalesExists = await tableExists(env, 'gumroad_sales');
  if (!gumroadSalesExists) {
    return {
      migrationRequired: true,
      imported: 0,
      skipped: 0,
      failed: 0,
      message: 'Run migration 0004_gumroad_sales.sql first.'
    };
  }

  const { sales, failedProducts } = await fetchGumroadSales(env, options);
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const sale of sales) {
    try {
      const result = await upsertGumroadSale(env, sale);
      if (result.skipped) skipped += 1;
      else imported += 1;
    } catch (error) {
      console.warn('Could not import Gumroad sale', error);
      failed += 1;
    }
  }

  return {
    imported,
    skipped,
    failed,
    fetched: sales.length,
    failedProducts
  };
}

async function recordLicenseEvent(env, event) {
  try {
    await env.DB
      .prepare(`
        INSERT INTO license_events (
          id,
          event_type,
          figma_user_id,
          figma_user_name,
          license_key_hint,
          success,
          message,
          created_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, CURRENT_TIMESTAMP)
      `)
      .bind(
        crypto.randomUUID(),
        event.type,
        event.figmaUserId || null,
        event.figmaUserName || null,
        maskLicenseKey(event.licenseKey),
        event.success ? 1 : 0,
        event.message || null
      )
      .run();
  } catch (error) {
    console.warn('Could not record license event', error);
  }
}

async function recordPluginEvent(env, event) {
  try {
    await env.DB
      .prepare(`
        INSERT INTO plugin_events (
          id,
          event_type,
          figma_user_id,
          figma_user_name,
          plan,
          feature,
          trial_count,
          from_language,
          to_language,
          selection_count,
          text_layer_count,
          duration_ms,
          success,
          error_code,
          message,
          metadata_json,
          created_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, CURRENT_TIMESTAMP)
      `)
      .bind(
        crypto.randomUUID(),
        compactString(event.eventType || event.type, 80) || 'unknown',
        compactString(event.figmaUserId, 120),
        compactString(event.figmaUserName, 120),
        compactString(event.plan, 20),
        compactString(event.feature, 80),
        toIntegerOrNull(event.trialCount),
        compactString(event.fromLanguage, 20),
        compactString(event.toLanguage, 20),
        toIntegerOrNull(event.selectionCount),
        toIntegerOrNull(event.textLayerCount),
        toIntegerOrNull(event.durationMs),
        toSuccessInt(event.success),
        compactString(event.errorCode, 80),
        compactString(event.message, 240),
        safeMetadataJson(event.metadata)
      )
      .run();

    return true;
  } catch (error) {
    console.warn('Could not record plugin event', error);
    return false;
  }
}

async function upsertPluginUser(env, event) {
  const figmaUserId = compactString(event.figmaUserId, 120);
  if (!figmaUserId) return false;

  try {
    await env.DB
      .prepare(`
        INSERT INTO plugin_users (
          figma_user_id,
          figma_user_name,
          plan,
          first_seen_at,
          last_seen_at,
          last_event_type,
          last_feature,
          usage_count,
          updated_at
        )
        VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?4, ?5, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(figma_user_id) DO UPDATE SET
          figma_user_name = COALESCE(excluded.figma_user_name, plugin_users.figma_user_name),
          plan = COALESCE(excluded.plan, plugin_users.plan),
          last_seen_at = CURRENT_TIMESTAMP,
          last_event_type = excluded.last_event_type,
          last_feature = excluded.last_feature,
          usage_count = plugin_users.usage_count + 1,
          updated_at = CURRENT_TIMESTAMP
      `)
      .bind(
        figmaUserId,
        compactString(event.figmaUserName, 120),
        compactString(event.plan, 20),
        compactString(event.eventType || event.type, 80) || 'unknown',
        compactString(event.feature, 80)
      )
      .run();

    return true;
  } catch (error) {
    if (!isMissingTableError(error)) console.warn('Could not upsert plugin user', error);
    return false;
  }
}

async function getRecentEvents(env, limit = 80) {
  try {
    const result = await env.DB
      .prepare(`
        SELECT event_type, figma_user_id, figma_user_name, license_key_hint, success, message, created_at
        FROM license_events
        ORDER BY datetime(created_at) DESC
        LIMIT ?1
      `)
      .bind(limit)
      .all();

    return result.results || [];
  } catch (error) {
    console.warn('Could not read license events', error);
    return [];
  }
}

async function getRecentPluginEvents(env, limit = 1000) {
  try {
    const result = await env.DB
      .prepare(`
        SELECT
          event_type,
          figma_user_id,
          figma_user_name,
          plan,
          feature,
          trial_count,
          from_language,
          to_language,
          selection_count,
          text_layer_count,
          duration_ms,
          success,
          error_code,
          message,
          metadata_json,
          created_at
        FROM plugin_events
        ORDER BY datetime(created_at) DESC
        LIMIT ?1
      `)
      .bind(limit)
      .all();

    return result.results || [];
  } catch (error) {
    console.warn('Could not read plugin events', error);
    return [];
  }
}

async function getPluginUsersForAdmin(env, limit = 500) {
  try {
    const result = await env.DB
      .prepare(`
        SELECT
          figma_user_id,
          figma_user_name,
          plan,
          first_seen_at,
          last_seen_at,
          last_event_type,
          last_feature,
          usage_count,
          updated_at
        FROM plugin_users
        ORDER BY datetime(last_seen_at) DESC
        LIMIT ?1
      `)
      .bind(limit)
      .all();

    return result.results || [];
  } catch (error) {
    if (isMissingTableError(error)) return [];
    console.warn('Could not read plugin users', error);
    return [];
  }
}

async function getLicenseBindingsForAdmin(env) {
  const columns = await getTableColumns(env, 'license_bindings');
  const hasColumn = (column) => columns.includes(column);
  const requiredPurchaseColumns = getRequiredPurchaseColumns();
  const missingPurchaseFields = requiredPurchaseColumns.some((column) => !hasColumn(column));
  const selectColumns = [
    'figma_user_id',
    'figma_user_name',
    'license_key',
    'gumroad_sale_id',
    hasColumn('gumroad_email') ? 'gumroad_email' : 'NULL AS gumroad_email',
    hasColumn('gumroad_buyer_name') ? 'gumroad_buyer_name' : 'NULL AS gumroad_buyer_name',
    hasColumn('gumroad_purchase_created_at') ? 'gumroad_purchase_created_at' : 'NULL AS gumroad_purchase_created_at',
    hasColumn('gumroad_product_name') ? 'gumroad_product_name' : 'NULL AS gumroad_product_name',
    hasColumn('gumroad_subscription_plan') ? 'gumroad_subscription_plan' : 'NULL AS gumroad_subscription_plan',
    hasColumn('gumroad_subscription_status') ? 'gumroad_subscription_status' : 'NULL AS gumroad_subscription_status',
    hasColumn('gumroad_subscription_ends_at') ? 'gumroad_subscription_ends_at' : 'NULL AS gumroad_subscription_ends_at',
    'updated_at'
  ];
  const result = await env.DB
    .prepare(`
      SELECT ${selectColumns.join(', ')}
      FROM license_bindings
      ORDER BY datetime(updated_at) DESC
    `)
    .all();

  return {
    rows: result.results || [],
    missingPurchaseFields
  };
}

async function getGumroadSalesForAdmin(env) {
  try {
    const result = await env.DB
      .prepare(`
        SELECT
          gumroad_sale_id,
          license_key,
          email,
          buyer_name,
          product_name,
          product_id,
          product_permalink,
          purchase_created_at,
          subscription_plan,
          subscription_status,
          subscription_ends_at,
          refunded,
          chargebacked,
          updated_at
        FROM gumroad_sales
        ORDER BY datetime(purchase_created_at) DESC, datetime(updated_at) DESC
      `)
      .all();

    return result.results || [];
  } catch (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

async function tableExists(env, tableName) {
  const result = await env.DB
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?1")
    .bind(tableName)
    .first();
  return !!result;
}

async function getTableColumns(env, tableName) {
  try {
    const result = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all();
    return (result.results || []).map((column) => column.name);
  } catch (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

async function countTableRows(env, tableName) {
  try {
    const result = await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).first();
    return Number(result && result.count) || 0;
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

async function getLicenseBindingStats(env) {
  try {
    const result = await env.DB
      .prepare(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN datetime(updated_at) >= datetime('now', '-7 days') THEN 1 ELSE 0 END) AS updated_this_week
        FROM license_bindings
      `)
      .first();

    return {
      total: Number(result && result.total) || 0,
      updatedThisWeek: Number(result && result.updated_this_week) || 0
    };
  } catch (error) {
    if (isMissingTableError(error)) return { total: 0, updatedThisWeek: 0 };
    throw error;
  }
}

async function getDatabaseDiagnostics(env) {
  const [licenseBindingsExists, licenseEventsExists, pluginEventsExists, gumroadSalesExists, pluginUsersExists] = await Promise.all([
    tableExists(env, 'license_bindings'),
    tableExists(env, 'license_events'),
    tableExists(env, 'plugin_events'),
    tableExists(env, 'gumroad_sales'),
    tableExists(env, 'plugin_users')
  ]);
  const bindingColumns = licenseBindingsExists ? await getTableColumns(env, 'license_bindings') : [];
  const requiredPurchaseColumns = getRequiredPurchaseColumns();
  const missingPurchaseColumns = requiredPurchaseColumns.filter((column) => !bindingColumns.includes(column));
  const [licenseBindingCount, licenseEventCount, pluginEventCount, gumroadSalesCount, pluginUsersCount] = await Promise.all([
    licenseBindingsExists ? countTableRows(env, 'license_bindings') : Promise.resolve(null),
    licenseEventsExists ? countTableRows(env, 'license_events') : Promise.resolve(null),
    pluginEventsExists ? countTableRows(env, 'plugin_events') : Promise.resolve(null),
    gumroadSalesExists ? countTableRows(env, 'gumroad_sales') : Promise.resolve(null),
    pluginUsersExists ? countTableRows(env, 'plugin_users') : Promise.resolve(null)
  ]);

  return {
    tables: {
      license_bindings: licenseBindingsExists,
      license_events: licenseEventsExists,
      plugin_events: pluginEventsExists,
      gumroad_sales: gumroadSalesExists,
      plugin_users: pluginUsersExists
    },
    counts: {
      license_bindings: licenseBindingCount,
      license_events: licenseEventCount,
      plugin_events: pluginEventCount,
      gumroad_sales: gumroadSalesCount,
      plugin_users: pluginUsersCount
    },
    missingPurchaseColumns,
    migrationRequired: !licenseEventsExists || !pluginEventsExists || !gumroadSalesExists || !pluginUsersExists || missingPurchaseColumns.length > 0
  };
}

function getRequiredPurchaseColumns() {
  return getPurchaseFieldDefinitions().map((field) => field.column);
}

function getPurchaseFieldDefinitions() {
  return [
    { column: 'gumroad_email', detailKey: 'gumroadEmail' },
    { column: 'gumroad_buyer_name', detailKey: 'gumroadBuyerName' },
    { column: 'gumroad_purchase_created_at', detailKey: 'gumroadPurchaseCreatedAt' },
    { column: 'gumroad_product_name', detailKey: 'gumroadProductName' },
    { column: 'gumroad_subscription_plan', detailKey: 'gumroadSubscriptionPlan' },
    { column: 'gumroad_subscription_status', detailKey: 'gumroadSubscriptionStatus' },
    { column: 'gumroad_subscription_ends_at', detailKey: 'gumroadSubscriptionEndsAt' }
  ];
}

async function backfillPurchaseDetails(env, limit = 50) {
  const columns = await getTableColumns(env, 'license_bindings');
  const missingPurchaseColumns = getRequiredPurchaseColumns().filter((column) => !columns.includes(column));
  if (missingPurchaseColumns.length) {
    return {
      scanned: 0,
      updated: 0,
      failed: 0,
      migrationRequired: true,
      missingPurchaseColumns
    };
  }

  const boundedLimit = Math.max(1, Math.min(toIntegerOrNull(limit) || 50, 100));
  const result = await env.DB
    .prepare(`
      SELECT figma_user_id, license_key
      FROM license_bindings
      WHERE gumroad_email IS NULL
        OR gumroad_purchase_created_at IS NULL
        OR gumroad_subscription_plan IS NULL
        OR gumroad_subscription_status IS NULL
        OR gumroad_subscription_ends_at IS NULL
      ORDER BY datetime(updated_at) DESC
      LIMIT ?1
    `)
    .bind(boundedLimit)
    .all();

  const rows = result.results || [];
  let updated = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const gumroadData = await verifyWithGumroad(row.license_key, false);
      if (gumroadData && gumroadData.success && gumroadData.purchase) {
        await updateBindingPurchaseDetails(env, row.figma_user_id, extractGumroadPurchaseDetails(gumroadData));
        updated += 1;
      } else {
        failed += 1;
      }
    } catch (error) {
      console.warn('Could not backfill purchase details', error);
      failed += 1;
    }
  }

  return {
    scanned: rows.length,
    updated,
    failed
  };
}

function buildUserRows(bindings, pluginEvents, gumroadSales = []) {
  const usersById = new Map();
  const linkedLicenseKeys = new Set(bindings.map((binding) => binding.license_key).filter(Boolean));

  pluginEvents.slice().reverse().forEach((event) => {
    if (!event.figma_user_id) return;
    usersById.set(event.figma_user_id, {
      name: event.figma_user_name || 'Unknown user',
      plan: event.plan === 'pro' ? 'Pro' : 'Free',
      figmaUserId: event.figma_user_id,
      active: event.created_at || 'Unknown',
      status: event.event_type === 'trial_exhausted' ? 'Trial exhausted' : event.success ? 'Active' : 'Needs attention',
      action: event.success ? 'Usage' : 'Inspect'
    });
  });

  bindings.forEach((binding) => {
    usersById.set(binding.figma_user_id, {
      name: binding.gumroad_buyer_name || binding.figma_user_name || usersById.get(binding.figma_user_id)?.name || 'Unknown user',
      figmaName: binding.figma_user_name || 'Unknown user',
      email: binding.gumroad_email || '',
      licenseKey: binding.license_key,
      purchaseDate: binding.gumroad_purchase_created_at || '',
      subscriptionPlan: binding.gumroad_subscription_plan || '',
      subscriptionStatus: binding.gumroad_subscription_status || '',
      subscriptionEndsAt: binding.gumroad_subscription_ends_at || '',
      plan: 'Pro',
      figmaUserId: binding.figma_user_id,
      active: usersById.get(binding.figma_user_id)?.active || binding.updated_at || 'Unknown',
      status: 'Linked',
      action: 'Profile'
    });
  });

  gumroadSales.forEach((sale) => {
    if (sale.license_key && linkedLicenseKeys.has(sale.license_key)) return;

    usersById.set(`gumroad:${sale.gumroad_sale_id}`, {
      name: sale.buyer_name || sale.email || 'Gumroad buyer',
      figmaName: '',
      email: sale.email || '',
      licenseKey: sale.license_key || '',
      purchaseDate: sale.purchase_created_at || '',
      subscriptionPlan: sale.subscription_plan || '',
      subscriptionStatus: sale.subscription_status || '',
      subscriptionEndsAt: sale.subscription_ends_at || '',
      plan: 'Pro',
      figmaUserId: '',
      active: sale.purchase_created_at || sale.updated_at || 'Unknown',
      status: 'Gumroad sale',
      action: 'Match'
    });
  });

  return Array.from(usersById.values())
    .sort((left, right) => {
      const leftDate = toIsoDate(left.active);
      const rightDate = toIsoDate(right.active);
      return (rightDate ? rightDate.getTime() : 0) - (leftDate ? leftDate.getTime() : 0);
    });
}

function countEventsByDay(events, eventFilter) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return labels.map((label, index) => ({
    label,
    value: events.filter((event) => {
      if (eventFilter && !eventFilter(event)) return false;
      const date = toIsoDate(event.created_at);
      return date && date.getDay() === ((index + 1) % 7);
    }).length
  }));
}

function buildFeatureUsage(pluginEvents) {
  const counts = new Map();
  pluginEvents
    .filter((event) => event.feature && (event.event_type === 'feature_completed' || event.event_type === 'feature_started'))
    .forEach((event) => counts.set(event.feature, (counts.get(event.feature) || 0) + 1));

  const rows = Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6);
  const max = Math.max(...rows.map(([, count]) => count), 1);

  if (!rows.length) {
    return [
      { name: 'Mirror Layouts', percent: 0, copy: 'No feature telemetry yet' },
      { name: 'Translate Text Layers', percent: 0, copy: 'No feature telemetry yet' },
      { name: 'Variant Creation', percent: 0, copy: 'No feature telemetry yet' },
      { name: 'Font Replacement', percent: 0, copy: 'No feature telemetry yet' }
    ];
  }

  return rows.map(([feature, count]) => ({
    name: labelFromFeature(feature),
    percent: Math.round((count / max) * 100),
    copy: `${count} tracked event${count === 1 ? '' : 's'}`
  }));
}

function buildErrorHotspots(pluginEvents, licenseEvents) {
  const counts = new Map();
  const failedPluginEvents = pluginEvents.filter((event) => !event.success || event.error_code);
  const failedLicenseEvents = licenseEvents.filter((event) => !event.success);

  failedPluginEvents.forEach((event) => {
    const key = event.error_code || event.message || event.event_type || 'plugin_error';
    const current = counts.get(key) || {
      title: labelFromEventType(key),
      count: 0,
      feature: event.feature ? labelFromFeature(event.feature) : '',
      latest: event.created_at || '',
      source: 'Plugin'
    };
    current.count += 1;
    if (!current.latest || (event.created_at && event.created_at > current.latest)) current.latest = event.created_at;
    counts.set(key, current);
  });

  failedLicenseEvents.forEach((event) => {
    const key = event.message || event.event_type || 'license_error';
    const current = counts.get(key) || {
      title: key,
      count: 0,
      feature: '',
      latest: event.created_at || '',
      source: 'License'
    };
    current.count += 1;
    if (!current.latest || (event.created_at && event.created_at > current.latest)) current.latest = event.created_at;
    counts.set(key, current);
  });

  return Array.from(counts.values())
    .sort((left, right) => right.count - left.count)
    .slice(0, 6)
    .map((item) => ({
      title: compactString(item.title, 120) || 'Unknown issue',
      count: item.count,
      feature: item.feature,
      latest: item.latest,
      source: item.source
    }));
}

function didEventSucceed(event) {
  return event.success === true || event.success === 1 || event.success === '1';
}

function didEventFail(event) {
  return event.success === false || event.success === 0 || event.success === '0' || Boolean(event.error_code);
}

function buildActivityEvents(pluginEvents, licenseEvents) {
  return pluginEvents.map((event) => ({
    source: 'Plugin',
    eventType: labelFromEventType(event.event_type || 'plugin_event'),
    rawEventType: event.event_type || '',
    user: event.figma_user_name || event.figma_user_id || 'Unknown user',
    figmaUserId: event.figma_user_id || '',
    plan: event.plan || '',
    feature: event.feature ? labelFromFeature(event.feature) : '',
    rawFeature: event.feature || '',
    success: didEventSucceed(event),
    errorCode: event.error_code || '',
    message: compactString(event.message || '', 180),
    createdAt: event.created_at || '',
    durationMs: event.duration_ms || '',
    trialCount: event.trial_count ?? ''
  })).concat(licenseEvents.map((event) => ({
    source: 'License',
    eventType: labelFromEventType(event.event_type || 'license_event'),
    rawEventType: event.event_type || '',
    user: event.figma_user_name || event.figma_user_id || 'Unknown user',
    figmaUserId: event.figma_user_id || '',
    plan: '',
    feature: 'License',
    rawFeature: 'license',
    success: didEventSucceed(event),
    errorCode: '',
    message: compactString(event.message || '', 180),
    createdAt: event.created_at || '',
    durationMs: '',
    trialCount: ''
  }))).sort((left, right) => {
    const leftDate = toIsoDate(left.createdAt);
    const rightDate = toIsoDate(right.createdAt);
    return (rightDate ? rightDate.getTime() : 0) - (leftDate ? leftDate.getTime() : 0);
  }).slice(0, 250);
}

function buildErrorRows(pluginEvents, licenseEvents) {
  const groups = new Map();
  const addEvent = (event, source) => {
    if (!didEventFail(event)) return;

    const key = [
      source,
      event.error_code || '',
      event.feature || '',
      event.message || event.event_type || 'unknown_error'
    ].join('|');
    const current = groups.get(key) || {
      source,
      title: event.error_code ? labelFromEventType(event.error_code) : compactString(event.message || event.event_type || 'Unknown issue', 120),
      errorCode: event.error_code || '',
      feature: event.feature ? labelFromFeature(event.feature) : source === 'License' ? 'License' : '',
      message: compactString(event.message || '', 180),
      count: 0,
      latest: event.created_at || '',
      users: new Set()
    };

    current.count += 1;
    if (event.figma_user_name || event.figma_user_id) current.users.add(event.figma_user_name || event.figma_user_id);
    if (!current.latest || (event.created_at && event.created_at > current.latest)) current.latest = event.created_at;
    groups.set(key, current);
  };

  pluginEvents.forEach((event) => addEvent(event, 'Plugin'));
  licenseEvents.forEach((event) => addEvent(event, 'License'));

  return Array.from(groups.values())
    .sort((left, right) => {
      const byCount = right.count - left.count;
      if (byCount) return byCount;
      return String(right.latest || '').localeCompare(String(left.latest || ''));
    })
    .slice(0, 80)
    .map((item) => ({
      ...item,
      users: Array.from(item.users).slice(0, 8),
      affectedUsers: item.users.size
    }));
}

function buildFeaturePerformance(pluginEvents) {
  const groups = new Map();
  pluginEvents
    .filter((event) => event.feature)
    .forEach((event) => {
      const key = event.feature;
      const current = groups.get(key) || {
        feature: labelFromFeature(key),
        rawFeature: key,
        started: 0,
        completed: 0,
        failed: 0,
        freeUses: 0,
        proUses: 0,
        durations: [],
        lastUsedAt: ''
      };

      if (event.event_type === 'feature_started') current.started += 1;
      if (event.event_type === 'feature_completed') current.completed += 1;
      if (event.event_type === 'feature_failed' || didEventFail(event)) current.failed += 1;
      if (event.plan === 'pro') current.proUses += 1;
      if (event.plan === 'free') current.freeUses += 1;
      if (Number.isFinite(Number(event.duration_ms))) current.durations.push(Number(event.duration_ms));
      if (!current.lastUsedAt || (event.created_at && event.created_at > current.lastUsedAt)) current.lastUsedAt = event.created_at || '';
      groups.set(key, current);
    });

  return Array.from(groups.values())
    .map((item) => {
      const totalFinished = item.completed + item.failed;
      const averageDurationMs = item.durations.length
        ? Math.round(item.durations.reduce((sum, value) => sum + value, 0) / item.durations.length)
        : 0;

      return {
        feature: item.feature,
        rawFeature: item.rawFeature,
        started: item.started,
        completed: item.completed,
        failed: item.failed,
        successRate: totalFinished ? Math.round((item.completed / totalFinished) * 1000) / 10 : 0,
        averageDurationMs,
        freeUses: item.freeUses,
        proUses: item.proUses,
        lastUsedAt: item.lastUsedAt
      };
    })
    .sort((left, right) => (right.completed + right.started) - (left.completed + left.started))
    .slice(0, 60);
}

function buildRetentionSummary(pluginUsers, users, pluginEvents) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const active7Days = pluginUsers.filter((user) => {
    const date = toIsoDate(user.last_seen_at);
    return date && date >= sevenDaysAgo;
  }).length;
  const active30Days = pluginUsers.filter((user) => {
    const date = toIsoDate(user.last_seen_at);
    return date && date >= thirtyDaysAgo;
  }).length;
  const new7Days = pluginUsers.filter((user) => {
    const date = toIsoDate(user.first_seen_at);
    return date && date >= sevenDaysAgo;
  }).length;
  const oneTimeUsers = pluginUsers.filter((user) => Number(user.usage_count) <= 1).length;
  const proUserIds = new Set(users.filter((user) => user.plan === 'Pro' && user.figmaUserId).map((user) => user.figmaUserId));
  const activePro30Days = pluginUsers.filter((user) => {
    const date = toIsoDate(user.last_seen_at);
    return proUserIds.has(user.figma_user_id) && date && date >= thirtyDaysAgo;
  }).length;
  const trialLimitUsers = countUnique(pluginEvents, (event) => event.event_type === 'trial_exhausted');

  return {
    trackedUsers: pluginUsers.length,
    active7Days,
    active30Days,
    new7Days,
    oneTimeUsers,
    activePro30Days,
    trialLimitUsers,
    items: [
      { label: 'Active last 7 days', value: String(active7Days), copy: `${new7Days} new tracked users in the same window.` },
      { label: 'Active last 30 days', value: String(active30Days), copy: `${activePro30Days} linked Pro users came back recently.` },
      { label: 'One-use users', value: String(oneTimeUsers), copy: 'Users who opened or used the plugin once only.' },
      { label: 'Trial limit reached', value: String(trialLimitUsers), copy: 'Unique users who hit the free usage limit.' }
    ]
  };
}

function buildSmartAlerts({ failedEvents, gumroadSales, gumroadOnlySales, pluginUsers, diagnostics, users }) {
  const endedSubscriptions = users.filter((user) => {
    const status = String(user.subscriptionStatus || '').toLowerCase();
    return status && status !== 'active' && status !== 'one_time';
  }).length;
  const alerts = [];

  if (diagnostics && diagnostics.migrationRequired) {
    alerts.push({
      level: 'critical',
      title: 'D1 migration required',
      copy: 'Some dashboard tables or columns are missing. Run the latest schema migration.',
      action: 'Open Settings'
    });
  }

  if (failedEvents > 0) {
    alerts.push({
      level: 'critical',
      title: 'Failed events need review',
      copy: `${failedEvents} failed license or plugin events are visible to the dashboard.`,
      action: 'Open Errors'
    });
  }

  if (!gumroadSales.length) {
    alerts.push({
      level: 'warning',
      title: 'Gumroad buyers are not imported',
      copy: 'Import Gumroad sales to show old buyers who never activated inside Figma.',
      action: 'Import Sales'
    });
  } else if (gumroadOnlySales.length) {
    alerts.push({
      level: 'warning',
      title: 'Unmatched Gumroad buyers',
      copy: `${gumroadOnlySales.length} Gumroad buyers are not linked to a Figma user yet.`,
      action: 'Open Users'
    });
  }

  if (!pluginUsers.length) {
    alerts.push({
      level: 'info',
      title: 'Usage tracking is waiting',
      copy: 'Plugin users will appear after the updated plugin sends telemetry events.',
      action: 'Open Activity'
    });
  }

  if (endedSubscriptions > 0) {
    alerts.push({
      level: 'warning',
      title: 'Ended subscriptions',
      copy: `${endedSubscriptions} customer records show an inactive subscription state.`,
      action: 'Open Users'
    });
  }

  return alerts.slice(0, 8);
}

function buildAdminDashboardPayload(bindings, licenseEvents, pluginEvents, gumroadSales = [], pluginUsers = [], diagnostics = null, stats = {}) {
  const linkedCount = Number.isFinite(stats.total) ? stats.total : bindings.length;
  const gumroadOnlySales = gumroadSales.filter((sale) => !bindings.some((binding) => binding.license_key && binding.license_key === sale.license_key));
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const updatedThisWeek = Number.isFinite(stats.updatedThisWeek)
    ? stats.updatedThisWeek
    : bindings.filter((binding) => new Date(binding.updated_at) >= weekAgo).length;
  const recentPluginEvents = pluginEvents.filter((event) => {
    const date = toIsoDate(event.created_at);
    return date && date >= weekAgo;
  });
  const failedLicenseEvents = licenseEvents.filter((event) => !event.success).length;
  const failedPluginEvents = pluginEvents.filter((event) => !event.success).length;
  const failedEvents = failedLicenseEvents + failedPluginEvents;
  const activationEvents = licenseEvents.filter((event) => event.event_type === 'activate-license');
  const activationSuccesses = activationEvents.filter((event) => event.success).length;
  const activationSuccess = activationEvents.length
    ? `${Math.round((activationSuccesses / activationEvents.length) * 1000) / 10}%`
    : 'No events yet';
  const knownUsers = new Set(bindings.map((binding) => binding.figma_user_id));
  pluginEvents.forEach((event) => {
    if (event.figma_user_id) knownUsers.add(event.figma_user_id);
  });
  const activeUsersThisWeek = countUnique(recentPluginEvents);
  const freeUserCount = pluginEvents.length
    ? countUnique(pluginEvents, (event) => event.plan === 'free' && !bindings.some((binding) => binding.figma_user_id === event.figma_user_id))
    : null;
  const proEventUserCount = countUnique(pluginEvents, (event) => event.plan === 'pro');
  const proUserCount = Math.max(linkedCount, proEventUserCount);
  const knownUserCount = Math.max(knownUsers.size, linkedCount) + gumroadOnlySales.length;
  const recentActivityCounts = countEventsByDay(pluginEvents, (event) => event.event_type !== 'plugin_error');
  const trialExhaustedCount = pluginEvents.filter((event) => event.event_type === 'trial_exhausted').length;
  const upgradeOpenedCount = pluginEvents.filter((event) => event.event_type === 'upgrade_opened').length;
  const gumroadClickedCount = pluginEvents.filter((event) => event.event_type === 'gumroad_clicked').length;
  const users = buildUserRows(bindings, pluginEvents, gumroadSales);
  const featurePerformance = buildFeaturePerformance(pluginEvents);
  const errorRows = buildErrorRows(pluginEvents, licenseEvents);
  const retention = buildRetentionSummary(pluginUsers, users, pluginEvents);
  const activityEvents = buildActivityEvents(pluginEvents, licenseEvents);

  const licenses = bindings.map((binding) => ({
    key: binding.license_key,
    maskedKey: maskLicenseKey(binding.license_key),
    user: binding.gumroad_buyer_name || binding.figma_user_name || binding.figma_user_id,
    email: binding.gumroad_email || '',
    figmaUserId: binding.figma_user_id,
    purchaseDate: binding.gumroad_purchase_created_at || '',
    subscriptionPlan: binding.gumroad_subscription_plan || '',
    subscriptionStatus: binding.gumroad_subscription_status || '',
    subscriptionEndsAt: binding.gumroad_subscription_ends_at || '',
    saleId: binding.gumroad_sale_id || '',
    product: binding.gumroad_product_name || '',
    state: 'Linked',
    updated: binding.updated_at || 'Unknown'
  })).concat(gumroadOnlySales.map((sale) => ({
    key: sale.license_key || '',
    maskedKey: maskLicenseKey(sale.license_key),
    user: sale.buyer_name || sale.email || sale.gumroad_sale_id,
    email: sale.email || '',
    figmaUserId: '',
    purchaseDate: sale.purchase_created_at || '',
    subscriptionPlan: sale.subscription_plan || '',
    subscriptionStatus: sale.subscription_status || '',
    subscriptionEndsAt: sale.subscription_ends_at || '',
    saleId: sale.gumroad_sale_id || '',
    product: sale.product_name || '',
    state: 'Gumroad',
    updated: sale.updated_at || 'Unknown'
  })));

  const timelineSource = pluginEvents.length
    ? pluginEvents.slice(0, 8)
    : licenseEvents.length
      ? licenseEvents.slice(0, 8)
      : bindings.slice(0, 8);
  const timeline = timelineSource.map((item) => {
    if (item.event_type) {
      return {
        title: item.feature ? `${labelFromEventType(item.event_type)}: ${labelFromFeature(item.feature)}` : labelFromEventType(item.event_type),
        copy: item.message || `${item.figma_user_name || item.figma_user_id || 'Unknown user'} ${item.success ? 'succeeded' : 'failed'}.`,
        time: item.created_at
      };
    }

    return {
      title: 'License linked',
      copy: `${item.figma_user_name || item.figma_user_id || 'Unknown user'} has an active D1 binding.`,
      time: item.updated_at
    };
  });

  return {
    metrics: [
      { label: 'Known Users', value: String(knownUserCount), trend: `${activeUsersThisWeek} active this week` },
      { label: 'Pro Users', value: String(proUserCount + gumroadOnlySales.length), trend: `${updatedThisWeek} license records updated this week` },
      { label: 'Free Users', value: freeUserCount === null ? 'Not tracked' : String(freeUserCount), trend: pluginEvents.length ? 'Seen in telemetry' : 'Starts after telemetry events' },
      { label: 'Lost Pro Alerts', value: String(failedEvents), trend: pluginEvents.length || licenseEvents.length ? 'Recent failed events' : 'No event history yet', negative: failedEvents > 0 },
      { label: 'Activation Success', value: activationSuccess, trend: activationEvents.length ? `${activationEvents.length} activation events` : 'No activation attempts yet' }
    ],
    conversions: recentActivityCounts.some((item) => item.value > 0)
      ? recentActivityCounts
      : [
        { label: 'Mon', value: 0 },
        { label: 'Tue', value: 0 },
        { label: 'Wed', value: 0 },
        { label: 'Thu', value: 0 },
        { label: 'Fri', value: 0 },
        { label: 'Sat', value: 0 },
        { label: 'Sun', value: 0 }
      ],
    risks: [
      ...(linkedCount > bindings.length ? [{
        title: 'User table is partially loaded',
        copy: `Showing ${bindings.length} linked licenses out of ${linkedCount} total.`
      }] : []),
      {
        title: failedEvents ? 'Recent failed checks' : 'No recent failures',
        copy: failedEvents ? `${failedEvents} admin-visible failures across license and plugin events.` : 'License and usage events look clean.'
      },
      {
        title: trialExhaustedCount ? 'Trial exhausted users' : 'Trial funnel warming up',
        copy: pluginEvents.length ? `${trialExhaustedCount} users/events reached the free limit.` : 'Telemetry will reveal users who hit the free cap.'
      },
      {
        title: 'Silent restore coverage',
        copy: `${linkedCount} users can be restored from the server binding if their local Pro state is lost.`
      },
      {
        title: 'Gumroad import coverage',
        copy: gumroadSales.length
          ? `${gumroadSales.length} Gumroad sales imported; ${gumroadOnlySales.length} are not linked to a Figma user yet.`
          : 'Run Gumroad import to show buyers who have not activated the plugin through Figma yet.'
      }
    ],
    recovery: licenseEvents
      .map((event) => ({ ...event, source: 'license' }))
      .concat(pluginEvents.map((event) => ({ ...event, source: 'plugin' })))
      .filter((event) => !event.success)
      .slice(0, 8)
      .map((event) => ({
        name: event.figma_user_name || event.figma_user_id || 'Unknown user',
        issue: event.message || event.error_code || event.event_type,
        lastSeen: event.created_at,
        action: 'Inspect'
      })),
    users,
    pluginUsers: pluginUsers.map((user) => ({
      name: user.figma_user_name || user.figma_user_id || 'Unknown user',
      figmaUserId: user.figma_user_id || '',
      plan: user.plan || '',
      firstSeenAt: user.first_seen_at || '',
      lastSeenAt: user.last_seen_at || '',
      lastEventType: user.last_event_type || '',
      lastFeature: user.last_feature || '',
      usageCount: Number(user.usage_count) || 0
    })),
    activityEvents,
    errorRows,
    retention,
    featurePerformance,
    alerts: buildSmartAlerts({
      failedEvents,
      gumroadSales,
      gumroadOnlySales,
      pluginUsers,
      diagnostics,
      users
    }),
    licenses,
    timeline,
    funnel: [
      { label: 'Opened plugin', count: pluginEvents.length ? formatCount(pluginEvents.filter((event) => event.event_type === 'plugin_opened').length, 'events') : 'Not tracked yet' },
      { label: 'Used free feature', count: pluginEvents.length ? formatCount(pluginEvents.filter((event) => event.event_type === 'trial_used').length, 'events') : 'Not tracked yet' },
      { label: 'Reached trial limit', count: pluginEvents.length ? formatCount(trialExhaustedCount, 'events') : 'Not tracked yet' },
      { label: 'Opened upgrade screen', count: pluginEvents.length ? formatCount(upgradeOpenedCount + gumroadClickedCount, 'events') : 'Not tracked yet' },
      { label: 'Activated Pro', count: `${linkedCount} linked users` }
    ],
    features: buildFeatureUsage(pluginEvents),
    errorHotspots: buildErrorHotspots(pluginEvents, licenseEvents),
    logs: pluginEvents.slice(0, 8).map((event) => ({
      level: event.success ? 'ok' : 'error',
      title: `POST /api/telemetry ${event.event_type}`,
      copy: event.message || `${event.figma_user_name || event.figma_user_id || 'Unknown user'} ${event.feature ? labelFromFeature(event.feature) : event.event_type}.`
    })).concat(licenseEvents.slice(0, 4).map((event) => ({
      level: event.success ? 'ok' : 'error',
      title: `POST /api/${event.event_type}`,
      copy: event.message || `${event.figma_user_name || event.figma_user_id || 'Unknown user'} ${event.success ? 'succeeded' : 'failed'}.`
    }))).slice(0, 12),
    summary: {
      activeProThisWeek: activeUsersThisWeek || updatedThisWeek,
      criticalCount: failedEvents,
      workerHealth: 'Live',
      workerCopy: diagnostics && diagnostics.migrationRequired
        ? 'Connected to Worker, but the D1 schema needs migration before all dashboard data can appear.'
        : pluginEvents.length
        ? 'Connected to Cloudflare D1 with live license and product telemetry.'
        : 'Connected to Cloudflare D1; telemetry starts after the plugin update is used.'
    },
    diagnostics
  };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return jsonPreflight(request);
    if (request.method !== 'POST') return json({ success: false, message: 'Method not allowed' }, 405);

    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/admin/login') {
        const { username = '', password = '' } = await request.json().catch(() => ({}));
        if (!String(username).trim() || !String(password).trim()) {
          return json({ success: false, message: 'Missing admin username or password.' }, 400, request);
        }

        const valid = await verifyAdminCredentials(env, username, password);
        if (!valid) {
          return json({ success: false, message: 'Invalid admin username or password.' }, 401, request);
        }

        const sessionCookie = await createAdminSessionCookie(env, {
          username: getAdminUsername(env)
        });
        return json(
          { success: true, authenticated: true, username: getAdminUsername(env) },
          200,
          request,
          { 'Set-Cookie': buildAdminSessionSetCookie(sessionCookie) }
        );
      }

      if (url.pathname === '/api/admin/logout') {
        return json(
          { success: true, authenticated: false },
          200,
          request,
          { 'Set-Cookie': buildAdminSessionClearCookie() }
        );
      }

      if (url.pathname === '/api/admin/session') {
        const session = await readAdminSession(request, env);
        if (session) {
          return json({
            success: true,
            authenticated: true,
            username: session.username || getAdminUsername(env)
          }, 200, request);
        }

        const authorized = await isAdminAuthorized(request, env);
        return json({
          success: true,
          authenticated: authorized,
          username: authorized ? getAdminUsername(env) : null
        }, 200, request);
      }

      if (url.pathname === '/api/activate-license') {
        const { figmaUserId, figmaUserName = '', licenseKey = '' } = await request.json();
        if (!figmaUserId || !licenseKey.trim()) {
          schedule(ctx, recordLicenseEvent(env, {
            type: 'activate-license',
            figmaUserId,
            figmaUserName,
            licenseKey,
            success: false,
            message: 'Missing figmaUserId or licenseKey'
          }));
          return json({ success: false, message: 'Missing figmaUserId or licenseKey' }, 400);
        }

        const existingLicenseBinding = await getBindingByLicense(env, licenseKey.trim());
        if (existingLicenseBinding && existingLicenseBinding.figma_user_id !== figmaUserId) {
          schedule(ctx, recordLicenseEvent(env, {
            type: 'activate-license',
            figmaUserId,
            figmaUserName,
            licenseKey,
            success: false,
            message: 'License is already linked to another Figma account'
          }));
          return json({ success: false, message: 'This license is already linked to another Figma account.' }, 409);
        }

        const gumroadData = await verifyWithGumroad(licenseKey.trim(), !existingLicenseBinding);
        if (!isPurchaseActive(gumroadData)) {
          schedule(ctx, recordLicenseEvent(env, {
            type: 'activate-license',
            figmaUserId,
            figmaUserName,
            licenseKey,
            success: false,
            message: gumroadData && gumroadData.message ? gumroadData.message : 'Invalid or inactive license'
          }));
          return json({
            success: false,
            message: gumroadData && gumroadData.message ? gumroadData.message : 'Invalid or inactive license.'
          }, 400);
        }

        const purchaseDetails = extractGumroadPurchaseDetails(gumroadData);
        await upsertBinding(env, {
          figmaUserId,
          figmaUserName,
          licenseKey: licenseKey.trim(),
          ...purchaseDetails
        });

        schedule(ctx, recordLicenseEvent(env, {
          type: 'activate-license',
          figmaUserId,
          figmaUserName,
          licenseKey,
          success: true,
          message: 'License activated and linked'
        }));
        return json({ success: true, isPro: true });
      }

      if (url.pathname === '/api/license-status') {
        const { figmaUserId } = await request.json();
        return handleLicenseStatus(env, ctx, figmaUserId);
      }

      if (url.pathname === '/api/unlink-license') {
        const { figmaUserId } = await request.json();
        return handleUnlinkLicense(env, ctx, figmaUserId);
      }

      if (url.pathname === '/api/telemetry') {
        const event = await request.json();
        if (!event || typeof event !== 'object' || Array.isArray(event)) {
          return json({ success: false, message: 'Invalid telemetry event' }, 400);
        }

        if (!compactString(event.eventType || event.type, 80)) {
          return json({ success: false, message: 'Missing eventType' }, 400);
        }

        schedule(ctx, Promise.all([
          recordPluginEvent(env, event),
          upsertPluginUser(env, event)
        ]));
        return json({ success: true });
      }

      if (url.pathname === '/api/admin/dashboard') {
        const authorized = await isAdminAuthorized(request, env);
        if (!authorized) {
          return json({ success: false, message: 'Unauthorized admin request' }, 401, request);
        }

        const [bindingsResult, events, pluginEvents, gumroadSales, pluginUsers, diagnostics, licenseStats] = await Promise.all([
          getLicenseBindingsForAdmin(env),
          getRecentEvents(env),
          getRecentPluginEvents(env),
          getGumroadSalesForAdmin(env),
          getPluginUsersForAdmin(env),
          getDatabaseDiagnostics(env),
          getLicenseBindingStats(env)
        ]);
        const payload = buildAdminDashboardPayload(bindingsResult.rows || [], events, pluginEvents, gumroadSales, pluginUsers, {
          ...diagnostics,
          missingPurchaseFields: bindingsResult.missingPurchaseFields
        }, licenseStats);

        return json({
          success: true,
          generatedAt: new Date().toISOString(),
          data: payload
        }, 200, request);
      }

      if (url.pathname === '/api/admin/diagnostics') {
        const authorized = await isAdminAuthorized(request, env);
        if (!authorized) {
          return json({ success: false, message: 'Unauthorized admin request' }, 401, request);
        }

        return json({
          success: true,
          diagnostics: await getDatabaseDiagnostics(env)
        }, 200, request);
      }

      if (url.pathname === '/api/admin/test-telemetry') {
        const authorized = await isAdminAuthorized(request, env);
        if (!authorized) {
          return json({ success: false, message: 'Unauthorized admin request' }, 401, request);
        }

        const recorded = await recordPluginEvent(env, {
          eventType: 'admin_test_telemetry',
          figmaUserId: 'admin-test',
          figmaUserName: 'Admin Test',
          plan: 'pro',
          success: true,
          message: 'Admin telemetry test event'
        });

        return json({
          success: recorded,
          message: recorded ? 'Telemetry test event recorded.' : 'Telemetry table is not ready. Run schema migration.'
        }, recorded ? 200 : 500, request);
      }

      if (url.pathname === '/api/admin/backfill-purchases') {
        const authorized = await isAdminAuthorized(request, env);
        if (!authorized) {
          return json({ success: false, message: 'Unauthorized admin request' }, 401, request);
        }

        const body = await request.json().catch(() => ({}));
        const result = await backfillPurchaseDetails(env, body.limit);
        return json({
          success: !result.migrationRequired,
          message: result.migrationRequired ? 'Purchase-field migration required before backfill.' : undefined,
          ...result
        }, result.migrationRequired ? 409 : 200, request);
      }

      if (url.pathname === '/api/admin/import-gumroad-sales') {
        const authorized = await isAdminAuthorized(request, env);
        if (!authorized) {
          return json({ success: false, message: 'Unauthorized admin request' }, 401, request);
        }

        const body = await request.json().catch(() => ({}));
        const result = await importGumroadSales(env, {
          limit: body.limit,
          allProducts: body.allProducts !== false
        });

        return json({
          success: !result.migrationRequired,
          ...result
        }, result.migrationRequired ? 409 : 200, request);
      }

      if (url.pathname === '/api/admin/license-status') {
        const authorized = await isAdminAuthorized(request, env);
        if (!authorized) {
          return json({ success: false, message: 'Unauthorized admin request' }, 401, request);
        }

        const { figmaUserId } = await request.json();
        const response = await handleLicenseStatus(env, ctx, figmaUserId);
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            ...buildCorsHeaders(request, { allowCredentials: true })
          }
        });
      }

      if (url.pathname === '/api/admin/unlink-license') {
        const authorized = await isAdminAuthorized(request, env);
        if (!authorized) {
          return json({ success: false, message: 'Unauthorized admin request' }, 401, request);
        }

        const { figmaUserId } = await request.json();
        const response = await handleUnlinkLicense(env, ctx, figmaUserId);
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            ...buildCorsHeaders(request, { allowCredentials: true })
          }
        });
      }

      return json({ success: false, message: 'Not found' }, 404);
    } catch (error) {
      return json({
        success: false,
        message: error instanceof Error ? error.message : 'Server error'
      }, 500, request);
    }
  }
};
