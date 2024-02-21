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
import React from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useArchiveRoleMutation } from "../../../features/role/roleApi";

const schema = yup.object().shape({
  role_name: yup.string().required("Role Name is required."),
  access_permission: yup.array().required(),
});

const parentCheckbox = [
  "User Management",
  "Masterlist",
  "Request",
  "Channel",
  "Filing",
  "Generate",
];
const userManagementCheckbox = ["User Account", "User Role"];
const masterlistCheckbox = [
  "Company",
  "Business Unit",
  "Department",
  "Unit",
  "Sub Unit",
  "Location",
];

const RoleAddDialog = ({ open, onClose }) => {
  const [archiveRole] = useArchiveRoleMutation();

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
      access_permission: [],
    },
  });

  // console.log("Errors: ", errors);
  console.log("Role: ", watch("role_name"));
  console.log(watch("access_permission"));

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (data) => {
    Swal.fire({
      title: "Information",
      text: "Are you sure you want to save this role information?",
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
        archiveRole(data)
          .unwrap()
          .then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Role added successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch(() => {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Submit role failed.",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  return (
    <>
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
          Add Role
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px" }}>
              <FormLabel>
                <TextField
                  {...register("role_name")}
                  variant="outlined"
                  label="Role Name*"
                  helperText={errors?.role_name?.message}
                  error={!!errors?.role_name?.message}
                  sx={{ borderColor: "primary" }}
                  fullWidth
                  autoComplete="off"
                />
              </FormLabel>
            </Stack>

            <Stack direction="column">
              {/* PERMISSIONS */}
              <FormControl
                component="fieldset"
                variant="standard"
                sx={{
                  border: "1px solid #2D3748",
                  borderRadius: "10px",
                  padding: 2,
                }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    padding: "0 20px",
                  }}
                >
                  Permissions
                </FormLabel>

                <FormGroup>
                  <Stack direction="row" flexWrap="wrap">
                    {parentCheckbox.map((item, index) => (
                      <Controller
                        key={index}
                        control={control}
                        name="access_permission"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <FormControlLabel
                              sx={{
                                flex: 1,
                                flexBasis: "40%",
                              }}
                              control={
                                <Checkbox
                                  ref={ref}
                                  value={item}
                                  checked={value?.includes(item)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      onChange([...value, e.target.value]);
                                    } else {
                                      onChange([
                                        ...value.filter(
                                          (item) => item !== e.target.value
                                        ),
                                      ]);
                                    }
                                  }}
                                />
                              }
                              label={item}
                            />
                          );
                        }}
                      />
                    ))}
                  </Stack>
                </FormGroup>
              </FormControl>

              {/* USER MANAGEMENT */}
              {watch("access_permission")?.includes("User Management") && (
                <FormControl
                  component="fieldset"
                  variant="standard"
                  sx={{
                    border: "1px solid #2D3748",
                    borderRadius: "10px",
                    padding: 2,
                  }}
                >
                  <FormLabel
                    component="legend"
                    sx={{
                      padding: "0 20px",
                    }}
                  >
                    User Management
                  </FormLabel>

                  <FormGroup>
                    <Stack direction="row" flexWrap="wrap">
                      {userManagementCheckbox.map((item, index) => (
                        <Controller
                          key={index}
                          control={control}
                          name="access_permission"
                          render={({ field: { ref, value, onChange } }) => {
                            return (
                              <FormControlLabel
                                sx={{
                                  flex: 1,
                                  flexBasis: "40%",
                                }}
                                control={
                                  <Checkbox
                                    ref={ref}
                                    value={item}
                                    checked={value?.includes(item)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        onChange([...value, e.target.value]);
                                      } else {
                                        onChange([
                                          ...value.filter(
                                            (item) => item !== e.target.value
                                          ),
                                        ]);
                                      }
                                    }}
                                  />
                                }
                                label={item}
                              />
                            );
                          }}
                        />
                      ))}
                    </Stack>
                  </FormGroup>
                </FormControl>
              )}

              {/* MASTERLIST */}
              {watch("access_permission")?.includes("Masterlist") && (
                <FormControl
                  component="fieldset"
                  variant="standard"
                  sx={{
                    border: "1px solid #2D3748",
                    borderRadius: "10px",
                    padding: 2,
                  }}
                >
                  <FormLabel
                    component="legend"
                    sx={{
                      padding: "0 20px",
                    }}
                  >
                    Masterlist
                  </FormLabel>

                  <FormGroup>
                    <Stack direction="row" flexWrap="wrap">
                      {masterlistCheckbox.map((item, index) => (
                        <Controller
                          key={index}
                          control={control}
                          name="access_permission"
                          render={({ field: { ref, value, onChange } }) => {
                            return (
                              <FormControlLabel
                                sx={{
                                  flex: 1,
                                  flexBasis: "40%",
                                }}
                                control={
                                  <Checkbox
                                    ref={ref}
                                    value={item}
                                    checked={value?.includes(item)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        onChange([...value, e.target.value]);
                                      } else {
                                        onChange([
                                          ...value.filter(
                                            (item) => item !== e.target.value
                                          ),
                                        ]);
                                      }
                                    }}
                                  />
                                }
                                label={item}
                              />
                            );
                          }}
                        />
                      ))}
                    </Stack>
                  </FormGroup>
                </FormControl>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button type="submit" variant="contained">
              Save
            </Button>
            <Button variant="outlined" onClick={onCloseAction}>
              Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default RoleAddDialog;
