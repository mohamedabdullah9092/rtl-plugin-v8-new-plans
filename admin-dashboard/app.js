const DEFAULT_API_BASE_URL = 'https://rtl-master-activation.mohamedabdullah9092.workers.dev';
const API_BASE_URL_KEY = 'rtlMasterAdminApiBaseUrl';
const DASHBOARD_CACHE_KEY = 'rtlMasterDashboardData';

const fallbackDashboardData = {
  metrics: [
    { label: 'Known Users', value: '0', trend: 'Waiting for live data' },
    { label: 'Pro Users', value: '0', trend: 'Waiting for live data' },
    { label: 'Free Users', value: 'Not tracked', trend: 'Starts after telemetry events' },
    { label: 'Lost Pro Alerts', value: '0', trend: 'Waiting for live data' },
    { label: 'Activation Success', value: 'No events yet', trend: 'Waiting for activation events' }
  ],
  risks: [],
  features: [],
  funnel: [],
  errorHotspots: [],
  alerts: [],
  activityEvents: [],
  errorRows: [],
  retention: {
    trackedUsers: 0,
    active7Days: 0,
    active30Days: 0,
    new7Days: 0,
    oneTimeUsers: 0,
    activePro30Days: 0,
    trialLimitUsers: 0,
    items: []
  },
  featurePerformance: [],
  users: [],
  pluginUsers: [],
  logs: [],
  summary: {
    activeProThisWeek: 0,
    criticalCount: 0,
    workerHealth: 'No live data',
    workerCopy: 'Sign in from Settings to load live Cloudflare D1 data.'
  }
};

let dashboardData = cloneData(fallbackDashboardData);
let currentUserSearchTerm = '';
let currentPlanFilter = 'all';
let currentStatusFilter = 'all';
let currentActivitySearchTerm = '';
let currentActivityEventFilter = 'all';
let currentActivityPlanFilter = 'all';
let currentActivityDateFilter = 'all';
let isAdminAuthenticated = false;

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toStatusClass(value) {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('healthy') || normalized.includes('linked')) return 'ok';
  if (normalized.includes('active')) return 'ok';
  if (normalized.includes('trial') || normalized.includes('free') || normalized.includes('available')) return 'free';
  if (normalized.includes('ok')) return 'ok';
  return 'risk';
}

function formatSubscriptionPlan(value) {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'monthly') return 'Monthly';
  if (normalized === 'yearly') return 'Yearly';
  if (normalized === 'one_time') return 'One-time';
  if (normalized === 'subscription') return 'Subscription';
  return value || '-';
}

function formatSubscriptionStatus(value) {
  const normalized = String(value || '').toLowerCase();
  const labels = {
    active: 'Active',
    ended: 'Ended',
    payment_failed: 'Payment failed',
    refunded: 'Refunded',
    chargebacked: 'Chargebacked',
    one_time: 'One-time'
  };
  return labels[normalized] || value || '';
}

function userSearchText(user) {
  return [
    user.name,
    user.email,
    user.plan,
    user.subscriptionPlan,
    user.subscriptionStatus,
    user.subscriptionEndsAt,
    user.figmaUserId,
    user.licenseKey,
    user.purchaseDate,
    user.active,
    user.status
  ].join(' ').toLowerCase();
}

function parseUserDate(value) {
  if (!value) return 0;
  const timestamp = Date.parse(String(value).replace(' ', 'T'));
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getUserSortTime(user) {
  return Math.max(
    parseUserDate(user.active),
    parseUserDate(user.purchaseDate)
  );
}

function sortUsersNewest(users = []) {
  return [...users].sort((first, second) => {
    const byDate = getUserSortTime(second) - getUserSortTime(first);
    if (byDate) return byDate;
    return String(first.name || '').localeCompare(String(second.name || ''));
  });
}

function getVisibleUsers() {
  const sorted = sortUsersNewest(dashboardData.users);
  const term = currentUserSearchTerm.trim().toLowerCase();
  return sorted.filter((user) => {
    if (term && !userSearchText(user).includes(term)) return false;
    if (!matchesPlanFilter(user)) return false;
    if (!matchesStatusFilter(user)) return false;
    return true;
  });
}

function normalizeFilterValue(value) {
  return String(value || '').toLowerCase().replaceAll('-', '_').replaceAll(' ', '_');
}

function getUserPlanTokens(user) {
  return [
    normalizeFilterValue(user.plan),
    normalizeFilterValue(user.subscriptionPlan),
    normalizeFilterValue(formatSubscriptionPlan(user.subscriptionPlan))
  ].filter(Boolean);
}

function getUserStatusTokens(user) {
  return [
    normalizeFilterValue(user.status),
    normalizeFilterValue(user.subscriptionStatus),
    normalizeFilterValue(formatSubscriptionStatus(user.subscriptionStatus)),
    toStatusClass(user.subscriptionStatus || user.status)
  ].filter(Boolean);
}

function matchesPlanFilter(user) {
  if (currentPlanFilter === 'all') return true;
  return getUserPlanTokens(user).includes(currentPlanFilter);
}

function matchesStatusFilter(user) {
  if (currentStatusFilter === 'all') return true;
  return getUserStatusTokens(user).includes(currentStatusFilter);
}

function pluginUserSearchText(user) {
  return [
    user.name,
    user.plan,
    user.figmaUserId,
    user.lastEventType,
    user.lastFeature,
    user.firstSeenAt,
    user.lastSeenAt
  ].join(' ').toLowerCase();
}

function getVisiblePluginUsers() {
  const rows = [...(dashboardData.pluginUsers || [])].sort((first, second) =>
    parseUserDate(second.lastSeenAt) - parseUserDate(first.lastSeenAt)
  );
  const term = currentUserSearchTerm.trim().toLowerCase();
  return rows.filter((user) => {
    if (term && !pluginUserSearchText(user).includes(term)) return false;
    if (currentPlanFilter !== 'all' && normalizeFilterValue(user.plan) !== currentPlanFilter) return false;
    return true;
  });
}

function activitySearchText(event) {
  return [
    event.source,
    event.eventType,
    event.rawEventType,
    event.user,
    event.figmaUserId,
    event.plan,
    event.feature,
    event.rawFeature,
    event.errorCode,
    event.message,
    event.createdAt
  ].join(' ').toLowerCase();
}

function matchesActivityDateFilter(event) {
  if (currentActivityDateFilter === 'all') return true;

  const eventDate = parseUserDate(event.createdAt);
  if (!eventDate) return false;

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  if (currentActivityDateFilter === 'today') {
    return new Date(eventDate).toDateString() === new Date().toDateString();
  }
  if (currentActivityDateFilter === '7d') return eventDate >= now - 7 * dayMs;
  if (currentActivityDateFilter === '30d') return eventDate >= now - 30 * dayMs;
  return true;
}

function getVisibleActivityEvents() {
  const term = currentActivitySearchTerm.trim().toLowerCase();
  return [...(dashboardData.activityEvents || [])]
    .sort((first, second) => parseUserDate(second.createdAt) - parseUserDate(first.createdAt))
    .filter((event) => {
      if (term && !activitySearchText(event).includes(term)) return false;
      if (currentActivityEventFilter !== 'all' && normalizeFilterValue(event.rawEventType || event.eventType) !== currentActivityEventFilter) return false;
      if (currentActivityPlanFilter !== 'all' && normalizeFilterValue(event.plan) !== currentActivityPlanFilter) return false;
      if (!matchesActivityDateFilter(event)) return false;
      return true;
    });
}

function getUserActivity(figmaUserId) {
  if (!figmaUserId) return [];
  return (dashboardData.activityEvents || [])
    .filter((event) => event.figmaUserId === figmaUserId)
    .sort((first, second) => parseUserDate(second.createdAt) - parseUserDate(first.createdAt));
}

function getUserByIdentifier(identifier) {
  const directUser = (dashboardData.users || []).find((item) =>
    [item.figmaUserId, item.licenseKey, item.email, item.name].some((value) => value && String(value) === String(identifier))
  );
  if (directUser) return directUser;

  const trackedUser = (dashboardData.pluginUsers || []).find((item) =>
    [item.figmaUserId, item.name].some((value) => value && String(value) === String(identifier))
  );
  if (!trackedUser) return null;

  return {
    name: trackedUser.name || 'Tracked user',
    email: '',
    plan: trackedUser.plan || '',
    subscriptionPlan: '',
    subscriptionStatus: '',
    subscriptionEndsAt: '',
    purchaseDate: '',
    figmaUserId: trackedUser.figmaUserId || '',
    licenseKey: '',
    active: trackedUser.lastSeenAt || '',
    status: trackedUser.lastEventType || '',
    lastSeenAt: trackedUser.lastSeenAt || ''
  };
}

function getUserByFigmaId(figmaUserId) {
  if (!figmaUserId) return null;
  return (dashboardData.users || []).find((item) => item.figmaUserId === figmaUserId)
    || (dashboardData.pluginUsers || []).find((item) => item.figmaUserId === figmaUserId)
    || null;
}

function getUserErrorEvents(figmaUserId) {
  if (!figmaUserId) return [];
  return (dashboardData.activityEvents || [])
    .filter((event) => event.figmaUserId === figmaUserId && !event.success)
    .sort((first, second) => parseUserDate(second.createdAt) - parseUserDate(first.createdAt));
}

function getUserUsageSummary(figmaUserId) {
  const activity = getUserActivity(figmaUserId);
  const errors = getUserErrorEvents(figmaUserId);
  const completedFeatures = activity.filter((event) => event.rawEventType === 'feature_completed').length;
  const startedFeatures = activity.filter((event) => event.rawEventType === 'feature_started').length;
  const latestSuccess = activity.find((event) => event.success);
  const latestFailure = errors[0];

  return {
    totalEvents: activity.length,
    errors: errors.length,
    startedFeatures,
    completedFeatures,
    latestSuccessAt: latestSuccess?.createdAt || '',
    latestFailureAt: latestFailure?.createdAt || ''
  };
}

function formatDuration(value) {
  const duration = Number(value);
  if (!Number.isFinite(duration) || duration <= 0) return '-';
  if (duration >= 1000) return `${Math.round(duration / 100) / 10}s`;
  return `${Math.round(duration)}ms`;
}

function statusLabel(success) {
  return success ? 'Success' : 'Failed';
}

function renderEmptyRow(targetId, message, columnCount) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <tr>
      <td colspan="${columnCount}">${escapeHtml(message)}</td>
    </tr>
  `;
}

function getApiBaseUrl() {
  return (localStorage.getItem(API_BASE_URL_KEY) || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
}

function getCachedDashboardData() {
  try {
    const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Could not read dashboard cache', error);
    return null;
  }
}

function setCachedDashboardData(data) {
  try {
    localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Could not cache dashboard data', error);
  }
}

function mergeDashboardData(liveData) {
  const next = cloneData(fallbackDashboardData);

  Object.entries(liveData || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      next[key] = value;
      return;
    }

    if (value && typeof value === 'object') {
      next[key] = { ...(next[key] || {}), ...value };
    }
  });

  if (liveData && liveData.diagnostics && liveData.diagnostics.migrationRequired) {
    const missingTables = Object.entries(liveData.diagnostics.tables || {})
      .filter(([, exists]) => !exists)
      .map(([name]) => name);
    const missingColumns = liveData.diagnostics.missingPurchaseColumns || [];
    next.risks = [
      {
        title: 'D1 schema migration required',
        copy: [
          missingTables.length ? `Missing tables: ${missingTables.join(', ')}` : '',
          missingColumns.length ? `Missing columns: ${missingColumns.join(', ')}` : ''
        ].filter(Boolean).join('. ') || 'Run the latest schema migration.'
      },
      ...next.risks
    ];
  }

  dashboardData = next;
}

function showDashboardLoadError(error) {
  const next = cloneData(fallbackDashboardData);
  const message = error instanceof Error ? error.message : 'Could not load live dashboard data.';
  next.summary = {
    ...(next.summary || {}),
    workerHealth: 'Error',
    workerCopy: message,
    criticalCount: 1
  };
  next.risks = [
    {
      title: 'Live dashboard load failed',
      copy: message
    },
    ...next.risks
  ];
  next.logs = [
    {
      level: 'error',
      title: 'POST /api/admin/dashboard',
      copy: message
    },
    ...next.logs
  ];
  dashboardData = next;
}

function showDashboardAuthMissing() {
  const cached = getCachedDashboardData();
  if (cached) {
    mergeDashboardData(cached);
    isAdminAuthenticated = false;
    dashboardData.summary = {
      ...(dashboardData.summary || {}),
      workerHealth: 'Cached data',
      workerCopy: 'Showing the last loaded dashboard data. Sign in from Settings to refresh current live data.'
    };
    dashboardData.risks = [
      {
        title: 'Admin session required',
        copy: 'The dashboard cannot refresh live Cloudflare D1 data until you sign in from Settings.'
      },
      ...dashboardData.risks
    ];
    return;
  }

  showDashboardLoadError(new Error('Admin session is missing in this browser. Open Settings and sign in to load live data.'));
}

function renderMetrics() {
  const metricsGrid = document.getElementById('metrics-grid');
  metricsGrid.innerHTML = dashboardData.metrics.map((metric) => `
    <article class="panel metric-card">
      <p class="eyebrow">${escapeHtml(metric.label)}</p>
      <div class="metric-value">${escapeHtml(metric.value)}</div>
      <div class="metric-trend ${metric.negative ? 'negative' : ''}">${escapeHtml(metric.trend)}</div>
    </article>
  `).join('');
}

function renderRiskList() {
  const riskList = document.getElementById('risk-list');
  if (!riskList) return;

  if (!dashboardData.risks.length) {
    riskList.innerHTML = `
      <div class="risk-item">
        <strong>No active risks</strong>
        <span>Dashboard data loaded without critical schema or worker alerts.</span>
      </div>
    `;
    return;
  }

  riskList.innerHTML = dashboardData.risks.map((item) => `
    <div class="risk-item">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.copy)}</span>
    </div>
  `).join('');
}

function renderFeatureUsage() {
  const target = document.getElementById('feature-usage-list');
  if (!target) return;

  const rows = dashboardData.features && dashboardData.features.length
    ? dashboardData.features
    : [{ name: 'No feature telemetry yet', percent: 0, copy: 'Use the plugin to start collecting feature signals.' }];

  target.innerHTML = rows.map((item) => {
    const percent = Math.max(0, Math.min(Number(item.percent) || 0, 100));
    return `
      <div class="insight-item">
        <div class="insight-row">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${percent}%</span>
        </div>
        <p>${escapeHtml(item.copy || '')}</p>
        <div class="insight-meter"><span style="width:${percent}%"></span></div>
      </div>
    `;
  }).join('');
}

function renderFunnel() {
  const target = document.getElementById('funnel-list');
  if (!target) return;

  const rows = dashboardData.funnel && dashboardData.funnel.length
    ? dashboardData.funnel
    : [{ label: 'No funnel data yet', count: 'Waiting for plugin events' }];

  target.innerHTML = rows.map((item) => `
    <div class="insight-item compact">
      <div class="insight-row">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(item.count)}</span>
      </div>
    </div>
  `).join('');
}

function renderErrorHotspots() {
  const target = document.getElementById('error-hotspots-list');
  if (!target) return;

  const rows = dashboardData.errorHotspots && dashboardData.errorHotspots.length
    ? dashboardData.errorHotspots
    : [{ title: 'No tracked errors', count: 0, source: 'Live telemetry', feature: '', latest: '' }];

  target.innerHTML = rows.map((item) => `
    <div class="insight-item compact ${Number(item.count) > 0 ? 'attention' : ''}">
      <div class="insight-row">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.count)}</span>
      </div>
      <p>${escapeHtml([item.source, item.feature, item.latest].filter(Boolean).join(' - '))}</p>
    </div>
  `).join('');
}

function renderRecentUsersTable(rows = getVisibleUsers().slice(0, 8)) {
  if (!rows.length) {
    renderEmptyRow('recent-users-table', 'No users loaded yet.', 5);
    return;
  }

  document.getElementById('recent-users-table').innerHTML = rows.map((user) => `
    <tr>
      <td data-label="Name">${escapeHtml(user.name)}</td>
      <td data-label="Email">${escapeHtml(user.email || '-')}</td>
      <td data-label="Plan"><span class="tag ${escapeHtml(String(user.plan || '').toLowerCase())}">${escapeHtml(user.plan)}</span></td>
      <td data-label="Billing">${escapeHtml(formatSubscriptionPlan(user.subscriptionPlan))}</td>
      <td data-label="Expiry Date">${escapeHtml(user.subscriptionEndsAt || '-')}</td>
    </tr>
  `).join('');
}

function renderUsersTable(rows = getVisibleUsers()) {
  const resultCount = document.getElementById('users-result-count');
  if (resultCount) resultCount.textContent = `${rows.length} user${rows.length === 1 ? '' : 's'}`;

  if (!rows.length) {
    renderEmptyRow('users-table', 'No users match this view.', 11);
    return;
  }

  document.getElementById('users-table').innerHTML = rows.map((user) => `
    <tr class="searchable-row" data-search="${escapeHtml(userSearchText(user))}">
      <td data-label="Name">${escapeHtml(user.name)}</td>
      <td data-label="Email">${escapeHtml(user.email || '-')}</td>
      <td data-label="Plan"><span class="tag ${escapeHtml(String(user.plan || '').toLowerCase())}">${escapeHtml(user.plan)}</span></td>
      <td data-label="Billing">${escapeHtml(formatSubscriptionPlan(user.subscriptionPlan))}</td>
      <td data-label="Figma User ID">${escapeHtml(user.figmaUserId)}</td>
      <td data-label="Activation Code" class="mono-cell">${escapeHtml(user.licenseKey || '-')}</td>
      <td data-label="Purchase Date">${escapeHtml(user.purchaseDate || '-')}</td>
      <td data-label="Expiry Date">${escapeHtml(user.subscriptionEndsAt || '-')}</td>
      <td data-label="Last Active">${escapeHtml(user.active)}</td>
      <td data-label="Status"><span class="tag ${toStatusClass(user.subscriptionStatus || user.status)}">${escapeHtml(formatSubscriptionStatus(user.subscriptionStatus) || user.status)}</span></td>
      <td data-label="Actions">
        <div class="action-stack">
          <button class="table-action" data-user-profile="${escapeHtml(user.figmaUserId || user.licenseKey || user.email || user.name)}">Profile</button>
          ${user.figmaUserId ? `<button class="table-action" data-user-lookup="${escapeHtml(user.figmaUserId)}">Lookup</button>` : ''}
          ${user.figmaUserId ? `<button class="table-action" data-user-refresh="${escapeHtml(user.figmaUserId)}">Refresh License</button>` : ''}
          ${user.figmaUserId ? `<button class="table-action danger" data-user-unlink="${escapeHtml(user.figmaUserId)}">Unlink</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function renderPluginUsersTable(rows = getVisiblePluginUsers()) {
  const resultCount = document.getElementById('plugin-users-result-count');
  if (resultCount) resultCount.textContent = `${rows.length} tracked user${rows.length === 1 ? '' : 's'}`;

  if (!rows.length) {
    renderEmptyRow('plugin-users-table', 'No plugin users tracked yet.', 8);
    return;
  }

  document.getElementById('plugin-users-table').innerHTML = rows.map((user) => `
    <tr>
      <td data-label="User">${escapeHtml(user.name)}</td>
      <td data-label="Plan"><span class="tag ${escapeHtml(String(user.plan || '').toLowerCase())}">${escapeHtml(user.plan || '-')}</span></td>
      <td data-label="First Used">${escapeHtml(user.firstSeenAt || '-')}</td>
      <td data-label="Last Used">${escapeHtml(user.lastSeenAt || '-')}</td>
      <td data-label="Usage Count">${escapeHtml(user.usageCount || 0)}</td>
      <td data-label="Last Event">${escapeHtml(user.lastEventType || '-')}</td>
      <td data-label="Last Feature">${escapeHtml(user.lastFeature || '-')}</td>
      <td data-label="Figma User ID">${escapeHtml(user.figmaUserId || '-')}</td>
    </tr>
  `).join('');
}

function populateActivityEventFilter() {
  const select = document.getElementById('activity-event-filter');
  if (!select) return;

  const currentValue = select.value || currentActivityEventFilter;
  const options = Array.from(new Map((dashboardData.activityEvents || [])
    .map((event) => [normalizeFilterValue(event.rawEventType || event.eventType), event.eventType || event.rawEventType])
    .filter(([value]) => value)).entries())
    .sort((first, second) => String(first[1]).localeCompare(String(second[1])));

  select.innerHTML = [
    '<option value="all">All events</option>',
    ...options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
  ].join('');
  select.value = options.some(([value]) => value === currentValue) ? currentValue : 'all';
  currentActivityEventFilter = select.value;
}

function renderActivityTable(rows = getVisibleActivityEvents()) {
  const resultCount = document.getElementById('activity-result-count');
  if (resultCount) resultCount.textContent = `${rows.length} event${rows.length === 1 ? '' : 's'}`;

  if (!rows.length) {
    renderEmptyRow('activity-table', 'No activity events match this view.', 8);
    return;
  }

  document.getElementById('activity-table').innerHTML = rows.map((event) => `
    <tr>
      <td data-label="Time">${escapeHtml(event.createdAt || '-')}</td>
      <td data-label="Source">${escapeHtml(event.source || '-')}</td>
      <td data-label="Event">${escapeHtml(event.eventType || event.rawEventType || '-')}</td>
      <td data-label="User">${escapeHtml(event.user || event.figmaUserId || '-')}</td>
      <td data-label="Plan"><span class="tag ${escapeHtml(normalizeFilterValue(event.plan))}">${escapeHtml(event.plan || '-')}</span></td>
      <td data-label="Feature">${escapeHtml(event.feature || '-')}</td>
      <td data-label="Status"><span class="tag ${event.success ? 'ok' : 'error'}">${statusLabel(event.success)}</span></td>
      <td data-label="Message">${escapeHtml([event.errorCode, event.message, formatDuration(event.durationMs)].filter((value) => value && value !== '-').join(' - ') || '-')}</td>
    </tr>
  `).join('');
}

function renderSmartAlerts() {
  const target = document.getElementById('smart-alerts-list');
  if (!target) return;

  const rows = dashboardData.alerts && dashboardData.alerts.length
    ? dashboardData.alerts
    : [{ level: 'ok', title: 'No active alerts', copy: 'Dashboard data does not show blocking issues right now.', action: 'Monitor' }];

  target.innerHTML = rows.map((alert) => `
    <div class="alert-item ${escapeHtml(alert.level || 'info')}">
      <div>
        <strong>${escapeHtml(alert.title)}</strong>
        <p>${escapeHtml(alert.copy || '')}</p>
      </div>
      <span>${escapeHtml(alert.action || '')}</span>
    </div>
  `).join('');
}

function renderErrorsTable() {
  const rows = dashboardData.errorRows || [];
  const resultCount = document.getElementById('errors-result-count');
  if (resultCount) resultCount.textContent = `${rows.length} error group${rows.length === 1 ? '' : 's'}`;

  if (!rows.length) {
    renderEmptyRow('errors-table', 'No grouped errors found.', 7);
    return;
  }

  document.getElementById('errors-table').innerHTML = rows.map((item) => `
    <tr>
      <td data-label="Issue">${escapeHtml(item.title || item.errorCode || 'Unknown issue')}</td>
      <td data-label="Source">${escapeHtml(item.source || '-')}</td>
      <td data-label="Feature">${escapeHtml(item.feature || '-')}</td>
      <td data-label="Count">${escapeHtml(item.count || 0)}</td>
      <td data-label="Affected Users">${escapeHtml(item.affectedUsers || 0)}</td>
      <td data-label="Latest">${escapeHtml(item.latest || '-')}</td>
      <td data-label="Message">${escapeHtml(item.message || (item.users || []).join(', ') || '-')}</td>
    </tr>
  `).join('');
}

function renderRetention() {
  const target = document.getElementById('retention-grid');
  if (!target) return;

  const retention = dashboardData.retention || fallbackDashboardData.retention;
  const rows = retention.items && retention.items.length
    ? retention.items
    : [
      { label: 'Tracked users', value: String(retention.trackedUsers || 0), copy: 'Waiting for plugin telemetry.' },
      { label: 'Active last 7 days', value: String(retention.active7Days || 0), copy: 'Recent returning users.' },
      { label: 'Active last 30 days', value: String(retention.active30Days || 0), copy: 'Monthly activity window.' },
      { label: 'Trial limit reached', value: String(retention.trialLimitUsers || 0), copy: 'Upgrade opportunity.' }
    ];

  target.innerHTML = rows.map((item) => `
    <article class="panel summary-card">
      <p class="eyebrow">${escapeHtml(item.label)}</p>
      <div class="metric-value">${escapeHtml(item.value)}</div>
      <p>${escapeHtml(item.copy || '')}</p>
    </article>
  `).join('');
}

function renderFeaturePerformance() {
  const rows = dashboardData.featurePerformance || [];
  if (!rows.length) {
    renderEmptyRow('feature-performance-table', 'No feature performance data yet.', 9);
    return;
  }

  document.getElementById('feature-performance-table').innerHTML = rows.map((item) => `
    <tr>
      <td data-label="Feature">${escapeHtml(item.feature || '-')}</td>
      <td data-label="Started">${escapeHtml(item.started || 0)}</td>
      <td data-label="Completed">${escapeHtml(item.completed || 0)}</td>
      <td data-label="Failed">${escapeHtml(item.failed || 0)}</td>
      <td data-label="Success Rate">${escapeHtml(`${item.successRate || 0}%`)}</td>
      <td data-label="Avg Duration">${escapeHtml(formatDuration(item.averageDurationMs))}</td>
      <td data-label="Free Uses">${escapeHtml(item.freeUses || 0)}</td>
      <td data-label="Pro Uses">${escapeHtml(item.proUses || 0)}</td>
      <td data-label="Last Used">${escapeHtml(item.lastUsedAt || '-')}</td>
    </tr>
  `).join('');
}

function renderUserLookupResult(identifier = '') {
  const target = document.getElementById('user-id-lookup-result');
  if (!target) return;

  const normalized = String(identifier || '').trim();
  if (!normalized) {
    target.className = 'lookup-result empty';
    target.innerHTML = `
      <strong>No user selected</strong>
      <span>Search by Figma User ID to open the customer profile and actions quickly.</span>
    `;
    return;
  }

  const user = getUserByFigmaId(normalized);
  if (!user) {
    target.className = 'lookup-result empty';
    target.innerHTML = `
      <strong>User not found</strong>
      <span>No dashboard record matched Figma User ID <strong>${escapeHtml(normalized)}</strong>.</span>
    `;
    return;
  }

  const summary = getUserUsageSummary(normalized);
  const userLabel = user.name || user.figmaUserId || 'Unknown user';
  target.className = 'lookup-result';
  target.innerHTML = `
    <div class="lookup-result-head">
      <div>
        <strong>${escapeHtml(userLabel)}</strong>
        <p>${escapeHtml(user.email || user.figmaUserId || '-')}</p>
      </div>
      <div class="action-stack">
        <button class="table-action" data-user-profile="${escapeHtml(user.figmaUserId || user.email || user.name)}">Open Profile</button>
        <button class="table-action" data-user-refresh="${escapeHtml(normalized)}">Refresh License</button>
        <button class="table-action danger" data-user-unlink="${escapeHtml(normalized)}">Unlink</button>
      </div>
    </div>
    <div class="lookup-meta">
      <span class="tag ${escapeHtml(String(user.plan || '').toLowerCase())}">${escapeHtml(user.plan || '-')}</span>
      <span class="tag ${toStatusClass(user.subscriptionStatus || user.status)}">${escapeHtml(formatSubscriptionStatus(user.subscriptionStatus) || user.status || '-')}</span>
      <span class="tag">${escapeHtml(formatSubscriptionPlan(user.subscriptionPlan) || 'No billing')}</span>
    </div>
    <span>Events: ${escapeHtml(summary.totalEvents)} | Errors: ${escapeHtml(summary.errors)} | Last active: ${escapeHtml(user.active || user.lastSeenAt || '-')}</span>
  `;
}

function renderUserProfile(identifier) {
  const modal = document.getElementById('user-profile-modal');
  const title = document.getElementById('user-profile-title');
  const body = document.getElementById('user-profile-body');
  if (!modal || !title || !body) return;

  const user = getUserByIdentifier(identifier);
  if (!user) return;

  const activity = getUserActivity(user.figmaUserId).slice(0, 8);
  const errors = getUserErrorEvents(user.figmaUserId).slice(0, 5);
  const summary = getUserUsageSummary(user.figmaUserId);
  title.textContent = user.name || 'Customer';
  body.innerHTML = `
    <div class="profile-actions">
      ${user.figmaUserId ? `<button class="ghost-button" type="button" data-user-lookup="${escapeHtml(user.figmaUserId)}">Open In Lookup</button>` : ''}
      ${user.figmaUserId ? `<button class="ghost-button" type="button" data-user-refresh="${escapeHtml(user.figmaUserId)}">Refresh License</button>` : ''}
      ${user.figmaUserId ? `<button class="table-action danger" type="button" data-user-unlink="${escapeHtml(user.figmaUserId)}">Unlink License</button>` : ''}
    </div>
    <div class="profile-section">
      <p class="profile-section-title">Overview</p>
      <div class="profile-grid">
        <div><span>Email</span><strong>${escapeHtml(user.email || '-')}</strong></div>
        <div><span>Plan</span><strong>${escapeHtml(user.plan || '-')}</strong></div>
        <div><span>Billing</span><strong>${escapeHtml(formatSubscriptionPlan(user.subscriptionPlan))}</strong></div>
        <div><span>Subscription Status</span><strong>${escapeHtml(formatSubscriptionStatus(user.subscriptionStatus) || user.status || '-')}</strong></div>
        <div><span>Expiry Date</span><strong>${escapeHtml(user.subscriptionEndsAt || '-')}</strong></div>
        <div><span>Last Active</span><strong>${escapeHtml(user.active || user.lastSeenAt || '-')}</strong></div>
        <div><span>Purchase Date</span><strong>${escapeHtml(user.purchaseDate || '-')}</strong></div>
        <div><span>Figma User ID</span><strong>${escapeHtml(user.figmaUserId || '-')}</strong></div>
        <div class="wide"><span>Activation Code</span><strong>${escapeHtml(user.licenseKey || '-')}</strong></div>
      </div>
    </div>
    <div class="profile-section">
      <p class="profile-section-title">Usage Summary</p>
      <div class="profile-kpis">
        <div class="profile-kpi"><span>Total Events</span><strong>${escapeHtml(summary.totalEvents)}</strong></div>
        <div class="profile-kpi"><span>Feature Starts</span><strong>${escapeHtml(summary.startedFeatures)}</strong></div>
        <div class="profile-kpi"><span>Feature Completes</span><strong>${escapeHtml(summary.completedFeatures)}</strong></div>
        <div class="profile-kpi"><span>Errors</span><strong>${escapeHtml(summary.errors)}</strong></div>
      </div>
    </div>
    <div class="profile-section profile-activity">
      <p class="profile-section-title">Recent Activity</p>
      ${activity.length ? activity.map((event) => `
        <div class="profile-event">
          <strong>${escapeHtml(event.eventType || event.rawEventType || '-')}</strong>
          <span>${escapeHtml([event.feature, event.createdAt, statusLabel(event.success)].filter(Boolean).join(' - '))}</span>
        </div>
      `).join('') : '<div class="profile-event"><strong>No tracked activity</strong><span>Telemetry will appear after plugin usage.</span></div>'}
    </div>
    <div class="profile-section profile-activity">
      <p class="profile-section-title">Recent Errors</p>
      ${errors.length ? errors.map((event) => `
        <div class="profile-event">
          <strong>${escapeHtml(event.eventType || event.rawEventType || 'Failed event')}</strong>
          <span>${escapeHtml([event.errorCode, event.message, event.createdAt].filter(Boolean).join(' - '))}</span>
        </div>
      `).join('') : '<div class="profile-event"><strong>No recent errors</strong><span>This user does not have tracked failures in the current dashboard window.</span></div>'}
    </div>
  `;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function renderLogs() {
  const rows = dashboardData.logs.length
    ? dashboardData.logs.slice(0, 6)
    : [{ level: 'ok', title: 'POST /api/admin/dashboard', copy: 'No backend events recorded yet.' }];

  const content = rows.map((item) => `
    <div class="log-entry">
      <div class="log-entry-head">
        <div class="log-title-block">
          <span class="log-method">POST</span>
          <strong>${escapeHtml(String(item.title || '').replace(/^POST\s+/i, ''))}</strong>
        </div>
        <span class="tag ${item.level === 'ok' ? 'ok' : 'error'}">${item.level === 'ok' ? 'Healthy' : 'Attention'}</span>
      </div>
      <p>${escapeHtml(item.copy)}</p>
    </div>
  `).join('');

  const logList = document.getElementById('log-list');
  if (logList) logList.innerHTML = content;
}

function hydrateSummary() {
  const summary = dashboardData.summary || {};
  const criticalCount = document.getElementById('critical-count');
  const workerHealth = document.getElementById('worker-health');
  const workerCopy = document.getElementById('worker-copy');
  const lastUpdated = document.getElementById('last-updated');

  if (criticalCount) criticalCount.textContent = `${summary.criticalCount ?? 0} critical`;
  if (workerHealth) workerHealth.textContent = summary.workerHealth || 'No live data';
  if (workerCopy) workerCopy.textContent = summary.workerCopy || 'Add an admin token in Settings to load live Cloudflare data.';
  if (lastUpdated) lastUpdated.textContent = `Updated ${new Date().toLocaleString()}`;
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function exportUsersCsv() {
  const headers = ['Name', 'Email', 'Plan', 'Billing', 'Figma User ID', 'Activation Code', 'Purchase Date', 'Expiry Date', 'Last Active', 'Subscription Status', 'Status'];
  const rows = getVisibleUsers().map((user) => [
    user.name,
    user.email,
    user.plan,
    formatSubscriptionPlan(user.subscriptionPlan),
    user.figmaUserId,
    user.licenseKey,
    user.purchaseDate,
    user.subscriptionEndsAt,
    user.active,
    formatSubscriptionStatus(user.subscriptionStatus) || user.status,
    user.status
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `rtl-master-users-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadCsv(filename, headers, rows) {
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function exportPluginUsersCsv() {
  const headers = ['Name', 'Plan', 'First Used', 'Last Used', 'Usage Count', 'Last Event', 'Last Feature', 'Figma User ID'];
  const rows = getVisiblePluginUsers().map((user) => [
    user.name,
    user.plan,
    user.firstSeenAt,
    user.lastSeenAt,
    user.usageCount,
    user.lastEventType,
    user.lastFeature,
    user.figmaUserId
  ]);
  downloadCsv(`rtl-master-plugin-users-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
}

function exportActivityCsv() {
  const headers = ['Time', 'Source', 'Event', 'Raw Event', 'User', 'Figma User ID', 'Plan', 'Feature', 'Success', 'Error Code', 'Message', 'Duration'];
  const rows = getVisibleActivityEvents().map((event) => [
    event.createdAt,
    event.source,
    event.eventType,
    event.rawEventType,
    event.user,
    event.figmaUserId,
    event.plan,
    event.feature,
    statusLabel(event.success),
    event.errorCode,
    event.message,
    formatDuration(event.durationMs)
  ]);
  downloadCsv(`rtl-master-activity-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
}

function exportErrorsCsv() {
  const headers = ['Issue', 'Source', 'Feature', 'Error Code', 'Count', 'Affected Users', 'Latest', 'Message', 'Users'];
  const rows = (dashboardData.errorRows || []).map((item) => [
    item.title,
    item.source,
    item.feature,
    item.errorCode,
    item.count,
    item.affectedUsers,
    item.latest,
    item.message,
    (item.users || []).join('; ')
  ]);
  downloadCsv(`rtl-master-errors-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
}

function exportFeaturePerformanceCsv() {
  const headers = ['Feature', 'Started', 'Completed', 'Failed', 'Success Rate', 'Average Duration', 'Free Uses', 'Pro Uses', 'Last Used'];
  const rows = (dashboardData.featurePerformance || []).map((item) => [
    item.feature,
    item.started,
    item.completed,
    item.failed,
    `${item.successRate || 0}%`,
    formatDuration(item.averageDurationMs),
    item.freeUses,
    item.proUses,
    item.lastUsedAt
  ]);
  downloadCsv(`rtl-master-feature-performance-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
}

function renderDashboard() {
  renderMetrics();
  renderRiskList();
  renderFeatureUsage();
  renderFunnel();
  renderErrorHotspots();
  renderRecentUsersTable();
  renderUsersTable();
  renderPluginUsersTable();
  populateActivityEventFilter();
  renderActivityTable();
  renderSmartAlerts();
  renderErrorsTable();
  renderRetention();
  renderFeaturePerformance();
  renderLogs();
  hydrateSummary();
}

function refreshUserViews() {
  renderUsersTable();
  renderPluginUsersTable();
  renderRecentUsersTable();
}

function refreshActivityViews() {
  renderActivityTable();
}

async function fetchJson(path, { body = {}, method = 'POST' } = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

function renderSessionStatus() {
  const status = document.getElementById('admin-session-status');
  if (!status) return;

  if (isAdminAuthenticated) {
    status.className = 'lookup-result';
    status.innerHTML = `
      <strong>Admin session active</strong>
      <span>Live admin data is available in this browser until you log out or the session expires.</span>
    `;
    return;
  }

  status.className = 'lookup-result empty';
  status.innerHTML = `
    <strong>Admin session required</strong>
    <span>Sign in once to load live dashboard data in this browser.</span>
  `;
}

async function syncAdminSession({ quiet = true } = {}) {
  try {
    const { response, payload } = await fetchJson('/api/admin/session');
    if (!response.ok || payload.success === false) {
      throw new Error(payload.message || 'Could not check admin session.');
    }
    isAdminAuthenticated = Boolean(payload.authenticated);
  } catch (error) {
    isAdminAuthenticated = false;
    if (!quiet) {
      alert(error instanceof Error ? error.message : 'Could not check admin session.');
    }
  }
  renderSessionStatus();
  return isAdminAuthenticated;
}

async function loadLiveDashboardData({ quiet = false } = {}) {
  try {
    const { response, payload } = await fetchJson('/api/admin/dashboard');
    if (response.status === 401) {
      isAdminAuthenticated = false;
      renderSessionStatus();
      if (!quiet && typeof window.openDashboardView === 'function') window.openDashboardView('settings');
      showDashboardAuthMissing();
      renderDashboard();
      return false;
    }

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'Could not load live dashboard data.');
    }

    isAdminAuthenticated = true;
    renderSessionStatus();
    setCachedDashboardData(payload.data);
    mergeDashboardData(payload.data);
    renderDashboard();
    return true;
  } catch (error) {
    console.warn('Live dashboard load failed', error);
    if (!quiet) alert(error instanceof Error ? error.message : 'Could not load live dashboard data.');
    showDashboardLoadError(error);
    renderDashboard();
    return false;
  }
}

function attachViewSwitching() {
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const views = Array.from(document.querySelectorAll('.view'));
  const sidebar = document.querySelector('.sidebar');
  const menuToggle = document.getElementById('mobile-menu-toggle');

  function openView(view) {
    navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.view === view));
    views.forEach((panel) => panel.classList.toggle('is-visible', panel.dataset.viewPanel === view));
    closeMobileMenu();
  }

  function closeMobileMenu() {
    if (!sidebar || !menuToggle) return;
    sidebar.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  window.openDashboardView = openView;

  navItems.forEach((button) => {
    button.addEventListener('click', () => openView(button.dataset.view));
  });

  if (sidebar && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!sidebar.classList.contains('is-open')) return;
      if (sidebar.contains(event.target)) return;
      closeMobileMenu();
    });
  }

  document.querySelectorAll('[data-nav-target]').forEach((button) => {
    button.addEventListener('click', () => openView(button.dataset.navTarget));
  });
}

function attachSearch() {
  const globalInput = document.getElementById('global-search');
  const usersInput = document.getElementById('users-search');

  function applySearch(term, sourceInput) {
    currentUserSearchTerm = term.trim().toLowerCase();
    [globalInput, usersInput].forEach((input) => {
      if (input && input !== sourceInput && input.value !== term) input.value = term;
    });

    refreshUserViews();
    if (term && typeof window.openDashboardView === 'function') {
      window.openDashboardView('users');
    }
  }

  if (globalInput) {
    globalInput.addEventListener('input', () => applySearch(globalInput.value, globalInput));
  }

  if (usersInput) {
    usersInput.addEventListener('input', () => applySearch(usersInput.value, usersInput));
  }
}

function attachUserFilters() {
  const planFilter = document.getElementById('users-plan-filter');
  const statusFilter = document.getElementById('users-status-filter');
  const clearButton = document.getElementById('clear-user-filters');
  const globalInput = document.getElementById('global-search');
  const usersInput = document.getElementById('users-search');

  if (planFilter) {
    planFilter.addEventListener('change', () => {
      currentPlanFilter = planFilter.value || 'all';
      refreshUserViews();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      currentStatusFilter = statusFilter.value || 'all';
      refreshUserViews();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      currentUserSearchTerm = '';
      currentPlanFilter = 'all';
      currentStatusFilter = 'all';
      if (globalInput) globalInput.value = '';
      if (usersInput) usersInput.value = '';
      if (planFilter) planFilter.value = 'all';
      if (statusFilter) statusFilter.value = 'all';
      refreshUserViews();
    });
  }
}

function attachActivityFilters() {
  const searchInput = document.getElementById('activity-search');
  const eventFilter = document.getElementById('activity-event-filter');
  const planFilter = document.getElementById('activity-plan-filter');
  const dateFilter = document.getElementById('activity-date-filter');
  const clearButton = document.getElementById('clear-activity-filters');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentActivitySearchTerm = searchInput.value || '';
      refreshActivityViews();
    });
  }

  if (eventFilter) {
    eventFilter.addEventListener('change', () => {
      currentActivityEventFilter = eventFilter.value || 'all';
      refreshActivityViews();
    });
  }

  if (planFilter) {
    planFilter.addEventListener('change', () => {
      currentActivityPlanFilter = planFilter.value || 'all';
      refreshActivityViews();
    });
  }

  if (dateFilter) {
    dateFilter.addEventListener('change', () => {
      currentActivityDateFilter = dateFilter.value || 'all';
      refreshActivityViews();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      currentActivitySearchTerm = '';
      currentActivityEventFilter = 'all';
      currentActivityPlanFilter = 'all';
      currentActivityDateFilter = 'all';
      if (searchInput) searchInput.value = '';
      if (eventFilter) eventFilter.value = 'all';
      if (planFilter) planFilter.value = 'all';
      if (dateFilter) dateFilter.value = 'all';
      refreshActivityViews();
    });
  }
}

async function postJson(path, body) {
  const { response, payload } = await fetchJson(path, { body });
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed.');
  }
  return payload;
}

function openUserLookup(figmaUserId) {
  const input = document.getElementById('user-id-lookup-input');
  if (input) input.value = figmaUserId || '';
  renderUserLookupResult(figmaUserId || '');
  if (typeof window.openDashboardView === 'function') window.openDashboardView('users');
}

async function refreshUserLicense(figmaUserId) {
  if (!figmaUserId) return;
  await postJson('/api/admin/license-status', { figmaUserId });
  await loadLiveDashboardData({ quiet: true });
  renderUserLookupResult(figmaUserId);
  renderUserProfile(figmaUserId);
  alert(`License refreshed for ${figmaUserId}.`);
}

async function unlinkUserLicense(figmaUserId) {
  if (!figmaUserId) return;
  const confirmed = window.confirm(`Unlink license for ${figmaUserId}?`);
  if (!confirmed) return;
  await postJson('/api/admin/unlink-license', { figmaUserId });
  await loadLiveDashboardData({ quiet: true });
  renderUserLookupResult(figmaUserId);
  alert(`License unlinked for ${figmaUserId}.`);
}

function attachUserLookup() {
  const input = document.getElementById('user-id-lookup-input');
  const button = document.getElementById('user-id-lookup-button');
  const clear = document.getElementById('user-id-lookup-clear');
  if (!input || !button || !clear) return;

  const runLookup = () => renderUserLookupResult(input.value.trim());

  button.addEventListener('click', runLookup);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runLookup();
    }
  });
  clear.addEventListener('click', () => {
    input.value = '';
    renderUserLookupResult('');
  });
}

function attachUserProfile() {
  const modal = document.getElementById('user-profile-modal');
  if (!modal) return;

  function closeProfile() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('click', (event) => {
    const profileButton = event.target.closest('[data-user-profile]');
    if (profileButton) {
      renderUserProfile(profileButton.dataset.userProfile);
      return;
    }

    const lookupButton = event.target.closest('[data-user-lookup]');
    if (lookupButton) {
      openUserLookup(lookupButton.dataset.userLookup);
      return;
    }

    const refreshButton = event.target.closest('[data-user-refresh]');
    if (refreshButton) {
      refreshUserLicense(refreshButton.dataset.userRefresh).catch((error) => {
        alert(error instanceof Error ? error.message : 'Could not refresh license.');
      });
      return;
    }

    const unlinkButton = event.target.closest('[data-user-unlink]');
    if (unlinkButton) {
      unlinkUserLicense(unlinkButton.dataset.userUnlink).catch((error) => {
        alert(error instanceof Error ? error.message : 'Could not unlink license.');
      });
      return;
    }

    if (event.target.closest('[data-close-profile]')) {
      closeProfile();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProfile();
  });
}

function attachSettings() {
  const apiInput = document.getElementById('api-base-url');
  const passwordInput = document.getElementById('admin-password');
  const saveButton = document.getElementById('save-dashboard-settings');
  const loginButton = document.getElementById('admin-login-button');
  const logoutButton = document.getElementById('admin-logout-button');
  const refreshButton = document.getElementById('refresh-dashboard');
  const importGumroadButton = document.getElementById('import-gumroad-sales');

  apiInput.value = getApiBaseUrl();
  renderSessionStatus();

  saveButton.addEventListener('click', () => {
    localStorage.setItem(API_BASE_URL_KEY, apiInput.value.trim() || DEFAULT_API_BASE_URL);
  });

  loginButton.addEventListener('click', async () => {
    loginButton.disabled = true;
    loginButton.textContent = 'Signing in...';
    try {
      await postJson('/api/admin/login', { password: passwordInput.value.trim() });
      passwordInput.value = '';
      isAdminAuthenticated = true;
      renderSessionStatus();
      await loadLiveDashboardData({ quiet: true });
      if (typeof window.openDashboardView === 'function') window.openDashboardView('overview');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'Sign In';
    }
  });

  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    try {
      await postJson('/api/admin/logout', {});
      isAdminAuthenticated = false;
      renderSessionStatus();
      showDashboardAuthMissing();
      renderDashboard();
      if (typeof window.openDashboardView === 'function') window.openDashboardView('settings');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not log out.');
    } finally {
      logoutButton.disabled = false;
    }
  });

  refreshButton.addEventListener('click', () => loadLiveDashboardData());

  if (importGumroadButton) {
    importGumroadButton.addEventListener('click', async () => {
      if (!isAdminAuthenticated) {
        alert('Sign in from Settings first.');
        return;
      }

      importGumroadButton.disabled = true;
      importGumroadButton.textContent = 'Importing...';
      try {
        const payload = await postJson('/api/admin/import-gumroad-sales', { limit: 500 });
        alert(`Imported ${payload.imported || 0} Gumroad sales.`);
        await loadLiveDashboardData();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Could not import Gumroad sales.');
      } finally {
        importGumroadButton.disabled = false;
        importGumroadButton.textContent = 'Import Gumroad Sales';
      }
    });
  }
}

function attachExports() {
  ['export-users-csv', 'export-users-csv-page'].forEach((id) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', exportUsersCsv);
  });

  ['export-plugin-users-csv', 'export-plugin-users-csv-page'].forEach((id) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', exportPluginUsersCsv);
  });

  ['export-activity-csv', 'export-activity-csv-page'].forEach((id) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', exportActivityCsv);
  });

  ['export-errors-csv', 'export-errors-csv-page'].forEach((id) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', exportErrorsCsv);
  });

  ['export-feature-performance-csv', 'export-feature-performance-csv-page'].forEach((id) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', exportFeaturePerformanceCsv);
  });
}

function init() {
  renderDashboard();
  attachViewSwitching();
  attachSearch();
  attachUserFilters();
  attachUserLookup();
  attachActivityFilters();
  attachUserProfile();
  attachSettings();
  attachExports();
  syncAdminSession({ quiet: true }).then((authenticated) => {
    if (authenticated) {
      loadLiveDashboardData({ quiet: true });
      return;
    }

    showDashboardAuthMissing();
    renderDashboard();
  });
}

init();
