import { Box, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, FormLabel, Stack, TextField, Typography } from "@mui/material";
import { ManageAccountsRounded } from "@mui/icons-material";

import * as yup from "yup";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { theme } from "../../../theme/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { formStyle as sx } from "../../Tickets/IssueHandlerConcerns/style/formStyle";

import { useCreateRoleMutation, useUpdateRoleNameMutation, useUpdateRolePermissionMutation } from "../../../features/user_management_api/role/roleApi";

const schema = yup.object().shape({
  user_Role_Name: yup.string().required("Role Name is required."),
  permissions: yup.array().required(),
});

const parentCheckbox = ["Overview", "User Management", "Masterlist", "Requestor", "Receiver", "Approver", "Ticketing", "Reports"];
const userManagementCheckbox = ["User Account", "User Role"];
const masterlistCheckbox = ["One Charging", "Service Provider", "Channel Setup", "Category", "Sub Category", "Concern Category", "Receiver Setup", "Approver Setup"];
const requestCheckbox = ["Requestor Concerns"];
const receiverCheckbox = ["Receiver Concerns"];
const approverCheckbox = ["Approval", "View Tickets"];
const ticketingCheckbox = ["Tickets"];

const RoleAddDialog = ({ data, open, onClose }) => {
  const [createRole, { isLoading: createRoleIsLoading, isFetching: createRoleIsFetching }] = useCreateRoleMutation();
  const [updateRoleName, { isLoading: updateRoleNameIsLoading, isFetching: updateRoleNameIsFetching }] = useUpdateRoleNameMutation();
  const [updateRolePermission, { isLoading: updateRolePermissionIsLoading, isFetching: updateRolePermissionIsFetching }] = useUpdateRolePermissionMutation();

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
      user_Role_Name: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (data) {
      setValue("user_Role_Name", data?.user_Role_Name);
      setValue("permissions", data?.permissions);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
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
        if (data) {
          // Role API
          if (formData.user_Role_Name !== data.user_Role_Name) {
            updateRoleName({
              id: data.id,
              user_Role_Name: formData.user_Role_Name,
            })
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Role updated successfully!",
                });
                onClose();
              })
              .catch((err) => {
                toast.error("Error", {
                  description: err.data.error.message,
                });
              });
          }

          // Role Permission API
          const isPermissionMatch = formData.permissions.every((item) => data.permissions.includes(item)) && formData.permissions.length === data.permissions.length;
          if (!isPermissionMatch) {
            updateRolePermission({
              id: data.id,
              permissions: formData.permissions,
            })
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Role updated successfully!",
                  duration: 1500,
                });
                onClose();
              })
              .catch((error) => {
                toast.error("Error!", {
                  description: error.data.error.message,
                  duration: 1500,
                });
              });
          }

          if (formData.user_Role_Name === data.user_Role_Name && isPermissionMatch) {
            updateRolePermission({
              id: data.id,
              permissions: formData.permissions,
            })
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Nothing has changed.",
                  duration: 1500,
                });
                onClose();
              })
              .catch((error) => {
                toast.error("Error!", {
                  description: error.data.error.message,
                  duration: 1500,
                });
              });
          }
        } else {
          createRole(formData)
            .unwrap()
            .then(() => {
              toast.success("Success!", {
                description: "Role added successfully!",
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
        }
      }
    });
  };

  const handleParentCheckboxChange = (e) => {
    if (!e.target.checked && e.target.value === "User Management") {
      setValue(
        "permissions",
        watch("permissions").filter((item) => !userManagementCheckbox.includes(item)),
      );
    }
    if (!e.target.checked && e.target.value === "Masterlist") {
      setValue(
        "permissions",
        watch("permissions").filter((item) => !masterlistCheckbox.includes(item)),
      );
    }
    if (!e.target.checked && e.target.value === "Requestor") {
      setValue(
        "permissions",
        watch("permissions").filter((item) => !requestCheckbox.includes(item)),
      );
    }
    if (!e.target.checked && e.target.value === "Receiver") {
      setValue(
        "permissions",
        watch("permissions").filter((item) => !receiverCheckbox.includes(item)),
      );
    }
    if (!e.target.checked && e.target.value === "Approver") {
      setValue(
        "permissions",
        watch("permissions").filter((item) => !approverCheckbox.includes(item)),
      );
    }
    if (!e.target.checked && e.target.value === "Ticketing") {
      setValue(
        "permissions",
        watch("permissions").filter((item) => !ticketingCheckbox.includes(item)),
      );
    }
  };

  return (
    <>
      <Dialog fullWidth open={open}>
        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center", mb: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: "#241d52", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ManageAccountsRounded sx={{ color: "#b9acff" }} />
              </Box>

              <Box sx={{ gap: 0 }}>
                <Typography sx={{ fontSize: "16px", color: theme.palette.text.main, fontWeight: 700 }}>{!data ? "Create Role" : "Update Role"}</Typography>
                <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                  {!data ? "Add a new role and assign its permissions" : "Edit role details and update its assigned permissions"}
                </Typography>
              </Box>
            </Stack>

            <Stack gap={1}>
              <Stack sx={{ padding: "5px" }}>
                <FormLabel>
                  <TextField
                    {...register("user_Role_Name")}
                    variant="outlined"
                    label="Role Name*"
                    helperText={errors?.user_Role_Name?.message}
                    error={!!errors?.user_Role_Name?.message}
                    sx={{ borderColor: "primary" }}
                    fullWidth
                    autoComplete="off"
                  />
                </FormLabel>
              </Stack>

              <Stack direction="column">
                {/* Permissions */}
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
                          name="permissions"
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
                                        onChange([...value.filter((item) => item !== e.target.value)]);
                                        handleParentCheckboxChange(e);
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

                {/* User Management */}
                {watch("permissions")?.includes("User Management") && (
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
                            name="permissions"
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
                                          onChange([...value.filter((item) => item !== e.target.value)]);
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

                {/* Masterlist */}
                {watch("permissions")?.includes("Masterlist") && (
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
                            name="permissions"
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
                                          onChange([...value.filter((item) => item !== e.target.value)]);
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

                {/* Requestor */}
                {watch("permissions")?.includes("Requestor") && (
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
                      Requestor
                    </FormLabel>

                    <FormGroup>
                      <Stack direction="row" flexWrap="wrap">
                        {requestCheckbox.map((item, index) => (
                          <Controller
                            key={index}
                            control={control}
                            name="permissions"
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
                                          onChange([...value.filter((item) => item !== e.target.value)]);
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

                {/* Receiver */}
                {watch("permissions")?.includes("Receiver") && (
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
                      Receiver
                    </FormLabel>

                    <FormGroup>
                      <Stack direction="row" flexWrap="wrap">
                        {receiverCheckbox.map((item, index) => (
                          <Controller
                            key={index}
                            control={control}
                            name="permissions"
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
                                          onChange([...value.filter((item) => item !== e.target.value)]);
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

                {/* Approver */}
                {watch("permissions")?.includes("Approver") && (
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
                      Approver
                    </FormLabel>

                    <FormGroup>
                      <Stack direction="row" flexWrap="wrap">
                        {approverCheckbox.map((item, index) => (
                          <Controller
                            key={index}
                            control={control}
                            name="permissions"
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
                                          onChange([...value.filter((item) => item !== e.target.value)]);
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

                {/* Ticketing */}
                {watch("permissions")?.includes("Ticketing") && (
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
                      Ticketing
                    </FormLabel>

                    <FormGroup>
                      <Stack direction="row" flexWrap="wrap">
                        {ticketingCheckbox.map((item, index) => (
                          <Controller
                            key={index}
                            control={control}
                            name="permissions"
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
                                          onChange([...value.filter((item) => item !== e.target.value)]);
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
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              variant="contained"
              onClick={onCloseAction}
              loading={createRoleIsLoading || createRoleIsFetching || updateRoleNameIsLoading || updateRoleNameIsFetching || updateRolePermissionIsLoading || updateRolePermissionIsFetching}
              sx={sx.cancelButton}
            >
              Cancel
            </LoadingButton>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={createRoleIsLoading || createRoleIsFetching || updateRoleNameIsLoading || updateRoleNameIsFetching || updateRolePermissionIsLoading || updateRolePermissionIsFetching}
              disabled={
                !watch("user_Role_Name") ||
                !watch("permissions").length ||
                (watch("permissions").includes("User Management") ? !watch("permissions").some((item) => userManagementCheckbox.includes(item)) : false) ||
                (watch("permissions").includes("Masterlist") ? !watch("permissions").some((item) => masterlistCheckbox.includes(item)) : false) ||
                (watch("permissions").includes("Requestor") ? !watch("permissions").some((item) => requestCheckbox.includes(item)) : false) ||
                (watch("permissions").includes("Receiver") ? !watch("permissions").some((item) => receiverCheckbox.includes(item)) : false) ||
                (watch("permissions").includes("Approver") ? !watch("permissions").some((item) => approverCheckbox.includes(item)) : false) ||
                (watch("permissions").includes("Ticketing") ? !watch("permissions").some((item) => ticketingCheckbox.includes(item)) : false)
              }
            >
              {!data ? "Add role" : "Save"}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default RoleAddDialog;
