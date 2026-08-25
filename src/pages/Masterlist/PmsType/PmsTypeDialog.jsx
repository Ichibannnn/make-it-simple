import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { AddCircleOutline, EditOutlined, Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useAddEditPmsTypeMutation } from "../../../features/api masterlist/pms-type/pmsTypeApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  name: yup.string().required("PMS Type is required."),
});

const PmsTypeDialog = ({ data, open, onClose }) => {
  const [addEditPmsType, { isLoading }] = useAddEditPmsTypeMutation();

  const isEditMode = Boolean(data?.id);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: null,
      name: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("name", data?.name);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = async (formData) => {
    // Add and edit hit the same endpoint; the only difference is whether an id is sent.
    const entry = isEditMode ? { id: data.id, name: formData.name } : { name: formData.name };

    try {
      await addEditPmsType({ typeNames: [entry] }).unwrap();
      toast.success("Success!", {
        description: isEditMode ? "PMS Type updated successfully!" : "PMS Type added successfully!",
        duration: 1500,
      });
      onCloseAction();
    } catch (error) {
      toast.error("Error!", {
        description: error?.data?.error?.message || "Something went wrong",
        duration: 1500,
      });
    }
  };

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ sx: sx.dialogPaper }}>
        <Typography sx={sx.dialogTitle}>{isEditMode ? "Edit PMS Type" : "Add PMS Type"}</Typography>
        <Typography sx={sx.dialogSubtitle}>
          {isEditMode ? "Update the details of this PMS type." : "Create a new PMS type for scheduling."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>PMS Type</Typography>
                <TextField
                  {...register("name")}
                  variant="outlined"
                  size="small"
                  placeholder="Enter PMS Type"
                  helperText={errors?.name?.message}
                  error={!!errors?.name?.message}
                  fullWidth
                  autoComplete="off"
                  sx={{ borderColor: "primary", "& .MuiInputBase-input": { fontSize: "14px" } }}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Cancel</Typography>
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("name")}
              sx={sx.disabledSaveButton}
            >
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Save</Typography>
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PmsTypeDialog;
