import { Box, Typography, Grid, Card, CardContent, Stack, useMediaQuery, CircularProgress } from "@mui/material";
import { Assignment, AssignmentLate, FiberManualRecord } from "@mui/icons-material";

import { theme } from "../../theme/theme";
import { useGetOverviewQuery } from "../../features/api_overview/overviewApi";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import noRecordsFound from "../../assets/svg/noRecordsFound.svg";

const Overview = () => {
  const { data, isLoading, isFetching, isSuccess } = useGetOverviewQuery();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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
                  <Typography variant="h4">{data?.value[0]?.totalTicket ? data?.value[0]?.totalTicket : "0"}</Typography>
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
                  <Typography variant="h4">{data?.value[0]?.totalDelay ? data?.value[0]?.totalDelay : "0"}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bar Chart Section */}
      <Box mt={4} padding={2} sx={{ backgroundColor: theme.palette.bgForm.black3, minHeight: "560px" }}>
        <Stack direction="row" gap={0.5} alignItems="center" justifyContent="center" sx={{ width: "100%" }} mb={2} mt={2}>
          <Typography gutterBottom sx={{ color: "#8884d8", fontSize: "17px", fontWeight: 600 }}>
            Ticket Distribution (Ranked by Tickets)
          </Typography>
        </Stack>

        <ResponsiveContainer width="100%" height={chartData?.length * 40}>
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

          {(isLoading || isFetching) && (
            <Stack sx={{ width: "100%", gap: 1, justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
              <Typography variant="h5" color="#EDF2F7">
                Please wait...
              </Typography>
            </Stack>
          )}

          {isSuccess && !chartData?.length && (
            <Stack sx={{ width: "100%", gap: 1, justifyContent: "center", alignItems: "center" }}>
              <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
              <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                No Tickets Available.
              </Typography>
            </Stack>
          )}
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
};

export default Overview;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload?.length) {
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
