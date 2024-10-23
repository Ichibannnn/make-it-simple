import React, { useRef } from "react";
import { theme } from "../../../theme/theme";

import { Box, Button, Dialog, DialogActions, DialogContent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Print } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import rdfLogo from "../../../assets/images/RDF Logo.png";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

const PrintServiceReport = ({ data, open, onClose }) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const onCloseHandler = () => {
    onClose();
  };

  // console.log("data: ", data);

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={open}>
        <DialogContent>
          <Stack sx={{ padding: 4, backgroundColor: "#fff", width: "100%" }}>
            {/* Print Display */}
            <Stack sx={{ border: "1px solid black", padding: 2 }}>
              <Stack direction="row">
                <Stack sx={{ border: "1px solid black" }}>
                  <img src={rdfLogo} alt="RDF LOGO" style={{ height: "60px" }} />
                </Stack>

                <Stack
                  sx={{
                    justifyContent: "center",
                    borderTop: "1px solid black",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                    width: "100%",
                  }}
                >
                  <Typography align="center" sx={{ fontWeight: "bold", color: "black" }}>
                    RDF FEED, LIVESTOCK AND FOODS, INC.
                  </Typography>
                  <Typography align="center" sx={{ fontWeight: "bold", color: "black", borderTop: "1px solid black" }}>
                    SERVICE REPORT
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" sx={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
                <Stack sx={{ width: "50%" }}>
                  <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black", borderRight: "1px solid black" }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TICKET NUMBER:{"  "}</Typography>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.ticketConcernId} </Typography>
                  </Stack>

                  <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black" }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>SYSTEM:{"  "}</Typography>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.channel_Name} </Typography>
                  </Stack>
                </Stack>

                <Stack sx={{ width: "50%" }}>
                  <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black" }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>DATE NEEDED:{"  "}</Typography>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.start_Date).format("MM/DD/YYYY")} </Typography>
                  </Stack>

                  <Stack direction="row" gap={1}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>START DATE:{"  "}</Typography>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.start_Date).format("MM/DD/YYYY")} </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack direction="row" sx={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
                <Stack sx={{ width: "50%" }}>
                  <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black", borderBottom: "1px solid black" }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CATEGORY:{"  "}</Typography>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.category_Description} </Typography>
                  </Stack>

                  <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black" }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>SUB-CATEGORY:{"  "}</Typography>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.subCategory_Description} </Typography>
                  </Stack>
                </Stack>

                <Stack sx={{ width: "50%" }}>
                  <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black" }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TARGET DATE:{"  "}</Typography>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.target_Date).format("MM/DD/YYYY")} </Typography>
                  </Stack>

                  <Stack direction="row" gap={1}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CLOSED DATE:{"  "}</Typography>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.close_At).format("MM/DD/YYYY")} </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack sx={{ marginTop: 8, minHeight: "600px", gap: 4 }}>
                <Stack sx={{ width: "100%", minHeight: 170, border: "1px solid black" }}>
                  <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TICKET DESCRIPTION:{"  "}</Typography>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 2 }}>
                    <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
                      In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying
                      on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. In publishing and graphic design, Lorem ipsum is a
                      placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a
                      placeholder before the final copy is available. In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual
                      form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. In
                      publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on
                      meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.
                    </Typography>
                  </Stack>
                </Stack>

                <Stack sx={{ width: "100%", minHeight: 170, border: "1px solid black" }}>
                  <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>RESOLUTION:{"  "}</Typography>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 2 }}>
                    <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
                      In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying
                      on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. In publishing and graphic design, Lorem ipsum is a
                      placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a
                      placeholder before the final copy is available. In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual
                      form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. In
                      publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on
                      meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack sx={{ padding: 2, width: "100%" }}>
                <Stack direction="row" sx={{ border: "1px solid black", padding: 1 }}>
                  <Stack sx={{ width: "100%" }}>
                    <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>PREPARED BY:</Typography>

                    <Stack mt={2}>
                      <Stack sx={{ width: "100%" }}>
                        <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.requestor_Name}</Typography>
                        <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Requestor`}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack sx={{ width: "100%" }}>
                    <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>CHECKED BY:</Typography>

                    <Stack mt={2}>
                      <Stack sx={{ width: "100%" }}>
                        <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.getForClosingTickets?.[0]?.approverLists?.[0]?.approverName}</Typography>
                        <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Approver`}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack sx={{ width: "100%" }}>
                    <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>CLOSED BY:</Typography>

                    <Stack mt={2}>
                      <Stack sx={{ width: "100%" }}>
                        <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.modified_By}</Typography>
                        <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Receiver`}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack display="none">
            <Stack sx={{ padding: 4, backgroundColor: "#fff", width: "100%" }} ref={componentRef}>
              {/* Printed */}
              <Stack sx={{ border: "1px solid black", padding: 2 }}>
                <Stack direction="row">
                  <Stack sx={{ border: "1px solid black" }}>
                    <img src={rdfLogo} alt="RDF LOGO" style={{ height: "60px" }} />
                  </Stack>

                  <Stack
                    sx={{
                      justifyContent: "center",
                      borderTop: "1px solid black",
                      borderRight: "1px solid black",
                      borderBottom: "1px solid black",
                      width: "100%",
                    }}
                  >
                    <Typography align="center" sx={{ fontWeight: "bold", color: "black" }}>
                      RDF FEED, LIVESTOCK AND FOODS, INC.
                    </Typography>
                    <Typography align="center" sx={{ fontWeight: "bold", color: "black", borderTop: "1px solid black" }}>
                      SERVICE REPORT
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" sx={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
                  <Stack sx={{ width: "50%" }}>
                    <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black", borderRight: "1px solid black" }}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TICKET NUMBER:{"  "}</Typography>
                      <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.ticketConcernId} </Typography>
                    </Stack>

                    <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black" }}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>SYSTEM:{"  "}</Typography>
                      <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.channel_Name} </Typography>
                    </Stack>
                  </Stack>

                  <Stack sx={{ width: "50%" }}>
                    <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black" }}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>DATE NEEDED:{"  "}</Typography>
                      <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.start_Date).format("MM/DD/YYYY")} </Typography>
                    </Stack>

                    <Stack direction="row" gap={1}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>START DATE:{"  "}</Typography>
                      <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.start_Date).format("MM/DD/YYYY")} </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack direction="row" sx={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
                  <Stack sx={{ width: "50%" }}>
                    <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black", borderBottom: "1px solid black" }}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CATEGORY:{"  "}</Typography>
                      <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.category_Description} </Typography>
                    </Stack>

                    <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black" }}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>SUB-CATEGORY:{"  "}</Typography>
                      <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.subCategory_Description} </Typography>
                    </Stack>
                  </Stack>

                  <Stack sx={{ width: "50%" }}>
                    <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black" }}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TARGET DATE:{"  "}</Typography>
                      <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.target_Date).format("MM/DD/YYYY")} </Typography>
                    </Stack>

                    <Stack direction="row" gap={1}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CLOSED DATE:{"  "}</Typography>
                      <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.close_At).format("MM/DD/YYYY")} </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack sx={{ marginTop: 8, minHeight: "600px", gap: 4 }}>
                  <Stack sx={{ width: "100%", minHeight: 170, border: "1px solid black" }}>
                    <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TICKET DESCRIPTION:{"  "}</Typography>
                    </Stack>

                    <Stack sx={{ width: "100%", padding: 2 }}>
                      <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
                        In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying
                        on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. In publishing and graphic design, Lorem ipsum is a
                        placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as
                        a placeholder before the final copy is available. In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the
                        visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.
                        In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying
                        on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack sx={{ width: "100%", minHeight: 170, border: "1px solid black" }}>
                    <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
                      <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>RESOLUTION:{"  "}</Typography>
                    </Stack>

                    <Stack sx={{ width: "100%", padding: 2 }}>
                      <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
                        In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying
                        on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. In publishing and graphic design, Lorem ipsum is a
                        placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as
                        a placeholder before the final copy is available. In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the
                        visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.
                        In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying
                        on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack sx={{ padding: 2, width: "100%" }}>
                  <Stack direction="row" sx={{ border: "1px solid black", padding: 1 }}>
                    <Stack sx={{ width: "100%" }}>
                      <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>PREPARED BY:</Typography>

                      <Stack mt={2}>
                        <Stack sx={{ width: "100%" }}>
                          <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.requestor_Name}</Typography>
                          <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Requestor`}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack sx={{ width: "100%" }}>
                      <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>CHECKED BY:</Typography>

                      <Stack mt={2}>
                        <Stack sx={{ width: "100%" }}>
                          <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.getForClosingTickets?.[0]?.approverLists?.[0]?.approverName}</Typography>
                          <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Approver`}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack sx={{ width: "100%" }}>
                      <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>CLOSED BY:</Typography>

                      <Stack mt={2}>
                        <Stack sx={{ width: "100%" }}>
                          <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.modified_By}</Typography>
                          <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Receiver`}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="success" startIcon={<Print />} onClick={handlePrint}>
            Print
          </Button>

          <Button onClick={() => onCloseHandler()}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PrintServiceReport;
