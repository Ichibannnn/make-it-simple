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
import React from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useLazyGetEmployeesQuery } from "../../../features/sedar/sedarApi";
import { useLazyGetRolesQuery } from "../../../features/user_management_api/role/roleApi";

const schema = yup.object().shape({
  empId: yup.string().required().label("Employee ID"),
  fullname: yup.string().required().label("Fullname"),
  username: yup.string().required().label("Username"),
  userRoleId: yup.object().required().label("Role"),
  // companyId: yup.number().required().label("Company"),
  // businessUnitId: yup.number().required().label("Business Unit"),
  departmentId: yup.number().required().label("Department "),
  // locationId: yup.number().required().label("Location"),
  subUnitId: yup.number().required().label("Sub-Unit "),
});

const UserAccountDialog = ({ open, onClose }) => {
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
      departmentId: null,
      subUnitId: null,
    },
  });

  const onSubmitHandler = (data) => {
    // console.log("Data: ", data);
  };

  const onCloseHandler = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        // onClose={handleClose}
      >
        <DialogTitle sx={{ paddingTop: 0, paddingBottom: 0 }}>
          Create User Account
        </DialogTitle>

        <DialogContent>
          <Stack
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

            <Autocomplete
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} label="Company" />
              )}
              sx={{
                flex: 1,
              }}
              fullWidth
              disablePortal
            />

            <Autocomplete
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} label="Business Unit" />
              )}
              sx={{
                flex: 1,
              }}
              fullWidth
              disablePortal
            />

            <Autocomplete
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} label="Department" />
              )}
              sx={{
                flex: 1,
              }}
              fullWidth
              disablePortal
            />

            <Autocomplete
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} label="Sub-Unit" />
              )}
              sx={{
                flex: 1,
              }}
              fullWidth
              disablePortal
            />

            <Autocomplete
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} label="Location" />
              )}
              sx={{
                flex: 1,
              }}
              fullWidth
              disablePortal
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="contained">Save</Button>
          <Button onClick={onCloseHandler}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserAccountDialog;
