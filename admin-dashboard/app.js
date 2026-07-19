const dashboardData = {
  metrics: [
    { label: 'Total Users', value: '14,280', trend: '+5.2% from last week' },
    { label: 'Pro Users', value: '3,912', trend: '+8.4% conversion lift' },
    { label: 'Free Users', value: '10,368', trend: '10 trial cap is active' },
    { label: 'Lost Pro Alerts', value: '43', trend: '-12 users after restore', negative: true },
    { label: 'Activation Success', value: '96.8%', trend: '+1.1% worker stability' }
  ],
  conversions: [
    { label: 'Mon', value: 32 },
    { label: 'Tue', value: 41 },
    { label: 'Wed', value: 49 },
    { label: 'Thu', value: 44 },
    { label: 'Fri', value: 58 },
    { label: 'Sat', value: 63 },
    { label: 'Sun', value: 52 }
  ],
  risks: [
    { title: 'Users missing D1 binding', copy: '17 users are active locally but missing a server record.' },
    { title: 'Activation retries spiking', copy: '9 repeated retries detected after a Cloudflare verification fail.' },
    { title: 'Silent restore candidates', copy: '26 users can likely be recovered without re-entering license keys.' }
  ],
  recovery: [
    { name: 'Salma N.', issue: 'Binding missing after update', lastSeen: '18 min ago', action: 'Restore Pro' },
    { name: 'Hassan M.', issue: 'Worker returned isPro false', lastSeen: '41 min ago', action: 'Inspect' },
    { name: 'Rana K.', issue: 'License stored locally only', lastSeen: '1h 15m ago', action: 'Rebind' }
  ],
  users: [
    { name: 'Maha Adel', plan: 'Pro', figmaUserId: '884019223', active: '4 min ago', status: 'Healthy', action: 'Open Profile' },
    { name: 'Karim Mostafa', plan: 'Free', figmaUserId: '884019318', active: '19 min ago', status: 'Trial 6/10', action: 'View Usage' },
    { name: 'Nour Ibrahim', plan: 'Pro', figmaUserId: '884019412', active: '53 min ago', status: 'Needs restore', action: 'Restore Pro' },
    { name: 'Omar Yasser', plan: 'Free', figmaUserId: '884019577', active: '2h ago', status: 'Trial exhausted', action: 'Prompt Upgrade' },
    { name: 'Huda Fathy', plan: 'Pro', figmaUserId: '884019601', active: '3h ago', status: 'Healthy', action: 'Open Profile' }
  ],
  licenses: [
    { key: 'RTLM-4P8A-91KF', user: 'Maha Adel', state: 'Linked', updated: 'Jul 19, 2026' },
    { key: 'RTLM-0ZZK-44DE', user: 'Nour Ibrahim', state: 'Risk', updated: 'Jul 19, 2026' },
    { key: 'RTLM-8A2Q-17LP', user: 'Huda Fathy', state: 'Linked', updated: 'Jul 18, 2026' },
    { key: 'RTLM-1Q5M-26HX', user: 'Unassigned', state: 'Available', updated: 'Jul 17, 2026' }
  ],
  timeline: [
    { title: 'Activate license', copy: 'Cloudflare verified Gumroad and linked Figma user 884019223.', time: '10:12 AM' },
    { title: 'Silent restore', copy: 'Recovered user without re-entering a license key.', time: '09:47 AM' },
    { title: 'Binding removed', copy: 'Inactive subscription auto-unlinked during license-status check.', time: '08:35 AM' }
  ],
  funnel: [
    { label: 'Opened plugin', count: '5,420 users' },
    { label: 'Used free feature', count: '3,990 users' },
    { label: 'Reached trial limit', count: '712 users' },
    { label: 'Opened upgrade screen', count: '386 users' },
    { label: 'Activated Pro', count: '121 users' }
  ],
  features: [
    { name: 'Mirror Layouts', percent: 92, copy: 'Highest repeat usage this week' },
    { name: 'Translate Text Layers', percent: 78, copy: 'Strong Pro conversion driver' },
    { name: 'Variant Creation', percent: 41, copy: 'Needs onboarding improvement' },
    { name: 'Font Replacement', percent: 34, copy: 'Mostly used by Arabic localization flows' }
  ],
  logs: [
    { level: 'ok', title: 'POST /api/activate-license', copy: '200 success in 241 ms for Figma user 884019223.' },
    { level: 'error', title: 'POST /api/license-status', copy: 'Binding not found for 17 users after plugin reopen.' },
    { level: 'ok', title: 'POST /api/unlink-license', copy: 'Manual unlink completed from support panel.' },
    { level: 'error', title: 'POST /api/activate-license', copy: '409 returned because license key was linked to another account.' }
  ]
};

function renderMetrics() {
  const metricsGrid = document.getElementById('metrics-grid');
  metricsGrid.innerHTML = dashboardData.metrics.map((metric) => `
    <article class="panel metric-card">
      <p class="eyebrow">${metric.label}</p>
      <div class="metric-value">${metric.value}</div>
      <div class="metric-trend ${metric.negative ? 'negative' : ''}">${metric.trend}</div>
    </article>
  `).join('');
}

function renderConversionBars() {
  const max = Math.max(...dashboardData.conversions.map((item) => item.value));
  document.getElementById('conversion-bars').innerHTML = dashboardData.conversions.map((item) => `
    <div class="bar-group">
      <span class="bar-value">${item.value}</span>
      <div class="bar-stack">
        <div class="bar" style="height:${(item.value / max) * 100}%"></div>
      </div>
      <span class="bar-label">${item.label}</span>
    </div>
  `).join('');
}

function renderRiskList() {
  document.getElementById('risk-list').innerHTML = dashboardData.risks.map((item) => `
    <div class="risk-item">
      <strong>${item.title}</strong>
      <span>${item.copy}</span>
    </div>
  `).join('');
}

function renderRecoveryTable() {
  document.getElementById('recovery-table').innerHTML = dashboardData.recovery.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.issue}</td>
      <td>${item.lastSeen}</td>
      <td><button class="table-action">${item.action}</button></td>
    </tr>
  `).join('');
}

function renderUsersTable(rows = dashboardData.users) {
  document.getElementById('users-table').innerHTML = rows.map((user) => `
    <tr class="searchable-row" data-search="${[user.name, user.plan, user.figmaUserId, user.status].join(' ').toLowerCase()}">
      <td>${user.name}</td>
      <td><span class="tag ${user.plan.toLowerCase()}">${user.plan}</span></td>
      <td>${user.figmaUserId}</td>
      <td>${user.active}</td>
      <td><span class="tag ${user.status.toLowerCase().includes('healthy') ? 'ok' : user.status.toLowerCase().includes('trial') ? 'free' : 'risk'}">${user.status}</span></td>
      <td><button class="table-action">${user.action}</button></td>
    </tr>
  `).join('');
}

function renderLicensesTable() {
  document.getElementById('licenses-table').innerHTML = dashboardData.licenses.map((item) => `
    <tr>
      <td>${item.key}</td>
      <td>${item.user}</td>
      <td><span class="tag ${item.state === 'Risk' ? 'risk' : item.state === 'Available' ? 'free' : 'ok'}">${item.state}</span></td>
      <td>${item.updated}</td>
    </tr>
  `).join('');
}

function renderTimeline() {
  document.getElementById('timeline').innerHTML = dashboardData.timeline.map((item) => `
    <div class="timeline-item">
      <div class="timeline-header">
        <strong>${item.title}</strong>
        <time>${item.time}</time>
      </div>
      <span>${item.copy}</span>
    </div>
  `).join('');
}

function renderFunnel() {
  document.getElementById('funnel').innerHTML = dashboardData.funnel.map((item) => `
    <div class="funnel-step">
      <div class="funnel-step-header">
        <strong>${item.label}</strong>
        <span>${item.count}</span>
      </div>
    </div>
  `).join('');
}

function renderFeatures() {
  document.getElementById('feature-list').innerHTML = dashboardData.features.map((item) => `
    <div class="feature-item">
      <div class="feature-header">
        <strong>${item.name}</strong>
        <span class="feature-meta">${item.percent}%</span>
      </div>
      <span class="feature-meta">${item.copy}</span>
      <div class="feature-meter"><span style="width:${item.percent}%"></span></div>
    </div>
  `).join('');
}

function renderLogs() {
  const content = dashboardData.logs.map((item) => `
    <div class="log-entry">
      <div class="timeline-header">
        <strong>${item.title}</strong>
        <span class="tag ${item.level}">${item.level === 'ok' ? 'Healthy' : 'Attention'}</span>
      </div>
      <p>${item.copy}</p>
    </div>
  `).join('');

  document.getElementById('log-list').innerHTML = content;
  document.getElementById('log-board').innerHTML = content.replaceAll('log-entry', 'log-board-entry');
}

function attachViewSwitching() {
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const views = Array.from(document.querySelectorAll('.view'));

  navItems.forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      navItems.forEach((item) => item.classList.toggle('is-active', item === button));
      views.forEach((panel) => panel.classList.toggle('is-visible', panel.dataset.viewPanel === view));
    });
  });
}

function attachSearch() {
  const input = document.getElementById('global-search');
  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    const rows = dashboardData.users.filter((user) =>
      [user.name, user.plan, user.figmaUserId, user.status].join(' ').toLowerCase().includes(term)
    );
    renderUsersTable(rows);
  });
}

function hydrateSummary() {
  document.getElementById('sidebar-active-pro').textContent = '214';
  document.getElementById('critical-count').textContent = '3 critical';
  document.getElementById('worker-health').textContent = 'Stable';
  document.getElementById('worker-copy').textContent = 'Cloudflare Worker response time is within expected range.';
  document.getElementById('recovery-queue').textContent = `${dashboardData.recovery.length} users`;
}

function init() {
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
  attachViewSwitching();
  attachSearch();
  hydrateSummary();
}

init();
