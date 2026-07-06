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

import { topBarStyles as s } from "./styles/formStyle";

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
    <Box sx={s.container}>
      <IconButton size="small" onClick={onClose} sx={s.backBtn}>
        <ArrowBackIcon fontSize="small" />
      </IconButton>

      <Box sx={s.divider} />

      <Box sx={s.titleWrap}>
        <Typography sx={s.title}>{data.title}</Typography>
        <IconButton size="small" sx={s.editBtn}>
          <EditOutlinedIcon sx={s.editIcon} />
        </IconButton>
      </Box>

      <Chip
        label={isPreview ? "Preview Mode" : "Draft"}
        size="small"
        sx={s.chip(isPreview)}
      />

      {/* Draft saved indicator */}
      {savedLabel && (
        <Box sx={s.savedWrap}>
          <CloudDoneOutlinedIcon sx={s.savedIcon} />
          <Typography sx={s.savedText}>{savedLabel}</Typography>
        </Box>
      )}

      <Box sx={s.spacer} />

      {/* Discard draft button — only when a draft exists */}
      {hasDraft && (
        <Tooltip title="Discard local draft and reset to defaults" arrow>
          <Button
            variant="text"
            size="small"
            onClick={onDiscardDraft}
            startIcon={<DeleteOutlineIcon sx={s.discardIcon} />}
            sx={s.discardBtn}
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
            <EditNoteOutlinedIcon sx={s.toggleIcon} />
          ) : (
            <VisibilityOutlinedIcon sx={s.toggleIcon} />
          )
        }
        sx={s.toggleBtn}
      >
        {isPreview ? "Back to Editor" : "Preview"}
      </Button>

      <Button
        variant="contained"
        size="small"
        onClick={onSave}
        startIcon={<SaveOutlinedIcon sx={s.saveIcon} />}
        sx={s.saveBtn}
      >
        Save Form
      </Button>
    </Box>
  );
}
