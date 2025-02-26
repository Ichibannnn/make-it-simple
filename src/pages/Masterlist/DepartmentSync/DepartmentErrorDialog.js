import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../../theme/theme";
import { DiscountOutlined, ExpandMore, GppBadOutlined, SyncOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";
import { useSyncDepartmentMutation } from "../../../features/api masterlist/department/departmentApi";
import { toast } from "sonner";

export const DepartmentErrorDialog = ({ errorData, open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [syncDepartments, { isLoading: isDepartmentSyncLoading, isFetching: isDepartmentSyncFetching }] = useSyncDepartmentMutation();

  const availableSyncData = errorData?.data?.value?.availableSync?.map((item) => {
    return {
      department_No: item.department_No,
      department_Code: item.department_Code,
      department_Name: item.department_Name,
      businessUnit_Name: item.businessUnit_Name,
    };
  });

  const duplicateSyncData = errorData?.data?.value?.duplicateSync?.map((item) => {
    return {
      department_No: item.department_No,
      department_Code: item.department_Code,
      department_Name: item.department_Name,
      businessUnit_Name: item.businessUnit_Name,
    };
  });

  const availableSyncHandler = () => {
    Swal.fire({
      title: "Confirmation?",
      text: "Are you sure you want to sync the department list?",
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
        const available = availableSyncData?.map((item) => ({
          department_No: item.department_No,
          department_Code: item.department_Code,
          department_Name: item.department_Name,
          businessUnit_Name: item.businessUnit_Name,
        }));

        console.log("Available: ", available);

        syncDepartments({
          departments: available,
        })
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Sync data successfully!",
            });
            onClose();
          })
          .catch((error) => {
            toast.error("Error!", {
              description: "Department sync failed",
            });
          });
      }
    });
  };

  const onCloseAction = () => {
    onClose();
  };

  console.log("availableSyncData: ", availableSyncData);

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={open} sx={{ borderRadius: "none", padding: 0 }}>
        <DialogContent sx={{ paddingBottom: 10 }}>
          <Stack direction="column" sx={{ padding: "5px", gap: 1 }}>
            <Stack>
              <Stack direction="row" gap={0.5}>
                <GppBadOutlined color="error" />
                <Typography
                  sx={{
                    fontSize: "17px",
                    fontWeight: 500,
                  }}
                >
                  Error Information
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "13px",
                }}
              >
                Unsuccessful sync of department due to the following error(s):
              </Typography>
            </Stack>

            {/* AVAILABLE FOR SYNCING */}
            <Stack sx={{ paddingTop: 5 }}>
              {availableSyncData?.length > 0 && (
                <Accordion sx={{ background: "#1A222F" }}>
                  <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
                    <Stack direction="row" gap={0.5} sx={{ width: "100%", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "14px", fontWeight: 500, color: theme.palette.success.main }}>Avalable Department for syncing: </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack sx={{ width: "100%", height: "auto", background: theme.palette.bgForm.black3 }}>
                      <TableContainer>
                        <Table size="small" sx={{ borderBottom: "none" }}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 600,
                                  fontSize: "10px",
                                }}
                                align="center"
                              >
                                LINE NO.
                              </TableCell>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                DEPARTMENT CODE
                              </TableCell>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                DEPARTMENT NAME
                              </TableCell>

                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                BUSINESS UNIT NAME
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {errorData?.data?.value?.availableSync?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                  }}
                                  align="center"
                                >
                                  {index + 1}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.department_Code}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: theme.palette.success.main,
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.department_Name}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.businessUnit_Name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>

                    <Stack direction="row" sx={{ width: "100%", justifyContent: "end", mt: 1 }}>
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        startIcon={<SyncOutlined />}
                        loadingPosition="start"
                        onClick={() => availableSyncHandler()}
                        loading={isLoading || isDepartmentSyncLoading || isDepartmentSyncFetching}
                        sx={{
                          ":disabled": {
                            backgroundColor: theme.palette.primary.main,
                            color: "black",
                          },
                          borderRadius: 0,
                          fontSize: "0.8rem", // Adjust font size
                          padding: "6px 12px", // Custom padding
                          minWidth: "120px", // Adjust width
                          height: "36px", // Set height
                        }}
                      >
                        Sync Department
                      </LoadingButton>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              )}
            </Stack>

            {/* DUPLICATED LIST */}
            <Stack>
              {duplicateSyncData?.length > 0 && (
                <Accordion sx={{ background: "#1A222F" }}>
                  <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
                    <Stack direction="row" gap={0.5} sx={{ width: "100%", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Duplicated list: </Typography>
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Stack sx={{ width: "100%", height: "auto", background: theme.palette.bgForm.black3 }}>
                      <TableContainer>
                        <Table size="small" sx={{ borderBottom: "none" }}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 600,
                                  fontSize: "10px",
                                }}
                                align="center"
                              >
                                LINE NO.
                              </TableCell>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                DEPARTMENT CODE
                              </TableCell>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                DEPARTMENT NAME
                              </TableCell>

                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                BUSINESS UNIT NAME
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {errorData?.data?.value?.duplicateSync?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                  }}
                                  align="center"
                                >
                                  {index + 1}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.department_Code}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: theme.palette.error.main,
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.department_Name}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.businessUnit_Name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              )}
            </Stack>
          </Stack>

          <Stack direction="column"></Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={onCloseAction}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
