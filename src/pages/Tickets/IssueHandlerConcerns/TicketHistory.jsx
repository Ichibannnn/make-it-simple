import { useMemo, useState } from "react";
import moment from "moment";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { ExpandMore, History, ViewTimeline } from "@mui/icons-material";
import { useGetTicketHistoryQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { ticketStyle as sx } from "./style/ticketStyle";

const NEGATIVE = ["Rejected", "Disapprove", "Cancel"];
const getTone = (item, pending) =>
  pending ? "pending" : NEGATIVE.includes(item.request) ? "error" : "ok";

const getInitials = (name = "") => {
  const [last = "", rest = ""] = name.includes(",")
    ? name.split(",").map((s) => s.trim())
    : ["", name.trim()];
  const first = rest.split(" ")[0] || last;
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || "?";
};

const DateCell = ({ date }) =>
  date ? (
    <Stack>
      <Typography sx={sx.dateDay}>
        {moment(date).format("MMM D, YYYY")}
      </Typography>
      <Typography sx={sx.dateTime}>{moment(date).format("h:mm A")}</Typography>
    </Stack>
  ) : (
    <Box sx={sx.pendingBox}>
      <History sx={{ fontSize: 16 }} />
      Pending
    </Box>
  );

const Reason = ({ text, tone }) => {
  const [open, setOpen] = useState(false);
  const isLong = text.length > 160;

  return (
    <Box sx={sx.reasonBox({ tone })}>
      <Typography sx={sx.reasonLabel}>Reason</Typography>
      <Typography
        sx={[sx.reasonText({ tone }), !open && isLong && sx.reasonClamp]}
      >
        {text}
      </Typography>
      {isLong && (
        <Button
          disableRipple
          onClick={() => setOpen((o) => !o)}
          sx={sx.reasonToggle}
        >
          {open ? "Show less" : "Show more"}
        </Button>
      )}
    </Box>
  );
};

const Entry = ({ item, pending, next, isLast }) => {
  const tone = getTone(item, pending);

  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <DateCell date={pending ? null : item.transaction_Date} />
      </TimelineOppositeContent>

      <TimelineSeparator>
        <TimelineDot sx={sx.dot({ tone, next })} />
        {!isLast && <TimelineConnector sx={sx.connector(pending)} />}
      </TimelineSeparator>

      <TimelineContent sx={sx.timelineContent}>
        <Box sx={sx.card({ tone })}>
          <Typography sx={sx.statusText({ tone, next })}>
            {item.request}
          </Typography>
          <Typography sx={sx.historyDesc}>{item.status}</Typography>

          <Stack sx={sx.transactedByBox}>
            <Avatar sx={sx.avatar}>{getInitials(item.transacted_By)}</Avatar>
            <Typography sx={sx.transactedBy}>{item.transacted_By}</Typography>
          </Stack>

          {item.remarks && <Reason text={item.remarks} tone={tone} />}
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
};

const TicketHistory = ({ data }) => {
  const { data: historyData, isLoading } = useGetTicketHistoryQuery(
    data?.ticketConcernId,
    {
      skip: !data?.ticketConcernId,
    },
  );

  const entries = useMemo(() => {
    const record = historyData?.value?.[0];
    const upcoming = (record?.upComingApprovers ?? []).map((item) => ({
      item,
      pending: true,
    }));
    const past = (record?.getTicketHistoryConcerns ?? []).map((item) => ({
      item,
      pending: false,
    }));
    return [...upcoming, ...past];
  }, [historyData]);

  // The step closest to "now" is the last upcoming one (the list reads newest -> oldest)
  const nextIndex = entries.reduce((acc, e, i) => (e.pending ? i : acc), -1);

  return (
    <Stack sx={{ width: "100%" }}>
      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={sx.accordionHistory}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "text.secondary" }} />}
          aria-controls="ticket-timeline-content"
          id="ticket-timeline-header"
        >
          <Stack sx={sx.titleHeader}>
            <ViewTimeline sx={sx.titleHeaderIcon} />
            <Typography sx={sx.titleText}>Ticket Timeline</Typography>
          </Stack>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 1 }}>
          {isLoading ? (
            <Stack gap={2}>
              {[0, 1, 2].map((i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={84}
                  sx={{ bgcolor: "rgba(255,255,255,0.05)" }}
                />
              ))}
            </Stack>
          ) : entries.length === 0 ? (
            <Typography sx={sx.emptyText}>
              No activity on this ticket yet.
            </Typography>
          ) : (
            <Timeline position="right" sx={sx.timeline}>
              {entries.map(({ item, pending }, index) => (
                <Entry
                  key={`${pending ? "up" : "hist"}-${index}`}
                  item={item}
                  pending={pending}
                  next={index === nextIndex}
                  isLast={index === entries.length - 1}
                />
              ))}
            </Timeline>
          )}
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default TicketHistory;
