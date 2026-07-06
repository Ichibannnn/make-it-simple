import { Box, Typography, Divider, Tooltip } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { FIELD_GROUPS } from "../../../constants/fieldTypes";
import { fieldPaletteStyles as s } from "./styles/formStyle";

function PaletteCard({ type, label, Icon, isAdvanced }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, label, fromPalette: true },
  });

  return (
    <Tooltip title={`Drag to add ${label}`} placement="right" arrow>
      <Box
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        sx={s.card(isAdvanced, isDragging)}
      >
        <Icon sx={s.cardIcon(isAdvanced)} />
        <Typography sx={s.cardLabel}>{label}</Typography>
      </Box>
    </Tooltip>
  );
}

export default function FieldPalette() {
  return (
    <Box sx={s.container}>
      <Box sx={s.headerWrap}>
        <Typography sx={s.headerText}>FIELDS</Typography>
      </Box>

      {FIELD_GROUPS.map(({ group, fields }, gi) => (
        <Box key={group} sx={s.group}>
          <Typography sx={s.groupTitle}>{group}</Typography>
          <Box sx={s.grid}>
            {fields.map((f) => (
              <PaletteCard key={f.type} {...f} isAdvanced={group === "ADVANCED"} />
            ))}
          </Box>
          {gi < FIELD_GROUPS.length - 1 && <Divider sx={s.divider} />}
        </Box>
      ))}

      <Box sx={s.footer}>
        <Typography sx={s.footerText}>
          Drag fields onto the canvas to build your form
        </Typography>
      </Box>
    </Box>
  );
}
