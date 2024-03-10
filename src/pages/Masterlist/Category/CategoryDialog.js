import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { useCreateEditCategoryMutation } from "../../../features/api masterlist/category_api/categoryApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  category_Description: yup.string().required("Category is required."),
});

export const CategoryDialog = ({ data, open, onClose }) => {
  const [createEditCategory] = useCreateEditCategoryMutation();

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
      category_Description: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("category_Description", data?.category_Description);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    console.log("Form Data: ", formData);

    if (formData.id) {
      createEditCategory(formData)
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
      createEditCategory(formData)
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
  console.log(watch("id"));
  console.log(watch("category_Description"));

  console.log("Error: ", errors);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth open={open}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
          }}
        >
          {data ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 1.5 }}>
              <FormLabel
                sx={{
                  color: theme.palette.text.main,
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "1.4375em",
                }}
              >
                Category name *
              </FormLabel>
              <TextField
                {...register("category_Description")}
                variant="outlined"
                helperText={errors?.category_Description?.message}
                error={!!errors?.category_Description?.message}
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
              disabled={!watch("category_Description")}
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
