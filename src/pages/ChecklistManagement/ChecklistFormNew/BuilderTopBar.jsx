import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

export default function BuilderTopBar({
  mode = "builder",
  onTogglePreview,
  onSave,
  onClose,
  onDiscardDraft,
  data,
  draftSavedAt, // ISO string | null — set by FormBuilder after each auto-save
  hasDraft, // boolean
}) {
  const isPreview = mode === "preview";

  // Format last-saved timestamp
  const savedLabel = draftSavedAt
    ? `Draft saved ${new Date(draftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : null;

  return (
    <Box
      sx={{
        height: 56,
        display: "flex",
        alignItems: "center",
        px: 2,
        gap: 1.5,
        borderBottom: "1px solid #30363D",
        bgcolor: "#161B22",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <IconButton
        size="small"
        onClick={onClose}
        sx={{ color: "#8B949E", "&:hover": { color: "#E6EDF3" } }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>

      <Box
        sx={{ width: "1px", height: 20, bgcolor: "#30363D", flexShrink: 0 }}
      />

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 14,
            color: "#E6EDF3",
            whiteSpace: "nowrap",
          }}
        >
          {data.title}
        </Typography>
        <IconButton size="small" sx={{ color: "#8B949E", p: 0.25 }}>
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      <Chip
        label={isPreview ? "Preview Mode" : "Draft"}
        size="small"
        sx={{
          height: 20,
          fontSize: 10,
          fontWeight: 600,
          flexShrink: 0,
          bgcolor: isPreview ? "rgba(34,197,94,0.12)" : "rgba(249,115,22,0.12)",
          color: isPreview ? "#22C55E" : "#F97316",
          border: `1px solid ${isPreview ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.3)"}`,
          "& .MuiChip-label": { px: 1 },
        }}
      />

      {/* Draft saved indicator */}
      {savedLabel && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <CloudDoneOutlinedIcon sx={{ fontSize: 13, color: "#22C55E" }} />
          <Typography
            sx={{ fontSize: 11, color: "#22C55E", whiteSpace: "nowrap" }}
          >
            {savedLabel}
          </Typography>
        </Box>
      )}

      <Box sx={{ flex: 1 }} />

      {/* Discard draft button — only when a draft exists */}
      {hasDraft && (
        <Tooltip title="Discard local draft and reset to defaults" arrow>
          <Button
            variant="text"
            size="small"
            onClick={onDiscardDraft}
            startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />}
            sx={{
              color: "#8B949E",
              fontSize: 11,
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": { color: "#EF4444" },
            }}
          >
            Discard Draft
          </Button>
        </Tooltip>
      )}

      <Button
        variant="outlined"
        size="small"
        onClick={onTogglePreview}
        startIcon={
          isPreview ? (
            <EditNoteOutlinedIcon sx={{ fontSize: 15 }} />
          ) : (
            <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
          )
        }
        sx={{
          borderColor: "#30363D",
          color: "#8B949E",
          fontSize: 12,
          whiteSpace: "nowrap",
          flexShrink: 0,
          "&:hover": { borderColor: "#7C3AED", color: "#E6EDF3" },
        }}
      >
        {isPreview ? "Back to Editor" : "Preview"}
      </Button>

      <Button
        variant="contained"
        size="small"
        onClick={onSave}
        startIcon={<SaveOutlinedIcon sx={{ fontSize: 15 }} />}
        sx={{
          bgcolor: "#7C3AED",
          fontSize: 12,
          whiteSpace: "nowrap",
          flexShrink: 0,
          "&:hover": { bgcolor: "#6D28D9" },
          boxShadow: "0 0 12px rgba(124,58,237,0.4)",
        }}
      >
        Save Form
      </Button>
    </Box>
  );
}
