import React from "react";
import moment from "moment";
import { theme } from "../../../../theme/theme";

import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator, timelineOppositeContentClasses } from "@mui/lab";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { AccessTimeOutlined, PersonOutlineOutlined } from "@mui/icons-material";

import { useGetTicketHistoryQuery } from "../../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

const ClosingTicketHistory = ({ data }) => {
  const { data: historyData } = useGetTicketHistoryQuery(data?.ticketConcernId, {
    skip: !data?.ticketConcernId,
  });

  const isSmallScreen = useMediaQuery("(max-width: 1024px) and (max-height: 911px)");

  return (
    <Stack sx={{ width: isSmallScreen ? "100%" : "50%", height: "auto", background: theme.palette.bgForm.black2, padding: 2, borderRadius: "20px" }}>
      <Timeline
        position="right"
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
            alignItems: "center",
          },
        }}
      >
        {historyData?.value?.[0]?.getTicketHistoryConcerns?.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="text.secondary" sx={{ fontSize: "13px" }}>
              <Stack direction="row">
                <AccessTimeOutlined sx={{ fontSize: "20px", color: "text.secondary" }} />
                <Typography sx={{ fontSize: "13px" }}>{moment(item.transaction_Date).format("llll")}</Typography>
              </Stack>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot color={item.request === "Rejected" ? "error" : "success"} />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <Typography component="span" sx={{ fontSize: "19px", fontWeight: 900, color: item.request === "Rejected" ? theme.palette.error.main : theme.palette.success.main }}>
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
  );
};

export default ClosingTicketHistory;
