import { Close, FiberManualRecord, TodayOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";

import moment from "moment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { theme } from "../../../theme/theme";

import useDisclosure from "../../../hooks/useDisclosure";
import noStore from "../../../assets/svg/noSchedule2.svg";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Controller, useForm } from "react-hook-form";

import { global } from "../../../styles/global";
import { pmsStyles } from "../styles/pmsStyles";

const PmsDetailDialog = ({ data, getDate, open, onClose }) => {
  const [getRescheduleData, setGetRescheduleData] = useState(null);

  const filteredData = data?.value?.pms?.filter((item) => moment(item?.date).format("YYYY-MM-DD") === getDate);

  console.log("FilteredData:", data);

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
        sx={pmsStyles.dialog}
        PaperProps={{ style: { ...global.paperDialog } }}
      >
        <DialogContent sx={global.dialogContent}>
          <Stack sx={pmsStyles.dialogHeaderContainer}>
            <Stack sx={pmsStyles.dialogHeaderText}>
              <Stack>
                <Typography fontWeight={600}>Store Visits</Typography>
                <Typography color="gray" sx={pmsStyles.dialogHeaderDate}>
                  {moment(getDate).format("dddd, MMMM D, YYYY")}
                </Typography>
              </Stack>

              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          {filteredData?.length > 0 ? (
            <Stack p={4} gap={1}>
              {filteredData.map((item, i) => (
                <Stack key={i} sx={pmsStyles.storeContainer}>
                  <Stack sx={pmsStyles.storeStackDirection}>
                    <Typography sx={pmsStyles.storeStackName}>{item?.name}</Typography>

                    <Typography
                      sx={{
                        ...pmsStyles.storeStackStatus,
                        color: item?.status === "Done" ? theme.palette.success.main : theme.palette.warning.main,
                      }}
                    >
                      {item.status}
                    </Typography>
                  </Stack>

                  <Stack sx={pmsStyles.storeStackDirection}>
                    <Typography sx={pmsStyles.storeStackArea}>{item.area}</Typography>

                    {item?.status === "Pending" && (
                      <Button variant="outlined" color="accent" startIcon={<TodayOutlined />} onClick={() => onReschedule(item)} sx={pmsStyles.reschedButton}>
                        Resched
                      </Button>
                    )}
                  </Stack>

                  <Stack sx={pmsStyles.storeStackDirection}>
                    <Typography sx={pmsStyles.completionText}>{`PMS: ${item.completion}`}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Stack>
              <Stack sx={pmsStyles.noStoreVisitContainer}>
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
  RescheduleDate: yup.date().required().label("Target Date"),
  Remarks: yup.string().required().label("Reason"),
});

const PmsScheduleDialog = ({ data, openScheduleDialog, onCloseScheduleDialog }) => {
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
      Remarks: "",
    },
  });

  const onCloseAction = () => {
    reset();
    onCloseScheduleDialog();
  };

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
        sx={pmsStyles.dialog}
        PaperProps={{ style: { ...global.paperDialog } }}
      >
        <DialogContent sx={global.dialogContent}>
          <Stack sx={pmsStyles.dialogHeaderContainer}>
            <Stack sx={pmsStyles.rescheduleHeaderStack}>
              <Typography fontWeight={600}>Reschedule Store Visit</Typography>
              <IconButton onClick={onCloseScheduleDialog}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Stack sx={pmsStyles.currentScheduleContainer}>
            <Stack sx={pmsStyles.currentScheduleBorder}>
              <Typography sx={pmsStyles.currentScheduleText}>Current Schedule</Typography>
              <Typography sx={pmsStyles.currentScheduleName}>{data?.name}</Typography>
              <Typography sx={pmsStyles.currentScheduleArea}>{data?.area}</Typography>
            </Stack>
          </Stack>

          <Stack sx={pmsStyles.newRescheduleRemarksStack}>
            <Stack sx={pmsStyles.newRescheduleRemarks}>
              <Stack sx={pmsStyles.newReschedContainer}>
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
                      minDate={new moment()}
                      slotProps={pmsStyles.datePicker}
                      error={!!errors.RescheduleDate}
                      helperText={errors.RescheduleDate ? errors.RescheduleDate.message : null}
                    />
                  )}
                />
                {errors.RescheduleDate && <Typography>{errors.RescheduleDate.message}</Typography>}
              </LocalizationProvider>
            </Stack>

            <Stack sx={pmsStyles.newRescheduleRemarks}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "13px" }}>Remarks</Typography>
                <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
              </Stack>

              <Controller
                control={control}
                name="Remarks"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      size="medium"
                      value={value}
                      placeholder="Add Remarks"
                      onChange={onChange}
                      sx={{
                        width: "100%",
                      }}
                      InputProps={{
                        style: {
                          fontSize: "13px",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          fontSize: "13px",
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
          <Stack sx={pmsStyles.dialogActions}>
            <Button variant="outlined" onClick={onCloseAction} fullWidth>
              Cancel
            </Button>
            <Button variant="contained" color="primary" fullWidth>
              Confirm Schedule
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};
