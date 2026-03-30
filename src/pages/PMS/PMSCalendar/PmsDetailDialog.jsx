import { Close, FiberManualRecord, TodayOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import moment from "moment";
import { theme } from "../../../theme/theme";
import noStore from "../../../assets/svg/noSchedule2.svg";
import { useState } from "react";
import useDisclosure from "../../../hooks/useDisclosure";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const PmsDetailDialog = ({ data, getDate, open, onClose }) => {
  const [getRescheduleData, setGetRescheduleData] = useState(null);
  const filteredData = data?.filter((item) => moment(item?.date).format("YYYY-MM-DD") === getDate);

  const { open: openScheduleDialog, onToggle: onToggleScheduleDialog, onClose: onCloseScheduleDialog } = useDisclosure();

  const onReschedule = (item) => {
    setGetRescheduleData(item);
    onToggleScheduleDialog();
  };

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

          {filteredData?.length > 0 ? (
            <Stack p={4} gap={1}>
              {filteredData.map((item, i) => (
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
                        color="accent"
                        startIcon={<TodayOutlined />}
                        onClick={() => onReschedule(item)}
                        sx={{
                          borderRadius: "5px",
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
              ))}
            </Stack>
          ) : (
            <Stack>
              <Stack sx={{ height: "320px", justifyContent: "center", alignItems: "center" }}>
                <img src={noStore} alt="No Store Found" className="nostore-illustration" />
                <Typography color="gray" align="center">
                  No store scheduled for this date
                </Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <PmsScheduleDialog data={getRescheduleData} openScheduleDialog={openScheduleDialog} onCloseScheduleDialog={onCloseScheduleDialog} />
    </>
  );
};

export default PmsDetailDialog;

const schema = yup.object().shape({
  TargetDate: yup.date().required().label("Target Date"),
  Reason: yup.string().required().label("Reason"),
});

const PmsScheduleDialog = ({ data, openScheduleDialog, onCloseScheduleDialog }) => {
  console.log("ScheduledData: ", data);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      RescheduleDate: null,
      Reason: "",
    },
  });

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openScheduleDialog}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseScheduleDialog();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto", border: "2px solid #4b586f" } }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Stack sx={{ borderBottom: "2px solid #4b586f" }}>
            <Stack p={2} direction="row" justifyContent="space-between" alignItems="center">
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>Reschedule Store Visit</Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseScheduleDialog}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          <Stack pr={4} pl={4} pt={4} sx={{ maxHeight: "400px" }}>
            <Stack p={2} sx={{ overflow: "auto", border: "1px solid #4b586f", borderRadius: "7px" }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 700, color: theme.palette.text.secondary }}>Current Schedule</Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 800 }}>{data?.store}</Typography>
              <Typography sx={{ fontSize: "12px" }}>{data?.area}</Typography>
            </Stack>
          </Stack>

          <Stack pr={4} pl={4} pt={2} gap={2}>
            <Stack sx={{ width: "100%" }}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "13px" }}>New Reschedule Date</Typography>
                <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
              </Stack>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  control={control}
                  name="RescheduleDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? moment(field.value) : null}
                      onChange={(newValue) => {
                        const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                        field.onChange(formattedValue);
                      }}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          sx: {
                            "& .MuiInputBase-input": {
                              padding: "8.5px 14px",
                            },
                            "& .MuiOutlinedInput-root": {
                              fontSize: "11px",
                            },
                          },
                        },
                      }}
                      minDate={new moment()}
                      error={!!errors.RescheduleDate}
                      helperText={errors.RescheduleDate ? errors.RescheduleDate.message : null}
                    />
                  )}
                />
                {errors.RescheduleDate && <Typography>{errors.RescheduleDate.message}</Typography>}
              </LocalizationProvider>
            </Stack>

            <Stack sx={{ width: "100%" }}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "13px" }}>Remarks</Typography>
                <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
              </Stack>

              <Controller
                control={control}
                name="Reason"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      size="medium"
                      value={value}
                      placeholder="Add Reason"
                      onChange={onChange}
                      sx={{
                        width: "100%",
                      }}
                      InputProps={{
                        style: {
                          fontSize: "11px",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          fontSize: "11px",
                        },
                      }}
                      autoComplete="off"
                      rows={3}
                      multiline
                    />
                  );
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", padding: 2 }} direction="row" gap={1}>
            <Button variant="contained" color="primary" fullWidth>
              Confirm Schedule
            </Button>

            <Button variant="outlined" onClick={onCloseScheduleDialog} fullWidth>
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};
