# Dashboard Wireframe

## Information Architecture

1. `Overview`
   - KPI cards
   - Worker status
   - schema and license alerts
   - recent customers
   - latest backend events
2. `Users`
   - searchable customer list
   - Gumroad import
   - CSV export
   - plan, billing, subscription status, and expiry date
3. `Settings`
   - Worker endpoint
   - admin token

## ASCII Wireframe

```text
+----------------------------------------------------------------------------------+
| Sidebar        | Topbar: Search | Last updated | Alerts | Refresh                 |
| Overview       +------------------------------------------------------------------+
| Users          | KPI 1 | KPI 2 | KPI 3 | KPI 4 | KPI 5                          |
| Settings       +------------------------------------------------------------------+
|                | Worker Status                  | License / Schema Alerts         |
|                +------------------------------------------------------------------+
|                | Recent Customers               | Latest Events                   |
+----------------------------------------------------------------------------------+
```

## UX Notes

- Keep the first screen focused on whether the plugin and license data are healthy.
- Put all customer and subscription detail in one Users table.
- Keep import/export actions next to the customer table.
- Avoid separate pages when the same data is already visible elsewhere.
