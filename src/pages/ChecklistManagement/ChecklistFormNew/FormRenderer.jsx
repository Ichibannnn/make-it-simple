import { useState, useMemo } from "react";
import { Box, Typography, TextField, MenuItem, IconButton, Button, Divider, Chip } from "@mui/material";

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

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13,
    bgcolor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "#30363D" },
    "&:hover fieldset": { borderColor: "#7C3AED" },
    "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
  },
  "& .MuiInputBase-input": { color: "#E6EDF3" },
  "& .MuiSelect-icon": { color: "#8B949E" },
};

function FieldLabel({ text, required }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#E6EDF3", mb: 0.75 }}>
      {text}
      {required && (
        <Box component="span" sx={{ color: "#F97316", ml: 0.5 }}>
          *
        </Box>
      )}
    </Typography>
  );
}

function SectionRender({ field }) {
  return (
    <Box
      sx={{
        mt: 2,
        mb: 1,
        pb: 1,
        borderBottom: "2px solid rgba(124,58,237,0.4)",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: "#9D5CF6",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {field.label}
      </Typography>
    </Box>
  );
}

const pickerSlotProps = (error) => ({
  textField: {
    fullWidth: true,
    size: "small",
    error: !!error,
    helperText: error,
    sx: inputSx,
  },
  popper: {
    sx: {
      "& .MuiPaper-root": {
        bgcolor: "#161B22",
        border: "1px solid #30363D",
        color: "#E6EDF3",
      },
      "& .MuiPickersDay-root": { color: "#E6EDF3" },
      "& .MuiPickersDay-root.Mui-selected": {
        bgcolor: "#7C3AED",
        "&:hover": { bgcolor: "#6D28D9" },
      },
      "& .MuiPickersDay-root:hover": { bgcolor: "rgba(124,58,237,0.2)" },
      "& .MuiPickersCalendarHeader-label": { color: "#E6EDF3" },
      "& .MuiPickersArrowSwitcher-button": { color: "#8B949E" },
      "& .MuiDayCalendar-weekDayLabel": { color: "#8B949E" },
      "& .MuiPickersYear-yearButton.Mui-selected": { bgcolor: "#7C3AED" },
      "& .MuiPickersMonth-monthButton.Mui-selected": { bgcolor: "#7C3AED" },
      "& .MuiClock-pin, & .MuiClockPointer-root, & .MuiClockPointer-thumb": {
        bgcolor: "#7C3AED",
      },
      "& .MuiClockPointer-thumb": { borderColor: "#7C3AED" },
      "& .MuiClockNumber-root.Mui-selected": { bgcolor: "#7C3AED" },
    },
  },
});

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
        sx={inputSx}
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
        sx={inputSx}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: { bgcolor: "#161B22", border: "1px solid #30363D", mt: 0.5 },
            },
          },
        }}
      >
        <MenuItem value="">
          <em style={{ color: "#8B949E" }}>Select…</em>
        </MenuItem>
        {options.map((opt, i) => (
          <MenuItem key={i} value={opt} sx={{ fontSize: 13, color: "#E6EDF3" }}>
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
      sx={{
        width: 28,
        height: 28,
        borderRadius: 1,
        border: `1.5px solid ${color}`,
        bgcolor: active ? color : "transparent",
        color: active ? "#fff" : color,
        "&:hover": { bgcolor: active ? color : `${color}22` },
      }}
    >
      {target === "check" ? <CheckIcon sx={{ fontSize: 16 }} /> : <CloseIcon sx={{ fontSize: 16 }} />}
    </IconButton>
  );
}

function ChecklistRender({ field, value, onChange, errors }) {
  const rows = field.rows || [];
  const columns = getChecklistColumns(field);
  const descriptionLabel = field.descriptionLabel || "DESCRIPTION";
  const rowState = value || {};
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
    <Box>
      <FieldLabel text={field.label} required={field.required} />
      <Box
        sx={{
          borderRadius: 1.5,
          overflow: "hidden",
          border: "1px solid #30363D",
        }}
      >
        {/* Header row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: gridCols,
            bgcolor: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid #30363D",
            px: 1.5,
            py: 1,
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: "#8B949E",
              letterSpacing: "0.08em",
            }}
          >
            #
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: "#8B949E",
              letterSpacing: "0.08em",
            }}
          >
            {descriptionLabel}
          </Typography>
          {columns.map((col) => (
            <Typography
              key={col.id}
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#8B949E",
                letterSpacing: "0.08em",
                textAlign: col.type === "status" ? "center" : "left",
              }}
            >
              {col.label}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {rows.map((rowLabel, i) => {
          const r = rowState[i] || {};
          const rowErr = errors?.[i];
          return (
            <Box
              key={i}
              sx={{
                display: "grid",
                gridTemplateColumns: gridCols,
                px: 1.5,
                py: 1,
                gap: 1.5,
                alignItems: "center",
                borderBottom: i < rows.length - 1 ? "1px solid #30363D" : "none",
                bgcolor: rowErr ? "rgba(239,68,68,0.04)" : "transparent",
              }}
            >
              <Typography sx={{ fontSize: 11, color: "#8B949E" }}>{i + 1}</Typography>
              <Typography sx={{ fontSize: 13, color: "#E6EDF3" }}>{rowLabel}</Typography>

              {columns.map((col) => {
                const cellVal = r[col.id];
                const required = isColumnRequired(col, statusCol ? r[statusCol.id] : undefined);
                const hasErr = !!rowErr?.[col.id];

                if (col.type === "status") {
                  return (
                    <Box
                      key={col.id}
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
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
                    sx={{
                      ...inputSx,
                      "& .MuiInputBase-input": {
                        ...inputSx["& .MuiInputBase-input"],
                        py: 0.5,
                        fontSize: 12,
                      },
                    }}
                  />
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function SignerCard({ index, signerLabel, value, names, showDigital, onChange, onRemove, canRemove, error }) {
  const cur = value || {};
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1.5,
        border: "1px solid #30363D",
        bgcolor: "rgba(255,255,255,0.02)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#E6EDF3" }}>
          {signerLabel} {index + 1}
        </Typography>
        {canRemove && (
          <IconButton
            size="small"
            onClick={onRemove}
            sx={{
              color: "#EF4444",
              "&:hover": { bgcolor: "rgba(239,68,68,0.1)" },
              p: 0.5,
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: showDigital ? "1fr 1fr" : "1fr 1fr",
          },
          gap: 2,
        }}
      >
        {/* Name dropdown */}
        <Box>
          <Typography sx={{ fontSize: 11, color: "#8B949E", mb: 0.5 }}>
            Name
            <Box component="span" sx={{ color: "#F97316", ml: 0.25 }}>
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
            sx={inputSx}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: "#161B22",
                    border: "1px solid #30363D",
                    mt: 0.5,
                  },
                },
              },
            }}
          >
            <MenuItem value="">
              <em style={{ color: "#8B949E" }}>Select name…</em>
            </MenuItem>
            {(names || []).map((opt, i) => (
              <MenuItem key={i} value={opt} sx={{ fontSize: 13, color: "#E6EDF3" }}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* E-Signature */}
        <Box>
          <Typography sx={{ fontSize: 11, color: "#8B949E", mb: 0.5 }}>
            E-Signature
            <Box component="span" sx={{ color: "#F97316", ml: 0.25 }}>
              *
            </Box>
          </Typography>
          <Box
            onClick={() => onChange({ ...cur, eSig: !cur.eSig })}
            sx={{
              height: 56,
              borderRadius: 1,
              border: `1.5px dashed ${cur.eSig ? "#22C55E" : error?.eSig ? "#EF4444" : "#30363D"}`,
              bgcolor: cur.eSig ? "rgba(34,197,94,0.06)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { borderColor: "#7C3AED" },
            }}
          >
            {cur.eSig ? (
              <>
                <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#22C55E" }} />
                <Typography
                  sx={{
                    color: "#22C55E",
                    fontFamily: '"Brush Script MT", cursive',
                    fontSize: 22,
                  }}
                >
                  Signed
                </Typography>
              </>
            ) : (
              <>
                <DrawIcon sx={{ fontSize: 16, color: "#8B949E" }} />
                <Typography sx={{ fontSize: 11, color: "#8B949E" }}>Click to sign</Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Digital Signature (optional column) */}
        {showDigital && (
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography sx={{ fontSize: 11, color: "#8B949E", mb: 0.5 }}>Digital Signature</Typography>
            <Box
              sx={{
                height: 56,
                borderRadius: 1,
                border: "1.5px dashed #30363D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <DrawIcon sx={{ fontSize: 16, color: "#8B949E" }} />
              <Typography sx={{ fontSize: 11, color: "#8B949E" }}>Digital signature</Typography>
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <FieldLabel text={field.label} required={field.required} />
        {multi && (
          <Button
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 15 }} />}
            onClick={addSigner}
            sx={{
              bgcolor: "#7C3AED",
              color: "#fff",
              fontSize: 12,
              textTransform: "none",
              px: 1.5,
              py: 0.5,
              "&:hover": { bgcolor: "#6D28D9" },
              boxShadow: "0 0 8px rgba(124,58,237,0.4)",
            }}
          >
            {addLabel}
          </Button>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {signers.map((s, i) => (
          <SignerCard
            key={i}
            index={i}
            signerLabel={signerLabel}
            value={s}
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
        const rowErr = {};
        (f.rows || []).forEach((_, i) => {
          const r = v?.[i] || {};
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
        if (Object.keys(rowErr).length) e[`${f.id}_rows`] = rowErr;
      }
    }
    setErrors(e);
    setSubmitted(Object.keys(e).length === 0);
  }

  if (submitted) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0D1117",
        }}
      >
        <Box
          sx={{
            maxWidth: 480,
            textAlign: "center",
            p: 5,
            borderRadius: 2,
            border: "1px solid rgba(34,197,94,0.3)",
            bgcolor: "rgba(34,197,94,0.05)",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 56, color: "#22C55E", mb: 2 }} />
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#E6EDF3", mb: 1 }}>
            Form submitted successfully
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#8B949E", mb: 3 }}>
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
            sx={{
              borderColor: "#30363D",
              color: "#8B949E",
              "&:hover": { borderColor: "#7C3AED" },
            }}
          >
            Fill Again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#0D1117" }}>
      <Box
        sx={{
          maxWidth: 960,
          width: "100%",
          mx: "auto",
          px: 3,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Form header */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            border: "1px solid #30363D",
            bgcolor: "#161B22",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.5,
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#E6EDF3" }}>
              PMS Store Checklist
            </Typography>
            <Chip
              label={`${filledCount}/${fillableCount} filled · ${pct}%`}
              size="small"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                bgcolor: "rgba(124,58,237,0.12)",
                color: "#9D5CF6",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
            />
          </Box>
          <Typography sx={{ fontSize: 12, color: "#8B949E" }}>
            Preview mode — fill out the form to test it.
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              height: 4,
              bgcolor: "#30363D",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${pct}%`,
                bgcolor: "#7C3AED",
                transition: "width 0.25s ease",
                boxShadow: "0 0 8px rgba(124,58,237,0.5)",
              }}
            />
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
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: `repeat(${mobileCols}, minmax(0, 1fr))`,
                      md: `repeat(${desktopCols}, minmax(0, 1fr))`,
                    },
                    gap: 2,
                    mt: g.section ? 1.5 : 0,
                  }}
                >
                  {g.items.map((field) => {
                    const Renderer = RENDERERS[field.type] || TextRender;
                    const fullRow = field.type === "checklist" || field.type === "signature";
                    return (
                      <Box
                        key={field.id}
                        sx={{
                          gridColumn: fullRow ? "1 / -1" : "auto",
                        }}
                      >
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
        <Divider sx={{ borderColor: "#30363D", my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setValues({});
              setErrors({});
            }}
            sx={{
              borderColor: "#30363D",
              color: "#8B949E",
              fontSize: 12,
              "&:hover": { borderColor: "#EF4444", color: "#EF4444" },
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#7C3AED",
              fontSize: 12,
              "&:hover": { bgcolor: "#6D28D9" },
              boxShadow: "0 0 12px rgba(124,58,237,0.4)",
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
