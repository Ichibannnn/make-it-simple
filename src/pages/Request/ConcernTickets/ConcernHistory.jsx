import moment from "moment";
import { theme } from "../../../theme/theme";

import { Close, History, PersonOutlineOutlined } from "@mui/icons-material";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator, timelineOppositeContentClasses } from "@mui/lab";
import { Avatar, Box, Button, Dialog, DialogContent, Divider, IconButton, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import { useGetTicketHistoryQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { reqConcernStyles as sx } from "./style/reqConcernStyles";
import { useMemo, useState } from "react";

const NEGATIVE = ["Rejected", "Disapprove", "Cancel"];
const getTone = (item, pending) => (pending ? "pending" : NEGATIVE.includes(item.request) ? "error" : "ok");

const getInitials = (name = "") => {
  const [last = "", rest = ""] = name.includes(",") ? name.split(",").map((s) => s.trim()) : ["", name.trim()];
  const first = rest.split(" ")[0] || last;
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || "?";
};

const DateCell = ({ date }) =>
  date ? (
    <Stack>
      <Typography sx={sx.dateDay}>{moment(date).format("MMM D, YYYY")}</Typography>
      <Typography sx={sx.dateTime}>{moment(date).format("h:mm A")}</Typography>
    </Stack>
  ) : (
    <Box sx={sx.pendingBox}>
      <History sx={{ fontSize: 16 }} />
      Pending
    </Box>
  );

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
          <Typography sx={sx.statusText({ tone, next })}>{item.request}</Typography>
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

const Reason = ({ text, tone }) => {
  const [open, setOpen] = useState(false);
  const isLong = text.length > 160;

  return (
    <Box sx={sx.reasonBox({ tone })}>
      <Typography sx={sx.reasonLabel}>Reason</Typography>
      <Typography sx={[sx.reasonText({ tone }), !open && isLong && sx.reasonClamp]}>{text}</Typography>
      {isLong && (
        <Button disableRipple onClick={() => setOpen((o) => !o)} sx={sx.reasonToggle}>
          {open ? "Show less" : "Show more"}
        </Button>
      )}
    </Box>
  );
};

const ConcernHistory = ({ data, open, onClose }) => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data: historyData, isLoading } = useGetTicketHistoryQuery(data?.ticketRequestConcerns?.[0]?.ticketConcernId, {
    skip: !data?.ticketRequestConcerns?.[0]?.ticketConcernId,
  });

  const entries = useMemo(() => {
    const record = historyData?.value?.[0];
    const upcoming = (record?.upComingApprovers ?? []).map((item) => ({ item, pending: true }));
    const past = (record?.getTicketHistoryConcerns ?? []).map((item) => ({ item, pending: false }));
    return [...upcoming, ...past];
  }, [historyData]);

  // The step closest to "now" is the last upcoming one (the list reads newest -> oldest)
  const nextIndex = entries.reduce((acc, e, i) => (e.pending ? i : acc), -1);

  const onCloseHandler = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onCloseHandler}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        // PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <Stack sx={sx.titleHeaderStack}>
                <Typography sx={sx.titleText}> {`Ticket Number: ${moment(data?.created_At).format("YYYY")}-${data?.ticketRequestConcerns?.[0]?.ticketConcernId}`}</Typography>
              </Stack>
            </Stack>

            <IconButton onClick={onCloseHandler}>
              <Close />
            </IconButton>
          </Stack>

          <Divider variant="fullWidth" sx={sx.divider} />

          <Stack gap={2} sx={{ padding: 2, borderRadius: "20px", marginTop: 2 }}>
            {/* TIMELINE */}
            <Stack sx={sx.dialogStack}>
              <Stack sx={sx.titleHeaderStack}>
                <Box sx={sx.titleBar} />
                <Typography sx={sx.titleText}>Timeline History</Typography>
              </Stack>

              {isLoading ? (
                <Stack gap={2}>
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} variant="rounded" height={84} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                  ))}
                </Stack>
              ) : entries.length === 0 ? (
                <Typography sx={sx.emptyText}>No activity on this ticket yet.</Typography>
              ) : (
                <Timeline position="right" sx={sx.timeline}>
                  {entries.map(({ item, pending }, index) => (
                    <Entry key={`${pending ? "up" : "hist"}-${index}`} item={item} pending={pending} next={index === nextIndex} isLast={index === entries.length - 1} />
                  ))}
                </Timeline>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConcernHistory;
