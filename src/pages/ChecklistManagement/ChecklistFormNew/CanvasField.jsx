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
import { canvasFieldStyles as s } from "./styles/formStyle";

const ADVANCED_TYPES = { checklist: true, signature: true };

function ColPicker({ value = 1, onChange, icon: Icon, tooltip }) {
  return (
    <Tooltip title={tooltip} arrow placement="top">
      <Box sx={s.colPickerWrap}>
        <Icon sx={s.colPickerIcon} />
        <Box sx={s.colPickerDots}>
          {[1, 2, 3, 4].map((n) => {
            const active = value === n;
            return (
              <Box
                key={n}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(n);
                }}
                sx={s.colPickerCell(active)}
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
    <Box sx={s.previewContainer}>
      <Box sx={s.previewHeaderRow(cols)}>
        <Typography sx={s.previewHeaderCell}>#</Typography>
        <Typography sx={s.previewHeaderCell}>{descriptionLabel}</Typography>
        {columns.map((col) => (
          <Typography key={col.id} sx={s.previewHeaderCol(col.type === "status")}>
            {col.label}
          </Typography>
        ))}
      </Box>
      {rows.slice(0, 3).map((row, i) => (
        <Box
          key={i}
          sx={s.previewRow(cols, i < Math.min(rows.length, 3) - 1)}
        >
          <Typography sx={s.previewRowNum}>{i + 1}</Typography>
          <Typography sx={s.previewRowDesc}>{row}</Typography>
          {columns.map((col) => {
            if (col.type === "status") {
              return (
                <Box key={col.id} sx={s.previewStatusWrap}>
                  <Box sx={s.previewStatusBox("#22C55E")}>
                    <Typography sx={s.previewStatusMark("#22C55E")}>✓</Typography>
                  </Box>
                  <Box sx={s.previewStatusBox("#EF4444")}>
                    <Typography sx={s.previewStatusMark("#EF4444")}>✗</Typography>
                  </Box>
                </Box>
              );
            }
            return (
              <Typography key={col.id} sx={s.previewColCell}>
                {col.label}
              </Typography>
            );
          })}
        </Box>
      ))}
      {rows.length > 3 && (
        <Box sx={s.previewMoreWrap}>
          <Typography sx={s.previewMoreText}>+{rows.length - 3} more rows</Typography>
        </Box>
      )}
      {rows.length === 0 && (
        <Box sx={s.previewEmptyWrap}>
          <Typography sx={s.previewEmptyText}>
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
    <Box sx={s.sigPreviewContainer}>
      <Box sx={s.sigPreviewHeader}>
        <Typography sx={s.sigPreviewSigner}>{signerLabel} 1</Typography>
        {multi && (
          <Box sx={s.sigPreviewAddChip}>
            + {field.addButtonLabel || `Add ${signerLabel}`}
          </Box>
        )}
      </Box>
      <Box sx={s.sigPreviewGrid}>
        <Box>
          <Typography sx={s.sigPreviewLabel}>Name</Typography>
          <Box sx={s.sigPreviewNameBox}>
            <Typography sx={s.sigPreviewNameText}>Select name…</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={s.sigPreviewLabel}>E-Signature</Typography>
          <Box sx={s.sigPreviewSignBox}>
            <DrawIcon sx={s.sigPreviewDrawIcon} />
            <Typography sx={s.sigPreviewSignText}>Sign</Typography>
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
      sx={s.container(isSelected, isSection)}
    >
      {/* Row header */}
      <Box sx={s.rowHeader(isSection)}>
        {/* Drag handle */}
        <Box
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          sx={s.dragHandle}
        >
          <DragIndicatorIcon sx={s.dragIcon} />
        </Box>

        {/* Label */}
        <Typography sx={s.label(isSection)}>
          {field.label}
          {field.required && (
            <Box component="span" sx={s.requiredStar}>
              *
            </Box>
          )}
        </Typography>

        {/* Section: column pickers */}
        {isSection && (
          <Box sx={s.sectionColsWrap}>
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
            sx={s.typeChip(isAdvanced)}
          />
        )}

        {/* Delete */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={s.deleteBtn}
        >
          <DeleteOutlineIcon sx={s.deleteIcon} />
        </IconButton>
      </Box>

      {/* Expanded previews for advanced types */}
      {isChecklist && isSelected && (
        <Box sx={s.previewWrap}>
          <ChecklistPreview field={field} />
        </Box>
      )}
      {isSignature && isSelected && (
        <Box sx={s.previewWrap}>
          <SignaturePreview field={field} />
        </Box>
      )}
    </Box>
  );
}
