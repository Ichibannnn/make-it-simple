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
import { useEffect } from "react";
import { AddCircleOutline, EditOutlined, Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { masterlistStyles as sx } from "../styles/masterlistStyles";
import { useLazyGetOneChargingQuery } from "../../../features/api masterlist/one_charging/oneChargingApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  storeName: yup.object().required().label("Store Name"),
  region: yup.string().required().label("Region"),
  area: yup.string().required().label("Area"),
});

const StoreListDialog = ({ data, open, onClose }) => {
  //   const [
  //     createEditCategory,
  //     { isLoading: createEditCategoryIsLoading, isFetching: createEditCategoryIsFetching },
  //   ] = useCreateEditCategoryMutation();
  const [
    getOneCharging,
    { data: oneChargingData, isLoading: oneChargingIsLoading, isSuccess: oneChargingIsSuccess },
  ] = useLazyGetOneChargingQuery();

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
      oneCharging: null,
      region: "",
      area: "",
    },
  });

  //   useEffect(() => {
  //     if (data) {
  //       setValue("id", data?.id);
  //       setValue("channelId", {
  //         id: data?.channelId,
  //         channel_Name: data?.channel_Name,
  //       });
  //       setValue("category_Description", data?.category_Description);
  //     }
  //   }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    console.log("Form Data: ", formData);

    // if (formData.id) {
    //   const editPayload = {
    //     id: data.id,
    //     channelId: formData?.channelId?.id,
    //     category_Description: formData?.category_Description,
    //   };

    //   createEditCategory(editPayload)
    //     .unwrap()
    //     .then(() => {
    //       toast.success("Success!", {
    //         description: "Updated category! ",
    //         duration: 1500,
    //       });
    //       reset();
    //       onClose();
    //     })
    //     .catch((error) => {
    //       console.log("error: ", error);
    //       toast.error("Error!", {
    //         description: error.data.error.message,
    //         duration: 1500,
    //       });
    //     });
    // } else {
    //   const addPayload = {
    //     channelId: formData?.channelId?.id,
    //     category_Description: formData?.category_Description,
    //   };

    //   createEditCategory(addPayload)
    //     .unwrap()
    //     .then(() => {
    //       toast.success("Success!", {
    //         description: "Category added successsfully!",
    //         duration: 1500,
    //       });
    //       reset();
    //       onClose();
    //     })
    //     .catch((error) => {
    //       console.log("error: ", error);
    //       toast.error("Error!", {
    //         description: error.data.error.message,
    //         duration: 1500,
    //       });
    //     });
    // }
  };

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ sx: sx.dialogPaper }}>
        <Typography sx={sx.dialogTitle}>{data ? "Edit Store" : "Add Store"}</Typography>

        <Typography sx={sx.dialogSubtitle}>
          {data ? "Update the details of this store." : "Create a new store with region and area."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Store Name</Typography>
                <Controller
                  control={control}
                  name="oneCharging"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        value={value}
                        size="small"
                        options={oneChargingData?.value?.onecharging || []}
                        loading={oneChargingIsLoading}
                        renderInput={(params) => (
                          <TextField
                            placeholder="Select Store Name"
                            fullWidth
                            {...params}
                            sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }}
                          />
                        )}
                        onOpen={() => {
                          if (!oneChargingIsSuccess)
                            getOneCharging({
                              Status: true,
                            });
                        }}
                        onChange={(_, value) => {
                          setValue("region", `${value?.unitCode} - ${value?.unitName}`);
                          setValue("area", `${value?.subUnitCode} - ${value?.subUnitName}`);
                          onChange(value);
                        }}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        isOptionEqualToValue={(option, value) => option.sync_id === value.sync_id}
                        fullWidth
                        disablePortal
                        disableClearable
                        componentsProps={{
                          popper: {
                            sx: {
                              "& .MuiAutocomplete-listbox": {
                                fontSize: "14px",
                              },
                            },
                          },
                        }}
                      />
                    );
                  }}
                />
              </Stack>

              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Region</Typography>
                <TextField
                  {...register("region")}
                  size="small"
                  variant="outlined"
                  placeholder="Region"
                  helperText={errors?.region?.message}
                  error={!!errors?.region?.message}
                  fullWidth
                  autoComplete="off"
                  disabled
                  sx={{ borderColor: "primary", "& .MuiInputBase-input": { fontSize: "14px" } }}
                />
              </Stack>

              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Area</Typography>

                <TextField
                  {...register("area")}
                  size="small"
                  variant="outlined"
                  placeholder="Area"
                  helperText={errors?.area?.message}
                  error={!!errors?.area?.message}
                  fullWidth
                  autoComplete="off"
                  disabled
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
              //   loading={createEditCategoryIsLoading || createEditCategoryIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("storeName") || !watch("region") || !watch("area")}
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

export default StoreListDialog;
