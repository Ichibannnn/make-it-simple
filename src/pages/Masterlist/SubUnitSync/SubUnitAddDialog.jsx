import { Autocomplete, Dialog, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CloseOutlined, Save, SyncOutlined } from "@mui/icons-material";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useCreateEditSubUnitMutation } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetLocationQuery } from "../../../features/api masterlist/location/locationApi";
import { useLazyGetUnitQuery } from "../../../features/api masterlist/unit/unitApi";

const schema = yup.object().shape({
  subUnitId: yup.string().nullable(),
  unitId: yup.object().required().label("Unit"),
  subUnit_Code: yup.string().required().label("Sub Unit Code"),
  subUnit_Name: yup.string().required().label("Sub Unit Name"),
  locations: yup.object().notRequired(),
});

const SubUnitAddDialog = ({ data, setData, open, onClose }) => {
  const [createEditSubUnit, { isLoading: isSubUnitLoading, isFetching: isSubUnitFetching }] = useCreateEditSubUnitMutation();

  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();

  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] = useLazyGetLocationQuery();

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
      subUnitId: null,
      unitId: null,
      subUnit_Code: "",
      subUnit_Name: "",
      locations: null,
    },
  });

  const onSubmitSubUnitForm = (formData) => {
    console.log("Formdata:", formData);
    if (!data) {
      const addPayload = {
        unitCode: formData.unitId.unit_Code,
        subUnit_Code: formData.subUnit_Code,
        subUnit_Name: formData.subUnit_Name,
        location_Code: formData?.locations?.location_Code,
      };

      console.log("addPayload: ", addPayload);

      createEditSubUnit(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Added sub unit successfully!",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    } else {
      const editPayload = {
        subUnitId: data.id,
        unitId: data.unitId,
        subUnit_Code: formData.subUnit_Code,
        subUnit_Name: formData.subUnit_Name,
      };

      console.log("Edit Payload: ", editPayload);

      createEditSubUnit(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated successfully!",
            duration: 1500,
          });
          reset();
          setData(null);
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

  const onCloseAction = () => {
    reset();
    setData(null);
    onClose();
  };

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("unitId", {
        unitId: data?.unitId,
        unit_Code: data?.unit_Code,
        unit_Name: data?.unit_Name,
      });
      setValue("subUnit_Code", data?.subUnit_Code);
      setValue("subUnit_Name", data?.subUnit_Name);
    }
  }, [data]);

  //   console.log("Unit: ", unitData);
  //   console.log("Unit: ", watch("unitId"));
  //   console.log("Sub Code: ", watch("subUnit_Code"));
  //   console.log("Sub Unit Name: ", watch("subUnit_Name"));
  // console.log("Location: ", watch("locations"));

  // console.log("Validation Error: ", errors);
  // console.log("Data: ", data);

  return (
    <div>
      <Dialog fullWidth maxWidth="sm" open={open} PaperProps={{ style: { overflow: "unset" } }}>
        <IconButton
          aria-label="close"
          onClick={onCloseAction}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseOutlined />
        </IconButton>

        <DialogContent>
          <Stack direction="column" sx={{ padding: "5px" }}>
            <Stack>
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#48BB78",
                  }}
                >
                  Sub Unit Form
                </Typography>
              </Stack>

              <form onSubmit={handleSubmit(onSubmitSubUnitForm)}>
                <Stack sx={{ marginTop: 3, padding: "5px", gap: 1.5 }}>
                  <Controller
                    control={control}
                    name="unitId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          ref={ref}
                          size="small"
                          value={value}
                          options={unitData?.value?.unit || []}
                          loading={unitIsLoading}
                          renderInput={(params) => <TextField {...params} label="Unit" />}
                          onOpen={() => {
                            if (!unitIsSuccess) getUnit();
                          }}
                          onChange={(_, value) => {
                            onChange(value);
                          }}
                          getOptionLabel={(option) => `${option.unit_Code} - ${option.unit_Name}`}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          sx={{
                            flex: 2,
                          }}
                          fullWidth
                          disablePortal
                          disableClearable
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name="subUnit_Code"
                    render={({ field: { ref, value, onChange } }) => {
                      return <TextField inputRef={ref} size="small" value={value} label="Sub Unit Code" onChange={onChange} fullWidth autoComplete="off" />;
                    }}
                  />

                  <Controller
                    control={control}
                    name="subUnit_Name"
                    render={({ field: { ref, value, onChange } }) => {
                      return <TextField inputRef={ref} size="small" value={value} label="Sub Unit Name" onChange={onChange} fullWidth autoComplete="off" />;
                    }}
                  />

                  {!data ? (
                    <Controller
                      control={control}
                      name="locations"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            // multiple
                            ref={ref}
                            size="small"
                            value={value}
                            options={locationData?.value?.location || []}
                            loading={locationIsLoading}
                            renderInput={(params) => <TextField {...params} label="Location" />}
                            onOpen={() => {
                              if (!locationIsSuccess) getLocation();
                            }}
                            onChange={(_, value) => {
                              onChange(value);
                            }}
                            getOptionLabel={(option) => `${option.location_Code} - ${option.location_Name}`}
                            isOptionEqualToValue={(option, value) => option.location_Code === value.location_Code}
                            sx={{
                              flex: 2,
                            }}
                            fullWidth
                            disablePortal
                            //   disableClearable
                          />
                        );
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Stack>

                <Stack direction="row" justifyContent="right" marginTop={3} gap={1}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    loadingPosition="start"
                    loading={isSubUnitLoading || isSubUnitFetching}
                    disabled={!watch("unitId") || !watch("subUnit_Code") || !watch("subUnit_Name") || (!data ? !watch("locations") : false)}
                    sx={{
                      ":disabled": {
                        backgroundColor: theme.palette.secondary.main,
                        color: "black",
                      },
                    }}
                    size="small"
                  >
                    Save
                  </LoadingButton>

                  <LoadingButton variant="outlined" onClick={onCloseAction} size="small">
                    Close
                  </LoadingButton>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubUnitAddDialog;
