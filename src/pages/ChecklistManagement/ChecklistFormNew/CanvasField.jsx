import { Box, Typography, IconButton, Chip, Tooltip } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DrawIcon from "@mui/icons-material/Draw";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";

import { TYPE_CHIP_LABEL } from "../../../constants/fieldTypes";
import { getChecklistColumns } from "../../../constants/checklistDefaults";

const ADVANCED_TYPES = { checklist: true, signature: true };

function ColPicker({ value = 1, onChange, icon: Icon, tooltip }) {
  return (
    <Tooltip title={tooltip} arrow placement="top">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 0.75,
          py: 0.25,
          borderRadius: 1,
          border: "1px solid #30363D",
          bgcolor: "rgba(255,255,255,0.02)",
        }}
      >
        <Icon sx={{ fontSize: 13, color: "#8B949E" }} />
        <Box sx={{ display: "flex", gap: 0.25 }}>
          {[1, 2, 3, 4].map((n) => {
            const active = value === n;
            return (
              <Box
                key={n}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(n);
                }}
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  bgcolor: active ? "#7C3AED" : "transparent",
                  color: active ? "#fff" : "#8B949E",
                  border: "1px solid",
                  borderColor: active ? "#7C3AED" : "#30363D",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "#7C3AED",
                    color: active ? "#fff" : "#9D5CF6",
                  },
                }}
              >
                {n}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Tooltip>
  );
}

function ChecklistPreview({ field }) {
  const rows = field.rows || [];
  const columns = getChecklistColumns(field);
  const descriptionLabel = field.descriptionLabel || "DESCRIPTION";
  const cols = [
    "24px",
    "minmax(120px, 1fr)",
    ...columns.map((c) => (c.type === "status" ? "72px" : "minmax(80px, 1fr)")),
  ].join(" ");

  return (
    <Box
      sx={{
        mt: 1,
        borderRadius: 1,
        overflow: "hidden",
        border: "1px solid #30363D",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: cols,
          bgcolor: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid #30363D",
          px: 1,
          py: 0.5,
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 700,
            color: "#8B949E",
            letterSpacing: "0.08em",
          }}
        >
          #
        </Typography>
        <Typography
          sx={{
            fontSize: 9,
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
              fontSize: 9,
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
      {rows.slice(0, 3).map((row, i) => (
        <Box
          key={i}
          sx={{
            display: "grid",
            gridTemplateColumns: cols,
            px: 1,
            py: 0.75,
            borderBottom: i < Math.min(rows.length, 3) - 1 ? "1px solid #30363D" : "none",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 10, color: "#8B949E" }}>{i + 1}</Typography>
          <Typography sx={{ fontSize: 11, color: "#E6EDF3" }}>{row}</Typography>
          {columns.map((col) => {
            if (col.type === "status") {
              return (
                <Box key={col.id} sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: 0.5,
                      border: "1px solid #22C55E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: 8, color: "#22C55E", fontWeight: 700 }}>✓</Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: 0.5,
                      border: "1px solid #EF4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: 8, color: "#EF4444", fontWeight: 700 }}>✗</Typography>
                  </Box>
                </Box>
              );
            }
            return (
              <Typography
                key={col.id}
                sx={{
                  fontSize: 10,
                  color: "#8B949E",
                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {col.label}
              </Typography>
            );
          })}
        </Box>
      ))}
      {rows.length > 3 && (
        <Box sx={{ px: 1, py: 0.5, bgcolor: "rgba(124,58,237,0.05)" }}>
          <Typography sx={{ fontSize: 10, color: "#7C3AED" }}>+{rows.length - 3} more rows</Typography>
        </Box>
      )}
      {rows.length === 0 && (
        <Box sx={{ px: 1, py: 1.5 }}>
          <Typography
            sx={{
              fontSize: 10,
              color: "#8B949E",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            No rows yet — add rows in the properties panel
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function SignaturePreview({ field }) {
  const signerLabel = field.signerLabel || "Technician";
  const multi = field.multi !== false;
  return (
    <Box
      sx={{
        mt: 1,
        borderRadius: 1,
        border: "1px solid #30363D",
        p: 1.25,
        bgcolor: "rgba(255,255,255,0.02)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#E6EDF3" }}>{signerLabel} 1</Typography>
        {multi && (
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 0.5,
              bgcolor: "rgba(124,58,237,0.15)",
              color: "#9D5CF6",
              fontSize: 9,
              fontWeight: 600,
            }}
          >
            + {field.addButtonLabel || `Add ${signerLabel}`}
          </Box>
        )}
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
        <Box>
          <Typography sx={{ fontSize: 9, color: "#8B949E", mb: 0.5 }}>Name</Typography>
          <Box
            sx={{
              height: 28,
              borderRadius: 0.5,
              border: "1px solid #30363D",
              display: "flex",
              alignItems: "center",
              px: 1,
            }}
          >
            <Typography sx={{ fontSize: 10, color: "#8B949E", fontStyle: "italic" }}>Select name…</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 9, color: "#8B949E", mb: 0.5 }}>E-Signature</Typography>
          <Box
            sx={{
              height: 28,
              borderRadius: 0.5,
              border: "1px dashed #30363D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <DrawIcon sx={{ fontSize: 12, color: "#8B949E" }} />
            <Typography sx={{ fontSize: 10, color: "#8B949E" }}>Sign</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function CanvasField({ field, isSelected, onSelect, onDelete, onUpdate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const isSection = field.type === "section";
  const isChecklist = field.type === "checklist";
  const isSignature = field.type === "signature";
  const isAdvanced = ADVANCED_TYPES[field.type];

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
      }}
      onClick={onSelect}
      sx={{
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: isSelected ? "#7C3AED" : isSection ? "transparent" : "#30363D",
        borderLeft: isSection
          ? "3px solid #7C3AED"
          : isSelected
            ? "3px solid #7C3AED"
            : "3px solid transparent",
        bgcolor: isSection
          ? "rgba(124,58,237,0.08)"
          : isSelected
            ? "rgba(124,58,237,0.06)"
            : "rgba(255,255,255,0.015)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        overflow: "hidden",
        boxShadow: isSelected ? "0 0 0 1px rgba(124,58,237,0.4)" : "none",
        "&:hover": {
          borderColor: "#7C3AED",
          bgcolor: isSection ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.05)",
        },
      }}
    >
      {/* Row header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: isSection ? 1.25 : 1.75,
          flexWrap: "wrap",
        }}
      >
        {/* Drag handle */}
        <Box
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          sx={{
            cursor: "grab",
            color: "#30363D",
            "&:hover": { color: "#8B949E" },
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <DragIndicatorIcon sx={{ fontSize: 16 }} />
        </Box>

        {/* Label */}
        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: isSection ? 13 : 14,
            fontWeight: isSection ? 700 : 400,
            color: isSection ? "#9D5CF6" : "#E6EDF3",
            letterSpacing: isSection ? "0.04em" : 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {field.label}
          {field.required && (
            <Box component="span" sx={{ color: "#F97316", ml: 0.25 }}>
              *
            </Box>
          )}
        </Typography>

        {/* Section: column pickers */}
        {isSection && (
          <Box
            sx={{
              display: "flex",
              gap: 0.75,
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <ColPicker
              value={field.desktopCols || 1}
              onChange={(v) => onUpdate({ ...field, desktopCols: v })}
              icon={DesktopWindowsOutlinedIcon}
              tooltip="Desktop columns"
            />
            <ColPicker
              value={field.mobileCols || 1}
              onChange={(v) => onUpdate({ ...field, mobileCols: v })}
              icon={PhoneIphoneOutlinedIcon}
              tooltip="Mobile columns"
            />
          </Box>
        )}

        {/* Type chip */}
        {!isSection && (
          <Chip
            label={TYPE_CHIP_LABEL[field.type] || field.type}
            size="small"
            sx={{
              height: 18,
              fontSize: 9,
              fontWeight: 600,
              flexShrink: 0,
              bgcolor: isAdvanced ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.05)",
              color: isAdvanced ? "#9D5CF6" : "#8B949E",
              border: `1px solid ${isAdvanced ? "rgba(124,58,237,0.3)" : "#30363D"}`,
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        )}

        {/* Delete */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            color: "#30363D",
            "&:hover": { color: "#EF4444", bgcolor: "rgba(239,68,68,0.08)" },
            p: 0.25,
            flexShrink: 0,
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* Expanded previews for advanced types */}
      {isChecklist && isSelected && (
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <ChecklistPreview field={field} />
        </Box>
      )}
      {isSignature && isSelected && (
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <SignaturePreview field={field} />
        </Box>
      )}
    </Box>
  );
}
