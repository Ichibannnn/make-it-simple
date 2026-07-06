import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { AddCircleOutline, EditOutlined, Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useAddEditPmsTypeMutation } from "../../../features/api masterlist/pms-type/pmsTypeApi";
import { pmsTypeStyles as sx } from "./styles/pmsTypeStyles";

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
        <DialogTitle sx={sx.dialogTitle}>
          {isEditMode ? <EditOutlined sx={sx.dialogTitleIcon} /> : <AddCircleOutline sx={sx.dialogTitleIcon} />}
          {isEditMode ? "Edit PMS Type" : "Add PMS Type"}
        </DialogTitle>
        <Typography sx={sx.dialogSubtitle}>
          {isEditMode ? "Update the details of this PMS type." : "Create a new PMS type for scheduling."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <TextField
                {...register("name")}
                variant="outlined"
                label="PMS Type Name"
                helperText={errors?.name?.message}
                error={!!errors?.name?.message}
                sx={{ borderColor: "primary" }}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("name")}
              sx={sx.disabledSaveButton}
            >
              Save
            </LoadingButton>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              Close
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PmsTypeDialog;
