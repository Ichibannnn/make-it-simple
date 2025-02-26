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
import { ExpandMore, GppBadOutlined, SyncOutlined } from "@mui/icons-material";
import { useSyncSubUnitMutation } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import Swal from "sweetalert2";

export const SubUnitErrorDialog = ({ errorData, open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncSubUnits, { isLoading: isSubUnitSyncLoading, isFetching: isSubUnitSyncFetching }] = useSyncSubUnitMutation();

  const availableSyncData = errorData?.data?.value?.availableSync?.map((item) => {
    return {
      subUnit_No: item.subUnit_No,
      subUnit_Code: item.subUnit_Code,
      subUnit_Name: item.subUnit_Name,
      unit_Name: item.unit_Name,
    };
  });

  const unitNotExistData = errorData?.data?.value?.unitNotExist?.map((item) => {
    return {
      subUnit_No: item.subUnit_No,
      subUnit_Code: item.subUnit_Code,
      subUnit_Name: item.subUnit_Name,
      unit_Name: item.unit_Name,
    };
  });

  const availableSyncHandler = () => {
    Swal.fire({
      title: "Confirmation?",
      text: "Are you sure you want to sync the sub units list?",
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
          subUnit_No: item.subUnit_No,
          subUnit_Code: item.subUnit_Code,
          subUnit_Name: item.subUnit_Name,
          unit_Name: item.unit_Name,
        }));

        console.log("Available: ", available);

        syncSubUnits({
          syncSubUnitsResults: available,
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
              description: "Sub Units sync failed",
            });
          });
      }
    });
  };

  const onCloseAction = () => {
    onClose();
  };

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
                Unsuccessful sync of sub unit due to the following error(s):
              </Typography>
            </Stack>

            {/* AVAILABLE FOR SYNCING */}
            <Stack sx={{ paddingTop: 5 }}>
              {availableSyncData?.length > 0 && (
                <Accordion sx={{ background: "#1A222F" }}>
                  <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
                    <Stack direction="row" gap={0.5} sx={{ width: "100%", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "14px", fontWeight: 500, color: theme.palette.success.main }}>Avalable Sub Unit for syncing: </Typography>
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
                                SUB UNIT CODE
                              </TableCell>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                SUB UNIT NAME
                              </TableCell>

                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                UNIT NAME
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {availableSyncData?.map((item, index) => (
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
                                  {item.subUnit_Code}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: theme.palette.success.main,
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.subUnit_Name}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.unit_Name}
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
                        loading={isLoading || isSubUnitSyncLoading || isSubUnitSyncFetching}
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
                        Sync Units
                      </LoadingButton>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              )}
            </Stack>

            {/* UNIT DOES NOT EXIST */}
            <Stack>
              {unitNotExistData?.length > 0 && (
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
                                SUB UNIT CODE
                              </TableCell>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                SUB UNIT NAME
                              </TableCell>

                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                UNIT NAME
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {unitNotExistData?.map((item, index) => (
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
                                  {item.subUnit_Code}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: theme.palette.error.main,
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.subUnit_Name}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.unit_Name}
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
