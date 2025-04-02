import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { theme } from "../../../theme/theme";
import { ExpandMore, GppBadOutlined, LanOutlined, SyncOutlined } from "@mui/icons-material";
import useDisclosure from "../../../hooks/useDisclosure";
import { useSyncLocationMutation } from "../../../features/api masterlist/location/locationApi";
import { LoadingButton } from "@mui/lab";

export const LocationErrorDialog = ({ errorData, open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncLocations, { isLoading: isLocationSyncLoading, isFetching: isLocationSyncFetching }] = useSyncLocationMutation();

  const availableSyncData = errorData?.data?.value?.availableSync?.map((item) => {
    return {
      location_No: item.location_No,
      location_Code: item.location_Code,
      location_Name: item.location_Name,
      upsertSubunitLists: item.upsertSubunitLists?.map((subUnit) => ({
        subUnit_Name: subUnit.subUnit_Name,
      })),
    };
  });

  const availableSyncHandler = () => {
    console.log("availableSyncData: ", availableSyncData);
  };

  const onCloseAction = () => {
    onClose();
  };

  console.log("ErrorData: ", errorData);

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={open} sx={{ borderRadius: "none", padding: 0 }}>
        <DialogContent sx={{ paddingBottom: 10 }}>
          <Stack direction="column" sx={{ padding: "5px" }}>
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
                Unsuccessful sync of location due to the following error(s):
              </Typography>
            </Stack>

            {/* AVAILABLE FOR SYNCING */}
            <Stack sx={{ paddingTop: 5 }}>
              {availableSyncData?.length > 0 && (
                <Accordion sx={{ background: "#1A222F" }}>
                  <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
                    <Stack direction="row" gap={0.5} sx={{ width: "100%", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "14px", fontWeight: 500, color: theme.palette.success.main }}>Avalable location for syncing: </Typography>
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
                                LOCATION CODE
                              </TableCell>
                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                LOCATION NAME
                              </TableCell>

                              <TableCell
                                sx={{
                                  background: "#1C2536",
                                  color: theme.palette.text.secondary,
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                SUB UNITS
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {availableSyncData
                              ?.reduce((carry, item) => {
                                if (carry.some((carryItem) => carryItem.location_Code === item.location_Code)) return carry;

                                return [...carry, item];
                              }, [])
                              .map((item, index) => (
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
                                    {item.location_Code}
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      color: theme.palette.success.main,
                                      fontSize: "12px",
                                    }}
                                  >
                                    {item.location_Name}
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      color: "#EDF2F7",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <LocationSubUnitError subUnits={item.upsertSubunitLists} availableSyncData={availableSyncData} />
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
                        loading={isLoading || isLocationSyncLoading || isLocationSyncFetching}
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
                        Sync Location
                      </LoadingButton>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              )}
            </Stack>

            {/* UNIT DOES NOT EXIST */}
            {/* <Stack>
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
            </Stack> */}

            <Stack sx={{ paddingTop: 5 }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>Sub Unit information does not exist: </Typography>

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
                        LOCATION CODE
                      </TableCell>
                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: theme.palette.text.secondary,
                          fontWeight: 700,
                          fontSize: "10px",
                        }}
                      >
                        LOCATION NAME
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: theme.palette.text.secondary,
                          fontWeight: 700,
                          fontSize: "10px",
                        }}
                      >
                        SUB UNITS
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {errorData?.data?.value?.subUnitNotExist
                      ?.reduce((carry, item) => {
                        if (carry.some((carryItem) => carryItem.location_Code === item.location_Code)) return carry;

                        return [...carry, item];
                      }, [])
                      .map((item, index) => (
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
                            {item.location_Code}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "12px",
                            }}
                          >
                            {item.location_Name}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: theme.palette.error.main,
                              fontSize: "12px",
                            }}
                          >
                            <LocationSubUnitError subUnits={item.upsertSubunitLists} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
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

export const LocationSubUnitError = ({ subUnits, availableSyncData }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Sub units">
          <Badge badgeContent={subUnits.length} color="primary">
            <LanOutlined />
          </Badge>
        </Tooltip>
      </IconButton>

      <Menu
        anchorEl={ref.current}
        open={open}
        onClose={onToggle}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List dense>
          {subUnits?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.subUnit_Name}
                sx={{
                  color: "#EDF2F7",
                  fontSize: "12px",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Menu>
    </div>
  );
};
