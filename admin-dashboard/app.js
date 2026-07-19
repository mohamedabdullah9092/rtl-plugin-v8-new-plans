const DEFAULT_API_BASE_URL = 'https://rtl-master-activation.mohamedabdullah9092.workers.dev';
const API_BASE_URL_KEY = 'rtlMasterAdminApiBaseUrl';
const ADMIN_TOKEN_KEY = 'rtlMasterAdminToken';

const fallbackDashboardData = {
  metrics: [
    { label: 'Known Users', value: '0', trend: 'Waiting for live data' },
    { label: 'Pro Users', value: '0', trend: 'Waiting for live data' },
    { label: 'Free Users', value: 'Not tracked', trend: 'Starts after telemetry events' },
    { label: 'Lost Pro Alerts', value: '0', trend: 'Waiting for live data' },
    { label: 'Activation Success', value: 'No events yet', trend: 'Waiting for activation events' }
  ],
  conversions: [
    { label: 'Mon', value: 0 },
    { label: 'Tue', value: 0 },
    { label: 'Wed', value: 0 },
    { label: 'Thu', value: 0 },
    { label: 'Fri', value: 0 },
    { label: 'Sat', value: 0 },
    { label: 'Sun', value: 0 }
  ],
  risks: [],
  recovery: [],
  users: [],
  licenses: [],
  timeline: [],
  funnel: [
    { label: 'Opened plugin', count: 'Not tracked yet' },
    { label: 'Used free feature', count: 'Not tracked yet' },
    { label: 'Reached trial limit', count: 'Not tracked yet' },
    { label: 'Opened upgrade screen', count: 'Not tracked yet' },
    { label: 'Activated Pro', count: '0 linked users' }
  ],
  features: [
    { name: 'Mirror Layouts', percent: 0, copy: 'No feature telemetry yet' },
    { name: 'Translate Text Layers', percent: 0, copy: 'No feature telemetry yet' },
    { name: 'Variant Creation', percent: 0, copy: 'No feature telemetry yet' },
    { name: 'Font Replacement', percent: 0, copy: 'No feature telemetry yet' }
  ],
  logs: [],
  summary: {
    activeProThisWeek: 0,
    criticalCount: 0,
    workerHealth: 'No live data',
    workerCopy: 'Add the admin token and refresh to load real Cloudflare D1 data.'
  }
};

let dashboardData = cloneData(fallbackDashboardData);

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

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
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

function renderConversionBars() {
  const values = dashboardData.conversions.map((item) => Number(item.value) || 0);
  const max = Math.max(...values, 1);

  document.getElementById('conversion-bars').innerHTML = dashboardData.conversions.map((item) => `
    <div class="bar-group">
      <span class="bar-value">${escapeHtml(item.value)}</span>
      <div class="bar-stack">
        <div class="bar" style="height:${((Number(item.value) || 0) / max) * 100}%"></div>
      </div>
      <span class="bar-label">${escapeHtml(item.label)}</span>
    </div>
  `).join('');
}

function renderRiskList() {
  document.getElementById('risk-list').innerHTML = dashboardData.risks.map((item) => `
    <div class="risk-item">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.copy)}</span>
    </div>
  `).join('');
}

function renderRecoveryTable() {
  if (!dashboardData.recovery.length) {
    renderEmptyRow('recovery-table', 'No recovery issues found.', 4);
    return;
  }

  document.getElementById('recovery-table').innerHTML = dashboardData.recovery.map((item) => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.issue)}</td>
      <td>${escapeHtml(item.lastSeen)}</td>
      <td><button class="table-action">${escapeHtml(item.action)}</button></td>
    </tr>
  `).join('');
}

function renderUsersTable(rows = dashboardData.users) {
  if (!rows.length) {
    renderEmptyRow('users-table', 'No users match this view.', 11);
    return;
  }

  document.getElementById('users-table').innerHTML = rows.map((user) => `
    <tr class="searchable-row" data-search="${escapeHtml([user.name, user.email, user.plan, user.subscriptionPlan, user.subscriptionStatus, user.subscriptionEndsAt, user.figmaUserId, user.licenseKey, user.status].join(' ').toLowerCase())}">
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.email || '-')}</td>
      <td><span class="tag ${escapeHtml(String(user.plan || '').toLowerCase())}">${escapeHtml(user.plan)}</span></td>
      <td>${escapeHtml(formatSubscriptionPlan(user.subscriptionPlan))}</td>
      <td>${escapeHtml(user.figmaUserId)}</td>
      <td class="mono-cell">${escapeHtml(user.licenseKey || '-')}</td>
      <td>${escapeHtml(user.purchaseDate || '-')}</td>
      <td>${escapeHtml(user.subscriptionEndsAt || '-')}</td>
      <td>${escapeHtml(user.active)}</td>
      <td><span class="tag ${toStatusClass(user.subscriptionStatus || user.status)}">${escapeHtml(formatSubscriptionStatus(user.subscriptionStatus) || user.status)}</span></td>
      <td><button class="table-action">${escapeHtml(user.action)}</button></td>
    </tr>
  `).join('');
}

function renderLicensesTable() {
  if (!dashboardData.licenses.length) {
    renderEmptyRow('licenses-table', 'No linked licenses found.', 8);
    return;
  }

  document.getElementById('licenses-table').innerHTML = dashboardData.licenses.map((item) => `
    <tr>
      <td class="mono-cell">${escapeHtml(item.key)}</td>
      <td>${escapeHtml(item.user)}</td>
      <td>${escapeHtml(item.email || '-')}</td>
      <td>${escapeHtml(item.purchaseDate || '-')}</td>
      <td>${escapeHtml(formatSubscriptionPlan(item.subscriptionPlan))}</td>
      <td>${escapeHtml(item.subscriptionEndsAt || '-')}</td>
      <td><span class="tag ${toStatusClass(item.state)}">${escapeHtml(item.state)}</span></td>
      <td>${escapeHtml(item.updated)}</td>
    </tr>
  `).join('');
}

function renderTimeline() {
  document.getElementById('timeline').innerHTML = dashboardData.timeline.map((item) => `
    <div class="timeline-item">
      <div class="timeline-header">
        <strong>${escapeHtml(item.title)}</strong>
        <time>${escapeHtml(item.time)}</time>
      </div>
      <span>${escapeHtml(item.copy)}</span>
    </div>
  `).join('');
}

function renderFunnel() {
  document.getElementById('funnel').innerHTML = dashboardData.funnel.map((item) => `
    <div class="funnel-step">
      <div class="funnel-step-header">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(item.count)}</span>
      </div>
    </div>
  `).join('');
}

function renderFeatures() {
  document.getElementById('feature-list').innerHTML = dashboardData.features.map((item) => {
    const percent = Math.max(0, Math.min(Number(item.percent) || 0, 100));

    return `
      <div class="feature-item">
        <div class="feature-header">
          <strong>${escapeHtml(item.name)}</strong>
          <span class="feature-meta">${percent}%</span>
        </div>
        <span class="feature-meta">${escapeHtml(item.copy)}</span>
        <div class="feature-meter"><span style="width:${percent}%"></span></div>
      </div>
    `;
  }).join('');
}

function renderLogs() {
  const rows = dashboardData.logs.length
    ? dashboardData.logs
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

  document.getElementById('log-list').innerHTML = content;
  document.getElementById('log-board').innerHTML = content.replaceAll('log-entry', 'log-board-entry');
}

function hydrateSummary() {
  const summary = dashboardData.summary || {};
  const sidebarActivePro = document.getElementById('sidebar-active-pro');
  const criticalCount = document.getElementById('critical-count');
  const workerHealth = document.getElementById('worker-health');
  const workerCopy = document.getElementById('worker-copy');
  const recoveryQueue = document.getElementById('recovery-queue');

  if (sidebarActivePro) sidebarActivePro.textContent = String(summary.activeProThisWeek ?? '0');
  if (criticalCount) criticalCount.textContent = `${summary.criticalCount ?? 0} critical`;
  if (workerHealth) workerHealth.textContent = summary.workerHealth || 'No live data';
  if (workerCopy) workerCopy.textContent = summary.workerCopy || 'Add an admin token in Settings to load live Cloudflare data.';
  if (recoveryQueue) recoveryQueue.textContent = `${dashboardData.recovery.length} users`;
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function exportUsersCsv() {
  const headers = ['Name', 'Email', 'Plan', 'Billing', 'Figma User ID', 'Activation Code', 'Purchase Date', 'Expiry Date', 'Last Active', 'Subscription Status', 'Status'];
  const rows = dashboardData.users.map((user) => [
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

function renderDashboard() {
  renderMetrics();
  renderConversionBars();
  renderRiskList();
  renderRecoveryTable();
  renderUsersTable();
  renderLicensesTable();
  renderTimeline();
  renderFunnel();
  renderFeatures();
  renderLogs();
  hydrateSummary();
}

async function loadLiveDashboardData({ quiet = false } = {}) {
  const token = getAdminToken();
  if (!token) {
    if (!quiet) alert('Add the admin token in Settings first.');
    renderDashboard();
    return false;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    });

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'Could not load live dashboard data.');
    }

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

  function openView(view) {
    navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.view === view));
    views.forEach((panel) => panel.classList.toggle('is-visible', panel.dataset.viewPanel === view));
  }

  navItems.forEach((button) => {
    button.addEventListener('click', () => openView(button.dataset.view));
  });

  document.querySelectorAll('[data-nav-target]').forEach((button) => {
    button.addEventListener('click', () => openView(button.dataset.navTarget));
  });
}

function attachSearch() {
  const input = document.getElementById('global-search');
  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    const rows = dashboardData.users.filter((user) =>
      [user.name, user.email, user.plan, user.subscriptionPlan, user.subscriptionStatus, user.subscriptionEndsAt, user.figmaUserId, user.licenseKey, user.status].join(' ').toLowerCase().includes(term)
    );
    renderUsersTable(rows);
  });
}

function attachSettings() {
  const apiInput = document.getElementById('api-base-url');
  const tokenInput = document.getElementById('admin-token');
  const saveButton = document.getElementById('save-dashboard-settings');
  const refreshButton = document.getElementById('refresh-dashboard');
  const importGumroadButton = document.getElementById('import-gumroad-sales');

  apiInput.value = getApiBaseUrl();
  tokenInput.value = getAdminToken();

  saveButton.addEventListener('click', async () => {
    localStorage.setItem(API_BASE_URL_KEY, apiInput.value.trim() || DEFAULT_API_BASE_URL);
    localStorage.setItem(ADMIN_TOKEN_KEY, tokenInput.value.trim());
    await loadLiveDashboardData();
  });

  refreshButton.addEventListener('click', () => loadLiveDashboardData());

  if (importGumroadButton) {
    importGumroadButton.addEventListener('click', async () => {
      const token = getAdminToken();
      if (!token) {
        alert('Add the admin token in Settings first.');
        return;
      }

      importGumroadButton.disabled = true;
      importGumroadButton.textContent = 'Importing...';
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/admin/import-gumroad-sales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ limit: 500 })
        });
        const payload = await response.json();
        if (!response.ok || !payload.success) {
          throw new Error(payload.message || 'Could not import Gumroad sales.');
        }
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
  const exportButton = document.getElementById('export-users-csv');
  if (exportButton) exportButton.addEventListener('click', exportUsersCsv);
}

function init() {
  renderDashboard();
  attachViewSwitching();
  attachSearch();
  attachSettings();
  attachExports();
  loadLiveDashboardData({ quiet: true });
}

init();
