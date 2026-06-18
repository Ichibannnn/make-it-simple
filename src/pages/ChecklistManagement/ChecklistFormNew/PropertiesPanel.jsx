import { Box, Typography, TextField, Switch, Divider, Button, IconButton, MenuItem } from "@mui/material";
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

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 12,
    "& fieldset": { borderColor: "#30363D" },
    "&:hover fieldset": { borderColor: "#7C3AED" },
    "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
    bgcolor: "rgba(255,255,255,0.02)",
  },
  "& .MuiInputBase-input": { color: "#E6EDF3", py: 0.75, px: 1.25 },
};

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 9,
        fontWeight: 700,
        color: "#8B949E",
        letterSpacing: "0.1em",
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

function PropRow({ label, children }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 11, color: "#8B949E", mb: 0.5 }}>{label}</Typography>
      {children}
    </Box>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography sx={{ fontSize: 12, color: "#8B949E" }}>{label}</Typography>
      <Switch
        size="small"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#7C3AED" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            bgcolor: "#7C3AED",
          },
        }}
      />
    </Box>
  );
}

export default function PropertiesPanel({ field, onClose, onUpdate }) {
  const isEmpty = !field;

  const isSection = field?.type === "section";
  const isChecklist = field?.type === "checklist";
  const isSignature = field?.type === "signature";

  function update(key, value) {
    onUpdate({ ...field, [key]: value });
  }

  return (
    <Box
      sx={{
        width: 272,
        flexShrink: 0,
        borderLeft: "1px solid #30363D",
        bgcolor: "#161B22",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        transition: "width 0.2s ease",
      }}
    >
      {/* Panel header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #30363D",
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexShrink: 0,
        }}
      >
        <TuneIcon sx={{ fontSize: 15, color: "#7C3AED" }} />
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: "#E6EDF3",
            flex: 1,
            letterSpacing: "0.06em",
          }}
        >
          {isEmpty ? "PROPERTIES" : "FIELD PROPERTIES"}
        </Typography>
        {!isEmpty && (
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: "#8B949E", p: 0.25, "&:hover": { color: "#E6EDF3" } }}
          >
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        )}
      </Box>

      {isEmpty ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            p: 3,
            opacity: 0.5,
          }}
        >
          <TuneIcon sx={{ fontSize: 32, color: "#30363D" }} />
          <Typography
            sx={{
              fontSize: 12,
              color: "#8B949E",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Click any field on the canvas to configure its properties
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flex: 1,
          }}
        >
          {/* Label */}
          <PropRow label="Label">
            <TextField
              fullWidth
              size="small"
              value={field.label}
              onChange={(e) => update("label", e.target.value)}
              sx={inputSx}
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
                sx={inputSx}
              />
            </PropRow>
          )}

          {/* Required toggle */}
          {!isSection && (
            <ToggleRow label="Required" checked={!!field.required} onChange={(v) => update("required", v)} />
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
                  <Divider sx={{ borderColor: "#30363D" }} />

                  <PropRow label="Description Column Header">
                    <TextField
                      fullWidth
                      size="small"
                      value={field.descriptionLabel || "DESCRIPTION"}
                      onChange={(e) => update("descriptionLabel", e.target.value)}
                      sx={inputSx}
                    />
                  </PropRow>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <SectionLabel>COLUMNS</SectionLabel>
                      <Button
                        size="small"
                        startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                        onClick={addCol}
                        sx={{
                          color: "#7C3AED",
                          fontSize: 10,
                          textTransform: "none",
                          p: 0.25,
                          minWidth: 0,
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {columns.map((col, i) => (
                        <Box
                          key={col.id}
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            border: "1px solid #30363D",
                            bgcolor: "rgba(255,255,255,0.02)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.75,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Column label"
                              value={col.label}
                              onChange={(e) => updateCol(i, { label: e.target.value })}
                              sx={inputSx}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeCol(i)}
                              sx={{
                                color: "#30363D",
                                "&:hover": { color: "#EF4444" },
                                p: 0.25,
                                flexShrink: 0,
                              }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Box>

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 0.75,
                            }}
                          >
                            <TextField
                              select
                              size="small"
                              value={col.type}
                              onChange={(e) => updateCol(i, { type: e.target.value })}
                              sx={inputSx}
                              SelectProps={{
                                MenuProps: {
                                  PaperProps: {
                                    sx: {
                                      bgcolor: "#161B22",
                                      border: "1px solid #30363D",
                                    },
                                  },
                                },
                              }}
                            >
                              {COLUMN_TYPES.map((t) => (
                                <MenuItem key={t.value} value={t.value} sx={{ fontSize: 12 }}>
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
                                sx={inputSx}
                                SelectProps={{
                                  MenuProps: {
                                    PaperProps: {
                                      sx: {
                                        bgcolor: "#161B22",
                                        border: "1px solid #30363D",
                                      },
                                    },
                                  },
                                }}
                              >
                                {REQUIRE_WHEN.map((r) => {
                                  const disabled = (r.value === "check" || r.value === "x") && !statusExists;
                                  return (
                                    <MenuItem
                                      key={r.value}
                                      value={r.value}
                                      disabled={disabled}
                                      sx={{ fontSize: 12 }}
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
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#8B949E",
                            textAlign: "center",
                            py: 1.5,
                            fontStyle: "italic",
                          }}
                        >
                          No columns. Click "Add" to add one.
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: "#30363D" }} />

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <SectionLabel>ROWS</SectionLabel>
                      <Button
                        size="small"
                        startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                        onClick={() => update("rows", [...(field.rows || []), ""])}
                        sx={{
                          color: "#7C3AED",
                          fontSize: 10,
                          textTransform: "none",
                          p: 0.25,
                          minWidth: 0,
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      {(field.rows || []).map((row, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 10,
                              color: "#8B949E",
                              width: 16,
                              textAlign: "center",
                              flexShrink: 0,
                            }}
                          >
                            {i + 1}
                          </Typography>
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
                            sx={inputSx}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              const rows = [...(field.rows || [])];
                              rows.splice(i, 1);
                              update("rows", rows);
                            }}
                            sx={{
                              color: "#30363D",
                              "&:hover": { color: "#EF4444" },
                              p: 0.25,
                              flexShrink: 0,
                            }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Box>
                      ))}
                      {(!field.rows || field.rows.length === 0) && (
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#8B949E",
                            textAlign: "center",
                            py: 1.5,
                            fontStyle: "italic",
                          }}
                        >
                          No rows yet.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </>
              );
            })()}

          {/* ── SIGNATURE SPECIFIC ── */}
          {isSignature && (
            <>
              <Divider sx={{ borderColor: "#30363D" }} />

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
                      sx={inputSx}
                    />
                  </PropRow>
                  <PropRow label="Add Button Label">
                    <TextField
                      fullWidth
                      size="small"
                      value={field.addButtonLabel || ""}
                      placeholder="Add Technician"
                      onChange={(e) => update("addButtonLabel", e.target.value)}
                      sx={inputSx}
                    />
                  </PropRow>
                  <PropRow label="Min Signers">
                    <TextField
                      size="small"
                      type="number"
                      value={field.minSigners ?? 1}
                      onChange={(e) => update("minSigners", Math.max(0, parseInt(e.target.value || "0", 10)))}
                      sx={inputSx}
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
                  placeholder={"e.g.\nManalang, Jonaber Sydney L.\nMarcelo, Carl Justine S."}
                  onChange={(e) =>
                    update(
                      "nameOptions",
                      e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                  sx={inputSx}
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
          <Box sx={{ mt: "auto", pt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#7C3AED",
                "&:hover": { bgcolor: "#6D28D9" },
                fontSize: 12,
                boxShadow: "0 0 12px rgba(124,58,237,0.3)",
              }}
            >
              Apply Changes
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
