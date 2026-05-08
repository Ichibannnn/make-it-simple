import moment from "moment";
import { theme } from "../../../theme/theme";

import { Close, History, PersonOutlineOutlined } from "@mui/icons-material";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator, timelineOppositeContentClasses } from "@mui/lab";
import { Box, Dialog, DialogContent, Divider, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import { useGetTicketHistoryQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

const ConcernHistory = ({ data, open, onClose }) => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data: historyData } = useGetTicketHistoryQuery(data?.ticketRequestConcerns?.[0]?.ticketConcernId, {
    skip: !data?.ticketRequestConcerns?.[0]?.ticketConcernId,
  });

  const onCloseHandler = () => {
    onClose();
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open} onClose={onCloseHandler} disableEscapeKeyDown={false} sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}>
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <Stack>
                <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "700", fontSize: "18px" }}>
                  {`Ticket Number: ${moment(data?.created_At).format("YYYY")}-${data?.ticketRequestConcerns?.[0]?.ticketConcernId}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />

          <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
            <Stack gap={2} sx={{ padding: 2, borderRadius: "20px" }}>
              <Stack>
                <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "700", fontSize: "18px" }}>
                  Timeline History
                </Typography>
              </Stack>

              {/* TIMELINE */}
              <Stack sx={{ width: "100%", height: "auto", background: theme.palette.bgForm.black2, padding: 2, borderRadius: "20px" }}>
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
                        <Stack>
                          {item.transaction_Date ? (
                            <Typography sx={{ fontSize: isScreenSmall ? "9px" : "13px" }}>{moment(item.transaction_Date).format("llll")}</Typography>
                          ) : (
                            <Stack>
                              <Box gap={0.3} sx={{ display: "flex", direction: "row", alignItems: "center", justifyContent: "end" }}>
                                <History />
                                <Typography sx={{ fontSize: isScreenSmall ? "9px" : "13px" }}>Pending...</Typography>
                              </Box>
                            </Stack>
                          )}
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
                            fontSize: "17px",
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

                        <Typography color="text.secondary" sx={{ fontSize: "15px" }}>
                          {item.status}
                        </Typography>

                        <Stack direction="row" gap={0.5} mt={1} sx={{ alignItems: "center" }}>
                          <PersonOutlineOutlined sx={{ fontSize: "20px", color: theme.palette.text.main }} />
                          <Typography sx={{ fontSize: "14px", fontStyle: "italic", fontWeight: 500, color: theme.palette.text.main }}>{item.transacted_By}</Typography>
                        </Stack>

                        <Stack gap={0} marginTop={2}>
                          <Typography color="text.secondary" sx={{ fontSize: "15px", fontWeight: "700" }}>
                            {item.remarks ? "Reason: " : ""}
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontSize: "15px", fontWeight: "700", color: theme.palette.error.main }}>
                            {item.remarks ? item.remarks : ""}
                          </Typography>
                        </Stack>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConcernHistory;
