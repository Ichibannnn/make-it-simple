import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useCreateEditSubCategoryMutation } from "../../../features/api masterlist/sub_category_api/subCategoryApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  subCategory_Description: yup.string().required().label("Sub Category"),
  categoryId: yup.object().required().label("Category"),
});

export const SubCategoryDialog = ({ data, open, onClose }) => {
  const [createEditSubCategory] = useCreateEditSubCategoryMutation();
  const [
    getCategory,
    {
      data: categoryData,
      isLoading: categoryIsLoading,
      isSuccess: categoryIsSuccess,
    },
  ] = useLazyGetCategoryQuery();

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
        id: data?.categoryId,
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
    if (formData.id) {
      createEditSubCategory({
        id: formData.id,
        subCategory_Description: formData.subCategory_Description,
        categoryId: formData.categoryId.id,
      })
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
      createEditSubCategory({
        id: formData.id,
        subCategory_Description: formData.subCategory_Description,
        categoryId: formData.categoryId.id,
      })
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
          console.log("Error: ", error);
          //   toast.error("Error!", {
          //     description: error.data.error.message,
          //     duration: 1500,
          //   });
        });
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Stack sx={{ padding: 3 }}>
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            Sub Category Form
          </Typography>
        </Stack>

        <Divider variant="fullWidth" sx={{ background: "#2D3748" }} />

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <Box sx={{ width: "300px", padding: 2, minHeight: "790px" }}>
            <Stack sx={{ marginTop: 3, gap: 2 }}>
              <Stack sx={{ width: "100%", gap: 1 }}>
                <FormLabel
                  sx={{
                    color: theme.palette.text.main,
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: "1.4375em",
                  }}
                >
                  Category
                </FormLabel>

                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        size="small"
                        value={value}
                        options={categoryData?.value?.category || []}
                        loading={categoryIsLoading}
                        renderInput={(params) => <TextField {...params} />}
                        onOpen={() => {
                          if (!categoryIsSuccess)
                            getCategory({
                              Status: true,
                            });
                        }}
                        onChange={(_, value) => onChange(value)}
                        getOptionLabel={(option) => option.category_Description}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        sx={{
                          flex: 2,
                        }}
                        fullWidth
                        disablePortal
                      />
                    );
                  }}
                />
              </Stack>

              <Stack sx={{ padding: "5px", gap: 1 }}>
                <FormLabel
                  sx={{
                    color: theme.palette.text.main,
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: "1.4375em",
                  }}
                >
                  Sub Category
                </FormLabel>

                <TextField
                  {...register("subCategory_Description")}
                  size="small"
                  variant="outlined"
                  helperText={errors?.subCategory_Description?.message}
                  error={!!errors?.subCategory_Description?.message}
                  sx={{ borderColor: "primary" }}
                  fullWidth
                  autoComplete="off"
                />
              </Stack>
            </Stack>
          </Box>

          <Divider variant="fullWidth" sx={{ background: "#2D3748" }} />

          <Stack
            direction="row"
            justifyContent="right"
            alignItems="center"
            sx={{ padding: 2, gap: 1 }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={
                !watch("categoryId") || !watch("subCategory_Description")
              }
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
          </Stack>
        </form>
      </Drawer>
    </>
  );
};
