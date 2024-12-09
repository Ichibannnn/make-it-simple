import { Stack, Typography, Grid, Card, CardContent, Box } from "@mui/material";
import React from "react";
import { theme } from "../../theme/theme";
import { Toaster } from "sonner";
import { PieChart, Pie, Cell } from "recharts";
import { Assignment, Business } from "@mui/icons-material";

const dummyData = {
  totalTickets: 100,
  totalUnits: 5,
  units: [
    { name: "Unit 1", value: 20, color: "#0088FE" },
    { name: "Unit 2", value: 25, color: "#00C49F" },
    { name: "Unit 3", value: 15, color: "#FFBB28" },
    { name: "Unit 4", value: 30, color: "#FF8042" },
    { name: "Unit 5", value: 10, color: "#A28BFB" },
  ],
};

const Overview = () => {
  const { totalTickets, units } = dummyData;

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

      <Stack sx={{ width: "100%" }}>
        <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
          <Stack sx={{ width: "100%" }}>
            <Stack justifyItems="left">
              <Typography variant="h4">Overview</Typography>
            </Stack>

            <Stack justifyItems="space-between" direction="row" padding={4}>
              <Grid container spacing={3}>
                {/* Cards */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ width: "100%", height: "100%", backgroundColor: "#111927" }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        {/* Icon with Shadowed Circle */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 48,
                            height: 48,
                            backgroundColor: "#1E88E5", // Adjust color as needed
                            borderRadius: "50%",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <Assignment sx={{ color: "#fff" }} />
                        </Box>

                        <Box>
                          <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Total Tickets:</Typography>
                          <Typography variant="h4">{totalTickets}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ width: "100%", height: "100%", backgroundColor: theme.palette.bgForm.black_2 }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        {/* Icon with Shadowed Circle */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 48,
                            height: 48,
                            backgroundColor: "#43A047", // Adjust color as needed
                            borderRadius: "50%",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <Business sx={{ color: "#fff" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Total Units:</Typography>
                          <Typography variant="h4">{units.length}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Pie Chart Section */}
                <Grid item xs={12} md={8}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 3,
                      width: "100%",
                      mt: 4,
                      // backgroundColor: "#111927",
                      padding: 4,
                    }}
                  >
                    {/* <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                      }}
                    >
                      <Assignment sx={{ color: "#fff" }} />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Tickets:</Typography>
                    </Box> */}

                    {/* Pie Chart */}
                    <PieChart width={300} height={300}>
                      <Pie data={units} cx="50%" cy="50%" labelLine={false} outerRadius={150} fill="#8884d8" dataKey="value">
                        {units.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>

                    {/* Legends */}
                    <Stack spacing={2}>
                      {units.map((unit) => (
                        <Stack key={unit.name} direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              backgroundColor: unit.color,
                              borderRadius: "50%",
                            }}
                          />
                          <Typography>{unit.name}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Overview;
