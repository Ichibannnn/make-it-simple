import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DeleteOutlineOutlined, SaveOutlined, SyncOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useCreateEditReceiverMutation, useLazyGetReceiverBusinessListQuery, useLazyGetReceiverListQuery } from "../../../features/api_channel_setup/receiver/receiverApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  userId: yup.object().required().label("User Id"),
});

const businessUnitSchema = yup.object().shape({
  businessId: yup.object().required().label("Sub Unit"),
});

const ReceiverDialog = ({ data, open, onClose }) => {
  const [businessUnits, setBusinessUnits] = useState([]);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [createEditReceiver, { isLoading: isCreateEditReceiverLoading, isFetching: isCreateEditReceiverFetching }] = useCreateEditReceiverMutation();

  const [getReceiver, { data: receiverData, isLoading: receiverIsLoading, isSuccess: receiverIsSuccess }] = useLazyGetReceiverListQuery();

  const [getBusinessUnit, { data: businessUnitData, isLoading: businessUnitIsLoading, isSuccess: businessUnitIsSuccess }] = useLazyGetReceiverBusinessListQuery();

  const {
    control: receiverFormControl,
    handleSubmit: receiverFormHandleSubmit,
    setValue: receiverFormSetValue,
    watch: receiverFormWatch,
    reset: receiverFormReset,
    formState: { errors: receiverFormErrors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: null,
      userId: null,
    },
  });

  const {
    control: businessUnitFormControl,
    handleSubmit: businessUnitFormHandleSubmit,
    setValue: businessUnitFormSetValue,
    watch: businessUnitFormWatch,
    reset: businessUnitFormReset,
    formState: { errors: businessUnitFormErrors },
  } = useForm({
    resolver: yupResolver(businessUnitSchema),
    defaultValues: {
      id: null,
      userId: null,
      businessId: null,
    },
  });

  const onReceiverFormSubmit = (formData) => {
    if (!data) {
      const addPayload = {
        userId: formData?.userId?.userId,
        addNewReceiverIds: businessUnits?.map((item) => ({
          businessUnitId: item.businessUnitId,
        })),
      };

      console.log("Addpayload", addPayload);

      createEditReceiver(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Receiver added successfully!",
            duration: 1500,
          });
          setBusinessUnits([]);
          receiverFormReset();
          businessUnitFormReset();
          onClose();
        })
        .catch((error) => {
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    } else {
      const editPayload = {
        userId: data?.userId,
        fullName: data?.fullName,
        addNewReceiverIds: businessUnits?.map((item) => ({
          receiverId: item.receiverId,
          businessUnitId: item.businessUnitId,
        })),
      };

      createEditReceiver(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated receiver successfully!",
            duration: 1500,
          });
          setBusinessUnits([]);
          receiverFormReset();
          businessUnitFormReset();
          onClose();
        })
        .catch((error) => {
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    }
  };

  const onBusinessFormSubmit = (data) => {
    setBusinessUnits((currentValue) => [
      ...currentValue,
      {
        receiverId: data.receiverId,
        businessUnitId: data.businessId.businessUnitId,
        businessUnit_Code: data.businessId.businessUnit_Code,
        businessUnit_Name: data.businessId.businessUnit_Name,
      },
    ]);
    businessUnitFormReset();
  };

  const onBusinessUnitFormDelete = (index) => {
    setBusinessUnits((currentValue) => currentValue.filter((_, memberIndex) => memberIndex !== index));
  };

  const onCloseAction = () => {
    onClose();
    setBusinessUnits([]);
    receiverFormReset();
    businessUnitFormReset();
  };

  useEffect(() => {
    if (data) {
      receiverFormSetValue("userId", {
        userId: data?.userId,
        fullName: data?.fullName,
      });

      const editBusinessUnitList = data?.getReceives?.map((item) => ({
        receiverId: item.receiveId,
        businessUnitId: item.businessUnitId,
        businessUnit_Code: item.businessUnit_Code,
        businessUnit_Name: item.businessUnit_Name,
      }));

      setBusinessUnits(editBusinessUnitList);
    }
  }, [data]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="sm" open={open} sx={{ borderRadius: "none", padding: 0 }} PaperProps={{ style: { overflow: "unset" } }}>
        <DialogContent sx={{ paddingBottom: 10 }}>
          <Stack direction="column" sx={{ padding: "5px" }}>
            <Stack>
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: isSmallScreen ? "15px" : "18px",
                    fontWeight: 700,
                    color: "#48BB78",
                  }}
                >
                  Receiver Form
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                }}
              >
                Add receiver and tag business units
              </Typography>
            </Stack>

            <Stack id="receiverForm" component="form" onSubmit={receiverFormHandleSubmit(onReceiverFormSubmit)} sx={{ paddingTop: 2, gap: 2 }}>
              <Controller
                control={receiverFormControl}
                name="userId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      size="small"
                      value={value}
                      options={receiverData?.value || []}
                      loading={receiverIsLoading}
                      renderInput={(params) => (
                        <TextField {...params} label="Receiver Name" size="small" sx={{ "& .MuiInputBase-input": { fontSize: isSmallScreen ? "13px" : "16px" } }} />
                      )}
                      onOpen={() => {
                        if (!receiverIsSuccess) getReceiver();
                      }}
                      onChange={(_, value) => {
                        onChange(value);
                      }}
                      getOptionLabel={(option) => option.fullName}
                      isOptionEqualToValue={(option, value) => option.userId === value.userId || []}
                      noOptionsText={"No receiver available"}
                      disabled={data ? true : false}
                      sx={{
                        flex: 2,
                      }}
                      fullWidth
                      disablePortal
                      disableClearable
                    />
                  );
                }}
              />
            </Stack>

            <Stack sx={{ paddingTop: 2, gap: 2 }}>
              <Stack component="form" onSubmit={businessUnitFormHandleSubmit(onBusinessFormSubmit)} direction={isSmallScreen ? "column" : "row"} gap={2}>
                <Controller
                  control={businessUnitFormControl}
                  name="businessId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        size="small"
                        value={value}
                        options={businessUnitData?.value || []}
                        loading={businessUnitIsLoading}
                        renderInput={(params) => <TextField {...params} label="Business Units" size="small" />}
                        onOpen={() => {
                          if (!businessUnitIsSuccess) getBusinessUnit();
                        }}
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        getOptionLabel={(option) => `${option.businessUnit_Code} - ${option.businessUnit_Name}`}
                        isOptionEqualToValue={(option, value) => option.businessUnitId === value.businessUnitId}
                        getOptionDisabled={(option) => businessUnits.some((item) => item.businessUnitId === option.businessUnitId)}
                        noOptionsText={"No business unit available"}
                        sx={{
                          flex: 2,
                        }}
                        componentsProps={{
                          popper: {
                            sx: {
                              "& .MuiAutocomplete-listbox": {
                                fontSize: isSmallScreen ? "13px" : "16px",
                              },
                            },
                          },
                        }}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    );
                  }}
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  color="primary"
                  disabled={!businessUnitFormWatch("businessId")}
                  sx={{
                    ":disabled": {
                      backgroundColor: theme.palette.secondary.main,
                      color: "black",
                    },
                  }}
                >
                  Add business unit
                </LoadingButton>
              </Stack>

              <TableContainer>
                <Table
                  size="small"
                  sx={{
                    borderBottom: "none",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: theme.palette.text.secondary,
                          fontWeight: 700,
                          fontSize: "10px",
                        }}
                      >
                        BUSINESS UNIT
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: theme.palette.text.secondary,
                          fontWeight: 700,
                          fontSize: "10px",
                        }}
                        align="center"
                      >
                        ACTION
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody sx={{ border: "1px" }}>
                    {businessUnits.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                          }}
                        >
                          {item.businessUnit_Code} - {item.businessUnit_Name}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                          }}
                          align="center"
                        >
                          <IconButton onClick={() => onBusinessUnitFormDelete(index)}>
                            <DeleteOutlineOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            form="receiverForm"
            disabled={!receiverFormWatch("userId") || !businessUnits.length}
            loading={isCreateEditReceiverLoading || isCreateEditReceiverFetching}
          >
            Save
          </LoadingButton>
          <Button variant="text" onClick={onCloseAction}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceiverDialog;
