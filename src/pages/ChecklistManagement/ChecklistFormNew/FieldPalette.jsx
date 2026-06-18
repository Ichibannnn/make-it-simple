import { Box, Typography, Divider, Tooltip } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { FIELD_GROUPS } from "../../../constants/fieldTypes";

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
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          py: 1.5,
          px: 1,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: isAdvanced ? "rgba(124,58,237,0.35)" : "#30363D",
          bgcolor: isAdvanced ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.02)",
          cursor: "grab",
          opacity: isDragging ? 0.35 : 1,
          transition: "all 0.15s ease",
          userSelect: "none",
          "&:hover": {
            borderColor: "#7C3AED",
            bgcolor: "rgba(124,58,237,0.12)",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(124,58,237,0.2)",
          },
          "&:active": { cursor: "grabbing" },
        }}
      >
        <Icon sx={{ fontSize: 20, color: isAdvanced ? "#9D5CF6" : "#8B949E" }} />
        <Typography
          sx={{
            fontSize: 10,
            color: "#8B949E",
            textAlign: "center",
            lineHeight: 1.2,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default function FieldPalette() {
  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        borderRight: "1px solid #30363D",
        bgcolor: "#161B22",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            color: "#8B949E",
            letterSpacing: "0.1em",
          }}
        >
          FIELDS
        </Typography>
      </Box>

      {FIELD_GROUPS.map(({ group, fields }, gi) => (
        <Box key={group} sx={{ px: 2, pb: 2 }}>
          <Typography
            sx={{
              fontSize: 9,
              fontWeight: 600,
              color: "#8B949E",
              letterSpacing: "0.12em",
              mb: 1,
              opacity: 0.7,
            }}
          >
            {group}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75 }}>
            {fields.map((f) => (
              <PaletteCard key={f.type} {...f} isAdvanced={group === "ADVANCED"} />
            ))}
          </Box>
          {gi < FIELD_GROUPS.length - 1 && <Divider sx={{ borderColor: "#30363D", mt: 2 }} />}
        </Box>
      ))}

      <Box sx={{ px: 2, py: 2, mt: "auto", borderTop: "1px solid #30363D" }}>
        <Typography
          sx={{
            fontSize: 10,
            color: "#8B949E",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          Drag fields onto the canvas to build your form
        </Typography>
      </Box>
    </Box>
  );
}
