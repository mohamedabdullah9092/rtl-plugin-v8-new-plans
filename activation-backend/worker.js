const GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';
const NEW_PRODUCT_ID = 'xjW3twDEIx4LJQrkpgz4fQ==';
const OLD_PRODUCT_ID = 'dK0Er2rZ-4VFBT6KD-VTYw==';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
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
  return env.DB
    .prepare('SELECT figma_user_id, figma_user_name, license_key, gumroad_sale_id FROM license_bindings WHERE figma_user_id = ?1')
    .bind(figmaUserId)
    .first();
}

async function getBindingByLicense(env, licenseKey) {
  return env.DB
    .prepare('SELECT figma_user_id, figma_user_name, license_key, gumroad_sale_id FROM license_bindings WHERE license_key = ?1')
    .bind(licenseKey)
    .first();
}

async function upsertBinding(env, { figmaUserId, figmaUserName, licenseKey, gumroadSaleId }) {
  return env.DB
    .prepare(`
      INSERT INTO license_bindings (figma_user_id, figma_user_name, license_key, gumroad_sale_id, updated_at)
      VALUES (?1, ?2, ?3, ?4, CURRENT_TIMESTAMP)
      ON CONFLICT(figma_user_id) DO UPDATE SET
        figma_user_name = excluded.figma_user_name,
        license_key = excluded.license_key,
        gumroad_sale_id = excluded.gumroad_sale_id,
        updated_at = CURRENT_TIMESTAMP
    `)
    .bind(figmaUserId, figmaUserName, licenseKey, gumroadSaleId)
    .run();
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return json({ ok: true });
    if (request.method !== 'POST') return json({ success: false, message: 'Method not allowed' }, 405);

    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/activate-license') {
        const { figmaUserId, figmaUserName = '', licenseKey = '' } = await request.json();
        if (!figmaUserId || !licenseKey.trim()) {
          return json({ success: false, message: 'Missing figmaUserId or licenseKey' }, 400);
        }

        const existingLicenseBinding = await getBindingByLicense(env, licenseKey.trim());
        if (existingLicenseBinding && existingLicenseBinding.figma_user_id !== figmaUserId) {
          return json({ success: false, message: 'This license is already linked to another Figma account.' }, 409);
        }

        const gumroadData = await verifyWithGumroad(licenseKey.trim(), !existingLicenseBinding);
        if (!isPurchaseActive(gumroadData)) {
          return json({
            success: false,
            message: gumroadData && gumroadData.message ? gumroadData.message : 'Invalid or inactive license.'
          }, 400);
        }

        const gumroadSaleId = gumroadData.purchase && gumroadData.purchase.sale_id ? String(gumroadData.purchase.sale_id) : null;
        await upsertBinding(env, {
          figmaUserId,
          figmaUserName,
          licenseKey: licenseKey.trim(),
          gumroadSaleId
        });

        return json({ success: true, isPro: true });
      }

      if (url.pathname === '/api/license-status') {
        const { figmaUserId } = await request.json();
        if (!figmaUserId) return json({ success: false, message: 'Missing figmaUserId' }, 400);

        const binding = await getBindingByUser(env, figmaUserId);
        if (!binding) return json({ success: true, isPro: false });

        const gumroadData = await verifyWithGumroad(binding.license_key, false);
        if (!isPurchaseActive(gumroadData)) {
          await env.DB.prepare('DELETE FROM license_bindings WHERE figma_user_id = ?1').bind(figmaUserId).run();
          return json({ success: true, isPro: false });
        }

        return json({ success: true, isPro: true });
      }

      if (url.pathname === '/api/unlink-license') {
        const { figmaUserId } = await request.json();
        if (!figmaUserId) return json({ success: false, message: 'Missing figmaUserId' }, 400);

        await env.DB.prepare('DELETE FROM license_bindings WHERE figma_user_id = ?1').bind(figmaUserId).run();
        return json({ success: true });
      }

      return json({ success: false, message: 'Not found' }, 404);
    } catch (error) {
      return json({
        success: false,
        message: error instanceof Error ? error.message : 'Server error'
      }, 500);
    }
  }
};
