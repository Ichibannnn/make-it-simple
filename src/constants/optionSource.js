// ─────────────────────────────────────────────────────────────────────────────
// Option Sources Registry
//
// Each entry describes a named source for a Dropdown (select) field's options.
// type:
//   "static"  – hard-coded array, always available immediately
//   "api"     – fetched at runtime via a lazy RTK Query hook
//
// For "api" entries, `hookKey` maps to the hook that SelectOptionsSource will
// call.  The `transform` function converts the raw API response into a flat
// string[] that SelectRender / FormRenderer can consume directly.
// ─────────────────────────────────────────────────────────────────────────────

export const OPTION_SOURCES = [
  // ── Static examples ────────────────────────────────────────────────────────
  {
    id: "static_priority",
    label: "Priority Levels",
    type: "static",
    group: "Examples",
    options: ["Low", "Medium", "High", "Critical"],
  },
  {
    id: "static_status",
    label: "Status",
    type: "static",
    group: "Examples",
    options: ["Pending", "In Progress", "On Hold", "Resolved", "Closed"],
  },
  {
    id: "static_yes_no",
    label: "Yes / No",
    type: "static",
    group: "Examples",
    options: ["Yes", "No"],
  },
  {
    id: "static_yes_no_na",
    label: "Yes / No / N/A",
    type: "static",
    group: "Examples",
    options: ["Yes", "No", "N/A"],
  },
  {
    id: "static_pms_type",
    label: "PMS Type",
    type: "static",
    group: "Examples",
    options: ["Preventive", "Corrective", "Predictive", "Condition-Based"],
  },

  // ── Ymir API ───────────────────────────────────────────────────────────────
  {
    id: "api_companies",
    label: "Companies (Ymir)",
    type: "api",
    group: "Ymir",
    hookKey: "companies",
    // response shape: { result: [{ id, code, name, ... }] }
    transform: (data) =>
      (data?.result ?? data ?? []).map((c) => c.name ?? c.code ?? String(c.id)),
  },
  {
    id: "api_business_units",
    label: "Business Units (Ymir)",
    type: "api",
    group: "Ymir",
    hookKey: "businessUnits",
    transform: (data) =>
      (data?.result ?? data ?? []).map(
        (b) => b.name ?? b.business_unit_name ?? String(b.id),
      ),
  },
  {
    id: "api_departments",
    label: "Departments (Ymir)",
    type: "api",
    group: "Ymir",
    hookKey: "departments",
    transform: (data) =>
      (data?.result ?? data ?? []).map(
        (d) => d.name ?? d.department_name ?? String(d.id),
      ),
  },
  {
    id: "api_units",
    label: "Units (Ymir)",
    type: "api",
    group: "Ymir",
    hookKey: "units",
    transform: (data) =>
      (data?.result ?? data ?? []).map(
        (u) => u.name ?? u.unit_name ?? String(u.id),
      ),
  },
  {
    id: "api_sub_units",
    label: "Sub-Units (Ymir)",
    type: "api",
    group: "Ymir",
    hookKey: "subUnits",
    transform: (data) =>
      (data?.result ?? data ?? []).map(
        (s) => s.name ?? s.sub_unit_name ?? String(s.id),
      ),
  },
  {
    id: "api_locations",
    label: "Locations (Ymir)",
    type: "api",
    group: "Ymir",
    hookKey: "locations",
    transform: (data) =>
      (data?.result ?? data ?? []).map(
        (l) => l.name ?? l.location_name ?? String(l.id),
      ),
  },

  // ── SEDAR API ──────────────────────────────────────────────────────────────
  {
    id: "api_employees",
    label: "Employees (SEDAR)",
    type: "api",
    group: "SEDAR",
    hookKey: "employees",
    // response shape: [{ id, general_info: { full_id_number_full_name }, ... }]
    transform: (data) =>
      (Array.isArray(data) ? data : []).map(
        (e) =>
          e?.general_info?.full_id_number_full_name ??
          `${e?.general_info?.first_name ?? ""} ${e?.general_info?.last_name ?? ""}`.trim() ??
          String(e?.id ?? ""),
      ),
  },
];

// Quick lookup by id
export const OPTION_SOURCE_MAP = Object.fromEntries(
  OPTION_SOURCES.map((s) => [s.id, s]),
);

// Groups for the MUI Select menu
export const OPTION_SOURCE_GROUPS = [
  ...new Set(OPTION_SOURCES.map((s) => s.group)),
];
