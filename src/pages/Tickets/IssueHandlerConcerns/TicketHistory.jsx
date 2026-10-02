import moment from "moment";
import { theme } from "../../../theme/theme";
import { getStatus, ticketStyle as sx } from "./style/ticketStyle";

import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator, timelineOppositeContentClasses } from "@mui/lab";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { DiscountOutlined, ExpandMore, History, PersonOutlineOutlined } from "@mui/icons-material";

import { useGetTicketHistoryQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

const TicketHistory = ({ data }) => {
  const { data: historyData } = useGetTicketHistoryQuery(data?.ticketConcernId, {
    skip: !data?.ticketConcernId,
  });

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const upcoming = historyData?.value?.[0]?.upComingApprovers ?? [];
  const history = historyData?.value?.[0]?.getTicketHistoryConcerns ?? [];

  return (
    <Stack sx={{ width: "100%" }}>
      <Accordion defaultExpanded sx={sx.accordionHistory}>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
          <Stack sx={sx.titleHeader}>
            <Typography sx={sx.titleHeader}>Ticket Timeline</Typography>
          </Stack>
        </AccordionSummary>

        <AccordionDetails>
          <Stack>
            <Timeline position="right" sx={sx.labTimeline}>
              {/* Upcoming approvers (pending) */}
              {upcoming.map((item, index) => {
                const status = item.transaction_Date ? getStatus(item.request) : "pending";
                const isLast = history.length === 0 && index === upcoming.length - 1;

                return (
                  <TimelineItem key={`up-${index}`}>
                    <TimelineOppositeContent>
                      {item.transaction_Date ? (
                        <Typography sx={sx.dateText}>{moment(item.transaction_Date).format("llll")}</Typography>
                      ) : (
                        <Box sx={sx.pendingBox}>
                          <History />
                          <Typography sx={sx.dateText}>Pending...</Typography>
                        </Box>
                      )}
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                      <TimelineDot variant={status === "pending" ? "outlined" : "filled"} sx={sx.labDot(status)} />
                      {!isLast && <TimelineConnector sx={sx.labConnector(status)} />}
                    </TimelineSeparator>

                    <TimelineContent sx={sx.labContent}>
                      <Box sx={sx.stepTitle(status)}>{item.request}</Box>
                      <Box sx={sx.stepDesc}>{item.status}</Box>

                      <Box sx={sx.whoRow}>
                        <PersonOutlineOutlined />
                        <Typography sx={sx.whoText}>{item.transacted_By}</Typography>
                      </Box>

                      {item.remarks && (
                        <Box sx={sx.reasonBox(status)}>
                          <Typography sx={sx.reasonLabel}>Reason</Typography>
                          <Typography sx={sx.reasonText}>{item.remarks}</Typography>
                        </Box>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                );
              })}

              {/* Ticket history (completed) */}
              {history.map((item, index) => {
                const status = getStatus(item.request);
                const isLast = index === history.length - 1;

                return (
                  <TimelineItem key={`hist-${index}`}>
                    <TimelineOppositeContent>
                      <Typography sx={sx.dateText}>{moment(item.transaction_Date).format("llll")}</Typography>
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                      <TimelineDot variant="filled" sx={sx.labDot(status)} />
                      {!isLast && <TimelineConnector sx={sx.labConnector(status)} />}
                    </TimelineSeparator>

                    <TimelineContent sx={sx.labContent}>
                      <Box sx={sx.stepTitle(status)}>{item.request}</Box>
                      <Box sx={sx.stepDesc}>{item.status}</Box>

                      <Box sx={sx.whoRow}>
                        <PersonOutlineOutlined />
                        <Typography sx={sx.whoText}>{item.transacted_By}</Typography>
                      </Box>

                      {item.remarks && (
                        <Box sx={sx.reasonBox(status)}>
                          <Typography sx={sx.reasonLabel}>Reason</Typography>
                          <Typography sx={sx.reasonText}>{item.remarks}</Typography>
                        </Box>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default TicketHistory;
