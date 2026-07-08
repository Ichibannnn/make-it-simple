// Canonical, versioned form schema.
//
// The builder UI works on a FLAT fields[] list (so dnd-kit's sortable layer
// stays simple). The on-disk / API shape is a NESTED tree under `form.sections[].children[]`.
// `serialize` converts flat -> canonical; `deserialize` converts canonical -> flat.
// Conditional logic and validation are expressed declaratively so renderers,
// servers, and exporters can all agree.

export const CURRENT_VERSION = 1;
export const BUILDER_VERSION = "0.1.0";

// ────────────────────────────────────────────────────────────────────────────
// Conditional expressions
//
// Shape: { op: "always" } | { op: "never" }
//      | { op: "eq" | "neq" | "in", field: "<fieldId>" | "$row.<colId>", value: ... }
//      | { op: "and" | "or", clauses: [Expr, ...] }
//      | { op: "not", clause: Expr }
//
// `field` may reference a sibling form field by id, OR — inside a checklist
// column's requiredIf — the special token `$row.<columnId>` meaning "this row's
// value for that column" (typically the status column).
// ────────────────────────────────────────────────────────────────────────────

export function evaluateCondition(expr, ctx) {
  if (!expr) return true;
  const { values = {}, row = {} } = ctx || {};
  const resolve = (ref) => {
    if (typeof ref !== "string") return undefined;
    if (ref.startsWith("$row.")) return row[ref.slice(5)];
    return values[ref];
  };
  switch (expr.op) {
    case "always":
      return true;
    case "never":
      return false;
    case "eq":
      return resolve(expr.field) === expr.value;
    case "neq":
      return resolve(expr.field) !== expr.value;
    case "in":
      return Array.isArray(expr.value) && expr.value.includes(resolve(expr.field));
    case "and":
      return (expr.clauses || []).every((c) => evaluateCondition(c, ctx));
    case "or":
      return (expr.clauses || []).some((c) => evaluateCondition(c, ctx));
    case "not":
      return !evaluateCondition(expr.clause, ctx);
    default:
      return true;
  }
}

// Sugar used by checklist columns: `requireWhen` -> canonical `requiredIf`.
function requireWhenToExpr(requireWhen, statusColId) {
  switch (requireWhen) {
    case "always":
      return { op: "always" };
    case "optional":
    case undefined:
    case null:
      return { op: "never" };
    case "check":
      return statusColId ? { op: "eq", field: `$row.${statusColId}`, value: "check" } : { op: "never" };
    case "x":
      return statusColId ? { op: "eq", field: `$row.${statusColId}`, value: "x" } : { op: "never" };
    default:
      return { op: "never" };
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Validation rules (declarative slot — renderer wires what it needs)
//
// Shape: { rule: "required" | "minLength" | "maxLength" | "pattern" | "min" | "max", value?, message? }
// ────────────────────────────────────────────────────────────────────────────

function fieldValidation(field) {
  const rules = [];
  if (field.required) {
    rules.push({ rule: "required", message: `${field.label} is required` });
  }
  return rules;
}

// ────────────────────────────────────────────────────────────────────────────
// Serialize: flat builder state -> canonical schema
// ────────────────────────────────────────────────────────────────────────────

function normalizeChecklistColumns(field) {
  // The builder always stores columns[] on new fields; legacy shorthand is
  // only relevant when ingesting an older JSON via deserialize/migrate.
  const columns = Array.isArray(field.columns) ? field.columns : [];
  const statusCol = columns.find((c) => c.type === "status");
  return columns.map((c) => ({
    id: c.id,
    label: c.label,
    type: c.type,
    requiredIf: c.type === "status" ? { op: "never" } : requireWhenToExpr(c.requireWhen, statusCol?.id),
  }));
}

function serializeField(field) {
  const base = {
    id: field.id,
    type: field.type,
    label: field.label,
    visibleIf: field.visibleIf || { op: "always" },
    requiredIf: field.requiredIf || (field.required ? { op: "always" } : { op: "never" }),
    validation: field.validation || fieldValidation(field),
  };

  switch (field.type) {
    case "text":
    case "textarea":
    case "number":
    case "date":
    case "time":
      return {
        ...base,
        ...(field.placeholder ? { placeholder: field.placeholder } : {}),
      };
    case "select":
      return { ...base, options: field.options || [] };
    case "checklist":
      return {
        ...base,
        descriptionLabel: field.descriptionLabel || "DESCRIPTION",
        rows: (field.rows || []).map((r, i) => (typeof r === "string" ? { id: `r${i + 1}`, label: r } : r)),
        columns: normalizeChecklistColumns(field),
      };
    case "signature":
      return {
        ...base,
        multi: field.multi !== false,
        minSigners: field.minSigners ?? 1,
        signerLabel: field.signerLabel || "Signer",
        addButtonLabel: field.addButtonLabel || `Add ${field.signerLabel || "Signer"}`,
        nameOptions: field.nameOptions || [],
        digitalSig: field.digitalSig !== false,
      };
    default:
      return base;
  }
}

function serializeSection(sectionField, items) {
  return {
    id: sectionField?.id || "_root",
    type: "section",
    label: sectionField?.label || "",
    layout: {
      desktopCols: sectionField?.desktopCols ?? 1,
      mobileCols: sectionField?.mobileCols ?? 1,
    },
    visibleIf: sectionField?.visibleIf || { op: "always" },
    children: items.map(serializeField),
  };
}

export function serialize(flatFields, formMeta = {}) {
  const sections = [];
  let current = { section: null, items: [] };
  for (const f of flatFields) {
    if (f.type === "section") {
      if (current.section || current.items.length)
        sections.push(serializeSection(current.section, current.items));
      current = { section: f, items: [] };
    } else {
      current.items.push(f);
    }
  }
  if (current.section || current.items.length)
    sections.push(serializeSection(current.section, current.items));

  return {
    $schema: "https://schemas.local/helpdesk-form/v1.json",
    schemaVersion: CURRENT_VERSION,
    meta: {
      name: formMeta.name || "Untitled Form",
      description: formMeta.description || "",
      savedAt: new Date().toISOString(),
      builderVersion: BUILDER_VERSION,
    },
    form: {
      id: formMeta.id || "form",
      title: formMeta.name || "Untitled Form",
      sections,
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Deserialize: canonical schema -> flat builder state (for round-trips)
// ────────────────────────────────────────────────────────────────────────────

function exprToRequireWhen(expr, statusColId) {
  if (!expr) return "optional";
  if (expr.op === "always") return "always";
  if (expr.op === "never") return "optional";
  if (expr.op === "eq" && expr.field === `$row.${statusColId}`) {
    if (expr.value === "check") return "check";
    if (expr.value === "x") return "x";
  }
  return "optional";
}

function deserializeField(field) {
  const required = field.requiredIf?.op === "always";
  const base = {
    id: field.id,
    type: field.type,
    label: field.label,
    required,
    ...(field.visibleIf && field.visibleIf.op !== "always" ? { visibleIf: field.visibleIf } : {}),
    ...(field.requiredIf && field.requiredIf.op !== "always" && field.requiredIf.op !== "never"
      ? { requiredIf: field.requiredIf }
      : {}),
  };

  switch (field.type) {
    case "checklist": {
      const statusCol = (field.columns || []).find((c) => c.type === "status");
      return {
        ...base,
        descriptionLabel: field.descriptionLabel,
        rows: (field.rows || []).map((r) => (typeof r === "string" ? r : r.label)),
        columns: (field.columns || []).map((c) => ({
          id: c.id,
          label: c.label,
          type: c.type,
          requireWhen: c.type === "status" ? "always" : exprToRequireWhen(c.requiredIf, statusCol?.id),
        })),
      };
    }
    case "signature":
      return {
        ...base,
        multi: field.multi,
        minSigners: field.minSigners,
        signerLabel: field.signerLabel,
        addButtonLabel: field.addButtonLabel,
        nameOptions: field.nameOptions,
        digitalSig: field.digitalSig,
      };
    case "select":
      return { ...base, options: field.options };
    default:
      return { ...base, ...(field.placeholder ? { placeholder: field.placeholder } : {}) };
  }
}

export function deserialize(canonical) {
  const migrated = migrate(canonical);
  const flat = [];
  for (const section of migrated.form.sections) {
    if (section.id !== "_root") {
      flat.push({
        id: section.id,
        type: "section",
        label: section.label,
        desktopCols: section.layout?.desktopCols ?? 1,
        mobileCols: section.layout?.mobileCols ?? 1,
      });
    }
    for (const child of section.children || []) flat.push(deserializeField(child));
  }
  return { fields: flat, meta: migrated.meta };
}

// ────────────────────────────────────────────────────────────────────────────
// Migrations — keyed by source version. Each entry takes a v<N> doc and returns
// a v<N+1> doc. To add v2, append { from: 1, to: 2, migrate: (doc) => ... }.
// ────────────────────────────────────────────────────────────────────────────

const MIGRATIONS = [
  // v0 (no schemaVersion: raw flat dump with legacy column flags) -> v1
  {
    from: 0,
    to: 1,
    migrate(doc) {
      // Accept either {fields:[...]} or a bare fields array as v0.
      const flat = Array.isArray(doc) ? doc : doc.fields || [];
      const normalized = flat.map((f) => {
        if (f.type !== "checklist" || Array.isArray(f.columns)) return f;
        const cols = [];
        if (f.colStatus !== false)
          cols.push({ id: "status", label: "STATUS", type: "status", requireWhen: "always" });
        if (f.colAssetTag !== false)
          cols.push({ id: "asset", label: "ASSET TAG", type: "text", requireWhen: "check" });
        if (f.colRemarks !== false)
          cols.push({ id: "remarks", label: "REMARKS", type: "text", requireWhen: "x" });
        const { colStatus, colAssetTag, colRemarks, ...rest } = f;
        return { ...rest, columns: cols };
      });
      return serialize(normalized, { name: doc.name });
    },
  },
];

export function migrate(doc) {
  let version = doc?.schemaVersion ?? 0;
  let current = doc;
  while (version < CURRENT_VERSION) {
    const step = MIGRATIONS.find((m) => m.from === version);
    if (!step) throw new Error(`No migration from v${version}`);
    current = step.migrate(current);
    version = step.to;
  }
  return current;
}
