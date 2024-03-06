import {
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
import React, { useRef } from "react";
import { theme } from "../../../theme/theme";
import { GppBadOutlined, LanOutlined } from "@mui/icons-material";
import useDisclosure from "../../../hooks/useDisclosure";

export const LocationErrorDialog = ({ errorData, open, onClose }) => {
  const onCloseAction = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        sx={{ borderRadius: "none", padding: 0 }}
      >
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

            <Stack sx={{ paddingTop: 5 }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
                Sub Unit information does not exist:{" "}
              </Typography>

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
                    {errorData?.data?.value?.subUnitNotExist?.map(
                      (item, index) => (
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
                            <LocationSubUnitError
                              subUnits={item.upsertSubunitLists}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
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

export const LocationSubUnitError = ({ subUnits }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  console.log("Sub Units", subUnits);

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Sub units">
          <LanOutlined />
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
                  color: theme.palette.error.main,
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
