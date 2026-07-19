# Dashboard Wireframe

## Information Architecture

1. `Overview`
   - KPI cards
   - revenue and conversion area
   - health and alerts
2. `Users`
   - searchable user list
   - plan status
   - recovery and support actions
3. `Licenses`
   - linked keys
   - active or risky bindings
   - recent activation events
4. `Analytics`
   - funnel
   - feature usage
   - language and region trends
5. `Logs`
   - recent worker events
   - failure reasons
   - system health
6. `Settings`
   - trial limit
   - worker endpoint
   - silent restore behavior

## ASCII Wireframe

```text
+----------------------------------------------------------------------------------+
| Sidebar                                                                          |
| Logo                                                                             |
| Overview                                                                         |
| Users                                                                            |
| Licenses                                                                         |
| Analytics                                                                        |
| Logs                                                                             |
| Settings                                                                         |
+-------------------------------+--------------------------------------------------+
| Topbar                        | Search | Date range | Alerts | Admin avatar       |
+-------------------------------+--------------------------------------------------+
| Hero / Summary                                                                   |
| "Control Center for RTL Master"                                                  |
| Plugin health, conversion snapshot, billing confidence                            |
+----------------------------------------------------------------------------------+
| KPI 1         | KPI 2         | KPI 3         | KPI 4         | KPI 5            |
+----------------------------------------------------------------------------------+
| Revenue / Conversion Chart              | License Health / Incidents              |
+----------------------------------------------------------------------------------+
| Funnel                                 | Feature Usage                            |
+----------------------------------------------------------------------------------+
| Recent Users / Support Queue           | Recent Logs                              |
+----------------------------------------------------------------------------------+
```

## UX Notes

- The first screen should answer: "Is the plugin healthy right now?"
- Support actions must be one click away from user rows.
- Any user who lost `Pro` should be visible in the top-level alerts area.
- The design should feel more like a control room than a generic SaaS template.
