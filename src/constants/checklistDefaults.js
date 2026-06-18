let nextColId = 1000;
export const newColId = () => `c${nextColId++}`;

// Column types: status (✓/✗ buttons), text, number.
// requireWhen: 'always' | 'optional' | 'check' | 'x' (last two only meaningful when a status column exists)
export const COLUMN_TYPES = [
  { value: "status", label: "Status (✓/✗)" },
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
];

export const REQUIRE_WHEN = [
  { value: "optional", label: "Optional" },
  { value: "always", label: "Required" },
  { value: "check", label: "When ✓" },
  { value: "x", label: "When ✗" },
];

export function defaultChecklistColumns() {
  return [
    { id: newColId(), label: "STATUS", type: "status", requireWhen: "always" },
    { id: newColId(), label: "ASSET TAG", type: "text", requireWhen: "check" },
    { id: newColId(), label: "REMARKS", type: "text", requireWhen: "x" },
  ];
}

export function getChecklistColumns(field) {
  return Array.isArray(field.columns) ? field.columns : [];
}

export function hasStatusColumn(columns) {
  return columns.some((c) => c.type === "status");
}

// Determine whether a given column is required for a given row, based on requireWhen and the row's status value.
export function isColumnRequired(col, rowStatus) {
  if (col.requireWhen === "always") return true;
  if (col.requireWhen === "check") return rowStatus === "check";
  if (col.requireWhen === "x") return rowStatus === "x";
  return false;
}
