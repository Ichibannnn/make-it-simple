import { Autocomplete, Box, Checkbox, Dialog, DialogActions, DialogContent, Divider, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { PersonAddAlt1Rounded } from "@mui/icons-material";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Swal from "sweetalert2";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { formStyle as sx } from "../../Tickets/IssueHandlerConcerns/style/formStyle";

import useDisclosure from "../../../hooks/useDisclosure";
import UserAccountWarningDialog from "./UserAccountWarningDialog";

import { useLazyGetOneChargingQuery } from "../../../features/api masterlist/one_charging/oneChargingApi";
import { useLazyGetEmployeesQuery } from "../../../features/sedar/sedarApi";
import { useLazyGetRolesQuery } from "../../../features/user_management_api/role/roleApi";
import { useLazyGetCompanyQuery } from "../../../features/api masterlist/company/companyApi";
import { useLazyGetBusinessUnitQuery } from "../../../features/api masterlist/business-unit/businessUnitApi";
import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetUnitQuery } from "../../../features/api masterlist/unit/unitApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetLocationWithPaginationQuery } from "../../../features/api masterlist/location/locationApi";
import { useCreateUserMutation, useUpdateUserMutation } from "../../../features/user_management_api/user/userApi";

const UserAccountDialog = ({ data, open, onClose }) => {
  const [storeCheckbox, setStoreCheckbox] = useState(false);

  const [createUser, { isLoading: isCreateUserIsLoading, isFetching: isCreateUserIsFetching }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdateUserIsLoading, isFetching: isUpdateUserIsFetching }] = useUpdateUserMutation();

  const [getEmployees, { data: employeeData = [], isLoading: emloyeeIsLoading, isSuccess: employeeIsSuccess }] = useLazyGetEmployeesQuery();
  const [getRoles, { data: roleData, isLoading: roleIsLoading, isSuccess: roleIsSuccess }] = useLazyGetRolesQuery();
  const [getOneCharging, { data: oneChargingData, isLoading: oneChargingIsLoading, isSuccess: oneChargingIsSuccess }] = useLazyGetOneChargingQuery();
  const [getCompany, { data: companyData, isLoading: companyIsLoading, isSuccess: companyIsSuccess }] = useLazyGetCompanyQuery();
  const [getBusinessUnit, { data: businessUnitData, isLoading: businessUnitIsLoading, isSuccess: businessUnitIsSuccess }] = useLazyGetBusinessUnitQuery();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();
  const [getSubUnit, { data: subUnitData, isLoading: subUnitIsLoading, isSuccess: subUnitIsSuccess }] = useLazyGetSubUnitQuery();
  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] = useLazyGetLocationWithPaginationQuery();

  const [warningData, setWarningData] = useState("");

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { open: warningOpen, onToggle: warningOnToggle, onClose: warningOnClose } = useDisclosure();

  const schema = useMemo(
    () =>
      yup.object().shape({
        empId: !storeCheckbox && !data?.is_Store === true ? yup.object().required().label() : yup.string().nullable(),
        fullname: yup.string().required().label("Fullname"),
        username: yup.string().required().label("Username"),
        userRoleId: yup.object().required().label("Role"),
        oneCharging: yup.object().required().label("Charging"),
        companyId: yup.object().required().label("Company"),
        businessUnitId: yup.object().required().label("Business Unit"),
        departmentId: yup.object().required().label("Department"),
        unitId: yup.object().required().label("Unit"),
        subUnitId: yup.object().required().label("Sub-Unit"),
        locationId: yup.object().required().label("Location"),
      }),
    [storeCheckbox],
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      empId: !storeCheckbox ? null : "",
      fullname: "",
      username: "",
      userRoleId: null,
      oneCharging: null,
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
      // if (employeeIsSuccess) getEmployees();
      if (!oneChargingIsSuccess) getOneCharging();
      if (!companyIsSuccess) getCompany();
      if (!businessUnitIsSuccess) getBusinessUnit();
      if (!departmentIsSuccess) getDepartment();
      if (!unitIsSuccess) getUnit();
      if (!subUnitIsSuccess) getSubUnit();
      if (!locationIsSuccess) getLocation();

      // setValue("empId", {
      //   general_info: {
      //     full_id_number: data?.empId,id:
      //   },
      // });

      if (data?.is_Store === true) {
        setStoreCheckbox(true);
      }

      if (data && data.is_Store !== true) {
        setValue("empId", {
          general_info: {
            full_id_number: data.empId,
          },
        });
      } else if (data && data.is_Store === true) {
        setValue("empId", data.empId);
      } else {
        setValue("empId", "");
      }

      setValue("fullname", data?.fullname);
      setValue("username", data?.username);
      setValue("userRoleId", {
        id: data?.userRoleId,
        user_Role_Name: data?.user_Role_Name,
      });

      if (data?.oneChargingCode === null) {
        setValue("oneCharging", null);
        setValue("companyId", null);
        setValue("businessUnitId", null);
        setValue("departmentId", null);
        setValue("unitId", null);
        setValue("subUnitId", null);
        setValue("locationId", null);
      } else {
        setValue("oneCharging", {
          code: data?.oneChargingCode,
          name: data?.oneChargingName,
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
          location_Code: data?.location_Code,
          location_Name: data?.location_Name,
        });
      }
    }
  }, [data, companyIsLoading, businessUnitIsLoading, departmentIsLoading, unitIsLoading, subUnitIsLoading, locationIsLoading]);

  const onSubmitHandler = (formData) => {
    console.log("FormData:", formData);

    if (data?.is_Use === true && data?.user_Role_Name !== formData.userRoleId.user_Role_Name) {
      setWarningData({
        id: data.id,
        userRoleId: formData.userRoleId.id,
        user_Role_Name: formData.userRoleId.user_Role_Name,
        username: formData.username,
        oneChargingCode: formData.oneCharging.code,
        oneChargingName: formData.oneCharging.name,
        companyId: formData.companyId.id,
        businessUnitId: formData.businessUnitId.id,
        departmentId: formData.departmentId.id,
        unitId: formData.unitId.id,
        subUnitId: formData.subUnitId.id,
        locationCode: formData.locationId.location_Code,
      });
      warningOnToggle();
    } else {
      if (data) {
        const submitUpdateUser = {
          id: data.id,
          empId: data.empId,
          fullname: data.fullname,
          userRoleId: formData.userRoleId.id,
          oneChargingCode: formData.oneCharging.code,
          oneChargingName: formData.oneCharging.name,
          username: formData.username,
          companyId: formData.companyId.id,
          businessUnitId: formData.businessUnitId.id,
          departmentId: formData.departmentId.id,
          unitId: formData.unitId.id,
          subUnitId: formData.subUnitId.id,
          locationCode: formData.locationId.location_Code,
        };

        console.log("UpdateUser: ", submitUpdateUser);

        Swal.fire({
          title: "Information",
          text: "Are you sure you want to update this user?",
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
            console.log("Update User: ", submitUpdateUser);
            updateUser(submitUpdateUser)
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "User updated successfully!",
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
      } else {
        const submitAddUser = {
          empId: !storeCheckbox ? formData.empId.general_info.full_id_number : formData.empId,
          fullname: !storeCheckbox ? formData.empId.general_info.full_name : formData.fullname,
          username: formData.username,
          userRoleId: formData.userRoleId.id,
          oneChargingCode: formData.oneCharging.code,
          oneChargingName: formData.oneCharging.name,
          companyId: formData.companyId.id,
          businessUnitId: formData.businessUnitId.id,
          departmentId: formData.departmentId.id,
          unitId: formData.unitId.id,
          subUnitId: formData.subUnitId.id,
          locationCode: formData.locationId.location_Code,
          is_Store: !storeCheckbox ? false : true,
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
            console.log("Add user: ", submitAddUser);
            createUser(submitAddUser)
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "User added successfully!",
                });
                setStoreCheckbox(false);
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
      }
    }
  };

  const onCloseHandler = () => {
    setStoreCheckbox(false);
    reset();
    onClose();
  };

  const storeCheckboxHandler = (event) => {
    setStoreCheckbox(event.target.checked);
    reset();
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open} PaperProps={{ style: { overflow: "auto" } }}>
        <DialogContent>
          <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
            <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: "#241d52", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <PersonAddAlt1Rounded sx={{ color: "#b9acff" }} />
            </Box>

            <Box sx={{ gap: 0 }}>
              <Typography sx={{ fontSize: "16px", color: theme.palette.text.main, fontWeight: 700 }}>{!data ? "Create User Account" : "Update User Account"}</Typography>
              <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                {!data ? "Add a new user and assign their charging details" : "Edit existing user information and charging details"}
              </Typography>
            </Box>
          </Stack>

          <Stack id="user" component="form" onSubmit={handleSubmit(onSubmitHandler)} gap={1.5} paddingTop={4}>
            <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
              <Typography
                sx={{
                  color: "#48BB78",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                BASIC INFORMATION
              </Typography>

              <Typography
                sx={{
                  color: "#828d9b",
                  fontSize: "11.5px",
                  fontWeight: 500,
                }}
              >
                Required
              </Typography>
            </Stack>

            {!data && (
              <Stack direction="row" gap={1} alignItems="center" sx={{ bgcolor: theme.palette.bgForm.black1, padding: 1.5, borderRadius: "10px", border: "1px solid #2b3443" }}>
                <Checkbox
                  checked={storeCheckbox || data?.is_Store === true}
                  onChange={storeCheckboxHandler}
                  size="small"
                  disabled={data ? true : false}
                  sx={{
                    padding: 0,
                  }}
                />

                <Box sx={{ gap: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: theme.palette.text.main,
                    }}
                  >
                    Create user for Store
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Check if you want to create user for Store
                  </Typography>
                </Box>
              </Stack>
            )}

            <Stack direction={isSmallScreen ? "column" : "row"} gap={1}>
              {storeCheckbox === false ? (
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
                        renderInput={(params) => <TextField {...params} label="Employee ID" />}
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
                              .toLowerCase() + value?.general_info.last_name.split(" ").join("").toLowerCase(),
                          );

                          onChange(value);
                        }}
                        getOptionLabel={(option) => option?.general_info?.full_id_number}
                        isOptionEqualToValue={(option, value) => option.general_info.full_id_number === value.general_info.full_id_number}
                        disabled={data ? true : false}
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
              ) : (
                <TextField
                  {...register("empId")}
                  helperText={errors?.fullname?.message}
                  error={!!errors?.fullname?.message}
                  size="small"
                  label="Employee ID Store"
                  sx={{ borderColor: "primary", flex: 1 }}
                  autoComplete="off"
                  disabled={data ? true : false}
                />
              )}

              {!storeCheckbox ? (
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
                        disabled={data ? true : false}
                        inputProps={{
                          readOnly: !storeCheckbox ? true : false,
                        }}
                        autoComplete="off"
                        sx={{
                          flex: 2,
                        }}
                        fullWidth
                      />
                    );
                  }}
                />
              ) : (
                <TextField
                  {...register("fullname")}
                  helperText={errors?.fullname?.message}
                  error={!!errors?.fullname?.message}
                  size="small"
                  label="Fullname"
                  sx={{ borderColor: "primary", flex: 1 }}
                  autoComplete="off"
                  disabled={data ? true : false}
                  // onChange={(e) => storeFullnameHandler(e.target.value)}
                />
              )}
            </Stack>

            {!storeCheckbox ? (
              <Controller
                control={control}
                name="username"
                render={({ field: { ref, value, onChange } }) => {
                  return <TextField inputRef={ref} size="small" value={value} label="Username" onChange={onChange} autoComplete="off" fullWidth disabled={data ? true : false} />;
                }}
              />
            ) : (
              <TextField
                {...register("username")}
                helperText={errors?.username?.message}
                error={!!errors?.username?.message}
                size="small"
                label="Username"
                sx={{ borderColor: "primary", flex: 1 }}
                autoComplete="off"
                // onChange={(e) => storeUsernameHandler(e.target.value)}
                disabled={data ? true : false}
              />
            )}

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
                    renderInput={(params) => <TextField {...params} label="Role" />}
                    onOpen={() => {
                      if (!roleIsSuccess)
                        getRoles({
                          Status: true,
                        });
                    }}
                    onChange={(_, value) => onChange(value)}
                    getOptionLabel={(option) => option.user_Role_Name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{
                      flex: 2,
                    }}
                    fullWidth
                    disablePortal
                  />
                );
              }}
            />

            <Divider variant="fullWidth" sx={{ background: "#2D3748", mt: 2, mb: 1.5 }} />

            <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
              <Typography
                sx={{
                  color: "#48BB78",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                OTHER INFORMATION
              </Typography>

              <Typography
                sx={{
                  color: "#828d9b",
                  fontSize: "11.5px",
                  fontWeight: 500,
                }}
              >
                Auto-filled from Charging
              </Typography>
            </Stack>

            <Controller
              control={control}
              name="oneCharging"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={oneChargingData?.value?.onecharging || []}
                    loading={oneChargingIsLoading}
                    renderInput={(params) => <TextField {...params} label="Charging" />}
                    onOpen={() => {
                      if (!oneChargingIsSuccess) getOneCharging();
                    }}
                    onChange={(_, value) => {
                      setValue("companyId", {
                        id: value?.companyId,
                        company_Code: value?.companyCode,
                        company_Name: value?.companyName,
                      });

                      setValue("businessUnitId", {
                        id: value?.businessUnitId,
                        business_Code: value?.businessUnitCode,
                        business_Name: value?.businessUnitName,
                      });

                      setValue("departmentId", {
                        id: value?.departmentId,
                        department_Code: value?.departmentCode,
                        department_Name: value?.deparmentName,
                      });

                      setValue("unitId", {
                        id: value?.unitId,
                        unit_Code: value?.unitCode,
                        unit_Name: value?.unitName,
                      });

                      setValue("subUnitId", {
                        id: value?.subUnitId,
                        subUnit_Code: value?.subUnitCode,
                        subUnit_Name: value?.subUnitName,
                      });

                      setValue("locationId", {
                        location_Code: value?.locationCode,
                        location_Name: value?.locationName,
                      });

                      onChange(value);
                    }}
                    getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    sx={{
                      flex: 2,
                    }}
                    fullWidth
                    disablePortal
                    disableClearable
                    // disabled
                  />
                );
              }}
            />

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
                    renderInput={(params) => <TextField {...params} label="Company" />}
                    onOpen={() => {
                      if (!companyIsSuccess) getCompany();
                    }}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    getOptionLabel={(option) => `${option.company_Code} - ${option.company_Name}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{
                      flex: 2,
                    }}
                    fullWidth
                    disabled
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
                    options={businessUnitData?.value?.businessUnit || []}
                    loading={businessUnitIsLoading}
                    renderInput={(params) => <TextField {...params} label="Business Unit" />}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    getOptionLabel={(option) => `${option.business_Code} - ${option.business_Name}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{
                      flex: 2,
                    }}
                    fullWidth
                    disabled
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
                    options={departmentData?.value?.department || []}
                    loading={departmentIsLoading}
                    renderInput={(params) => <TextField {...params} label="Department" />}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    getOptionLabel={(option) => `${option.department_Code} - ${option.department_Name}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{
                      flex: 2,
                    }}
                    fullWidth
                    disabled
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
                    options={unitData?.value?.unit || []}
                    loading={unitIsLoading}
                    renderInput={(params) => <TextField {...params} label="Unit" />}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    getOptionLabel={(option) => `${option.unit_Code} - ${option.unit_Name}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{
                      flex: 2,
                    }}
                    fullWidth
                    disabled
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
                    options={subUnitData?.value?.subUnit || []}
                    loading={subUnitIsLoading}
                    onOpen={() => {
                      if (!subUnitIsSuccess)
                        getSubUnit({
                          Status: true,
                        });
                    }}
                    renderInput={(params) => <TextField {...params} label="Sub Unit" />}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    getOptionLabel={(option) => `${option.subUnit_Code} - ${option.subUnit_Name}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{
                      flex: 2,
                    }}
                    fullWidth
                    disabled
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
                    options={locationData?.value?.location || []}
                    loading={locationIsLoading}
                    renderInput={(params) => <TextField {...params} label="Location" />}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    getOptionLabel={(option) => `${option.location_Code} - ${option.location_Name}`}
                    isOptionEqualToValue={(option, value) => option.location_Code === value.location_Code}
                    sx={{
                      flex: 2,
                    }}
                    fullWidth
                    disabled
                  />
                );
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton variant="contained" loading={isCreateUserIsLoading || isCreateUserIsFetching || isUpdateUserIsLoading || isUpdateUserIsFetching} onClick={onCloseHandler} sx={sx.cancelButton}>
            Cancel
          </LoadingButton>

          {!storeCheckbox ? (
            <LoadingButton
              type="submit"
              form="user"
              variant="contained"
              loading={isCreateUserIsLoading || isCreateUserIsFetching || isUpdateUserIsLoading || isUpdateUserIsFetching}
              disabled={
                // !watch("empId") ||
                !watch("username") ||
                !watch("userRoleId") ||
                !watch("companyId") ||
                !watch("businessUnitId") ||
                !watch("departmentId") ||
                !watch("unitId") ||
                !watch("subUnitId") ||
                !watch("locationId")
              }
            >
              {!data ? "Add user" : "Save"}
            </LoadingButton>
          ) : (
            <LoadingButton
              type="submit"
              form="user"
              variant="contained"
              loading={isCreateUserIsLoading || isCreateUserIsFetching || isUpdateUserIsLoading || isUpdateUserIsFetching}
              disabled={
                !watch("empId") ||
                !watch("fullname") ||
                !watch("username") ||
                !watch("userRoleId") ||
                !watch("companyId") ||
                !watch("businessUnitId") ||
                !watch("departmentId") ||
                !watch("unitId") ||
                !watch("subUnitId") ||
                !watch("locationId")
              }
            >
              {!data ? "Add user" : "Save"}
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>

      <UserAccountWarningDialog data={data} payload={warningData} open={warningOpen} onClose={warningOnClose} userOnClose={onCloseHandler} />
    </>
  );
};

export default UserAccountDialog;
