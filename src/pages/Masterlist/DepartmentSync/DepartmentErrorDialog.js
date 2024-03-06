import {
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
import React from "react";
import { theme } from "../../../theme/theme";
import { GppBadOutlined } from "@mui/icons-material";

export const DepartmentErrorDialog = ({ errorData, open, onClose }) => {
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
                Unsuccessful sync of department due to the following error(s):
              </Typography>
            </Stack>

            <Stack sx={{ paddingTop: 5 }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
                Business unit information does not exist:{" "}
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
                    {errorData?.data?.value?.businessUnitNotExist?.map(
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
                            {item.department_Code}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "12px",
                            }}
                          >
                            {item.department_Name}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: theme.palette.error.main,
                              fontSize: "12px",
                            }}
                          >
                            {item.businessUnit_Name}
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
