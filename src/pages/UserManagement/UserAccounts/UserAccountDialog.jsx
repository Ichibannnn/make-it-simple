import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

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
import { useLazyGetLocationWithPaginationQuery } from "../../../features/api masterlist/location/locationApi";
import { useCreateUserMutation, useUpdateUserMutation } from "../../../features/user_management_api/user/userApi";
import Swal from "sweetalert2";
import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import useDisclosure from "../../../hooks/useDisclosure";
import UserAccountWarningDialog from "./UserAccountWarningDialog";

const UserAccountDialog = ({ data, open, onClose }) => {
  const [storeCheckbox, setStoreCheckbox] = useState(false);
  const [storeEmpId, setStoreEmpId] = useState(null);
  const [storeFullname, setStoreFullname] = useState(null);
  const [storeUsername, setStoreUsername] = useState(null);

  const [createUser, { isLoading: isCreateUserIsLoading, isFetching: isCreateUserIsFetching }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdateUserIsLoading, isFetching: isUpdateUserIsFetching }] = useUpdateUserMutation();

  const [getEmployees, { data: employeeData = [], isLoading: emloyeeIsLoading, isSuccess: employeeIsSuccess }] = useLazyGetEmployeesQuery();
  const [getRoles, { data: roleData, isLoading: roleIsLoading, isSuccess: roleIsSuccess }] = useLazyGetRolesQuery();
  const [getCompany, { data: companyData, isLoading: companyIsLoading, isSuccess: companyIsSuccess }] = useLazyGetCompanyQuery();
  const [getBusinessUnit, { data: businessUnitData, isLoading: businessUnitIsLoading, isSuccess: businessUnitIsSuccess }] = useLazyGetBusinessUnitQuery();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();
  const [getSubUnit, { data: subUnitData, isLoading: subUnitIsLoading, isSuccess: subUnitIsSuccess }] = useLazyGetSubUnitQuery();
  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] = useLazyGetLocationWithPaginationQuery();

  const [warningData, setWarningData] = useState("");

  const { open: warningOpen, onToggle: warningOnToggle, onClose: warningOnClose } = useDisclosure();

  const schema = useMemo(
    () =>
      yup.object().shape({
        empId: !storeCheckbox && !data?.is_Store === true ? yup.object().required().label() : yup.string().nullable(),
        fullname: yup.string().required().label("Fullname"),
        username: yup.string().required().label("Username"),
        userRoleId: yup.object().required().label("Role"),
        companyId: yup.object().required().label("Company"),
        businessUnitId: yup.object().required().label("Business Unit"),
        departmentId: yup.object().required().label("Department"),
        unitId: yup.object().required().label("Unit"),
        subUnitId: yup.object().required().label("Sub-Unit"),
        locationId: yup.object().required().label("Location"),
      }),
    [storeCheckbox]
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
        setValue("empId", data?.empId);
      } else {
        setValue("empId", "");
      }

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
  }, [data, companyIsLoading, businessUnitIsLoading, departmentIsLoading, unitIsLoading, subUnitIsLoading, locationIsLoading]);

  console.log("Data: ", data);

  const onSubmitHandler = (formData) => {
    if (data?.is_Use === true && data?.user_Role_Name !== formData.userRoleId.user_Role_Name) {
      setWarningData({
        id: data.id,
        userRoleId: formData.userRoleId.id,
        user_Role_Name: formData.userRoleId.user_Role_Name,
        username: formData.username,
        departmentId: formData.departmentId.id,
        subUnitId: formData.subUnitId.id,
        unitId: formData.unitId.id,
        companyId: formData.companyId.id,
        businessUnitId: formData.businessUnitId.id,
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
          username: formData.username,
          departmentId: formData.departmentId.id,
          subUnitId: formData.subUnitId.id,
          unitId: formData.unitId.id,
          companyId: formData.companyId.id,
          businessUnitId: formData.businessUnitId.id,
          locationCode: formData.locationId.location_Code,
        };

        console.log("Update Payload: ", submitUpdateUser);

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
          departmentId: formData.departmentId.id,
          subUnitId: formData.subUnitId.id,
          unitId: formData.unitId.id,
          companyId: formData.companyId.id,
          locationCode: formData.locationId.location_Code,
          businessUnitId: formData.businessUnitId.id,
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

  const storeEmpIdHandler = (data) => {
    setStoreEmpId(data);
  };

  const storeFullnameHandler = (data) => {
    setStoreFullname(data);
  };

  const storeUsernameHandler = (data) => {
    setStoreUsername(data);
  };

  // useEffect(() => {
  //   reset({
  //     empId: !storeCheckbox ? null : "",
  //   });
  // }, [storeCheckbox, reset]);

  // useEffect(() => {
  //   // const currentStoreValue = storeCheckbox;

  //   if (!storeCheckbox) {
  //     setValue("empId", null);
  //     setValue("fullname", "");
  //     setValue("username", "");
  //     setValue("userRoleId", null);
  //     setValue("companyId", null);
  //     setValue("businessUnitId", null);
  //     setValue("departmentId", null);
  //     setValue("unitId", null);
  //     setValue("subUnitId", null);
  //     setValue("location", null);
  //     reset();
  //   } else if (storeCheckbox) {
  //     setValue("empId", "");
  //     setValue("fullname", "");
  //     setValue("username", "");
  //     setValue("userRoleId", null);
  //     setValue("companyId", null);
  //     setValue("businessUnitId", null);
  //     setValue("departmentId", null);
  //     setValue("unitId", null);
  //     setValue("subUnitId", null);
  //     setValue("location", null);
  //     reset();
  //   }
  // }, [storeCheckbox]);

  // console.log("Errors: ", errors);
  // console.log("EmpId: ", watch("empId"));

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogTitle sx={{ paddingTop: 0, paddingBottom: 0 }}>Create User Account</DialogTitle>

        <DialogContent>
          <Stack id="user" component="form" onSubmit={handleSubmit(onSubmitHandler)} gap={2} paddingTop={3}>
            <Typography
              sx={{
                color: "#48BB78",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Basic Information
            </Typography>

            {!data && (
              <Stack direction="row" gap={0.5} alignItems="center">
                <Checkbox
                  checked={storeCheckbox || data?.is_Store === true}
                  onChange={storeCheckboxHandler}
                  size="small"
                  disabled={data ? true : false}
                  // inputProps={{ "aria-label": `select ticket ${item.closingTicketId}` }}
                  sx={{
                    padding: 0,
                  }}
                />

                <Typography sx={{ fontSize: "15px", fontStyle: "italic", color: storeCheckbox ? theme.palette.text.main : theme.palette.text.secondary }}>
                  Check if you want to create user for Store
                </Typography>
              </Stack>
            )}

            <Stack direction="row" gap={1}>
              {!storeCheckbox && !data ? (
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
                              .toLowerCase() + value?.general_info.last_name.split(" ").join("").toLowerCase()
                          );

                          onChange(value);
                        }}
                        getOptionLabel={(option) => option.general_info.full_id_number}
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
                  return <TextField inputRef={ref} size="small" value={value} label="Username" onChange={onChange} autoComplete="off" fullWidth />;
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

            <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 3, marginBottom: 3 }} />

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
                    renderInput={(params) => <TextField {...params} label="Company" />}
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
                    getOptionLabel={(option) => `${option.company_Code} - ${option.company_Name}`}
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
              name="businessUnitId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={businessUnitData?.value?.businessUnit.filter((item) => item.companyId === watch("companyId")?.id) || []}
                    loading={businessUnitIsLoading}
                    renderInput={(params) => <TextField {...params} label="Business Unit" />}
                    onChange={(_, value) => {
                      onChange(value);

                      setValue("departmentId", null);
                      setValue("unitId", null);
                      setValue("subUnitId", null);
                      setValue("locationId", null);

                      getDepartment();
                    }}
                    getOptionLabel={(option) => `${option.business_Code} - ${option.business_Name}`}
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
              name="departmentId"
              render={({ field: { ref, value, onChange } }) => {
                // console.log(watch("businessUnitId")?.id);
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={departmentData?.value?.department.filter((item) => item.businessUnitId === watch("businessUnitId")?.id) || []}
                    loading={departmentIsLoading}
                    renderInput={(params) => <TextField {...params} label="Department" />}
                    onChange={(_, value) => {
                      onChange(value);

                      setValue("unitId", null);
                      setValue("subUnitId", null);
                      setValue("locationId", null);

                      getUnit();
                    }}
                    getOptionLabel={(option) => `${option.department_Code} - ${option.department_Name}`}
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
              name="unitId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={unitData?.value?.unit.filter((item) => item.departmentId === watch("departmentId")?.id) || []}
                    loading={unitIsLoading}
                    renderInput={(params) => <TextField {...params} label="Unit" />}
                    onChange={(_, value) => {
                      onChange(value);

                      setValue("subUnitId", null);
                      setValue("locationId", null);

                      getSubUnit();
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
              name="subUnitId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={subUnitData?.value?.subUnit.filter((item) => item.unitId === watch("unitId")?.id) || []}
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

                      setValue("locationId", null);

                      getLocation();
                    }}
                    getOptionLabel={(option) => `${option.subUnit_Code} - ${option.subUnit_Name}`}
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
              name="locationId"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value}
                    options={locationData?.value?.location.filter((item) => item.subUnits.some((subUnitItem) => subUnitItem.subUnitId === watch("subUnitId")?.id)) || []}
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
                    disablePortal
                    disableClearable
                  />
                );
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
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
              Save
            </LoadingButton>
          ) : (
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
              Save
            </LoadingButton>
          )}

          <Button onClick={onCloseHandler}>Close</Button>
        </DialogActions>
      </Dialog>

      <UserAccountWarningDialog data={data} payload={warningData} open={warningOpen} onClose={warningOnClose} userOnClose={onCloseHandler} />
    </>
  );
};

export default UserAccountDialog;
