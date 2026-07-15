import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AddCircleOutline, EditOutlined, Save } from "@mui/icons-material";
import { useEffect } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useCreateEditSubCategoryMutation } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { toast } from "sonner";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  subCategory_Description: yup.string().required().label("Sub Category"),
  categoryId: yup.object().required().label("Category"),
});

export const SubCategoryDialog = ({ data, open, onClose }) => {
  const [
    createEditSubCategory,
    { isLoading: createEditSubCategoryIsLoading, isFetching: createEditSubCategoryIsFetching },
  ] = useCreateEditSubCategoryMutation();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] =
    useLazyGetCategoryQuery();

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
      categoryId: null,
      subCategory_Description: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("categoryId", {
        categoryId: data?.categoryId,
        category_Description: data?.category_Description,
      });
      setValue("subCategory_Description", data?.subCategory_Description);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    if (data) {
      const editPayload = {
        id: formData.id,
        subCategory_Description: formData.subCategory_Description,
        categoryId: formData.categoryId.categoryId,
      };

      console.log("EditPayload: ", editPayload);

      createEditSubCategory(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated sub category! ",
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
        subCategory_Description: formData.subCategory_Description,
        categoryId: formData.categoryId.id,
      };

      createEditSubCategory(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Sub Category added successsfully!",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("Error: ", error);
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
        <DialogTitle sx={sx.dialogTitle}>
          {data ? <EditOutlined sx={sx.dialogTitleIcon} /> : <AddCircleOutline sx={sx.dialogTitleIcon} />}
          {data ? "Edit Sub Category" : "Add Sub Category"}
        </DialogTitle>

        <Typography sx={sx.dialogSubtitle}>
          {data ? "Update the details of this sub category." : "Create a new sub category."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Controller
                control={control}
                name="categoryId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      value={value}
                      options={categoryData?.value?.category || []}
                      loading={categoryIsLoading}
                      renderInput={(params) => <TextField {...params} label="Category" />}
                      onOpen={() => {
                        if (!categoryIsSuccess)
                          getCategory({
                            Status: true,
                          });
                      }}
                      onChange={(_, value) => onChange(value)}
                      getOptionLabel={(option) => option.category_Description}
                      isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
                      fullWidth
                      disablePortal
                    />
                  );
                }}
              />

              <TextField
                {...register("subCategory_Description")}
                variant="outlined"
                label="Sub Category"
                helperText={errors?.subCategory_Description?.message}
                error={!!errors?.subCategory_Description?.message}
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
              loading={createEditSubCategoryIsLoading || createEditSubCategoryIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("categoryId") || !watch("subCategory_Description")}
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
