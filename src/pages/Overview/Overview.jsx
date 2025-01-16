import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Box, Typography, Grid, Card, CardContent, Stack, useMediaQuery } from "@mui/material";
import { useGetOverviewQuery } from "../../features/api_overview/overviewApi";
import { theme } from "../../theme/theme";
import { Assignment, AssignmentLate, FiberManualRecord, LocalOffer } from "@mui/icons-material";

const Overview = () => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetOverviewQuery();

  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading || isFetching) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>Error loading data. Please try again.</Typography>;
  }

  const chartData = data?.value?.[0]?.overviewAnalyticsDetails
    ?.map((detail) => ({
      name: detail.fullName,
      Tickets: detail.numberOfTicket,
      OnTime: Number(detail.numberOfTicket) - Number(detail.numberOfDelay),
      Delays: detail.numberOfDelay,
      percentageTicket: detail.percentageTicket,
      delayTicketPercentage: detail.delayTicketPercentage,
    }))
    ?.sort((a, b) => b.Tickets - a.Tickets);

  console.log("ChartData: ", chartData);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isTablet ? "10px" : "15px 94px 25px 94px",
        boxSizing: "border-box",
      }}
    >
      <Stack justifyItems="left" mb={2}>
        <Typography variant="h4">Overview</Typography>
      </Stack>

      <Grid container spacing={2}>
        {/* Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ width: "100%", height: "100%", backgroundColor: "#111927" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                {/* Icon with Shadowed Circle */}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 48,
                    height: 48,
                    backgroundColor: "#9e77ed",
                    borderRadius: "50%",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Assignment sx={{ color: "#fff" }} />
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Total Tickets:</Typography>
                  <Typography variant="h4">{data?.value[0]?.totalTicket}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ width: "100%", height: "100%", backgroundColor: "#111927" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                {/* Icon with Shadowed Circle */}
                <Box
                  sx={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 48,
                    height: 48,
                    backgroundColor: theme.palette.error.main,
                    borderRadius: "50%",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <AssignmentLate sx={{ color: "#fff" }} />
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Delayed Tickets:</Typography>
                  <Typography variant="h4">{data?.value[0]?.totalDelay}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bar Chart Section */}
      <Box mt={4} padding={2} sx={{ backgroundColor: theme.palette.bgForm.black3 }}>
        <Stack direction="row" gap={0.5} alignItems="center" justifyContent="center" sx={{ width: "100%" }} mb={2} mt={2}>
          <Typography gutterBottom sx={{ color: "#8884d8", fontSize: "17px", fontWeight: 600 }}>
            Ticket Distribution (Ranked by Tickets)
          </Typography>
        </Stack>

        <ResponsiveContainer width="100%" height={chartData.length * 40}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid stroke="#ccc" horizontal={false} />
            <XAxis type="number" domain={[0, 5]} />
            <YAxis type="category" dataKey="name" width={150} tick={{ fill: "#fff", fontSize: "12px" }} interval={0} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#3f305f" }} />

            {/* <Legend wrapperStyle={{ padding: 10 }} formatter={(value, entry) => <Typography sx={{ color: entry.color, fontSize: "12px", fontWeight: 600 }}>{value}</Typography>} />
            <Bar dataKey="Tickets" stackId="a" fill="#8884d8" name="Total Tickets" />
            <Bar dataKey="Delays" stackId="a" fill="#FF6347" name="Total Delays" /> */}

            <Bar dataKey="Tickets" fill="#8884d8" label={{ position: "right", fill: "#fff", fontSize: 12 }} name="Total Tickets" />
            <Bar
              dataKey="Delays"
              fill="#FF6347"
              label={{
                position: "right",
                fill: "#fff",
                fontSize: 12,
                formatter: (value) => (value > 0 ? value : ""),
              }}
              name="Total Delay (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
};

export default Overview;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const details = payload[0].payload;
    return (
      <Box
        sx={{
          backgroundColor: "#111927",
          borderRadius: "8px",
          padding: "10px",
          color: "#fff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>{label}</Typography>
        <Typography mt={1} sx={{ color: "#8884d8", fontSize: "13px", fontWeight: 500 }}>
          Total Tickets: {details.Tickets}
        </Typography>

        <Typography sx={{ color: theme.palette.error.main, fontSize: "13px", fontWeight: 500 }}>Total Delays: {details.Delays}</Typography>

        <Stack mt={0.5}>
          <Stack direction="row" gap={0.5} alignItems="center">
            <FiberManualRecord color="primary" sx={{ fontSize: "12px" }} />
            <Typography sx={{ color: "#fff", fontSize: "12px" }}>Ticket Percentage: {details.percentageTicket}%</Typography>
          </Stack>

          <Stack direction="row" gap={0.5} alignItems="center">
            <FiberManualRecord color="error" sx={{ fontSize: "12px" }} />
            <Typography sx={{ color: "#fff", fontSize: "12px" }}>Delay Percentage: {details.delayTicketPercentage}%</Typography>
          </Stack>
        </Stack>
      </Box>
    );
  }
  return null;
};

// import {
//   Stack,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Box,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   useMediaQuery,
//   Dialog,
//   DialogTitle,
//   IconButton,
//   DialogContent,
//   TablePagination,
//   Chip,
// } from "@mui/material";
// import React, { useState } from "react";
// import { ArrowForward, Assignment, CalendarMonthOutlined, Close, FiberManualRecord, FilterAlt } from "@mui/icons-material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import { useTheme } from "@emotion/react";

// const dummyData = {
//   totalTickets: 100,
//   totalUnits: 5,
//   units: [
//     { name: "Unit 1", value: 20, color: "#0088FE" },
//     { name: "Unit 2", value: 25, color: "#00C49F" },
//     { name: "Unit 3", value: 15, color: "#FFBB28" },
//     { name: "Unit 4", value: 30, color: "#FF8042" },
//     { name: "Unit 5", value: 10, color: "#A28BFB" },
//   ],
// };

// const dummyInvoices = [
//   { id: "TIX-001", customer: "Pangilinan, Gib Ibanson", ticketDescription: "Ticket 1", targetDate: "Dec 9, 2024", closedDate: "Jan 3, 2025", status: "Open" },
//   { id: "TIX-002", customer: "Crasco, Philip Lorenz", ticketDescription: "Ticket 2", targetDate: "Dec 5, 2024", closedDate: "Dec 26, 2024", status: "Open" },
//   { id: "TIX-003", customer: "Pangilinan, Gib Ibanson", ticketDescription: "Ticket 3", targetDate: "Dec 3, 2024", closedDate: "Dec 20, 2024", status: "Delayed" },
//   { id: "TIX-004", customer: "Crasco, Philip Lorenz", ticketDescription: "Ticket 4", targetDate: "Nov 24, 2024", closedDate: "Dec 12, 2024", status: "On-Time" },
//   { id: "TIX-005", customer: "Crasco, Philip Lorenz", ticketDescription: "Ticket 5", targetDate: "Nov 24, 2024", closedDate: "Dec 10, 2024", status: "Delayed" },
// ];

// const statusColors = {
//   Open: "#FF9800",
//   Delayed: "#F44336",
//   "On-Time": "#00C49F",
// };

// const Overview = () => {
//   const { totalTickets, units } = dummyData;

//   const [open, setOpen] = useState(false);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize, setPageSize] = useState(5);

//   const theme = useTheme();
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"));

//   const handleDialogOpen = () => setOpen(true);
//   const handleDialogClose = () => setOpen(false);

//   const onPageNumberChange = (_, page) => {
//     setPageNumber(page + 1);
//   };

//   const onPageSizeChange = (e) => {
//     setPageSize(e.target.value);
//     setPageNumber(1);
//   };

//   return (
//     <Stack
//       sx={{
//         width: "100%",
//         height: "auto",
//         display: "flex",
//         backgroundColor: theme.palette.bgForm.black1,
//         color: "#fff",
//         padding: isTablet ? "16px" : "44px 94px",
//         boxSizing: "border-box",
//       }}
//     >
//       <Stack sx={{ width: "100%" }}>
//         <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
//           <Stack sx={{ width: "100%" }}>
//             <Stack justifyItems="left">
//               <Typography variant="h4">Overview</Typography>
//             </Stack>

//             <Stack justifyItems="space-between" direction="row" padding={4}>
//               <Grid container spacing={3}>
//                 {/* Cards */}
//                 <Grid item xs={12} sm={6} md={4}>
//                   <Card sx={{ width: "100%", height: "100%", backgroundColor: "#111927" }}>
//                     <CardContent>
//                       <Stack direction="row" spacing={2} alignItems="center">
//                         {/* Icon with Shadowed Circle */}
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             width: 48,
//                             height: 48,
//                             backgroundColor: "#9e77ed", // Adjust color as needed
//                             borderRadius: "50%",
//                             boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
//                           }}
//                         >
//                           <Assignment sx={{ color: "#fff" }} />
//                         </Box>

//                         <Box>
//                           <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Total Tickets:</Typography>
//                           <Typography variant="h4">{totalTickets}</Typography>
//                         </Box>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={12} sm={6} md={4}>
//                   <Card sx={{ width: "100%", height: "100%", backgroundColor: theme.palette.bgForm.black_2 }}>
//                     <CardContent>
//                       <Stack direction="row" spacing={2} alignItems="center">
//                         {/* Icon with Shadowed Circle */}
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             width: 48,
//                             height: 48,
//                             backgroundColor: "#ff9800", // Adjust color as needed
//                             borderRadius: "50%",
//                             boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
//                           }}
//                         >
//                           <Assignment sx={{ color: "#fff" }} />
//                         </Box>

//                         <Box>
//                           <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Open Tickets:</Typography>
//                           <Typography variant="h4">{units.length}</Typography>
//                         </Box>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={12} sm={6} md={4}>
//                   <Card sx={{ width: "100%", height: "100%", backgroundColor: theme.palette.bgForm.black_2 }}>
//                     <CardContent>
//                       <Stack direction="row" spacing={2} alignItems="center">
//                         {/* Icon with Shadowed Circle */}
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             width: 48,
//                             height: 48,
//                             backgroundColor: "#43A047",
//                             borderRadius: "50%",
//                             boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
//                           }}
//                         >
//                           <Assignment sx={{ color: "#fff" }} />
//                         </Box>

//                         <Box>
//                           <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Closed Tickets:</Typography>
//                           <Typography variant="h4">{units.length}</Typography>
//                         </Box>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Grid>
//             </Stack>

//             <Stack
//               direction={isTablet ? "column" : "row"}
//               spacing={2}
//               sx={{
//                 padding: "16px",
//                 width: "100%",
//                 height: "auto", // Or a defined height
//                 overflowX: "auto",
//                 mt: 4,
//               }}
//             >
//               {isTablet ? (
//                 <>
//                   <Button variant="contained" startIcon={<FilterAlt />} onClick={handleDialogOpen}>
//                     Filters
//                   </Button>
//                   <Dialog
//                     open={open}
//                     onClose={handleDialogClose}
//                     maxWidth="sm"
//                     sx={{
//                       zIndex: theme.zIndex.modal,
//                       "& .MuiDialog-paper": {
//                         overflow: "visible",
//                       },
//                     }}
//                   >
//                     <DialogTitle>
//                       Filters
//                       <IconButton aria-label="close" onClick={handleDialogClose} sx={{ position: "absolute", right: 8, top: 8 }}>
//                         <Close />
//                       </IconButton>
//                     </DialogTitle>
//                     <DialogContent>
//                       {/* Replace this with your actual filtering section */}
//                       <Typography>Filtering Section</Typography>
//                     </DialogContent>
//                   </Dialog>
//                 </>
//               ) : (
//                 <Stack
//                   sx={{
//                     width: "25%", // Adjust width as needed
//                     backgroundColor: "#111927",
//                     padding: 2,
//                   }}
//                 >
//                   {/* Filtering Section for larger screens */}
//                   <Typography mb={1}>Filtering Section</Typography>

//                   <Stack sx={{ width: "100%", gap: 1.5, mt: 2 }}>
//                     <Select fullWidth defaultValue="All" sx={{ backgroundColor: "#1c1e2f" }}>
//                       <MenuItem value="All">All</MenuItem>
//                       <MenuItem value="Open">Open Ticket</MenuItem>
//                       <MenuItem value="Delayed">Delayed</MenuItem>
//                       <MenuItem value="On-Time">On-Time</MenuItem>
//                     </Select>

//                     <TextField fullWidth label="Personnel" variant="outlined" sx={{ backgroundColor: "#1c1e2f" }} autoComplete="off" />

//                     <LocalizationProvider dateAdapter={AdapterMoment}>
//                       <DatePicker label="From" renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: "#1c1e2f" }} />} />
//                     </LocalizationProvider>

//                     <LocalizationProvider dateAdapter={AdapterMoment}>
//                       <DatePicker label="To" renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: "#1c1e2f" }} />} />
//                     </LocalizationProvider>

//                     <Button variant="contained" fullWidth>
//                       Apply
//                     </Button>
//                   </Stack>
//                 </Stack>
//               )}

//               <Stack
//                 sx={{
//                   width: isTablet ? "100%" : "75%",
//                   overflowX: "auto",
//                 }}
//               >
//                 {/* Table Section */}
//                 <Box
//                   sx={{
//                     overflowX: "auto",
//                     maxWidth: "100%",
//                   }}
//                 >
//                   <TableContainer>
//                     <Table stickyHeader sx={{ borderBottom: "none", backgroundColor: "#111927" }}>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               background: "#1C2536",
//                               color: "#D65DB1",
//                               fontWeight: 700,
//                             }}
//                           >
//                             Ticket ID
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               background: "#1C2536",
//                               color: "#D65DB1",
//                               fontWeight: 700,
//                             }}
//                           >
//                             Personnel
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               background: "#1C2536",
//                               color: "#D65DB1",
//                               fontWeight: 700,
//                             }}
//                           >
//                             Ticket
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               background: "#1C2536",
//                               color: "#D65DB1",
//                               fontWeight: 700,
//                             }}
//                           >
//                             Target Date
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               background: "#1C2536",
//                               color: "#D65DB1",
//                               fontWeight: 700,
//                             }}
//                           >
//                             Closed Date
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               background: "#1C2536",
//                               color: "#D65DB1",
//                             }}
//                           >
//                             Status
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               background: "#1C2536",
//                               color: "#D65DB1",
//                               fontWeight: 700,
//                             }}
//                             align="right"
//                           >
//                             Action
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {dummyInvoices.map((invoice) => (
//                           <TableRow key={invoice.id}>
//                             <TableCell
//                               sx={{
//                                 color: "#EDF2F7",
//                               }}
//                             >
//                               {invoice.id}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 color: "#EDF2F7",
//                               }}
//                             >
//                               {invoice.customer}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 color: "#EDF2F7",
//                               }}
//                             >
//                               {invoice.ticketDescription}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 color: "#EDF2F7",
//                               }}
//                             >
//                               <Chip
//                                 variant="filled"
//                                 size="30px"
//                                 icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
//                                 sx={{
//                                   fontSize: "12px",
//                                   backgroundColor: "#1D1F3B",
//                                   color: theme.palette.primary.main,
//                                   fontWeight: 800,
//                                 }}
//                                 label={invoice.targetDate}
//                               />
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 color: "#EDF2F7",
//                               }}
//                             >
//                               <Chip
//                                 variant="filled"
//                                 size="30px"
//                                 icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
//                                 sx={{
//                                   fontSize: "12px",
//                                   backgroundColor: "#1D1F3B",
//                                   color: theme.palette.primary.main,
//                                   fontWeight: 800,
//                                 }}
//                                 label={invoice.closedDate}
//                               />
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 color: "#EDF2F7",
//                               }}
//                             >
//                               <Stack direction="row" alignItems="center" spacing={1}>
//                                 <FiberManualRecord sx={{ color: statusColors[invoice.status], fontSize: 12 }} />
//                                 <Typography sx={{ fontSize: 12 }}>{invoice.status}</Typography>
//                               </Stack>
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 color: "#EDF2F7",
//                               }}
//                               align="right"
//                             >
//                               <ArrowForward />
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   <TablePagination
//                     sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={dummyInvoices?.totalCount || 0}
//                     rowsPerPage={dummyInvoices?.pageSize || 5}
//                     page={dummyInvoices?.currentPage - 1 || 0}
//                     onPageChange={onPageNumberChange}
//                     onRowsPerPageChange={onPageSizeChange}
//                   />
//                 </Box>
//               </Stack>
//             </Stack>
//           </Stack>
//         </Stack>
//       </Stack>
//     </Stack>
//   );
// };

// export default Overview;
