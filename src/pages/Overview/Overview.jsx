// import React from "react";
// import { Stack, Typography } from "@mui/material";
// import { theme } from "../../theme/theme";
// import { Toaster } from "sonner";
// import { FaTicketAlt, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { Bar } from "react-chartjs-2"; // Import Bar component from react-chartjs-2

// const Overview = () => {
//   // Sample ticket data per month
//   const ticketData = {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [
//       {
//         label: "On-time Tickets",
//         backgroundColor: "rgba(75,192,192,0.2)",
//         borderColor: "rgba(75,192,192,1)",
//         borderWidth: 1,
//         hoverBackgroundColor: "rgba(75,192,192,0.4)",
//         hoverBorderColor: "rgba(75,192,192,1)",
//         data: [65, 59, 80, 81, 56, 55], // Sample data for demonstration
//       },
//     ],
//   };

//   return (
//     <Stack
//       sx={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         backgroundColor: theme.palette.bgForm.black1,
//         color: "#fff",
//         padding: "44px 94px 94px 94px",
//       }}
//     >
//       <Toaster richColors position="top-right" />
//       {/* First Stack */}
//       <Stack direction="row" spacing={4}>
//         {/* All Tickets */}
//         <Stack alignItems="center">
//           <FaTicketAlt size={24} />
//           <Typography variant="h6">All Tickets</Typography>
//           <Typography variant="body1">100</Typography> {/* Static number */}
//         </Stack>
//         {/* Open Tickets */}
//         <Stack alignItems="center">
//           <FaClock size={24} />
//           <Typography variant="h6">Open Tickets</Typography>
//           <Typography variant="body1">20</Typography> {/* Static number */}
//         </Stack>
//         {/* Pending Tickets */}
//         <Stack alignItems="center">
//           <FaCheckCircle size={24} />
//           <Typography variant="h6">Pending Tickets</Typography>
//           <Typography variant="body1">30</Typography> {/* Static number */}
//         </Stack>
//         {/* Closed Tickets */}
//         <Stack alignItems="center">
//           <FaTimesCircle size={24} />
//           <Typography variant="h6">Closed Tickets</Typography>
//           <Typography variant="body1">50</Typography> {/* Static number */}
//         </Stack>
//       </Stack>
//     </Stack>
//   );
// };

// export default Overview;

import { Stack, Typography } from "@mui/material";
import React from "react";
import { theme } from "../../theme/theme";
import { useChangeUserPasswordMutation } from "../../features/user_management_api/user/userApi";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const Overview = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "44px 94px 94px 94px",
      }}
    >
      <Toaster richColors position="top-right" />
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant="h4">Overview</Typography>
            </Stack>
            <Stack justifyItems="space-between" direction="row"></Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Overview;
