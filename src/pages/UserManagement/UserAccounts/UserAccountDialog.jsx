import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useLazyGetEmployeesQuery } from "../../../features/sedar/sedarApi";
import { useLazyGetRolesQuery } from "../../../features/user_management_api/role/roleApi";
import { useLazyGetCompanyQuery } from "../../../features/api masterlist/company/companyApi";
import { useLazyGetBusinessUnitQuery } from "../../../features/api masterlist/business-unit/businessUnitApi";
import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetUnitQuery } from "../../../features/api masterlist/unit/unitApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetLocationQuery } from "../../../features/api masterlist/location/locationApi";
import { useCreateUserMutation } from "../../../features/user_management_api/user/userApi";
import Swal from "sweetalert2";
import { Toaster, toast } from "sonner";

const schema = yup.object().shape({
  empId: yup.object().required().label("Employee ID"),
  fullname: yup.string().required().label("Fullname"),
  username: yup.string().required().label("Username"),
  userRoleId: yup.object().required().label("Role"),
  companyId: yup.object().required().label("Company"),
  businessUnitId: yup.object().required().label("Business Unit"),
  departmentId: yup.object().required().label("Department "),
  unitId: yup.object().required().label("Unit "),
  subUnitId: yup.object().required().label("Sub-Unit "),
  locationId: yup.object().required().label("Location"),
});

const UserAccountDialog = ({ data, open, onClose }) => {
  const [createUser] = useCreateUserMutation();

  const [
    getEmployees,
    {
      data: employeeData = [],
      isLoading: emloyeeIsLoading,
      isSuccess: employeeIsSuccess,
    },
  ] = useLazyGetEmployeesQuery();

  const [
    getRoles,
    { data: roleData, isLoading: roleIsLoading, isSuccess: roleIsSuccess },
  ] = useLazyGetRolesQuery();

  const [
    getCompany,
    {
      data: companyData,
      isLoading: companyIsLoading,
      isSuccess: companyIsSuccess,
    },
  ] = useLazyGetCompanyQuery();

  const [
    getBusinessUnit,
    {
      data: businessUnitData,
      isLoading: businessUnitIsLoading,
      isSuccess: businessUnitIsSuccess,
    },
  ] = useLazyGetBusinessUnitQuery();

  const [
    getDepartment,
    {
      data: departmentData,
      isLoading: departmentIsLoading,
      isSuccess: departmentIsSuccess,
    },
  ] = useLazyGetDepartmentQuery();

  const [
    getUnit,
    { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess },
  ] = useLazyGetUnitQuery();

  const [
    getSubUnit,
    {
      data: subUnitData,
      isLoading: subUnitIsLoading,
      isSuccess: subUnitIsSuccess,
    },
  ] = useLazyGetSubUnitQuery();

  const [
    getLocation,
    {
      data: locationData,
      isLoading: locationIsLoading,
      isSuccess: locationIsSuccess,
    },
  ] = useLazyGetLocationQuery();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      empId: null,
      fullname: "",
      username: "",
      userRoleId: null,
      companyId: null,
      businessUnitId: null,
      departmentId: null,
      unitId: null,
      subUnitId: null,
      locationId: null,
    },
  });

  useEffect(() => {
    if (data) {
      if (employeeIsSuccess) getEmployees();
      // getOptionLabel={(option) =>
      //   `${option.department_Code} - ${option.department_Name}`
      // }
      // isOptionEqualToValue={(option, value) =>
      //   option.id === value.id
      // }

      setValue("empId", {
        general_info: {
          full_id_number: data?.empId,
        },
      });
      setValue("fullname", data?.fullname);
      setValue("username", data?.username);
      setValue("userRoleId", {
        id: data?.userRoleId,
        user_Role_Name: data?.user_Role_Name,
      });
      setValue("companyId", {
        id: data?.companyId,
        company_Code: data?.company_Code,
        company_Name: data?.company_Name,
      });
      setValue("businessUnitId", {
        id: data?.businessUnitId,
        business_Code: data?.businessUnit_Code,
        business_Name: data?.businessUnit_Name,
      });
      setValue("businessUnitId", {
        id: data?.businessUnitId,
        business_Code: data?.businessUnit_Code,
        business_Name: data?.businessUnit_Name,
      });
      setValue("departmentId", {
        id: data?.departmentId,
        department_Code: data?.department_Code,
        department_Name: data?.department_Name,
      });
      setValue("unitId", {
        id: data?.unitId,
        unit_Code: data?.unit_Code,
        unit_Name: data?.unit_Name,
      });
      setValue("subUnitId", {
        id: data?.subUnitId,
        subUnit_Code: data?.subUnit_Code,
        subUnit_Name: data?.subUnit_Name,
      });
      setValue("locationId", {
        id: data?.locationId,
        location_Code: data?.location_Code,
        location_Name: data?.location_Name,
      });
    }
  }, [data]);

  // console.log("Data: ", data);
  // console.log("Employee Data: ", employeeData);

  // console.log("Employee Id: ", watch("empId"));

  const onSubmitHandler = (formData) => {
    console.log("formData: ", formData.locationId.subUnits[0].locationId);

    const submitUser = {
      empId: formData.empId.general_info.full_id_number,
      fullname: formData.empId.general_info.full_name,
      username: formData.username,
      userRoleId: formData.userRoleId.id,
      departmentId: formData.departmentId.id,
      subUnitId: formData.subUnitId.id,
      unitId: formData.unitId.id,
      companyId: formData.companyId.id,
      locationId: formData.locationId.id,
      businessUnitId: formData.businessUnitId.id,
    };

    Swal.fire({
      title: "Information",
      text: "Are you sure you want to add this user?",
      icon: "info",
      color: "white",
      showCancelButton: true,
      background: "#111927",
      confirmButtonColor: "#9e77ed",
      cancelButtonColor: "#1C2536",
      heightAuto: false,
      width: "30em",
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Submit: ", submitUser);
        createUser(submitUser)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "User added successfully!",
            });
            reset();
            onClose();
          })
          .catch((error) => {
            console.log("Error : ", error);
            toast.error("Error!", {
              description: error.data.error.message,
            });
          });
      }
    });
  };

  const onCloseHandler = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <Toaster richColors position="top-right" closeButton />
        <DialogTitle sx={{ paddingTop: 0, paddingBottom: 0 }}>
          Create User Account
        </DialogTitle>

        <DialogContent>
          <Stack
            id="user"
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            gap={2}
            paddingTop={3}
          >
            <Typography
              sx={{
                color: "#48BB78",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Basic Information
            </Typography>

            <Stack direction="row" gap={1}>
              <Controller
                control={control}
                name="empId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      size="small"
                      value={value}
                      options={employeeData}
                      loading={emloyeeIsLoading}
                      renderInput={(params) => (
                        <TextField {...params} label="Employee ID" />
                      )}
                      onOpen={() => {
                        if (!employeeIsSuccess) getEmployees();
                      }}
                      onChange={(_, value) => {
                        setValue("fullname", value?.general_info.full_name);
                        setValue(
                          "username",
                          value?.general_info.first_name
                            .split(" ")
                            .map((item) => item.at(0))
                            .join("")
                            .toLowerCase() +
                            value?.general_info.last_name.toLowerCase()
                        );

                        onChange(value);
                      }}
                      getOptionLabel={(option) =>
                        option.general_info.full_id_number
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.general_info.full_id_number ===
                        value.general_info.full_id_number
                      }
                      sx={{
                        flex: 1,
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
                name="fullname"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      size="small"
                      value={value}
                      label="Fullname"
                      onChange={onChange}
                      inputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        flex: 2,
                      }}
                      fullWidth
                    />
                  );
                }}
              />
            </Stack>

            <Controller
              control={control}
              name="username"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <TextField
                    inputRef={ref}
                    size="small"
                    value={value}
                    label="Username"
                    onChange={onChange}
                    fullWidth
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="userRoleId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={roleData?.value?.userRole || []}
                    loading={roleIsLoading}
                    renderInput={(params) => (
                      <TextField {...params} label="Role" />
                    )}
                    onOpen={() => {
                      if (!roleIsSuccess)
                        getRoles({
                          Status: true,
                        });
                    }}
                    onChange={(_, value) => onChange(value)}
                    getOptionLabel={(option) => option.user_Role_Name}
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

            <Divider
              variant="fullWidth"
              sx={{ background: "#2D3748", marginTop: 3, marginBottom: 3 }}
            />

            <Typography
              sx={{
                color: "#48BB78",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Other Information
            </Typography>

            <Controller
              control={control}
              name="companyId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={companyData?.value?.company || []}
                    loading={companyIsLoading}
                    renderInput={(params) => (
                      <TextField {...params} label="Company" />
                    )}
                    onOpen={() => {
                      if (!companyIsSuccess) getCompany();
                    }}
                    onChange={(_, value) => {
                      onChange(value);

                      setValue("businessUnitId", null);
                      setValue("departmentId", null);
                      setValue("unitId", null);
                      setValue("subUnitId", null);
                      setValue("locationId", null);

                      getBusinessUnit();
                    }}
                    getOptionLabel={(option) =>
                      `${option.company_Code} - ${option.company_Name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
              name="businessUnitId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={
                      businessUnitData?.value?.businessUnit.filter(
                        (item) => item.companyId === watch("companyId")?.id
                      ) || []
                    }
                    loading={businessUnitIsLoading}
                    renderInput={(params) => (
                      <TextField {...params} label="Business Unit" />
                    )}
                    onChange={(_, value) => {
                      onChange(value);

                      setValue("departmentId", null);
                      setValue("unitId", null);
                      setValue("subUnitId", null);
                      setValue("locationId", null);

                      getDepartment();
                    }}
                    getOptionLabel={(option) =>
                      `${option.business_Code} - ${option.business_Name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
              name="departmentId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={
                      departmentData?.value?.department.filter(
                        (item) =>
                          item.businessUnitId === watch("businessUnitId")?.id
                      ) || []
                    }
                    loading={departmentIsLoading}
                    renderInput={(params) => (
                      <TextField {...params} label="Department" />
                    )}
                    onChange={(_, value) => {
                      onChange(value);

                      setValue("unitId", null);
                      setValue("subUnitId", null);
                      setValue("locationId", null);

                      getUnit();
                    }}
                    getOptionLabel={(option) =>
                      `${option.department_Code} - ${option.department_Name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
              name="unitId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={
                      unitData?.value?.unit.filter(
                        (item) =>
                          item.departmentId === watch("departmentId")?.id
                      ) || []
                    }
                    loading={unitIsLoading}
                    renderInput={(params) => (
                      <TextField {...params} label="Unit" />
                    )}
                    onChange={(_, value) => {
                      onChange(value);

                      setValue("subUnitId", null);
                      setValue("locationId", null);

                      getSubUnit();
                    }}
                    getOptionLabel={(option) =>
                      `${option.unit_Code} - ${option.unit_Name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
              name="subUnitId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={
                      subUnitData?.value?.subUnit.filter(
                        (item) => item.unitId === watch("unitId")?.id
                      ) || []
                    }
                    loading={subUnitIsLoading}
                    renderInput={(params) => (
                      <TextField {...params} label="Sub Unit" />
                    )}
                    onChange={(_, value) => {
                      onChange(value);

                      setValue("locationId", null);

                      getLocation();
                    }}
                    getOptionLabel={(option) =>
                      `${option.subUnit_Code} - ${option.subUnit_Name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
              name="locationId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={
                      locationData?.value?.location.filter((item) =>
                        item.subUnits.some(
                          (subUnitItem) =>
                            subUnitItem.subUnitId === watch("subUnitId")?.id
                        )
                      ) || []
                    }
                    loading={locationIsLoading}
                    renderInput={(params) => (
                      <TextField {...params} label="Location" />
                    )}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    getOptionLabel={(option) =>
                      `${option.location_Code} - ${option.location_Name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button type="submit" form="user" variant="contained">
            Save
          </Button>
          <Button onClick={onCloseHandler}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserAccountDialog;
