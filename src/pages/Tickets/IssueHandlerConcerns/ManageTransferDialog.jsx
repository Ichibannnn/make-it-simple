import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, AttachFileOutlined, CheckOutlined, Close, FiberManualRecord, FileDownloadOutlined, FileUploadOutlined, RemoveCircleOutline } from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useTransferIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

const schema = yup.object().shape({
  TransferTicketId: yup.number(),
  TicketConcernId: yup.number(),
  TransferRemarks: yup.string().required().label("Remarks is required"),
  AddTransferAttachments: yup.array().nullable(),
});

const ManageTransferDialog = ({ data, open, onClose }) => {
  const [addAttachments, setAddAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const fileInputRef = useRef();

  const [manageTransferTickets, { isLoading: manageTransferTicketsIsLoading, isFetching: manageTransferTicketsIsFetching }] = useTransferIssueHandlerTicketsMutation();
  const [deleteRequestorAttachment, { isLoading: isDeleteRequestorAttachmentLoading, isFetching: isDeleteRequestorAttachmentFetching }] = useDeleteRequestorAttachmentMutation();

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
      TransferTicketId: "",
      TicketConcernId: "",
      TransferRemarks: "",
      AddTransferAttachments: [],
    },
  });

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

  const handleUpdateFile = (id) => {
    setTicketAttachmentId(id);
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    console.log("File name: ", fileNameToDelete);

    try {
      if (fileNameToDelete.ticketAttachmentId) {
        const deletePayload = {
          ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
        };
        await deleteRequestorAttachment(deletePayload)
          .unwrap()
          .then()
          .catch((err) => {
            console.log("error: ", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
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

    // console.log("Attachments: ", attachments)
  };

  const onSubmitAction = (formData) => {
    console.log("Form Data: ", formData);

    Swal.fire({
      title: "Confirmation",
      text: `Edit tranfer ticket number ${data?.ticketConcernId}?`,
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
        const payload = new FormData();

        payload.append("TransferTicketId", formData.TransferTicketId);
        payload.append("TicketConcernId", formData.TicketConcernId);
        payload.append("TransferRemarks", formData.TransferRemarks);

        // Attachments
        const files = formData.AddTransferAttachments;
        for (let i = 0; i < files.length; i++) {
          payload.append(`AddTransferAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
          payload.append(`AddTransferAttachments[${i}].attachment`, files[i]);
        }

        if (files.length === 0) {
          payload.append(`AddTransferAttachments[0].ticketAttachmentId`, "");
          payload.append(`AddTransferAttachments[0].attachment`, "");
        }

        // console.log("Payload Entries: ", [...payload.entries()]);

        manageTransferTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Transfer updated successfully!",
              duration: 1500,
            });

            setAddAttachments([]);
            reset();
            onClose();
          })
          .catch((err) => {
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  const onCloseHandler = () => {
    onClose();
    reset();
    setAddAttachments([]);
  };

  useEffect(() => {
    if (data) {
      //   console.log("Data: ", data);

      setValue("TransferTicketId", data?.getForTransferTickets?.[0]?.transferTicketConcernId);
      setValue("TicketConcernId", data?.ticketConcernId);
      setValue("TransferRemarks", data?.getForTransferTickets?.[0]?.transfer_Remarks);

      const manageTransferTicketArray = data?.getForTransferTickets?.map((item) =>
        item?.getAttachmentForTransferTickets?.map((subItem) => {
          return {
            ticketAttachmentId: subItem.ticketAttachmentId,
            name: subItem.fileName,
            size: (subItem.fileSize / (1024 * 1024)).toFixed(2),
            link: subItem.attachment,
          };
        })
      );

      setAddAttachments(
        manageTransferTicketArray?.[0]?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.name,
          size: item.size,
          link: item.link,
        }))
      );
    }
  }, [data]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogContent>
          <Stack sx={{ minHeight: "600px" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: theme.palette.success.main,
                  }}
                >
                  Ticket Details
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseHandler}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>

            <Divider variant="fullWidth" sx={{ background: "#2D3748" }} />

            <Stack id="closeticket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
              {/* TICKET DETAILS */}
              <Stack sx={{ padding: 1, width: "100%" }}>
                <Stack direction="row" gap={0.5} alignItems="center" mt={4}>
                  <FiberManualRecord color="warning" fontSize="20px" />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: theme.palette.text.main,
                    }}
                  >
                    {` Ticket # : ${data?.ticketConcernId}`}
                  </Typography>

                  {data?.getForClosingTickets?.[0]?.isApprove === true ? (
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "#22B4BF",
                      }}
                    >
                      (Approved)
                    </Typography>
                  ) : (
                    ""
                  )}
                </Stack>

                <Stack gap={0.5} mt={4}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: theme.palette.text.main,
                    }}
                  >
                    Ticket Description:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: theme.palette.text.secondary,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: data?.concern_Description.replace(/\r\n/g, "<br />"),
                    }}
                  />
                </Stack>

                <Stack sx={{ padding: 2, marginTop: 2, minHeight: "500px", bgcolor: theme.palette.bgForm.black2 }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      color: theme.palette.text.main,
                    }}
                  >
                    Manage Transfer Ticket
                  </Typography>

                  <Stack gap={0.5} mt={2}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      Transfer Remarks:
                    </Typography>

                    <Controller
                      control={control}
                      name="TransferRemarks"
                      render={({ field: { ref, value, onChange } }) => {
                        return <TextField inputRef={ref} size="medium" value={value} onChange={onChange} autoComplete="off" rows={6} multiline sx={{ fontSize: "10px" }} />;
                      }}
                    />

                    <Stack gap={0.5} mt={2} onDragOver={handleDragOver} onDrop={handleDrop}>
                      <Stack direction="row" gap={0.5}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Attachment:
                        </Typography>

                        <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick} sx={{ padding: "2px", borderRadius: "2px" }}>
                          <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                        </Button>
                      </Stack>

                      {addAttachments?.length === 0 ? (
                        <Stack sx={{ flexDirection: "column", border: "1px solid #2D3748", minHeight: "195px", justifyContent: "center", alignItems: "center" }}>
                          <Stack direction="row" gap={0.5} justifyContent="center">
                            <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                            <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                          </Stack>
                        </Stack>
                      ) : (
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

                                {!!fileName.ticketAttachmentId && (
                                  <Tooltip title="Upload">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleUpdateFile(fileName.ticketAttachmentId)}
                                      style={{
                                        background: "none",
                                      }}
                                    >
                                      <FileUploadOutlined />
                                    </IconButton>
                                  </Tooltip>
                                )}

                                {!!fileName.ticketAttachmentId && (
                                  <Tooltip title="Download">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        window.location = fileName.link;
                                      }}
                                      style={{
                                        background: "none",
                                      }}
                                    >
                                      <FileDownloadOutlined />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Stack>

                    <Controller
                      control={control}
                      name="AddTransferAttachments"
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
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", paddingRight: 2, paddingLeft: 2 }}>
            <LoadingButton
              type="submit"
              form="closeticket"
              variant="contained"
              loading={manageTransferTicketsIsLoading || manageTransferTicketsIsFetching}
              disabled={!watch("TransferRemarks")}
            >
              Save
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageTransferDialog;
