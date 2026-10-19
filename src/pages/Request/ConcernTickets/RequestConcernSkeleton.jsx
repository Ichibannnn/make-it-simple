import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Stack } from "@mui/material";

// One label + one input, mirrors the real form fields
const FieldSkeleton = ({ labelWidth = 110, height = 40 }) => (
  <Stack spacing={0.75}>
    <Skeleton variant="text" width={labelWidth} height={18} />
    <Skeleton variant="rounded" height={height} />
  </Stack>
);

// 2 columns on md+, 1 column on small screens, no negative margins
const FormGrid = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
      gap: 2,
    }}
  >
    {children}
  </Box>
);

const SectionTitle = ({ width = 140 }) => <Skeleton variant="text" width={width} height={22} sx={{ mb: 1.5 }} />;

const RequestDialogSkeleton = ({ open, onCloseAction }) => (
  <Dialog
    fullWidth
    maxWidth="lg"
    open={open}
    onClose={(event, reason) => {
      if (reason === "backdropClick") {
        event.stopPropagation();
        return;
      }
      onCloseAction();
    }}
    sx={{ backdropFilter: "blur(5px)" }}
    PaperProps={{ "aria-busy": true, "aria-label": "Loading form" }}
  >
    {/* Header */}
    <DialogTitle
      component="div"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
      }}
    >
      <Stack spacing={0.5} sx={{ flex: 1 }}>
        <Skeleton variant="text" width={220} height={30} />
        <Skeleton variant="text" width={320} height={18} />
      </Stack>
      <Skeleton variant="circular" width={32} height={32} />
    </DialogTitle>

    <DialogContent dividers sx={{ py: 3, minHeight: 600 }}>
      <Stack spacing={4}>
        {/* Requestor details */}
        <Box>
          <SectionTitle />
          <FormGrid>
            <FieldSkeleton labelWidth={120} />
            <FieldSkeleton labelWidth={150} />
            {[90, 120, 100, 60, 80, 70].map((w, i) => (
              <FieldSkeleton key={i} labelWidth={w} />
            ))}
          </FormGrid>
        </Box>

        {/* Concern details */}
        <Box>
          <SectionTitle width={130} />
          <FormGrid>
            {[110, 80, 90, 100].map((w, i) => (
              <FieldSkeleton key={i} labelWidth={w} />
            ))}
          </FormGrid>

          {/* Date (half width, aligned with the left column) */}
          <Box sx={{ mt: 2, width: { xs: "100%", md: "calc(50% - 8px)" } }}>
            <FieldSkeleton labelWidth={90} />
          </Box>
        </Box>

        {/* Concern textarea + Add concern button */}
        <Stack spacing={1.5}>
          <Skeleton variant="text" width={70} height={18} />
          <Skeleton variant="rounded" height={110} />
          <Skeleton variant="rounded" height={40} />
        </Stack>

        {/* Notes */}
        <Stack spacing={0.75}>
          <Skeleton variant="text" width={110} height={18} />
          <Skeleton variant="rounded" height={84} />
        </Stack>

        {/* Attachment drop zone */}
        <Stack spacing={0.75}>
          <Skeleton variant="text" width={130} height={18} />
          <Skeleton variant="rounded" height={72} />
        </Stack>
      </Stack>
    </DialogContent>

    {/* Footer */}
    <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
      <Skeleton variant="rounded" width={90} height={40} />
      <Skeleton variant="rounded" width={120} height={40} />
    </DialogActions>
  </Dialog>
);

export default RequestDialogSkeleton;
