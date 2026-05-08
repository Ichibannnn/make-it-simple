import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";

import { useCreateEditCategoryConcernMutation } from "../../../features/api masterlist/category_concern/categoryConcernApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  concernCategory: yup.string().required("Category is required."),
});

export const CategoryConcernDialog = ({ data, open, onClose }) => {
  const [createEditCategory, { isLoading: createEditCategoryIsLoading, isFetching: createEditCategoryIsFetching }] = useCreateEditCategoryConcernMutation();

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
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ style: { overflow: "unset" } }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#48BB78",
          }}
        >
          {data ? "Edit Concern Category" : "Add Concern Category"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 1.5 }}>
              <TextField
                {...register("concernCategory")}
                variant="outlined"
                label="Concern Category"
                helperText={errors?.concernCategory?.message}
                error={!!errors?.concernCategory?.message}
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
              loading={createEditCategoryIsLoading || createEditCategoryIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("concernCategory")}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "black",
                },
              }}
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
