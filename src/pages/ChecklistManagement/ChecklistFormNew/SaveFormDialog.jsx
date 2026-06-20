import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

// ── Yup schema ──────────────────────────────────────────────────────────────
const saveSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Form title is required")
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be under 120 characters"),
  description: yup
    .string()
    .trim()
    .max(500, "Description must be under 500 characters"),
  version: yup
    .string()
    .trim()
    .matches(
      /^\d+\.\d+\.\d+$/,
      'Version must follow semver format (e.g. "1.0.0")',
    )
    .required("Version is required"),
});

// ── Shared input sx ─────────────────────────────────────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13,
    bgcolor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "#30363D" },
    "&:hover fieldset": { borderColor: "#7C3AED" },
    "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
  },
  "& .MuiInputBase-input": { color: "#E6EDF3" },
  "& .MuiFormHelperText-root": { color: "#EF4444", fontSize: 11 },
  "& .MuiInputLabel-root": { color: "#8B949E", fontSize: 13 },
  "& .MuiInputLabel-root.Mui-focused": { color: "#7C3AED" },
};

// ── Field count summary ──────────────────────────────────────────────────────
function FieldSummary({ fields }) {
  const counts = fields.reduce(
    (acc, f) => {
      if (f.type === "section") acc.sections++;
      else if (f.type === "checklist") acc.checklists++;
      else if (f.type === "signature") acc.signatures++;
      else acc.basic++;
      return acc;
    },
    { sections: 0, basic: 0, checklists: 0, signatures: 0 },
  );

  const chips = [
    {
      label: `${counts.sections} section${counts.sections !== 1 ? "s" : ""}`,
      color: "#9D5CF6",
    },
    {
      label: `${counts.basic} basic field${counts.basic !== 1 ? "s" : ""}`,
      color: "#8B949E",
    },
    {
      label: `${counts.checklists} checklist${counts.checklists !== 1 ? "s" : ""}`,
      color: "#7C3AED",
    },
    {
      label: `${counts.signatures} signature${counts.signatures !== 1 ? "s" : ""}`,
      color: "#5eaeff",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
      {chips.map((c) => (
        <Chip
          key={c.label}
          label={c.label}
          size="small"
          sx={{
            height: 20,
            fontSize: 10,
            fontWeight: 600,
            bgcolor: "rgba(255,255,255,0.04)",
            color: c.color,
            border: `1px solid ${c.color}44`,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ))}
    </Box>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
/**
 * @param {object}   props
 * @param {boolean}  props.open
 * @param {Function} props.onClose
 * @param {object}   props.defaultMeta   – { title, description } from the builder
 * @param {Array}    props.fields         – current flat fields array
 * @param {Function} props.onConfirm      – called with validated payload
 * @param {boolean}  [props.loading]
 */
export default function SaveFormDialog({
  open,
  onClose,
  defaultMeta,
  fields,
  onConfirm,
  loading = false,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(saveSchema),
    mode: "onChange",
    defaultValues: {
      title: defaultMeta?.title || "",
      description: defaultMeta?.description || "",
      version: "1.0.0",
    },
  });

  // Reset whenever the dialog opens with fresh defaultMeta
  const handleEnter = () => {
    reset({
      title: defaultMeta?.title || "",
      description: defaultMeta?.description || "",
      version: "1.0.0",
    });
  };

  const onSubmit = (values) => {
    onConfirm({
      title: values.title,
      description: values.description,
      version: values.version,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{ onEnter: handleEnter }}
      PaperProps={{
        sx: {
          bgcolor: "#161B22",
          border: "1px solid #30363D",
          borderRadius: 2,
          backgroundImage: "none",
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #30363D",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SaveOutlinedIcon sx={{ fontSize: 16, color: "#9D5CF6" }} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#E6EDF3" }}>
            Save Form
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#8B949E", mt: 0.25 }}>
            Review and confirm the form details before saving.
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: "#8B949E", p: 0.5, "&:hover": { color: "#E6EDF3" } }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </DialogTitle>

      {/* ── Body ── */}
      <DialogContent
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Field summary */}
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: "#8B949E",
              letterSpacing: "0.1em",
              mb: 1,
            }}
          >
            FORM SUMMARY
          </Typography>
          <FieldSummary fields={fields} />
        </Box>

        <Divider sx={{ borderColor: "#30363D" }} />

        {/* RHF fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: "#8B949E",
              letterSpacing: "0.1em",
            }}
          >
            FORM DETAILS
          </Typography>

          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Form Title"
                fullWidth
                size="small"
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={inputSx}
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description (optional)"
                fullWidth
                size="small"
                multiline
                minRows={2}
                maxRows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={inputSx}
              />
            )}
          />

          {/* Version */}
          <Controller
            name="version"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Version"
                fullWidth
                size="small"
                placeholder="1.0.0"
                error={!!errors.version}
                helperText={
                  errors.version?.message ||
                  "Use semver format (major.minor.patch)"
                }
                sx={{
                  ...inputSx,
                  "& .MuiFormHelperText-root": {
                    color: errors.version ? "#EF4444" : "#8B949E",
                    fontSize: 11,
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Payload note */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            bgcolor: "rgba(124,58,237,0.06)",
            border: "1px solid rgba(124,58,237,0.2)",
            display: "flex",
            gap: 1,
            alignItems: "flex-start",
          }}
        >
          <CheckCircleOutlineIcon
            sx={{ fontSize: 15, color: "#9D5CF6", mt: 0.15, flexShrink: 0 }}
          />
          <Typography sx={{ fontSize: 11, color: "#8B949E", lineHeight: 1.6 }}>
            Saving will produce a versioned JSON payload using the canonical
            schema and clear the local draft. All field order and configuration
            will be preserved exactly as built.
          </Typography>
        </Box>
      </DialogContent>

      {/* ── Actions ── */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #30363D",
          gap: 1,
        }}
      >
        <LoadingButton
          variant="outlined"
          size="small"
          onClick={onClose}
          disabled={loading}
          sx={{
            borderColor: "#30363D",
            color: "#8B949E",
            fontSize: 12,
            "&:hover": { borderColor: "#8B949E" },
          }}
        >
          Cancel
        </LoadingButton>

        <LoadingButton
          variant="contained"
          size="small"
          loading={loading}
          loadingIndicator={
            <CircularProgress size={14} sx={{ color: "#fff" }} />
          }
          startIcon={!loading && <SaveOutlinedIcon sx={{ fontSize: 15 }} />}
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          sx={{
            bgcolor: "#7C3AED",
            fontSize: 12,
            "&:hover": { bgcolor: "#6D28D9" },
            "&.Mui-disabled": {
              bgcolor: "rgba(124,58,237,0.3)",
              color: "rgba(255,255,255,0.4)",
            },
            boxShadow: "0 0 12px rgba(124,58,237,0.4)",
          }}
        >
          Save Form
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
