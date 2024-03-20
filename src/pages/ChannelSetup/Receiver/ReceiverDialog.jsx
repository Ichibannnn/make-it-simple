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
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Controller, Form, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { CloseFullscreen, DeleteOutlineOutlined } from "@mui/icons-material";
import {
  useCreateEditReceiverMutation,
  useLazyGetReceiverBusinessListQuery,
  useLazyGetReceiverListQuery,
} from "../../../features/api_channel_setup/receiver/receiverApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  userId: yup.object().required().label("User Id"),
});

const businessUnitSchema = yup.object().shape({
  businessId: yup.object().required().label("Sub Unit"),
});

const ReceiverDialog = ({ data, open, onClose }) => {
  const [businessUnits, setBusinessUnits] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [createEditReceiver] = useCreateEditReceiverMutation();

  const [
    getReceiver,
    {
      data: receiverData,
      isLoading: receiverIsLoading,
      isSuccess: receiverIsSuccess,
    },
  ] = useLazyGetReceiverListQuery();

  const [
    getBusinessUnit,
    {
      data: businessUnitData,
      isLoading: businessUnitIsLoading,
      isSuccess: businessUnitIsSuccess,
    },
  ] = useLazyGetReceiverBusinessListQuery();

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

      console.log("Edit Payload: ", editPayload);

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
    setBusinessUnits((currentValue) =>
      currentValue.filter((_, memberIndex) => memberIndex !== index)
    );
  };

  const onCloseAction = () => {
    onClose();
    setDisabled(false);
    setBusinessUnits([]);
    receiverFormReset();
    businessUnitFormReset();
  };

  useEffect(() => {
    if (businessUnits.length > 0 || !!data) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [businessUnits]);

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

  // console.log("Edit Data: ", data);
  // console.log("Business uNit: ", businessUnitData);
  // console.log("Table: ", businessUnits);

  console.log("Table: ", businessUnits);

  // console.log("Receiver Data: ", receiverData);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        sx={{ borderRadius: "none", padding: 0 }}
        PaperProps={{ style: { overflow: "unset" } }}
      >
        <DialogContent sx={{ paddingBottom: 10 }}>
          <Stack direction="column" sx={{ padding: "5px" }}>
            <Stack>
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "18px",
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

            <Stack
              id="receiverForm"
              component="form"
              onSubmit={receiverFormHandleSubmit(onReceiverFormSubmit)}
              sx={{ paddingTop: 2, gap: 2 }}
            >
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
                        <TextField
                          {...params}
                          label="Receiver Name"
                          size="small"
                        />
                      )}
                      onOpen={() => {
                        if (!receiverIsSuccess) getReceiver();
                      }}
                      onChange={(_, value) => {
                        console.log(value);
                        onChange(value);
                      }}
                      getOptionLabel={(option) => option.fullName}
                      isOptionEqualToValue={(option, value) =>
                        option.userId === value.userId
                      }
                      disabled={disabled && !data}
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
              <Stack
                component="form"
                onSubmit={businessUnitFormHandleSubmit(onBusinessFormSubmit)}
                direction="row"
                gap={2}
              >
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
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Business Units"
                            size="small"
                          />
                        )}
                        onOpen={() => {
                          if (!businessUnitIsSuccess) getBusinessUnit();
                        }}
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        getOptionLabel={(option) =>
                          `${option.businessUnit_Code} - ${option.businessUnit_Name}`
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.businessUnitId === value.businessUnitId
                        }
                        getOptionDisabled={(option) =>
                          businessUnits.some(
                            (item) =>
                              item.businessUnitId === option.businessUnitId
                          )
                        }
                        // disabled={
                        //   !channelFormWatch("channel_Name") ||
                        //   errorValidationIsError
                        // }
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
                    // minHeight: "50px",
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
                          <IconButton
                            onClick={() => onBusinessUnitFormDelete(index)}
                          >
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
          <Button
            type="submit"
            variant="contained"
            form="receiverForm"
            sx={{
              ":disabled": {
                backgroundColor: theme.palette.secondary.main,
                color: "black",
              },
            }}
          >
            Submit
          </Button>
          <Button variant="text" onClick={onCloseAction}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceiverDialog;
