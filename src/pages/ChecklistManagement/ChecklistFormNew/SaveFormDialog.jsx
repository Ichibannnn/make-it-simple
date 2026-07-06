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

import { saveFormDialogStyles as s } from "./styles/formStyle";

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
    <Box sx={s.summaryChipsWrap}>
      {chips.map((c) => (
        <Chip
          key={c.label}
          label={c.label}
          size="small"
          sx={s.summaryChip(c.color)}
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
      PaperProps={{ sx: s.paper }}
    >
      {/* ── Header ── */}
      <DialogTitle sx={s.title}>
        <Box sx={s.titleIconBox}>
          <SaveOutlinedIcon sx={s.titleIcon} />
        </Box>

        <Box sx={s.titleTextWrap}>
          <Typography sx={s.titleHeading}>Save Form</Typography>
          <Typography sx={s.titleSub}>
            Review and confirm the form details before saving.
          </Typography>
        </Box>

        <IconButton size="small" onClick={onClose} sx={s.titleCloseBtn}>
          <CloseIcon sx={s.titleCloseIcon} />
        </IconButton>
      </DialogTitle>

      {/* ── Body ── */}
      <DialogContent sx={s.content}>
        {/* Field summary */}
        <Box>
          <Typography sx={s.sectionLabel}>FORM SUMMARY</Typography>
          <FieldSummary fields={fields} />
        </Box>

        <Divider sx={s.divider} />

        {/* RHF fields */}
        <Box sx={s.fieldsWrap}>
          <Typography sx={s.sectionLabelPlain}>FORM DETAILS</Typography>

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
                sx={s.input}
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
                sx={s.input}
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
                sx={s.versionInput(!!errors.version)}
              />
            )}
          />
        </Box>

        {/* Payload note */}
        <Box sx={s.noteBox}>
          <CheckCircleOutlineIcon sx={s.noteIcon} />
          <Typography sx={s.noteText}>
            Saving will produce a versioned JSON payload using the canonical
            schema and clear the local draft. All field order and configuration
            will be preserved exactly as built.
          </Typography>
        </Box>
      </DialogContent>

      {/* ── Actions ── */}
      <DialogActions sx={s.actions}>
        <LoadingButton
          variant="outlined"
          size="small"
          onClick={onClose}
          disabled={loading}
          sx={s.cancelBtn}
        >
          Cancel
        </LoadingButton>

        <LoadingButton
          variant="contained"
          size="small"
          loading={loading}
          loadingIndicator={<CircularProgress size={14} sx={s.loadingSpinner} />}
          startIcon={!loading && <SaveOutlinedIcon sx={s.saveStartIcon} />}
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          sx={s.saveBtn}
        >
          Save Form
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
