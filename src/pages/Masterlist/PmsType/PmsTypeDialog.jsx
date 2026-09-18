import { Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useAddEditPmsTypeMutation } from "../../../features/api masterlist/pms-type/pmsTypeApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";
import { useLazyGetActiveSitesQuery } from "../../../features/api masterlist/sites/sitesApi";
import { useState } from "react";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  site: yup.object().nullable(),
  name: yup.string().required().label("PMS Type is required."),
  noOfPmsEvalutions: yup
    .string()
    .required("Total PMS evaluation is required")
    .matches(/^\d+$/, "Must be a number")
    .test("positive", "Must be a positive value", (value) => Number(value) > 0),
  lookupSource: yup.string().oneOf(["Stores", "Employees", "Farms", "Departments", "Buildings"], "Invalid Lookup Source").required("Lookup Source is required"),
});

const PmsTypeDialog = ({ data, open, onClose }) => {
  // const [lookupSource, setLookupSource] = useState(null);

  const [addEditPmsType, { isLoading }] = useAddEditPmsTypeMutation();

  const [getSite, { data: siteData, isLoading: siteIsLoading, isSuccess: siteIsSuccess }] = useLazyGetActiveSitesQuery();

  const isEditMode = Boolean(data?.id);

  // const lookupDropdownOptions = [
  //   {
  //     value: "Stores",
  //     label: "Stores",
  //   },
  //   {
  //     value: "Employees",
  //     label: "Employees",
  //   },
  //   {
  //     value: "Farms",
  //     label: "Farms",
  //   },
  //   {
  //     value: "Departments",
  //     label: "Departments",
  //   },
  //   {
  //     value: "Buildings",
  //     label: "Buildings",
  //   },
  // ];

  const lookupDropdownOptions = ["Stores", "Employees", "Farms", "Departments", "Buildings"];

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: null,
      site: null,
      name: "",
      noOfPmsEvalutions: "",
      lookupSource: "Stores",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("name", data?.name);
      setValue("noOfPmsEvalutions", data?.noOfPmsEvalutions);

      if (data?.siteId) {
        setValue("site", {
          id: data?.siteId,
          name: data?.siteName,
        });
      } else {
        setValue("site", null);
      }

      if (data?.lookupSource) {
        setValue("lookupSource", data?.lookupSource);
      } else {
        setValue("lookupSource", "");
      }
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = async (formData) => {
    const entry = isEditMode
      ? {
          id: data.id,
          name: formData.name,
          siteId: formData.site.id,
          noOfPmsEvalutions: Number(formData.noOfPmsEvalutions),
          lookupSource: formData.lookupSource,
        }
      : {
          name: formData.name,
          siteId: formData.site.id,
          noOfPmsEvalutions: Number(formData.noOfPmsEvalutions),
          lookupSource: formData.lookupSource,
        };

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

  console.log("Lookup: ", watch("lookupSource"));

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ sx: sx.dialogPaper }}>
        <Typography sx={sx.dialogTitle}>{isEditMode ? "Edit PMS Type" : "Add PMS Type"}</Typography>
        <Typography sx={sx.dialogSubtitle}>{isEditMode ? "Update the details of this PMS type." : "Create a new PMS type for scheduling."}</Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Site</Typography>
                <Controller
                  control={control}
                  name="site"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        value={value}
                        size="small"
                        options={siteData?.value?.sites || []}
                        loading={siteIsLoading}
                        renderInput={(params) => <TextField placeholder="Select Site" fullWidth {...params} sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }} />}
                        onOpen={() => {
                          if (!siteIsSuccess) getSite();
                        }}
                        onChange={(_, value) => onChange(value)}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
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

              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Total PMS Evaluations</Typography>
                <TextField
                  {...register("noOfPmsEvalutions")}
                  variant="outlined"
                  size="small"
                  placeholder="Enter number of evaluation"
                  helperText={errors?.noOfPmsEvalutions?.message}
                  error={!!errors?.noOfPmsEvalutions}
                  fullWidth
                  autoComplete="off"
                  sx={{
                    borderColor: "primary",
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                    },
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />
              </Stack>

              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Lookup Source</Typography>
                <Controller
                  name="lookupSource"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      size="small"
                      placeholder="Select lookup source"
                      sx={{
                        width: "100%",
                        fontSize: "13px",
                        "& .MuiSelect-select": {
                          color: "#fff",
                        },
                      }}
                    >
                      {lookupDropdownOptions.map((item, i) => (
                        <MenuItem key={i} value={item} sx={{ fontSize: "13px" }}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Cancel</Typography>
            </LoadingButton>
            <LoadingButton type="submit" variant="contained" loading={isLoading} loadingPosition="start" startIcon={<Save />} disabled={!watch("name")} sx={sx.disabledSaveButton}>
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Save</Typography>
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PmsTypeDialog;
