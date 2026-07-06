import {
  Box,
  Typography,
  TextField,
  Switch,
  Divider,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import TuneIcon from "@mui/icons-material/Tune";

import {
  getChecklistColumns,
  newColId,
  COLUMN_TYPES,
  REQUIRE_WHEN,
  hasStatusColumn,
} from "../../../constants/checklistDefaults";
import SelectOptionsSource from "../../../components/SelectOptionSource";
import { propertiesPanelStyles as s } from "./styles/formStyle";

function SectionLabel({ children }) {
  return <Typography sx={s.sectionLabel}>{children}</Typography>;
}

function PropRow({ label, children }) {
  return (
    <Box>
      <Typography sx={s.propRowLabel}>{label}</Typography>
      {children}
    </Box>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <Box sx={s.toggleRow}>
      <Typography sx={s.toggleLabel}>{label}</Typography>
      <Switch
        size="small"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={s.toggleSwitch}
      />
    </Box>
  );
}

export default function PropertiesPanel({ field, onClose, onUpdate }) {
  const isEmpty = !field;

  const isSection = field?.type === "section";
  const isChecklist = field?.type === "checklist";
  const isSignature = field?.type === "signature";
  const isSelect = field?.type === "select";

  function update(key, value) {
    onUpdate({ ...field, [key]: value });
  }

  return (
    <Box sx={s.panel}>
      {/* Panel header */}
      <Box sx={s.header}>
        <TuneIcon sx={s.headerIcon} />
        <Typography sx={s.headerTitle}>
          {isEmpty ? "PROPERTIES" : "FIELD PROPERTIES"}
        </Typography>
        {!isEmpty && (
          <IconButton size="small" onClick={onClose} sx={s.closeBtn}>
            <CloseIcon sx={s.closeIcon} />
          </IconButton>
        )}
      </Box>

      {isEmpty ? (
        <Box sx={s.emptyWrap}>
          <TuneIcon sx={s.emptyIcon} />
          <Typography sx={s.emptyText}>
            Click any field on the canvas to configure its properties
          </Typography>
        </Box>
      ) : (
        <Box sx={s.body}>
          {/* Label */}
          <PropRow label="Label">
            <TextField
              fullWidth
              size="small"
              value={field.label}
              onChange={(e) => update("label", e.target.value)}
              sx={s.input}
            />
          </PropRow>

          {/* Placeholder — not for section/checklist/signature/repeater */}
          {!isSection && !isChecklist && !isSignature && (
            <PropRow label="Placeholder (optional)">
              <TextField
                fullWidth
                size="small"
                value={field.placeholder || ""}
                placeholder="Enter placeholder text..."
                onChange={(e) => update("placeholder", e.target.value)}
                sx={s.input}
              />
            </PropRow>
          )}

          {/* Required toggle */}
          {!isSection && (
            <ToggleRow
              label="Required"
              checked={!!field.required}
              onChange={(v) => update("required", v)}
            />
          )}

          {/* ── SELECT (DROPDOWN) SPECIFIC ── */}
          {isSelect && (
            <>
              <Divider sx={s.divider} />
              <SelectOptionsSource
                currentOptions={field.options ?? []}
                currentSourceId={field.optionSource ?? null}
                onOptionsChange={(opts) => update("options", opts)}
                onSourceChange={(srcId) => {
                  onUpdate({ ...field, optionSource: srcId ?? undefined });
                }}
              />
            </>
          )}

          {/* ── CHECKLIST SPECIFIC ── */}
          {isChecklist &&
            (() => {
              const columns = getChecklistColumns(field);
              const statusExists = hasStatusColumn(columns);

              function setColumns(next) {
                const patched = { ...field, columns: next };
                delete patched.colStatus;
                delete patched.colAssetTag;
                delete patched.colRemarks;
                onUpdate(patched);
              }
              function updateCol(i, patch) {
                const next = [...columns];
                next[i] = { ...next[i], ...patch };
                setColumns(next);
              }
              function addCol() {
                setColumns([
                  ...columns,
                  {
                    id: newColId(),
                    label: "New Column",
                    type: "text",
                    requireWhen: "optional",
                  },
                ]);
              }
              function removeCol(i) {
                const next = [...columns];
                next.splice(i, 1);
                setColumns(next);
              }

              return (
                <>
                  <Divider sx={s.divider} />

                  <PropRow label="Description Column Header">
                    <TextField
                      fullWidth
                      size="small"
                      value={field.descriptionLabel || "DESCRIPTION"}
                      onChange={(e) => update("descriptionLabel", e.target.value)}
                      sx={s.input}
                    />
                  </PropRow>

                  <Box>
                    <Box sx={s.listHeaderRow}>
                      <SectionLabel>COLUMNS</SectionLabel>
                      <Button
                        size="small"
                        startIcon={<AddIcon sx={s.addIcon} />}
                        onClick={addCol}
                        sx={s.addBtn}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box sx={s.colList}>
                      {columns.map((col, i) => (
                        <Box key={col.id} sx={s.colCard}>
                          <Box sx={s.colTopRow}>
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Column label"
                              value={col.label}
                              onChange={(e) => updateCol(i, { label: e.target.value })}
                              sx={s.input}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeCol(i)}
                              sx={s.colDelBtn}
                            >
                              <DeleteOutlineIcon sx={s.colDelIcon} />
                            </IconButton>
                          </Box>

                          <Box sx={s.colGrid}>
                            <TextField
                              select
                              size="small"
                              value={col.type}
                              onChange={(e) => updateCol(i, { type: e.target.value })}
                              sx={s.input}
                              SelectProps={{
                                MenuProps: {
                                  PaperProps: {
                                    sx: s.menuPaper,
                                  },
                                },
                              }}
                            >
                              {COLUMN_TYPES.map((t) => (
                                <MenuItem key={t.value} value={t.value} sx={s.menuItem}>
                                  {t.label}
                                </MenuItem>
                              ))}
                            </TextField>

                            {col.type !== "status" && (
                              <TextField
                                select
                                size="small"
                                value={col.requireWhen || "optional"}
                                onChange={(e) => updateCol(i, { requireWhen: e.target.value })}
                                sx={s.input}
                                SelectProps={{
                                  MenuProps: {
                                    PaperProps: {
                                      sx: s.menuPaper,
                                    },
                                  },
                                }}
                              >
                                {REQUIRE_WHEN.map((r) => {
                                  const disabled =
                                    (r.value === "check" || r.value === "x") &&
                                    !statusExists;
                                  return (
                                    <MenuItem
                                      key={r.value}
                                      value={r.value}
                                      disabled={disabled}
                                      sx={s.menuItem}
                                    >
                                      {r.label}
                                      {disabled && " (needs Status col)"}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            )}
                          </Box>
                        </Box>
                      ))}
                      {columns.length === 0 && (
                        <Typography sx={s.emptyListText}>
                          No columns. Click "Add" to add one.
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={s.divider} />

                  <Box>
                    <Box sx={s.listHeaderRow}>
                      <SectionLabel>ROWS</SectionLabel>
                      <Button
                        size="small"
                        startIcon={<AddIcon sx={s.addIcon} />}
                        onClick={() => update("rows", [...(field.rows || []), ""])}
                        sx={s.addBtn}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box sx={s.rowsList}>
                      {(field.rows || []).map((row, i) => (
                        <Box key={i} sx={s.rowItem}>
                          <Typography sx={s.rowNum}>{i + 1}</Typography>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder={`Row ${i + 1} label`}
                            value={row}
                            onChange={(e) => {
                              const rows = [...(field.rows || [])];
                              rows[i] = e.target.value;
                              update("rows", rows);
                            }}
                            sx={s.input}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              const rows = [...(field.rows || [])];
                              rows.splice(i, 1);
                              update("rows", rows);
                            }}
                            sx={s.colDelBtn}
                          >
                            <DeleteOutlineIcon sx={s.colDelIcon} />
                          </IconButton>
                        </Box>
                      ))}
                      {(!field.rows || field.rows.length === 0) && (
                        <Typography sx={s.emptyListText}>No rows yet.</Typography>
                      )}
                    </Box>
                  </Box>
                </>
              );
            })()}

          {/* ── SIGNATURE SPECIFIC ── */}
          {isSignature && (
            <>
              <Divider sx={s.divider} />

              <ToggleRow
                label="Allow multiple signers"
                checked={field.multi !== false}
                onChange={(v) => update("multi", v)}
              />

              {field.multi !== false && (
                <>
                  <PropRow label="Signer Label (e.g. 'Technician')">
                    <TextField
                      fullWidth
                      size="small"
                      value={field.signerLabel || ""}
                      placeholder="Technician"
                      onChange={(e) => update("signerLabel", e.target.value)}
                      sx={s.input}
                    />
                  </PropRow>
                  <PropRow label="Add Button Label">
                    <TextField
                      fullWidth
                      size="small"
                      value={field.addButtonLabel || ""}
                      placeholder="Add Technician"
                      onChange={(e) => update("addButtonLabel", e.target.value)}
                      sx={s.input}
                    />
                  </PropRow>
                  <PropRow label="Min Signers">
                    <TextField
                      size="small"
                      type="number"
                      value={field.minSigners ?? 1}
                      onChange={(e) =>
                        update(
                          "minSigners",
                          Math.max(0, parseInt(e.target.value || "0", 10)),
                        )
                      }
                      sx={s.input}
                    />
                  </PropRow>
                </>
              )}

              <PropRow label="Name Dropdown Options (one per line)">
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={8}
                  size="small"
                  value={(field.nameOptions || []).join("\n")}
                  placeholder={
                    "e.g.\nManalang, Jonaber Sydney L.\nMarcelo, Carl Justine S."
                  }
                  onChange={(e) =>
                    update(
                      "nameOptions",
                      e.target.value
                        .split("\n")
                        .map((str) => str.trim())
                        .filter(Boolean),
                    )
                  }
                  sx={s.input}
                />
              </PropRow>

              <ToggleRow
                label="Show Digital Signature column"
                checked={field.digitalSig !== false}
                onChange={(v) => update("digitalSig", v)}
              />
            </>
          )}

          {/* Apply */}
          <Box sx={s.applyWrap}>
            <Button fullWidth variant="contained" size="small" sx={s.applyBtn}>
              Apply Changes
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
