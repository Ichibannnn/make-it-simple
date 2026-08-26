import { useState, useMemo } from "react";
import { Box, Typography, TextField, MenuItem, IconButton, Button, Divider, Chip, Switch } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DrawIcon from "@mui/icons-material/Draw";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import dayjs from "dayjs";
import { getChecklistColumns, isColumnRequired } from "../../../constants/checklistDefaults";
import { formRendererStyles as s, pickerSlotProps } from "./styles/formStyle";

function FieldLabel({ text, required }) {
  return (
    <Typography sx={s.fieldLabel}>
      {text}
      {required && (
        <Box component="span" sx={s.requiredStar}>
          *
        </Box>
      )}
    </Typography>
  );
}

function SectionRender({ field }) {
  return (
    <Box sx={s.sectionWrap}>
      <Typography sx={s.sectionText}>{field.label}</Typography>
    </Box>
  );
}

function TextRender({ field, value, onChange, error }) {
  if (field.type === "date") {
    const dval = value ? dayjs(value) : null;
    return (
      <Box>
        <FieldLabel text={field.label} required={field.required} />
        <DatePicker
          value={dval && dval.isValid() ? dval : null}
          onChange={(d) => onChange(d ? d.format("YYYY-MM-DD") : "")}
          slotProps={pickerSlotProps(error)}
        />
      </Box>
    );
  }
  if (field.type === "time") {
    const tval = value ? dayjs(`2000-01-01T${value}`) : null;
    return (
      <Box>
        <FieldLabel text={field.label} required={field.required} />
        <TimePicker
          value={tval && tval.isValid() ? tval : null}
          onChange={(t) => onChange(t ? t.format("HH:mm") : "")}
          slotProps={pickerSlotProps(error)}
        />
      </Box>
    );
  }
  return (
    <Box>
      <FieldLabel text={field.label} required={field.required} />
      <TextField
        fullWidth
        size="small"
        value={value || ""}
        placeholder={field.placeholder || ""}
        onChange={(e) => onChange(e.target.value)}
        multiline={field.type === "textarea"}
        rows={field.type === "textarea" ? 3 : 1}
        type={field.type === "number" ? "number" : "text"}
        error={!!error}
        helperText={error}
        sx={s.input}
      />
    </Box>
  );
}

function SelectRender({ field, value, onChange, error }) {
  const options = field.options || ["Option 1", "Option 2", "Option 3"];
  return (
    <Box>
      <FieldLabel text={field.label} required={field.required} />
      <TextField
        select
        fullWidth
        size="small"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error}
        sx={s.input}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: s.selectMenuPaper,
            },
          },
        }}
      >
        <MenuItem value="">
          <em style={{ color: "#8B949E" }}>Select…</em>
        </MenuItem>
        {options.map((opt, i) => (
          <MenuItem key={i} value={opt} sx={s.selectMenuItem}>
            {opt}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

function StatusButton({ value, target, onChange, color }) {
  const active = value === target;
  return (
    <IconButton
      size="small"
      onClick={() => onChange(active ? null : target)}
      sx={s.statusButton(color, active)}
    >
      {target === "check" ? <CheckIcon sx={s.statusIcon} /> : <CloseIcon sx={s.statusIcon} />}
    </IconButton>
  );
}

function ChecklistTable({ field, columns, descriptionLabel, rowState, onChange, rowErrors }) {
  const rows = field.rows || [];
  const statusCol = columns.find((c) => c.type === "status");

  function setRow(idx, patch) {
    onChange({ ...rowState, [idx]: { ...(rowState[idx] || {}), ...patch } });
  }

  // Grid layout: # | description | col1 | col2 | ...
  const gridCols = [
    "32px",
    "minmax(140px, 1.5fr)",
    ...columns.map((c) => (c.type === "status" ? "92px" : "minmax(120px, 1fr)")),
  ].join(" ");

  return (
    <Box sx={s.checklistContainer}>
      {/* Header row */}
      <Box sx={s.checklistHeaderRow(gridCols)}>
        <Typography sx={s.checklistHeaderCell}>#</Typography>
        <Typography sx={s.checklistHeaderCell}>{descriptionLabel}</Typography>
        {columns.map((col) => (
          <Typography key={col.id} sx={s.checklistHeaderCol(col.type === "status")}>
            {col.label}
          </Typography>
        ))}
      </Box>

      {/* Rows */}
      {rows.map((rowLabel, i) => {
        const r = rowState[i] || {};
        const rowErr = rowErrors?.[i];
        return (
          <Box
            key={i}
            sx={s.checklistRow(gridCols, i < rows.length - 1, !!rowErr)}
          >
            <Typography sx={s.checklistRowNum}>{i + 1}</Typography>
            <Typography sx={s.checklistRowDesc}>{rowLabel}</Typography>

            {columns.map((col) => {
              const cellVal = r[col.id];
              const required = isColumnRequired(col, statusCol ? r[statusCol.id] : undefined);
              const hasErr = !!rowErr?.[col.id];

              if (col.type === "status") {
                return (
                  <Box key={col.id} sx={s.checklistStatusWrap}>
                    <StatusButton
                      value={cellVal}
                      target="check"
                      onChange={(v) => setRow(i, { [col.id]: v })}
                      color="#22C55E"
                    />
                    <StatusButton
                      value={cellVal}
                      target="x"
                      onChange={(v) => setRow(i, { [col.id]: v })}
                      color="#EF4444"
                    />
                  </Box>
                );
              }

              return (
                <TextField
                  key={col.id}
                  size="small"
                  type={col.type === "number" ? "number" : "text"}
                  placeholder={required ? `${col.label} *` : `${col.label} (Optional)`}
                  value={cellVal || ""}
                  onChange={(e) => setRow(i, { [col.id]: e.target.value })}
                  error={hasErr}
                  sx={s.checklistCell}
                />
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}

// A checklist field renders one or more table "instances". When `field.duplicable`
// is on, an Add button appends another full copy of the table (e.g. a second
// "Frontend PC" set). When `field.toggleable` is on, each instance gets its own
// switch to disable/grey out that copy without deleting its data.
function ChecklistRender({ field, value, onChange, errors }) {
  const columns = getChecklistColumns(field);
  const descriptionLabel = field.descriptionLabel || "DESCRIPTION";
  const duplicable = !!field.duplicable;
  const toggleable = !!field.toggleable;
  const addLabel = field.duplicateLabel || `Add ${field.label || "Item"}`;

  const instances = Array.isArray(value) && value.length > 0 ? value : [{ rows: {}, disabled: false }];

  function updateInstance(idx, patch) {
    onChange(instances.map((inst, i) => (i === idx ? { ...inst, ...patch } : inst)));
  }
  function addInstance() {
    onChange([...instances, { rows: {}, disabled: false }]);
  }
  function removeInstance(idx) {
    if (instances.length <= 1) return;
    const next = [...instances];
    next.splice(idx, 1);
    onChange(next);
  }

  return (
    <Box sx={s.checklistInstancesWrap}>
      {instances.map((inst, idx) => {
        const isLast = idx === instances.length - 1;
        const isDisabled = toggleable && !!inst.disabled;
        return (
          <Box key={idx}>
            <Box sx={s.checklistInstanceHeader}>
              <Box sx={s.checklistTitleGroup}>
                <FieldLabel text={field.label} required={field.required} />
                {duplicable && <Chip label={idx + 1} size="small" sx={s.checklistCountBadge} />}
              </Box>
              <Box sx={s.checklistHeaderActions}>
                {toggleable && (
                  <Switch
                    size="small"
                    checked={isDisabled}
                    onChange={(e) => updateInstance(idx, { disabled: e.target.checked })}
                    sx={s.checklistDisableSwitch}
                  />
                )}
                {duplicable && isLast && (
                  <Button
                    size="small"
                    startIcon={<AddIcon sx={s.signatureAddIcon} />}
                    onClick={addInstance}
                    sx={s.signatureAddBtn}
                  >
                    {addLabel}
                  </Button>
                )}
                {duplicable && instances.length > 1 && (
                  <IconButton size="small" onClick={() => removeInstance(idx)} sx={s.signerRemoveBtn}>
                    <DeleteOutlineIcon sx={s.signerRemoveIcon} />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box sx={isDisabled ? s.checklistDisabledOverlay : undefined}>
              <ChecklistTable
                field={field}
                columns={columns}
                descriptionLabel={descriptionLabel}
                rowState={inst.rows || {}}
                onChange={(rows) => updateInstance(idx, { rows })}
                rowErrors={errors?.[idx]}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

function SignerCard({ index, signerLabel, value, names, showDigital, onChange, onRemove, canRemove, error }) {
  const cur = value || {};
  return (
    <Box sx={s.signerCard}>
      <Box sx={s.signerHeader}>
        <Typography sx={s.signerTitle}>
          {signerLabel} {index + 1}
        </Typography>
        {canRemove && (
          <IconButton size="small" onClick={onRemove} sx={s.signerRemoveBtn}>
            <DeleteOutlineIcon sx={s.signerRemoveIcon} />
          </IconButton>
        )}
      </Box>

      <Box sx={s.signerGrid(showDigital)}>
        {/* Name dropdown */}
        <Box>
          <Typography sx={s.signerPropLabel}>
            Name
            <Box component="span" sx={s.requiredStarSm}>
              *
            </Box>
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={cur.name || ""}
            onChange={(e) => onChange({ ...cur, name: e.target.value })}
            error={!!error?.name}
            sx={s.input}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: s.signerNameMenuPaper,
                },
              },
            }}
          >
            <MenuItem value="">
              <em style={{ color: "#8B949E" }}>Select name…</em>
            </MenuItem>
            {(names || []).map((opt, i) => (
              <MenuItem key={i} value={opt} sx={s.signerMenuItem}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* E-Signature */}
        <Box>
          <Typography sx={s.signerPropLabel}>
            E-Signature
            <Box component="span" sx={s.requiredStarSm}>
              *
            </Box>
          </Typography>
          <Box
            onClick={() => onChange({ ...cur, eSig: !cur.eSig })}
            sx={s.eSigBox(cur.eSig, !!error?.eSig)}
          >
            {cur.eSig ? (
              <>
                <CheckCircleOutlineIcon sx={s.eSigSignedIcon} />
                <Typography sx={s.eSigSignedText}>Signed</Typography>
              </>
            ) : (
              <>
                <DrawIcon sx={s.eSigDrawIcon} />
                <Typography sx={s.eSigHintText}>Click to sign</Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Digital Signature (optional column) */}
        {showDigital && (
          <Box sx={s.digitalCol}>
            <Typography sx={s.signerPropLabel}>Digital Signature</Typography>
            <Box sx={s.digitalBox}>
              <DrawIcon sx={s.eSigDrawIcon} />
              <Typography sx={s.eSigHintText}>Digital signature</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function SignatureRender({ field, value, onChange, errors }) {
  const multi = field.multi !== false;
  const minSigners = field.minSigners ?? 1;
  const signerLabel = field.signerLabel || "Signer";
  const addLabel = field.addButtonLabel || `Add ${signerLabel}`;
  const names = field.nameOptions || [];
  const showDigital = field.digitalSig !== false;

  const signers =
    Array.isArray(value) && value.length > 0 ? value : Array.from({ length: minSigners }, () => ({}));

  function updateSigner(i, v) {
    onChange(signers.map((s, idx) => (idx === i ? v : s)));
  }
  function addSigner() {
    onChange([...signers, {}]);
  }
  function removeSigner(i) {
    if (signers.length <= minSigners) return;
    const next = [...signers];
    next.splice(i, 1);
    onChange(next);
  }

  const canRemove = signers.length > minSigners;

  return (
    <Box>
      <Box sx={s.signatureHeader}>
        <FieldLabel text={field.label} required={field.required} />
        {multi && (
          <Button
            size="small"
            startIcon={<AddIcon sx={s.signatureAddIcon} />}
            onClick={addSigner}
            sx={s.signatureAddBtn}
          >
            {addLabel}
          </Button>
        )}
      </Box>

      <Box sx={s.signersWrap}>
        {signers.map((sig, i) => (
          <SignerCard
            key={i}
            index={i}
            signerLabel={signerLabel}
            value={sig}
            names={names}
            showDigital={showDigital}
            onChange={(v) => updateSigner(i, v)}
            onRemove={() => removeSigner(i)}
            canRemove={canRemove}
            error={errors?.[i]}
          />
        ))}
      </Box>
    </Box>
  );
}

const RENDERERS = {
  text: TextRender,
  textarea: TextRender,
  number: TextRender,
  date: TextRender,
  time: TextRender,
  select: SelectRender,
  section: SectionRender,
  checklist: ChecklistRender,
  signature: SignatureRender,
};

export default function FormRenderer({ fields }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function setValue(id, v) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  const filledCount = useMemo(() => {
    return fields.filter((f) => f.type !== "section" && values[f.id] != null && values[f.id] !== "").length;
  }, [values, fields]);
  const fillableCount = fields.filter((f) => f.type !== "section").length;
  const pct = fillableCount === 0 ? 0 : Math.round((filledCount / fillableCount) * 100);

  function handleSubmit() {
    const e = {};
    for (const f of fields) {
      if (f.type === "section") continue;
      const v = values[f.id];
      if (f.required && (v == null || v === "" || (typeof v === "object" && Object.keys(v).length === 0))) {
        e[f.id] = `${f.label} is required`;
      }
      if (f.type === "signature") {
        const minSigners = f.minSigners ?? 1;
        const signers = Array.isArray(v) && v.length > 0 ? v : Array.from({ length: minSigners }, () => ({}));
        const sigErr = {};
        signers.forEach((s, i) => {
          const isRequired = f.required || i < minSigners;
          if (!isRequired) return;
          if (!s.name || !String(s.name).trim()) {
            sigErr[i] = { ...(sigErr[i] || {}), name: true };
          }
          if (!s.eSig) {
            sigErr[i] = { ...(sigErr[i] || {}), eSig: true };
          }
        });
        if (Object.keys(sigErr).length) e[`${f.id}_signers`] = sigErr;
      }
      if (f.type === "checklist") {
        const cols = getChecklistColumns(f);
        const statusCol = cols.find((c) => c.type === "status");
        const instances = Array.isArray(v) && v.length > 0 ? v : [{ rows: {}, disabled: false }];
        const instanceErrors = [];
        instances.forEach((inst, instIdx) => {
          if (f.toggleable && inst.disabled) return;
          const rowErr = {};
          (f.rows || []).forEach((_, i) => {
            const r = inst.rows?.[i] || {};
            const rowStatus = statusCol ? r[statusCol.id] : undefined;
            for (const col of cols) {
              if (col.type === "status") continue;
              if (isColumnRequired(col, rowStatus)) {
                const val = r[col.id];
                if (val == null || String(val).trim() === "") {
                  rowErr[i] = { ...(rowErr[i] || {}), [col.id]: true };
                }
              }
            }
          });
          if (Object.keys(rowErr).length) instanceErrors[instIdx] = rowErr;
        });
        if (instanceErrors.some(Boolean)) e[`${f.id}_rows`] = instanceErrors;
      }
    }
    setErrors(e);
    setSubmitted(Object.keys(e).length === 0);
  }

  if (submitted) {
    return (
      <Box sx={s.successWrap}>
        <Box sx={s.successCard}>
          <CheckCircleOutlineIcon sx={s.successIcon} />
          <Typography sx={s.successTitle}>Form submitted successfully</Typography>
          <Typography sx={s.successSub}>
            This is a preview — your responses are not saved.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSubmitted(false);
              setValues({});
              setErrors({});
            }}
            sx={s.fillAgainBtn}
          >
            Fill Again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={s.scroll}>
      <Box sx={s.inner}>
        {/* Form header */}
        <Box sx={s.headerCard}>
          <Box sx={s.headerTop}>
            <Typography sx={s.headerTitle}>PMS Store Checklist</Typography>
            <Chip
              label={`${filledCount}/${fillableCount} filled · ${pct}%`}
              size="small"
              sx={s.headerChip}
            />
          </Box>
          <Typography sx={s.headerSub}>
            Preview mode — fill out the form to test it.
          </Typography>
          <Box sx={s.progressTrack}>
            <Box sx={s.progressBar(pct)} />
          </Box>
        </Box>

        {/* Fields — grouped by section, rendered in grid based on section's column config */}
        {(() => {
          const groups = [];
          let current = { section: null, items: [] };
          for (const f of fields) {
            if (f.type === "section") {
              if (current.section || current.items.length) groups.push(current);
              current = { section: f, items: [] };
            } else {
              current.items.push(f);
            }
          }
          if (current.section || current.items.length) groups.push(current);

          return groups.map((g, gi) => {
            const desktopCols = g.section?.desktopCols || 1;
            const mobileCols = g.section?.mobileCols || 1;
            // Checklist & signature span the full row regardless of grid
            return (
              <Box key={g.section?.id || `g${gi}`}>
                {g.section && <SectionRender field={g.section} />}
                <Box sx={s.groupGrid(mobileCols, desktopCols, !!g.section)}>
                  {g.items.map((field) => {
                    const Renderer = RENDERERS[field.type] || TextRender;
                    const fullRow = field.type === "checklist" || field.type === "signature";
                    return (
                      <Box key={field.id} sx={s.groupItem(fullRow)}>
                        <Renderer
                          field={field}
                          value={values[field.id]}
                          onChange={(v) => setValue(field.id, v)}
                          error={errors[field.id]}
                          errors={errors[`${field.id}_rows`] || errors[`${field.id}_signers`]}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          });
        })()}

        {/* Submit */}
        <Divider sx={s.divider} />
        <Box sx={s.submitRow}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setValues({});
              setErrors({});
            }}
            sx={s.clearBtn}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            sx={s.submitBtn}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
