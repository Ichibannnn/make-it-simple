import { Close, FiberManualRecord } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { theme } from "../../../theme/theme";
import useDisclosure from "../../../hooks/useDisclosure";

import moment from "moment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Controller, useForm } from "react-hook-form";
import { useLazyGetUsersQuery } from "../../../features/user_management_api/user/userApi";

const PmsAddSchedule = ({ openAddSchedule, onCloseAddSchedule }) => {
  const pmsType = [
    {
      title: "Store",
      description: "Store Maintenance Schedule",
    },
    {
      title: "Desktop",
      description: "Desktop PMS",
    },
    {
      title: "Laptop",
      description: "Laptop PMS",
    },
    {
      title: "Weighing Scale",
      description: "Weighing Scale PMS",
    },
  ];

  const {
    open: openAddScheduleForm,
    onToggle: onToggleAddScheduleForm,
    onClose: onCloseAddScheduleForm,
  } = useDisclosure();

  const onOpenAddScheduleFormAction = () => {
    onToggleAddScheduleForm();
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={openAddSchedule}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseAddSchedule();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{
          style: { overflow: "auto", border: "2px solid #4b586f" },
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Stack sx={{ borderBottom: "2px solid #4b586f", mb: 2 }}>
            <Stack
              p={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>
                  Select PMS type to add schedule
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseAddSchedule}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          {pmsType.map((item, i) => (
            <Stack
              key={i}
              pr={3}
              pl={3}
              pt={1}
              pb={1}
              sx={{
                cursor: "pointer",
              }}
              onClick={() => onOpenAddScheduleFormAction()}
            >
              <Stack
                p={2}
                sx={{
                  overflow: "auto",
                  border: "1px solid #4b586f",
                  borderRadius: "7px",
                  "&:hover": {
                    backgroundColor: "#1C2536",
                    borderColor: theme.palette.primary.main,
                    color: "#AD46FF",
                  },
                }}
              >
                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography
                  sx={{ fontSize: "13px", color: theme.palette.text.secondary }}
                >
                  {item.description}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>

      <PmsAddScheduleForm
        open={openAddScheduleForm}
        onClose={onCloseAddScheduleForm}
      />
    </>
  );
};

const schema = yup.object().shape({
  Store: yup.object().required().label("Store"),
  ScheduleDate: yup.date().required().label("Target Date"),
});

export default PmsAddSchedule;

const PmsAddScheduleForm = ({ open, onClose }) => {
  const [
    getUser,
    { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess },
  ] = useLazyGetUsersQuery();

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
      Store: null,
      ScheduleDate: null,
    },
  });

  const onCloseAction = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
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
        PaperProps={{
          style: { overflow: "unset", border: "2px solid #4b586f" },
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Stack sx={{ borderBottom: "2px solid #4b586f" }}>
            <Stack
              p={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>
                  Add Store Schedule
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onClose}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          <Stack p={4} gap={2} mt={2}>
            <Stack sx={{ width: "100%" }}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "13px" }}>Store Name</Typography>
                <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
              </Stack>
              <Controller
                control={control}
                name="Store"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      size="small"
                      value={value}
                      options={userData?.value?.users || []}
                      loading={userIsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Store"
                          sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }}
                        />
                      )}
                      onOpen={() => {
                        if (!userIsSuccess)
                          getUser({
                            Status: true,
                          });
                      }}
                      onChange={(_, value) => {
                        onChange(value);
                      }}
                      getOptionLabel={(option) => option?.fullname}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      disablePortal
                      disableClearable
                      componentsProps={{
                        popper: {
                          sx: {
                            "& .MuiAutocomplete-listbox": {
                              fontSize: "13px",
                            },
                          },
                        },
                      }}
                    />
                  );
                }}
              />
            </Stack>

            <Stack sx={{ width: "100%" }}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "13px" }}>Schedule Date</Typography>
                <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
              </Stack>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  control={control}
                  name="ScheduleDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? moment(field.value) : null}
                      onChange={(newValue) => {
                        const formattedValue = newValue
                          ? moment(newValue).format("YYYY-MM-DD")
                          : null;
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
                              fontSize: "13px",
                            },
                          },
                        },
                      }}
                      minDate={new moment()}
                      error={!!errors.ScheduleDate}
                      helperText={
                        errors.ScheduleDate ? errors.ScheduleDate.message : null
                      }
                    />
                  )}
                />
                {errors.ScheduleDate && (
                  <Typography>{errors.ScheduleDate.message}</Typography>
                )}
              </LocalizationProvider>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", padding: 2 }} direction="row" gap={1}>
            <Button variant="outlined" onClick={onCloseAction} fullWidth>
              Cancel
            </Button>
            <Button variant="contained" color="primary" fullWidth>
              Add Schedule
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};
