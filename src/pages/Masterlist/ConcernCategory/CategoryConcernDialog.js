import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AddCircleOutline, EditOutlined, Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";

import { useCreateEditCategoryConcernMutation } from "../../../features/api masterlist/category_concern/categoryConcernApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  concernCategory: yup.string().required("Category is required."),
});

export const CategoryConcernDialog = ({ data, open, onClose }) => {
  const [
    createEditCategory,
    { isLoading: createEditCategoryIsLoading, isFetching: createEditCategoryIsFetching },
  ] = useCreateEditCategoryConcernMutation();

  const {
    control,
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
      concernCategory: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("concernCategory", data?.categoryConcern);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    if (formData.id) {
      const editPayload = {
        id: data.id,
        concernCategory: formData?.concernCategory,
      };

      createEditCategory(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated category! ",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("error: ", error);
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    } else {
      const addPayload = {
        concernCategory: formData?.concernCategory,
      };

      createEditCategory(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Category added successsfully!",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("error: ", error);
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    }
  };

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ sx: sx.dialogPaper }}>
        <Typography sx={sx.dialogTitle}>{data ? "Edit Concern Category" : "Add Concern Category"}</Typography>
        <Typography sx={sx.dialogSubtitle}>
          {data ? "Update the details of this concern category." : "Create a new concern category."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Concern Category</Typography>
                <TextField
                  {...register("concernCategory")}
                  variant="outlined"
                  size="small"
                  placeholder="Enter Concern Category"
                  helperText={errors?.concernCategory?.message}
                  error={!!errors?.concernCategory?.message}
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
              loading={createEditCategoryIsLoading || createEditCategoryIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("concernCategory")}
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
