// import React from "react";
// import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
// import { LocalPrintshopOutlined } from "@mui/icons-material";
// import { PDFDocument, rgb } from "pdf-lib";
// import fontkit from "@pdf-lib/fontkit";
// import { saveAs } from "file-saver";

// const PrintServiceReport = ({ data, open, onClose }) => {
//   const handleGeneratePdf = async () => {
//     try {
//       // 1. Load your base PDF template
//       const existingPdfBytes = await fetch("/pdf/MIS_ServiceReport.pdf").then((res) => res.arrayBuffer());

//       const pdfDoc = await PDFDocument.load(existingPdfBytes);

//       // 2. Register fontkit to allow custom fonts
//       pdfDoc.registerFontkit(fontkit);

//       // 3. Load Calibri fonts from public/fonts
//       const calibriBytes = await fetch("/fonts/Calibri.ttf").then((res) => res.arrayBuffer());

//       const calibriFont = await pdfDoc.embedFont(calibriBytes);

//       // 4. Get first page
//       const firstPage = pdfDoc.getPages()[0];

//       // 5. Extract API data
//       const issueDescription = data?.concern_Description.replace(/\r\n/g, " - ") || "N/A";
//       const resolution = data?.getForClosingTickets?.[0]?.resolution || "N/A";

//       console.log("Data:", data);
//       console.log("Description:", issueDescription);

//       // 6. Inject text at chosen coordinates
//       // NOTE: adjust x/y until aligned perfectly
//       firstPage.drawText(issueDescription, {
//         x: 100,
//         y: 200, // move up/down until inside "ISSUE DESCRIPTION"
//         size: 9,
//         font: calibriFont,
//         color: rgb(0, 0, 0),
//       });

//       // firstPage.drawText(resolution, {
//       //   x: 120,
//       //   y: 200, // move up/down until inside "RESOLUTION / REMARKS"
//       //   size: 11,
//       //   font: calibriFont,
//       //   color: rgb(0, 0, 0),
//       // });

//       // 7. Save & download
//       const pdfBytes = await pdfDoc.save();
//       saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "MIS_ServiceReport.pdf");
//     } catch (err) {
//       console.error("Error generating PDF:", err);
//     }
//   };

//   return (
//     <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
//       <DialogContent>Generate Service Report PDF?</DialogContent>
//       <DialogActions>
//         <Button variant="contained" color="success" startIcon={<LocalPrintshopOutlined />} onClick={handleGeneratePdf}>
//           Generate PDF
//         </Button>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default PrintServiceReport;

// INITIAL SR REPORT
// import React, { useRef } from "react";

// import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
// import { Print } from "@mui/icons-material";

// import rdfLogo from "../../../assets/images/RDF Logo.png";
// import moment from "moment";
// import { useReactToPrint } from "react-to-print";

// const PrintServiceReport = ({  open, onClose }) => {
//   const componentRef = useRef(null);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const onCloseHandler = () => {
//     onClose();
//   };

//     const data = {
//     // JOB ORDER SECTION
//     site: "Office", // Check "Office"
//     departmentSite: "California", // Fill Dept. / Store / Farm
//     requestedBy: "User", // Fill Requested by
//     contactNumber: "09915127479", // Fill Contact #
//     typeOfRequest: "New", // Check "New"
//     dateTimeStarted: "2025-01-01 06:01am", // Fill Date & Time Started
//     dateTimeFinished: "2025-01-01 06:02am", // Fill Date & Time Finished
//     urgency: "Normal", // Check "Normal"

//     // CATEGORY SECTION (As it is)
//     // ACTIVITY SECTION (As it is)

//     // STATUS + CATEGORY SYSTEM
//     status: "Open", // Check "Open"
//     categorySystem: "Process", // Check "Process"

//     // ISSUE / RESOLUTION
//     issueDescription: "Testing", // Fill ISSUE DESCRIPTION
//     resolutionOrRemarks: "Testing", // Fill RESOLUTION / REMARKS

//     // PREPARED BY SECTION
//     supports: [
//       { id: "1", name: "Support 1" },
//       { id: "2", name: "Support 2" },
//       { id: "3", name: "Support 3" },
//     ],

//     // RECEIVED BY SECTION
//     receivedBy: "Gib",

//     // CLOSED BY SECTION
//     closedBy: "Keigh",
//   };

//   return (
//     <>
//       <Dialog
//         fullWidth
//         maxWidth="lg"
//         open={open}
//         onClose={(event, reason) => {
//           if (reason === "backdropClick") {
//             event.stopPropagation();
//             return;
//           }
//           onCloseHandler();
//         }}
//         disableEscapeKeyDown={false}
//         sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
//         PaperProps={{ style: { overflow: "auto" } }}
//       >
//         <DialogContent>
//           <Stack sx={{ padding: 4, backgroundColor: "#fff", width: "100%" }}>
//             {/* Print Display */}
//             <Stack sx={{ border: "1px solid black", padding: 2 }}>
//               <Stack direction="row">
//                 <Stack sx={{ border: "1px solid black" }}>
//                   <img src={rdfLogo} alt="RDF LOGO" style={{ height: "60px" }} />
//                 </Stack>

//                 <Stack
//                   sx={{
//                     justifyContent: "center",
//                     borderTop: "1px solid black",
//                     borderRight: "1px solid black",
//                     borderBottom: "1px solid black",
//                     width: "100%",
//                   }}
//                 >
//                   <Typography align="center" sx={{ fontWeight: "semibold", color: "black", borderBottom: "1px solid black", fontSize: "11px", fontStyle: "italic" }}>
//                     This document is for INTERNAL USE ONLY. Limited copies may be made only by RDF employees. or by the contractors and third party who have signed an appropriate
//                     nondisclosure agreement or with prior consent from the management.
//                   </Typography>

//                   <Typography align="center" sx={{ fontWeight: "bold", color: "black" }}>
//                     SERVICE REPORT
//                   </Typography>

//                   <Typography align="center" sx={{ fontWeight: "bold", color: "black", borderTop: "1px solid black" }}>
//                     MANAGEMENT INFORMATION SYSTEM
//                   </Typography>
//                 </Stack>
//               </Stack>

//               <Stack direction="row" sx={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
//                 <Stack sx={{ width: "60%" }}>
//                   <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black", borderRight: "1px solid black" }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TICKET NUMBER:{"  "}</Typography>
//                     <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.ticketConcernId} </Typography>
//                   </Stack>

//                   <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black" }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CHANNEL:{"  "}</Typography>
//                     <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.channel_Name} </Typography>
//                   </Stack>
//                 </Stack>

//                 <Stack sx={{ width: "40%" }}>
//                   <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black" }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>DATE NEEDED:{"  "}</Typography>
//                     <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.date_Needed ? moment(data?.date_Needed).format("MM/DD/YYYY") : "--"} </Typography>
//                   </Stack>

//                   <Stack direction="row" gap={1}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>START DATE:{"  "}</Typography>
//                     <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.dateStarted).format("MM/DD/YYYY hh:mma")} </Typography>
//                   </Stack>
//                 </Stack>
//               </Stack>

//               <Stack direction="row" sx={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
//                 <Stack sx={{ width: "60%" }}>
//                   <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black", borderBottom: "1px solid black" }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CATEGORY:{"  "}</Typography>
//                     <Typography sx={{ color: "black", fontSize: "14px" }}>
//                       <Stack direction="row" spacing={1}>
//                         {data?.getOpenTicketCategories?.map((item, i) => (
//                           <React.Fragment key={i}>
//                             {item.category_Description}
//                             {i < data.getOpenTicketCategories.length - 1 && ", "}
//                           </React.Fragment>
//                         ))}
//                       </Stack>
//                     </Typography>
//                   </Stack>

//                   <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black" }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "13px", marginLeft: 1 }}>SUB-CATEGORY:{"  "}</Typography>
//                     <Typography sx={{ color: "black", fontSize: "14px" }}>
//                       <Stack direction="row" spacing={1}>
//                         {data?.getOpenTicketSubCategories?.map((item, i) => (
//                           <React.Fragment key={i}>
//                             {item.subCategory_Description}
//                             {i < data.getOpenTicketSubCategories.length - 1 && ", "}
//                           </React.Fragment>
//                         ))}
//                       </Stack>
//                     </Typography>
//                   </Stack>
//                 </Stack>

//                 <Stack sx={{ width: "40%" }}>
//                   <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black" }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TARGET DATE:{"  "}</Typography>
//                     <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.target_Date).format("MM/DD/YYYY")} </Typography>
//                   </Stack>

//                   <Stack direction="row" gap={1}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CLOSED DATE:{"  "}</Typography>
//                     <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.close_At).format("MM/DD/YYYY hh:mma")} </Typography>
//                   </Stack>
//                 </Stack>
//               </Stack>

//               <Stack sx={{ marginTop: 8, minHeight: "600px", gap: 4 }}>
//                 {/* TICKET DESCRIPTION */}
//                 <Stack sx={{ width: "100%", height: "auto", border: "1px solid black" }}>
//                   <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>A. TICKET DESCRIPTION:{"  "}</Typography>
//                   </Stack>

//                   <Stack sx={{ width: "100%", padding: 2 }}>
//                     <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
//                       {data?.concern_Description?.split("\r\n").map((line, index) => (
//                         <span key={index}>
//                           {line}
//                           <br />
//                         </span>
//                       ))}
//                     </Typography>
//                   </Stack>
//                 </Stack>

//                 {/* RESOLUTION */}
//                 <Stack sx={{ width: "100%", height: "auto", border: "1px solid black" }}>
//                   <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>B. RESOLUTION:{"  "}</Typography>
//                   </Stack>

//                   <Stack sx={{ width: "100%", padding: 2 }}>
//                     <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
//                       {data?.getForClosingTickets?.[0]?.resolution?.split("\r\n").map((line, index) => (
//                         <span key={index}>
//                           {line}
//                           <br />
//                         </span>
//                       ))}
//                     </Typography>
//                   </Stack>
//                 </Stack>

//                 {/* TECHNICIANS */}
//                 <Stack sx={{ width: "100%", height: "auto", border: "1px solid black" }}>
//                   <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
//                     <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>C. TECHNICIANS:{"  "}</Typography>
//                   </Stack>

//                   <Stack sx={{ width: "100%", padding: 2 }}>
//                     {data?.getForClosingTickets?.[0]?.forClosingTicketTechnicians?.length > 0 ? (
//                       data?.getForClosingTickets?.[0]?.forClosingTicketTechnicians?.map((item, i) => (
//                         <Typography key={i} sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
//                           {i + 1}. {item.fullname}
//                           <br />
//                         </Typography>
//                       ))
//                     ) : (
//                       <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1, fontStyle: "italic" }}>No technician assigned.</Typography>
//                     )}
//                   </Stack>
//                 </Stack>
//               </Stack>

//               <Stack sx={{ padding: 2, width: "100%" }}>
//                 <Stack direction="row" sx={{ border: "1px solid black", padding: 1 }}>
//                   <Stack sx={{ width: "100%" }}>
//                     <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>REQUESTED BY:</Typography>

//                     <Stack mt={2}>
//                       <Stack sx={{ width: "100%" }}>
//                         <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.requestor_Name}</Typography>
//                         <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Requestor`}</Typography>
//                       </Stack>
//                     </Stack>
//                   </Stack>

//                   <Stack sx={{ width: "100%" }}>
//                     <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>PREPARED BY:</Typography>

//                     <Stack mt={2}>
//                       <Stack sx={{ width: "100%" }}>
//                         <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.issue_Handler}</Typography>
//                         <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Issue Handler`}</Typography>
//                       </Stack>
//                     </Stack>
//                   </Stack>

//                   <Stack sx={{ width: "100%" }}>
//                     <Typography sx={{ color: "black", fontWeight: 600, fontSize: "13px" }}>CHECKED BY:</Typography>

//                     <Stack mt={2}>
//                       <Stack sx={{ width: "100%" }}>
//                         <Typography sx={{ color: "black", fontWeight: 500, fontSize: "14px" }}>{data?.getForClosingTickets?.[0]?.approverLists?.[0]?.approverName}</Typography>
//                         <Typography sx={{ color: "black", fontWeight: 600, fontSize: "14px" }}>{`Approver`}</Typography>
//                       </Stack>
//                     </Stack>
//                   </Stack>
//                 </Stack>
//               </Stack>
//             </Stack>
//           </Stack>

//           {/* Printed */}
//           <Stack display="none">
//             <Stack sx={{ padding: 4, backgroundColor: "#fff", width: "100%" }} ref={componentRef}>
//               <Stack sx={{ border: "1px solid black", padding: 2 }}>
//                 <Stack direction="row">
//                   <Stack sx={{ border: "1px solid black" }}>
//                     <img src={rdfLogo} alt="RDF LOGO" style={{ height: "60px" }} />
//                   </Stack>

//                   <Stack
//                     sx={{
//                       justifyContent: "center",
//                       borderTop: "1px solid black",
//                       borderRight: "1px solid black",
//                       borderBottom: "1px solid black",
//                       width: "100%",
//                     }}
//                   >
//                     <Typography align="center" sx={{ fontWeight: "semibold", color: "black", borderBottom: "1px solid black", fontSize: "11px", fontStyle: "italic" }}>
//                       This document is for INTERNAL USE ONLY. Limited copies may be made only by RDF employees. or by the contractors and third party who have signed an appropriate
//                       nondisclosure agreement or with prior consent from the management.
//                     </Typography>

//                     <Typography align="center" sx={{ fontWeight: "bold", color: "black" }}>
//                       SERVICE REPORT
//                     </Typography>

//                     <Typography align="center" sx={{ fontWeight: "bold", color: "black", borderTop: "1px solid black" }}>
//                       MANAGEMENT INFORMATION SYSTEM
//                     </Typography>
//                   </Stack>
//                 </Stack>

//                 <Stack direction="row" sx={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
//                   <Stack sx={{ width: "60%" }}>
//                     <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black", borderRight: "1px solid black" }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TICKET NUMBER:</Typography>
//                       <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.ticketConcernId} </Typography>
//                     </Stack>

//                     <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black" }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CHANNEL:</Typography>
//                       <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.channel_Name} </Typography>
//                     </Stack>
//                   </Stack>

//                   <Stack sx={{ width: "40%" }}>
//                     <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black" }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>DATE NEEDED:</Typography>
//                       <Typography sx={{ color: "black", fontSize: "14px" }}>{data?.date_Needed ? moment(data?.date_Needed).format("MM/DD/YYYY") : "--"} </Typography>
//                     </Stack>

//                     <Stack direction="row" gap={1}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>START DATE:</Typography>
//                       <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.start_Date).format("MM/DD/YYYY hh:mma")} </Typography>
//                     </Stack>
//                   </Stack>
//                 </Stack>

//                 <Stack direction="row" sx={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black" }}>
//                   <Stack sx={{ width: "60%" }}>
//                     <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black", borderBottom: "1px solid black" }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CATEGORY:</Typography>
//                       <Typography sx={{ color: "black", fontSize: "14px" }}>
//                         <Stack direction="row" spacing={1}>
//                           {data?.getOpenTicketCategories?.map((item, i) => (
//                             <React.Fragment key={i}>
//                               {item.category_Description}
//                               {i < data.getOpenTicketCategories.length - 1 && ", "}
//                             </React.Fragment>
//                           ))}
//                         </Stack>
//                       </Typography>
//                     </Stack>

//                     <Stack direction="row" gap={1} sx={{ borderRight: "1px solid black" }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "13px", marginLeft: 1 }}>SUB-CATEGORY:</Typography>
//                       <Typography sx={{ color: "black", fontSize: "14px" }}>
//                         <Stack direction="row" spacing={1}>
//                           {data?.getOpenTicketSubCategories?.map((item, i) => (
//                             <React.Fragment key={i}>
//                               {item.subCategory_Description}
//                               {i < data.getOpenTicketSubCategories.length - 1 && ", "}
//                             </React.Fragment>
//                           ))}
//                         </Stack>
//                       </Typography>
//                     </Stack>
//                   </Stack>

//                   <Stack sx={{ width: "40%" }}>
//                     <Stack direction="row" gap={1} sx={{ borderBottom: "1px solid black" }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>TARGET DATE:</Typography>
//                       <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.target_Date).format("MM/DD/YYYY")} </Typography>
//                     </Stack>

//                     <Stack direction="row" gap={1}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>CLOSED DATE:</Typography>
//                       <Typography sx={{ color: "black", fontSize: "14px" }}>{moment(data?.close_At).format("MM/DD/YYYY hh:mma")} </Typography>
//                     </Stack>
//                   </Stack>
//                 </Stack>

//                 <Stack sx={{ marginTop: 8, minHeight: "600px", gap: 4 }}>
//                   {/* TICKET DESCRIPTION */}
//                   <Stack sx={{ width: "100%", height: "auto", border: "1px solid black" }}>
//                     <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>A. TICKET DESCRIPTION:</Typography>
//                     </Stack>

//                     <Stack sx={{ width: "100%", padding: 2 }}>
//                       <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
//                         {data?.concern_Description?.split("\r\n").map((line, index) => (
//                           <span key={index}>
//                             {line}
//                             <br />
//                           </span>
//                         ))}
//                       </Typography>
//                     </Stack>
//                   </Stack>

//                   {/* RESOLUTION */}
//                   <Stack sx={{ width: "100%", height: "auto", border: "1px solid black" }}>
//                     <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>B. RESOLUTION:</Typography>
//                     </Stack>

//                     <Stack sx={{ width: "100%", padding: 2 }}>
//                       <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
//                         {data?.getForClosingTickets?.[0]?.resolution?.split("\r\n").map((line, index) => (
//                           <span key={index}>
//                             {line}
//                             <br />
//                           </span>
//                         ))}
//                       </Typography>
//                     </Stack>
//                   </Stack>

//                   {/* TECHNICIANS */}
//                   <Stack sx={{ width: "100%", height: "auto", border: "1px solid black" }}>
//                     <Stack sx={{ borderBottom: "1px solid black", width: "100%", padding: 1 }}>
//                       <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "14px", marginLeft: 1 }}>C. TECHNICIANS:{"  "}</Typography>
//                     </Stack>

//                     <Stack sx={{ width: "100%", padding: 2 }}>
//                       {data?.getForClosingTickets?.[0]?.forClosingTicketTechnicians?.length > 0 ? (
//                         data?.getForClosingTickets?.[0]?.forClosingTicketTechnicians?.map((item, i) => (
//                           <Typography key={i} sx={{ color: "black", fontSize: "14px", marginLeft: 1 }}>
//                             {i + 1}. {item.fullname}
//                             <br />
//                           </Typography>
//                         ))
//                       ) : (
//                         <Typography sx={{ color: "black", fontSize: "14px", marginLeft: 1, fontStyle: "italic" }}>No technician assigned.</Typography>
//                       )}
//                     </Stack>
//                   </Stack>
//                 </Stack>

//                 <Stack sx={{ padding: 2, width: "100%" }}>
//                   <Stack direction="row" sx={{ border: "1px solid black", padding: 1 }}>
//                     <Stack sx={{ width: "100%" }}>
//                       <Typography sx={{ color: "black", fontWeight: 600, fontSize: "11px" }}>REQUESTED BY:</Typography>

//                       <Stack mt={2}>
//                         <Stack sx={{ width: "100%" }}>
//                           <Typography sx={{ color: "black", fontWeight: 500, fontSize: "12px" }}>{data?.requestor_Name}</Typography>
//                           <Typography sx={{ color: "black", fontWeight: 600, fontSize: "12px" }}>{`Requestor`}</Typography>
//                         </Stack>
//                       </Stack>
//                     </Stack>

//                     <Stack sx={{ width: "100%" }}>
//                       <Typography sx={{ color: "black", fontWeight: 600, fontSize: "11px" }}>PREPARED BY:</Typography>

//                       <Stack mt={2}>
//                         <Stack sx={{ width: "100%" }}>
//                           <Typography sx={{ color: "black", fontWeight: 500, fontSize: "12px" }}>{data?.issue_Handler}</Typography>
//                           <Typography sx={{ color: "black", fontWeight: 600, fontSize: "12px" }}>{`Issue Handler`}</Typography>
//                         </Stack>
//                       </Stack>
//                     </Stack>

//                     <Stack sx={{ width: "100%" }}>
//                       <Typography sx={{ color: "black", fontWeight: 600, fontSize: "11px" }}>CHECKED BY:</Typography>

//                       <Stack mt={2}>
//                         <Stack sx={{ width: "100%" }}>
//                           <Typography sx={{ color: "black", fontWeight: 500, fontSize: "12px" }}>{data?.getForClosingTickets?.[0]?.approverLists?.[0]?.approverName}</Typography>
//                           <Typography sx={{ color: "black", fontWeight: 600, fontSize: "12px" }}>{`Approver`}</Typography>
//                         </Stack>
//                       </Stack>
//                     </Stack>
//                   </Stack>
//                 </Stack>
//               </Stack>
//             </Stack>
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button variant="contained" color="success" startIcon={<Print />} onClick={handlePrint}>
//             Print
//           </Button>

//           <Button onClick={() => onCloseHandler()}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default PrintServiceReport;

import React, { useRef } from "react";

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid, Stack, Typography } from "@mui/material";
import { CheckBox, Print } from "@mui/icons-material";

import rdfLogo from "../../../assets/images/RDF Logo.png";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

const PrintServiceReport = ({ open, onClose }) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const onCloseHandler = () => {
    onClose();
  };

  const data = {
    // JOB ORDER SECTION
    site: "Office", // Check "Office"
    departmentSite: "California", // Fill Dept. / Store / Farm
    requestedBy: "User", // Fill Requested by
    contactNumber: "09915127479", // Fill Contact #
    typeOfRequest: "New", // Check "New"
    dateTimeStarted: "2025-01-01 06:01am", // Fill Date & Time Started
    dateTimeFinished: "2025-01-01 06:02am", // Fill Date & Time Finished
    urgency: "Normal", // Check "Normal"

    // CATEGORY SECTION (As it is)
    // ACTIVITY SECTION (As it is)

    // STATUS + CATEGORY SYSTEM
    status: "Open", // Check "Open"
    categorySystem: "Process", // Check "Process"

    // ISSUE / RESOLUTION
    issueDescription: "Testing", // Fill ISSUE DESCRIPTION
    resolutionOrRemarks: "Testing", // Fill RESOLUTION / REMARKS

    // PREPARED BY SECTION
    supports: [
      { id: "1", name: "Support 1" },
      { id: "2", name: "Support 2" },
      { id: "3", name: "Support 3" },
    ],

    // RECEIVED BY SECTION
    receivedBy: "Gib",

    // CLOSED BY SECTION
    closedBy: "Keigh",
  };

  const CheckedBox = ({ label, checked }) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <CheckBox size="small" checked={checked} />
      <Typography>{label}</Typography>
    </Stack>
  );

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          event.stopPropagation();
          return;
        }
        onClose();
      }}
      PaperProps={{ style: { overflow: "auto" } }}
    >
      <DialogContent>
        <Box ref={componentRef} sx={{ p: 2, fontSize: "11px", fontFamily: "Arial", backgroundColor: "#fff", overflow: "" }}>
          {/* HEADER */}
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <img src={rdfLogo} alt="RDF Logo" style={{ width: 120 }} />
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Typography variant="body2" fontWeight="bold" sx={{ color: "black" }}>
                MIS SERVICE REPORT
              </Typography>
              <Typography variant="caption">Management Information System</Typography>
            </Grid>
          </Grid>

          {/* JOB ORDER SECTION */}
          <Box sx={{ border: "1px solid black", p: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <CheckedBox label="Office" checked={data.site === "Office"} />
                <CheckedBox label="Store" checked={data.site === "Store"} />
                <CheckedBox label="Farm" checked={data.site === "Farm"} />
                <CheckedBox label="Depot" checked={data.site === "Depot"} />
              </Grid>
              <Grid item xs={3}>
                <Typography>Dept. / Store / Farm: {data.departmentSite}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Requested by: {data.requestedBy}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Contact #: {data.contactNumber}</Typography>
              </Grid>
              <Grid item xs={3}>
                <CheckedBox label="New" checked={data.typeOfRequest === "New"} />
                <CheckedBox label="Back-Job" checked={data.typeOfRequest === "Back-Job"} />
              </Grid>
              <Grid item xs={3}>
                <Typography>Date & Time Started: {data.dateTimeStarted}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Date & Time Finished: {data.dateTimeFinished}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Stack>
                  <CheckedBox label="Normal" checked={data.urgency === "Normal"} />
                  <CheckedBox label="Low" checked={data.urgency === "Low"} />
                  <CheckedBox label="High" checked={data.urgency === "High"} />
                  <CheckedBox label="Urgent" checked={data.urgency === "Urgent"} />
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* CATEGORY SECTION */}
          <Box sx={{ border: "1px solid black", p: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              CATEGORY
            </Typography>
            <Grid container spacing={1}>
              {/* ELECTRONIC SUPPORT */}
              <Grid item xs={3}>
                <Typography fontWeight="bold">Electronic Support</Typography>
                <CheckedBox label="SM100 Weighing Scale" />
                <CheckedBox label="Platform" />
                <CheckedBox label="Table Top" />
                <CheckedBox label="Floor Scale" />
                <CheckedBox label="Truck Scale" />
                <CheckedBox label="Rail scale" />
              </Grid>

              {/* ENTERPRISE APPS */}
              <Grid item xs={3}>
                <Typography fontWeight="bold">Enterprise Apps Dev't & Support</Typography>
                <CheckedBox label="System Development Support" />
                <CheckedBox label="Email Support" />
                <CheckedBox label="Oracle Support" />
              </Grid>

              {/* USER ACCOUNT MANAGEMENT */}
              <Grid item xs={3}>
                <Typography fontWeight="bold">User Account Management</Typography>
                <CheckedBox label="Create New User Account" />
                <CheckedBox label="User Account Update" />
                <CheckedBox label="User Password Reset" />
                <CheckedBox label="User's Automated Backup" />
              </Grid>

              {/* MIS HARDWARE/TECHNICAL SUPPORT */}
              <Grid item xs={3}>
                <Typography fontWeight="bold">MIS Hardware/Technical Support</Typography>
                <CheckedBox label="Desktop Support" />
                <CheckedBox label="Hardware" />
                <CheckedBox label="Software Application" />
                <CheckedBox label="Operating System" />
                <CheckedBox label="Web" />
                <CheckedBox label="Files / Data" />
                <CheckedBox label="Network" />
                <CheckedBox label="System Unit (CPU)" />
                <CheckedBox label="Monitor" />
                <CheckedBox label="Keyboard" />
                <CheckedBox label="Mouse" />
                <CheckedBox label="UPS Backup" />
                <CheckedBox label="AutomaticVoltageRegulator (AVR)" />
                <CheckedBox label="Laptop Support" />
                <CheckedBox label="POS Support" />
                <CheckedBox label="POS Printer" />
                <CheckedBox label="POS Receipt" />
                <CheckedBox label="Network Connection Support" />
                <CheckedBox label="Wireless Connection" />
                <CheckedBox label="Network File Sharing" />
              </Grid>
            </Grid>
          </Box>

          {/* ACTIVITY SECTION */}
          <Box sx={{ border: "1px solid black", p: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              ACTIVITY
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <CheckedBox label="Installation and Configuration" />
                <CheckedBox label="Repair and Troubleshoot" />
                <CheckedBox label="Backup" />
                <CheckedBox label="Recovery" />
                <CheckedBox label="Reformat" />
                <CheckedBox label="Replacement / Recommendation" />
              </Grid>
              <Grid item xs={3}>
                <CheckedBox label="Security Management" />
                <CheckedBox label="Transfer Files" />
                <CheckedBox label="Diagnose" />
                <CheckedBox label="Update Data" />
                <CheckedBox label="Generate Data" />
                <CheckedBox label="Upload Data" />
              </Grid>
              <Grid item xs={3}>
                <CheckedBox label="User Account Credentials" />
                <CheckedBox label="Activation" />
                <CheckedBox label="Deactivation" />
                <CheckedBox label="Transfer Database" />
                <CheckedBox label="Cleaning, Scan and Diagnose" />
                <CheckedBox label="Corrective Maintenance Services" />
              </Grid>
            </Grid>
          </Box>

          {/* ISSUE DESCRIPTION */}
          <Box sx={{ border: "1px solid black", p: 1, mb: 1, minHeight: 50 }}>
            <Typography variant="subtitle2">ISSUE DESCRIPTION</Typography>
            <Typography>{data.issueDescription}</Typography>
          </Box>

          {/* RESOLUTION */}
          <Box sx={{ border: "1px solid black", p: 1, mb: 1, minHeight: 50 }}>
            <Typography variant="subtitle2">RESOLUTION / REMARKS</Typography>
            <Typography>{data.resolutionOrRemarks}</Typography>
          </Box>

          {/* PREPARED BY */}
          <Box sx={{ border: "1px solid black", p: 1, mb: 1 }}>
            <Typography variant="subtitle2">Prepared by:</Typography>
            {data.supports.map((s) => (
              <Typography key={s.id}>
                SupportTech {s.id}: {s.name}
              </Typography>
            ))}
          </Box>

          {/* RECEIVED & CLOSED BY */}
          <Grid container spacing={1}>
            <Grid item xs={6} sx={{ border: "1px solid black", p: 1 }}>
              <Typography variant="subtitle2">RECEIVED BY:</Typography>
              <Typography>{data.receivedBy}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ border: "1px solid black", p: 1 }}>
              <Typography variant="subtitle2">CLOSED BY:</Typography>
              <Typography>{data.closedBy}</Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="success" startIcon={<Print />} onClick={handlePrint}>
          Print
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintServiceReport;
