import React from "react";
import moment from "moment";
import { theme } from "../../../theme/theme";

import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator, timelineOppositeContentClasses } from "@mui/lab";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography, useMediaQuery } from "@mui/material";
import { AccessTimeOutlined, DiscountOutlined, ExpandMore, PersonOutlineOutlined, Receipt } from "@mui/icons-material";

import { useGetTicketHistoryQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

const TicketHistory = ({ data }) => {
  const { data: historyData } = useGetTicketHistoryQuery(data?.ticketConcernId, {
    skip: !data?.ticketConcernId,
  });

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack sx={{ width: "100%" }}>
      <Accordion sx={{ background: theme.palette.bgForm.black2, padding: 1 }}>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
          <Stack direction="row" gap={0.5} sx={{ width: "100%", alignItems: "center" }}>
            <DiscountOutlined sx={{ fontSize: isScreenSmall ? "16px " : "18px" }} />
            <Typography sx={{ fontSize: isScreenSmall ? "14px " : "16px" }}>Ticket Timeline</Typography>
          </Stack>
        </AccordionSummary>

        <AccordionDetails>
          <Stack sx={{ width: "100%", height: "auto", background: theme.palette.bgForm.black2, borderRadius: "20px" }}>
            <Timeline
              position="right"
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                  alignItems: "center",
                },
              }}
            >
              {/* Upcoming History */}
              {historyData?.value?.[0]?.upComingApprovers?.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="text.secondary" sx={{ fontSize: "13px" }}>
                    <Stack direction="row">
                      {/* <AccessTimeOutlined sx={{ fontSize: "20px", color: "text.secondary" }} /> */}
                      <Typography sx={{ fontSize: isScreenSmall ? "9px" : "13px" }}>{moment(item.transaction_Date).format("llll")}</Typography>
                    </Stack>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <TimelineDot color="grey" />
                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: isScreenSmall ? "15px" : "17px",
                        fontWeight: 900,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {item.request}
                    </Typography>

                    <Typography color="text.secondary" sx={{ fontSize: isScreenSmall ? "13px" : "15px" }}>
                      {item.status}
                    </Typography>

                    <Stack direction="row" gap={0.5} mt={1} sx={{ alignItems: "center" }}>
                      <PersonOutlineOutlined sx={{ fontSize: isScreenSmall ? "18px" : "20px", color: theme.palette.text.main }} />
                      <Typography sx={{ fontSize: isScreenSmall ? "12px" : "14px", fontStyle: "italic", fontWeight: 500, color: theme.palette.text.main }}>
                        {item.transacted_By}
                      </Typography>
                    </Stack>

                    <Stack gap={0} marginTop={2}>
                      <Typography color="text.secondary" sx={{ fontSize: isScreenSmall ? "13px" : "15px", fontWeight: "500", color: theme.palette.text.main }}>
                        {item.remarks ? "Reason: " : ""}
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: isScreenSmall ? "13px" : "15px", fontWeight: "500", color: theme.palette.text.secondary }}>
                        {item.remarks ? item.remarks : ""}
                      </Typography>
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
              ))}

              {/* Ticket History */}
              {historyData?.value?.[0]?.getTicketHistoryConcerns?.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="text.secondary" sx={{ fontSize: "13px" }}>
                    <Stack direction="row">
                      {/* <AccessTimeOutlined sx={{ fontSize: "20px", color: "text.secondary" }} /> */}
                      <Typography sx={{ fontSize: isScreenSmall ? "9px" : "13px" }}>{moment(item.transaction_Date).format("llll")}</Typography>
                    </Stack>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <TimelineDot color={item.request === "Rejected" ? "error" : item.request === "Disapprove" ? "error" : item.request === "Cancel" ? "error" : "success"} />
                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: isScreenSmall ? "15px" : "17px",
                        fontWeight: 900,
                        color:
                          item.request === "Rejected"
                            ? theme.palette.error.main
                            : item.request === "Disapprove"
                            ? theme.palette.error.main
                            : item.request === "Cancel"
                            ? theme.palette.error.main
                            : theme.palette.success.main,
                      }}
                    >
                      {item.request}
                    </Typography>

                    <Typography color="text.secondary" sx={{ fontSize: isScreenSmall ? "13px" : "15px" }}>
                      {item.status}
                    </Typography>

                    <Stack direction="row" gap={0.5} mt={1} sx={{ alignItems: "center" }}>
                      {/* <PersonOutlineOutlined sx={{ fontSize: "20px", color: "#22B4BF" }} /> */}
                      <PersonOutlineOutlined sx={{ fontSize: isScreenSmall ? "18px" : "20px", color: theme.palette.text.main }} />
                      <Typography sx={{ fontSize: isScreenSmall ? "12px" : "14px", fontStyle: "italic", fontWeight: 500, color: theme.palette.text.main }}>
                        {item.transacted_By}
                      </Typography>
                    </Stack>

                    <Stack gap={0} marginTop={2}>
                      <Typography color="text.secondary" sx={{ fontSize: isScreenSmall ? "13px" : "15px", fontWeight: "500", color: theme.palette.text.main }}>
                        {item.remarks ? "Reason: " : ""}
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: isScreenSmall ? "13px" : "15px", fontWeight: "500", color: theme.palette.error.main }}>
                        {item.remarks ? item.remarks : ""}
                      </Typography>
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default TicketHistory;
