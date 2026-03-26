import { Close, TodayOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import moment from "moment";
import { theme } from "../../../theme/theme";
import noStore from "../../../assets/svg/noLocation.svg";

const PmsDetailDialog = ({ data, getDate, open, onClose }) => {
  console.log("Data: ", data);

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onClose();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto", border: "2px solid #4b586f" } }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Stack sx={{ borderBottom: "2px solid #4b586f" }}>
            <Stack p={2} direction="row" justifyContent="space-between">
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>Store Visits</Typography>
                <Typography color="gray" sx={{ fontSize: "13px" }}>
                  {moment(getDate).format("dddd, MMMM D, YYYY")}
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onClose}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          {data?.length ? (
            <Stack p={4} gap={1}>
              {data?.map((item, i) =>
                moment(item?.date).format("YYYY-MM-DD") === getDate ? (
                  <Stack key={i} sx={{ p: 2, backgroundColor: theme.palette.bgForm.black2, border: "2px solid #4b586f", borderRadius: "12px" }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: "13px", fontWeight: 800 }}>{item?.store}</Typography>

                      <Typography sx={{ fontSize: "13px", color: item?.status === "Done" ? theme.palette.success.main : theme.palette.warning.main, fontWeight: 700 }}>
                        {item.status}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>{item.area}</Typography>

                      {item?.status === "Pending" && (
                        <Button
                          variant="outlined"
                          size="small"
                          // color="info"
                          startIcon={<TodayOutlined />}
                          sx={{
                            borderRadius: 0,
                            fontSize: "0.7rem",
                            padding: "2px 6px",
                            minWidth: "unset",
                          }}
                        >
                          Resched
                        </Button>
                      )}
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>{`PMS: ${item.completion}`}</Typography>
                    </Stack>
                  </Stack>
                ) : null,
              )}
            </Stack>
          ) : (
            <Stack p={4} gap={1}>
              <Stack spacing={1} sx={{ height: "420px", backgroundColor: theme.palette.bgForm.black2, justifyContent: "center", alignItems: "center" }}>
                <img src={noStore} alt="No Store Found" className="norecords-found-table" />
                <Typography color="gray" align="center">
                  No store scheduled for this date
                </Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default PmsDetailDialog;
