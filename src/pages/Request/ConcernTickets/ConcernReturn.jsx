import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, CheckOutlined, Close, FiberManualRecord, RemoveCircleOutline } from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";
import { useDeleteRequestorAttachmentMutation, useReturnConcernMutation } from "../../../features/api_request/concerns/concernApi";

const schema = yup.object().shape({
  remarks: yup.string().required().label("Remarks is required"),
  ReturnTicketAttachments: yup.array().required(),
});

const ConcernReturn = ({ data, open, onClose }) => {
  const [addAttachments, setAddAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const fileInputRef = useRef();

  const [returnConcern, { isLoading: returnConcernIsLoading, isFetching: returnConcernIsFetching }] = useReturnConcernMutation();
  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      remarks: "",
      ReturnTicketAttachments: [],
    },
  });

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);

    const payload = new FormData();

    payload.append("RequestConcernId", data?.requestConcernId);
    payload.append("Remarks", formData?.remarks);

    // Attachments
    const files = formData.ReturnTicketAttachments;
    for (let i = 0; i < files.length; i++) {
      payload.append(`ReturnTicketAttachments[${i}].ticketAttachmentId`, "");
      payload.append(`ReturnTicketAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`ReturnTicketAttachments[0].ticketAttachmentId`, "");
      payload.append(`ReturnTicketAttachments[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);

    Swal.fire({
      title: "Confirmation",
      text: `Return to close this request concern number ${data?.requestConcernId}?`,
      icon: "info",
      color: "white",
      showCancelButton: true,
      background: "#111927",
      confirmButtonColor: "#9e77ed",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      cancelButtonColor: "#1C2536",
      heightAuto: false,
      width: "30em",
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        returnConcern(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Request return successfully!",
              duration: 1500,
            });

            setAddAttachments([]);
            reset();
            onClose();
          })
          .catch((err) => {
            console.log("Error", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  const handleAttachments = (event) => {
    // console.log("event: ", event);
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !addAttachments.some((existingFile) => existingFile.name === newFile.name));

    setAddAttachments((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    // console.log("File name: ", fileNameToDelete);

    try {
      if (fileNameToDelete.ticketAttachmentId) {
        const deletePayload = {
          removeAttachments: [
            {
              ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
            },
          ],
        };
        await deleteRequestorAttachment(deletePayload).unwrap();
      }

      setAddAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

      setValue(
        "AddClosingAttachments",
        watch("AddClosingAttachments").filter((file) => file.name !== fileNameToDelete.name)
      );
    } catch (error) {}
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const onCloseHandler = () => {
    onClose();
    reset();
    setAddAttachments([]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    const allowedExtensions = [".png", ".docx", ".jpg", ".jpeg", ".pdf"];
    const fileNames = Array.from(fileList)
      .filter((file) => {
        const extension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(`.${extension}`);
      })
      .map((file) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
      }));

    const uniqueNewFiles = fileNames.filter((fileName) => !addAttachments.includes(fileName));
    setAddAttachments([...addAttachments, ...uniqueNewFiles]);
  };

  //   console.log("Attachments: ", addAttachments);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#48BB78",
          }}
        >
          Return Form
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 0.5 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                }}
              >
                Remarks:
              </Typography>

              {/* <TextField
                {...register("reject_Remarks")}
                variant="outlined"
                // label="Enters Re"
                placeholder="Enter Remarks"
                helperText={errors?.reject_Remarks?.message}
                error={!!errors?.reject_Remarks?.message}
                sx={{ borderColor: "primary" }}
                rows={6}
                multiline
                fullWidth
                autoComplete="off"
              /> */}

              <Controller
                control={control}
                name="remarks"
                render={({ field: { ref, value, onChange } }) => {
                  return <TextField inputRef={ref} size="medium" value={value} placeholder="Enter Remarks" onChange={onChange} autoComplete="off" rows={6} multiline />;
                }}
              />
            </Stack>

            <Stack gap={0.5} mt={2} onDragOver={handleDragOver} onDrop={handleDrop}>
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Attachment:
                </Typography>

                <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick} sx={{ padding: "2px", borderRadius: "2px" }}>
                  <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                </Button>
              </Stack>

              <Box
                sx={{
                  border: "1px solid #2D3748",
                  minHeight: "195px",
                  display: "flex",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 1,
                }}
              >
                {addAttachments?.map((fileName, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 0.5,
                      borderBottom: "1px solid #2D3748",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography sx={{ fontSize: "12px" }}>{fileName.name}</Typography>

                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {fileName.size} Mb
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: !!fileName.ticketAttachmentId ? theme.palette.success.main : theme.palette.primary.main,
                          }}
                        >
                          {!!fileName.ticketAttachmentId ? "Attached file" : "Uploaded the file successfully"}
                        </Typography>

                        {!!fileName.ticketAttachmentId && <CheckOutlined color="success" fontSize="small" />}
                      </Box>
                    </Box>

                    <Box>
                      <Tooltip title="Remove">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteFile(fileName)}
                          style={{
                            background: "none",
                          }}
                        >
                          <RemoveCircleOutline />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Stack>

            <Controller
              control={control}
              name="ReturnTicketAttachments"
              render={({ field: { onChange, value } }) => (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.docx"
                  onChange={(event) => {
                    if (ticketAttachmentId) {
                      const files = Array.from(event.target.files);
                      files[0].ticketAttachmentId = ticketAttachmentId;

                      onChange([...files, ...value.filter((item) => item.ticketAttachmentId !== ticketAttachmentId)]);

                      setAddAttachments((prevFiles) => [
                        ...prevFiles.filter((item) => item.ticketAttachmentId !== ticketAttachmentId),
                        {
                          ticketAttachmentId: ticketAttachmentId,
                          name: files[0].name,
                          size: (files[0].size / (1024 * 1024)).toFixed(2),
                        },
                      ]);

                      fileInputRef.current.value = "";
                      setTicketAttachmentId(null);
                    } else {
                      handleAttachments(event);
                      const files = Array.from(event.target.files);

                      const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

                      onChange([...value, ...uniqueNewFiles]);
                      fileInputRef.current.value = "";
                    }
                  }}
                  hidden
                  multiple={!!ticketAttachmentId}
                />
              )}
            />
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={returnConcernIsLoading || returnConcernIsFetching}
              disabled={!watch("remarks") || !addAttachments.length}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "black",
                },
              }}
            >
              Submit
            </LoadingButton>
            <LoadingButton variant="outlined" loading={returnConcernIsLoading || returnConcernIsFetching} onClick={onCloseHandler}>
              Close
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ConcernReturn;
