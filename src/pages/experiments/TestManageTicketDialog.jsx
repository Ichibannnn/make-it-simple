import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Divider, FormHelperText, IconButton, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { Add, AttachFileOutlined, CheckOutlined, Close, FiberManualRecord } from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";

import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";

import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";

const schema = yup.object().shape({
  AddClosingAttachments: yup.array().nullable(),
});

const ManageTicketDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  const [viewIsLoading, setViewIsLoading] = useState(false);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);

  const fileInputRef = useRef();

  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [closeIssueHandlerTickets, { isLoading: closeIssueHandlerTicketsIsLoading, isFetching: closeIssueHandlerTicketsIsFetching }] = useCloseIssueHandlerTicketsMutation();
  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      AddClosingAttachments: [],
    },
  });

  const handleAttachments = (event) => {
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      file,
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !attachments.some((existingFile) => existingFile.name === newFile.name));

    setAttachments((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
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

      setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

      setValue(
        "AddClosingAttachments",
        watch("AddClosingAttachments").filter((file) => file.name !== fileNameToDelete.name),
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

    const uniqueNewFiles = fileNames.filter((fileName) => !attachments.includes(fileName));
    setAttachments([...attachments, ...uniqueNewFiles]);
  };

  const onSubmitAction = (formData) => {
    Swal.fire({
      title: "Confirmation",
      text: `Edit this ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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

        // Attachments
        const files = formData.AddClosingAttachments;
        for (let i = 0; i < files.length; i++) {
          payload.append(`AddClosingAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
          payload.append(`AddClosingAttachments[${i}].attachment`, files[i]);
        }

        if (files.length === 0) {
          payload.append(`AddClosingAttachments[0].ticketAttachmentId`, "");
          payload.append(`AddClosingAttachments[0].attachment`, "");
        }
        closeIssueHandlerTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket updated successfully!",
              duration: 1500,
            });
            setAttachments([]);
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
    setAttachments([]);
  };

  useEffect(() => {
    if (data) {
      const manageTicketArray = data?.getForClosingTickets?.map((item) =>
        item?.getAttachmentForClosingTickets?.map((subItem) => {
          return {
            ticketAttachmentId: subItem.ticketAttachmentId,
            name: subItem.fileName,
            size: (subItem.fileSize / (1024 * 1024)).toFixed(2),
            link: subItem.attachment,
          };
        }),
      );

      setAttachments(
        manageTicketArray?.[0]?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.name,
          size: item.size,
          link: item.link,
        })),
      );
    }
  }, [data]);

  // Function to open image view dialog
  const handleViewImage = async (file) => {
    setViewIsLoading(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

      if (response?.data) {
        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
        setSelectedImage(imageUrl); // Set the image URL to state
        setIsViewDialogOpen(true);
      }
      setViewIsLoading(false);
    } catch (error) {
      toast.error("Error!", {
        description: "View file error!",
        duration: 1500,
      });
      setViewIsLoading(false);
    }
  };

  const handleViewImageWithoutId = (file) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setIsViewDialogOpen(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleDownloadAttachment = async (file) => {
    setDownloadIsLoading(true);
    try {
      const response = await getDownloadAttachment(file?.ticketAttachmentId);

      if (response?.data) {
        const blob = new Blob([response.data], { type: response.data.type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${file?.name || "attachment"}`); // Default to 'attachment' if no name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after download
        setDownloadIsLoading(false);
      }
    } catch (error) {
      toast.error("Error!", {
        description: "Download file error!",
        duration: 1500,
      });
      setDownloadIsLoading(false);
    }
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const minDate = new moment().subtract(1, "days");

  return (
    <>
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
              <Stack sx={{ padding: 2, width: "100%", mt: 1 }}>
                <Stack sx={{ marginTop: 2, minHeight: "500px" }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {data?.getForClosingTickets?.[0]?.isApprove === false ? "Manage Ticket Form" : "View Ticket Form"}
                  </Typography>

                  <Stack gap={0.5} mt={2}>
                    <Stack gap={0.5} mt={2} onDragOver={handleDragOver} onDrop={handleDrop}>
                      <Stack direction="row" gap={0.5}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Attachment:
                        </Typography>

                        {data?.getForClosingTickets?.[0]?.isApprove === false && (
                          <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick} sx={{ padding: "2px", borderRadius: "2px" }}>
                            <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                          </Button>
                        )}
                      </Stack>

                      {attachments?.length === 0 ? (
                        <Stack
                          sx={{
                            flexDirection: "column",
                            border: "1px solid #2D3748",
                            minHeight: "195px",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
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
                            padding: 1,
                          }}
                        >
                          {attachments?.map((fileName, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                padding: 0.5,
                                borderBottom: "1px solid #2D3748",
                              }}
                            >
                              {getAttachmentIcon(fileName)}
                              <Stack
                                sx={{
                                  width: "100%",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography sx={{ fontSize: "14px" }}>{fileName.name}</Typography>

                                  <Typography
                                    sx={{
                                      fontSize: "12px",
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
                                        fontSize: "14px",
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
                                  <ManageForClosingMenuActions
                                    data={data}
                                    fileName={fileName}
                                    onView={handleViewImage}
                                    onViewWithoutId={handleViewImageWithoutId}
                                    onDelete={handleDeleteFile}
                                    onDownload={handleDownloadAttachment}
                                    isImageFile={isImageFile}
                                    viewIsLoading={viewIsLoading}
                                    downloadIsLoading={downloadIsLoading}
                                  />
                                </Box>
                              </Stack>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Stack>

                    <Controller
                      control={control}
                      name="AddClosingAttachments"
                      render={({ field: { onChange, value } }) => (
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".png,.jpg,.jpeg,.docx,.pdf,.xls,.xlsx"
                          onChange={(event) => {
                            if (ticketAttachmentId) {
                              const files = Array.from(event.target.files);
                              files[0].ticketAttachmentId = ticketAttachmentId;

                              onChange([...files, ...value.filter((item) => item.ticketAttachmentId !== ticketAttachmentId)]);

                              setAttachments((prevFiles) => [
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
            {data?.getForClosingTickets?.[0]?.isApprove === false && (
              <LoadingButton
                type="submit"
                form="closeticket"
                variant="contained"
                loading={closeIssueHandlerTicketsIsLoading || closeIssueHandlerTicketsIsFetching}
                disabled={!watch("resolution") || watch("CategoryId").length === 0 || watch("SubCategoryId").length === 0 || (watch("ClosingDate") && !watch("BackdateRemarks"))}
              >
                Save
              </LoadingButton>
            )}
          </Stack>
        </DialogActions>
      </Dialog>

      {selectedImage && (
        <>
          <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
            <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
            <DialogActions>
              <Button onClick={handleViewClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ManageTicketDialog;
