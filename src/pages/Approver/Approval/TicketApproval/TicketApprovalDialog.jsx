import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { theme } from "../../../../theme/theme";

import { Box, Button, Chip, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import { AccountCircleRounded, AttachFileOutlined, Check, Close, FiberManualRecord, FileDownloadOutlined, GetAppOutlined, VisibilityOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import Swal from "sweetalert2";
import useDisclosure from "../../../../hooks/useDisclosure";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../../features/api_notification/notificationApi";

import DisapprovedDialog from "./DisapprovedDialog";
import { useApproveTicketMutation } from "../../../../features/api_ticketing/approver/ticketApprovalApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../../features/api_attachments/attachmentsApi";
import { notificationMessageApi } from "../../../../features/api_notification_message/notificationMessageApi";
import useSignalRConnection from "../../../../hooks/useSignalRConnection";
import TicketApprovalMenuActions from "./MenuActions/TicketApprovalMenuActions";

const TicketApprovalDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [disapproveData, setDisapproveData] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const dispatch = useDispatch();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  useSignalRConnection();

  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [approveTicket, { isLoading: approveTicketIsLoading, isFetching: approveTicketIsFetching }] = useApproveTicketMutation();

  const { open: disapproveOpen, onToggle: disapproveOnToggle, onClose: disapproveOnClose } = useDisclosure();

  const onApproveAction = () => {
    const approvePayload = {
      approveClosingRequests: [
        {
          closingTicketId: data?.closingTicketId,
        },
      ],
    };

    console.log("Payload: ", approvePayload);
    Swal.fire({
      title: "Confirmation",
      text: "Approve this request?",
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
        approveTicket(approvePayload)
          .unwrap()
          .then(() => {
            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            toast.success("Success!", {
              description: "Approve request successfully!",
              duration: 1500,
            });
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

  useEffect(() => {
    if (data) {
      setAttachments(
        data?.closingAttachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        }))
      );
    }
  }, [data]);

  const onCloseHandler = () => {
    onClose();
  };

  const onDisapproveHandler = () => {
    disapproveOnToggle();
    setDisapproveData(data);
  };

  // Function to open image view dialog
  const handleViewImage = async (file) => {
    setViewLoading(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

      if (response?.data) {
        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
        setSelectedImage(imageUrl); // Set the image URL to state
        setIsViewDialogOpen(true);
        setViewLoading(false);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const handleDownloadAttachment = async (file) => {
    setDownloadLoading(true);
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
        setDownloadLoading(false);
      } else {
        console.log("No data in the response");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      {/* <Toaster richColors position="top-right" closeButton /> */}
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogContent>
          {/* REQUESTOR */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <AccountCircleRounded sx={{ fontSize: isScreenSmall ? "50px" : "70px" }} />
              <Stack>
                <Typography sx={{ fontSize: isScreenSmall ? "12px" : "14px", color: theme.palette.primary.main, fontStyle: "italic", letterSpacing: 1, fontWeight: 400 }}>
                  for closing:
                </Typography>
                <Typography
                  sx={{
                    fontSize: isScreenSmall ? "13px" : "15px",
                    color: "#6dc993",
                    fontWeight: 700,
                  }}
                >
                  {data?.fullname}
                </Typography>
                <Typography sx={{ fontSize: isScreenSmall ? "12px" : "14px", color: theme.palette.text.secondary }}>{data?.channel_Name}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Stack gap={2} sx={{ marginTop: 2, justifyContent: "space-between" }}>
            <Stack sx={{ width: "100%", background: theme.palette.bgForm.black2, padding: 2, borderRadius: "20px" }}>
              {/* CONCERN DETAILS */}

              {isScreenSmall ? (
                <>
                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}>Ticket Number:</Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}>{data?.ticketConcernId}</Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}>Ticket Description:</Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}>
                        {data?.concern_Details?.split("\r\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}>Resolution:</Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}>{data?.resolution}</Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}>Service Provider:</Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}>{data?.channel_Name}</Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}>Category:</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ml: 1 }}>
                      {data?.getClosingTicketCategories?.map((item, i) => (
                        <Box key={i}>
                          <Chip
                            variant="filled"
                            size="small"
                            label={item.category_Description ? item.category_Description : "-"}
                            sx={{
                              backgroundColor: theme.palette.bgForm.black_1,
                              fontSize: "11px",
                              color: "#ffffff",
                              borderRadius: "none",
                              maxWidth: "300px",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px " }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}>Sub Category:</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ml: 1 }}>
                      {data?.getClosingTicketSubCategories?.map((item, i) => (
                        <Box key={i}>
                          <Chip
                            variant="filled"
                            size="small"
                            label={item.subCategory_Description ? item.subCategory_Description : "-"}
                            sx={{
                              backgroundColor: theme.palette.bgForm.black_1,
                              fontSize: "11px",
                              color: "#ffffff",
                              borderRadius: "none",
                              maxWidth: "300px",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Stack>
                </>
              ) : (
                <>
                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Ticket Number:</Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%" }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.ticketConcernId}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Ticket Description:</Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%" }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
                        {data?.concern_Details?.split("\r\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Resolution:</Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%" }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.resolution}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Service Provider:</Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%" }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.channel_Name}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Category:</Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%" }}>
                      <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                        {data?.getClosingTicketCategories?.map((item, i) => (
                          <Box key={i}>
                            <Chip
                              variant="filled"
                              size="small"
                              label={item.category_Description ? item.category_Description : "-"}
                              sx={{
                                backgroundColor: theme.palette.bgForm.black_1,
                                color: "#ffffff",
                                borderRadius: "none",
                                maxWidth: "300px",
                              }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Sub Category:</Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%" }}>
                      <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                        {data?.getClosingTicketSubCategories?.map((item, i) => (
                          <Box key={i}>
                            <Chip
                              variant="filled"
                              size="small"
                              label={item.subCategory_Description ? item.subCategory_Description : "-"}
                              sx={{
                                backgroundColor: theme.palette.bgForm.black_1,
                                color: "#ffffff",
                                borderRadius: "none",
                                maxWidth: "300px",
                              }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </>
              )}

              {/* <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                <Box sx={{ width: "15%", ml: 2 }}>
                  <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Technicians:</Typography>
                </Box>
                <Box sx={{ width: "10%" }} />
                <Box width={{ width: "75%", ml: 2 }}>
                  <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.subCategoryDescription}</Typography>
                </Box>
              </Stack> */}

              {/* ATTACHMENTS */}
              <Stack
                marginTop={3}
                padding={2}
                sx={{
                  border: "1px solid #2D3748",
                  borderRadius: "20px",
                }}
              >
                <Stack direction="row" gap={1} alignItems="center">
                  <GetAppOutlined sx={{ color: theme.palette.text.secondary }} />

                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Attachment(s):
                  </Typography>
                </Stack>

                {!attachments?.length ? (
                  <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                    <Stack direction="row" gap={0.5} justifyContent="center">
                      <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                      <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                    {attachments?.map((fileName, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "column",
                          // justifyContent: "space-between",
                          padding: 1,
                        }}
                      >
                        <Box
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
                            <Typography sx={{ fontSize: "14px" }}>{fileName.name}</Typography>

                            <Typography
                              sx={{
                                fontSize: isScreenSmall ? "10px" : "12px",
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {fileName.size} Mb
                            </Typography>
                          </Box>

                          <Box>
                            <TicketApprovalMenuActions fileName={fileName} onView={handleViewImage} onDownload={handleDownloadAttachment} isImageFile={isImageFile} />
                            {/* <>
                              {isImageFile(fileName.name) && (
                                <Tooltip title="View">
                                  <IconButton size="small" color="primary" onClick={() => handleViewImage(fileName)} style={{ background: "none" }}>
                                    {viewLoading ? <CircularProgress size={14} /> : <VisibilityOutlined />}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </>

                            {downloadLoading ? (
                              <CircularProgress size={14} />
                            ) : (
                              <Tooltip title="Download">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDownloadAttachment(fileName)}
                                  style={{
                                    background: "none",
                                  }}
                                >
                                  <FileDownloadOutlined />
                                </IconButton>
                              </Tooltip>
                            )} */}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ flexDirection: "row", gap: 0.5, padding: 2 }}>
            <LoadingButton
              size={isScreenSmall ? "small" : "medium"}
              variant="contained"
              color="success"
              onClick={onApproveAction}
              loading={approveTicketIsLoading || approveTicketIsFetching}
              startIcon={<Check />}
            >
              Approve
            </LoadingButton>

            <LoadingButton
              type="submit"
              variant="outlined"
              onClick={onDisapproveHandler}
              color="error"
              loading={approveTicketIsLoading || approveTicketIsFetching}
              startIcon={<Close />}
            >
              Disapprove
            </LoadingButton>
          </Stack>
        </DialogActions>

        <DisapprovedDialog data={disapproveData} open={disapproveOpen} onClose={disapproveOnClose} approvalOnClose={onCloseHandler} />
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

export default TicketApprovalDialog;
