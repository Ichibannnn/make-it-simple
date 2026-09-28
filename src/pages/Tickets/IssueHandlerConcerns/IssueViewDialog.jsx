// Layout 2
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Skeleton, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { AccountCircleRounded, AttachFileOutlined, ChecklistRtlOutlined, Close, GetAppOutlined, MoveDownOutlined, PendingOutlined, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";

import { theme } from "../../../theme/theme";
import moment from "moment";

import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";

import TicketHistory from "./TicketHistory";
import ViewTicketMenuActions from "./MenuActions/ViewTicketMenuActions";
import IssueHandlerClosingDialog from "./IssueHandlerClosingDialog";
import TicketForTransferDialog from "./TicketForTransferDialog";
import IssueHandlerHoldDialog from "./IssueHandlerHoldDialog";
import { toast } from "sonner";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import { useSelector } from "react-redux";

const IssueViewDialog = ({ data, viewOpen, viewOnClose, onClosing, onTransfer, onHold }) => {
  const [attachments, setAttachments] = useState([]);
  const [navigation, setNavigation] = useState("1");

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [viewIsLoading, setViewIsLoading] = useState(false);

  const [loadingAttachmentId, setLoadingAttachmentId] = useState(null);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const channelNameValidation = useSelector((state) => state?.user?.channels?.[0]?.channelName);

  const [getRequestorAttachment, { isLoading: attachmentIsLoading, isError: attachmentIsError, isFetching: attachmentIsFetching, isSuccess: attachmentIsSuccess }] =
    useLazyGetRequestorAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        })) ?? [],
      );
    } catch (error) {}
  };

  // Only refetch when the ticket itself changes, not whenever the `data` object reference changes
  useEffect(() => {
    if (data?.ticketConcernId) {
      getAttachmentData(data.ticketConcernId);
    }
  }, [data?.ticketConcernId]);

  const onCloseHandler = () => {
    viewOnClose();
  };

  const onTransferCloseHandler = () => {
    viewOnClose();
  };

  const onHoldCloseHandler = () => {
    viewOnClose();
  };

  // Function to open image view dialog
  const handleViewImage = useCallback(
    async (file) => {
      setViewIsLoading(true);
      setLoadingAttachmentId(file?.ticketAttachmentId);
      try {
        const response = await getViewAttachment(file?.ticketAttachmentId);

        if (response?.data) {
          const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
          setSelectedImage(imageUrl); // Set the image URL to state
          setIsViewDialogOpen(true);
        }
      } catch (error) {
        toast.error("Error!", {
          description: "View file error!",
          duration: 1500,
        });
      } finally {
        setViewIsLoading(false);
        setLoadingAttachmentId(null);
      }
    },
    [getViewAttachment],
  );

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const handleDownloadAttachment = useCallback(
    async (file) => {
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
          window.URL.revokeObjectURL(url); // Free the blob
        }
      } catch (error) {
        console.log("error: ", error);
        toast.error("Error!", {
          description: "Download file error!",
          duration: 1500,
        });
      } finally {
        setDownloadIsLoading(false);
      }
    },
    [getDownloadAttachment],
  );

  const handleViewClose = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage); // Release memory
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  // Filter once per attachments change instead of on every render
  const imageAttachments = useMemo(() => attachments.filter((a) => isImagePreview(a.name)), [attachments]);
  const otherAttachments = useMemo(() => attachments.filter((a) => !isImagePreview(a.name)), [attachments]);

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={viewOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseHandler();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogContent>
          {/* REQUESTOR */}
          <Stack direction="row" justifyContent="space-between" alignItems="end">
            <Stack direction="row" gap={1} alignItems="center">
              <AccountCircleRounded sx={{ fontSize: isScreenSmall ? "50px" : "70px" }} />
              <Stack>
                <Typography
                  sx={{
                    fontSize: isScreenSmall ? "12px" : "14px",
                    color: theme.palette.primary.main,
                    fontStyle: "italic",
                    letterSpacing: 1,
                    fontWeight: 400,
                  }}
                >
                  created by:{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: isScreenSmall ? "13px" : "15px",
                    color: "#6dc993",
                    fontWeight: 700,
                  }}
                >
                  {data?.requestor_Name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: isScreenSmall ? "11px" : "13px",
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {`${data?.department_Code} - ${data?.department_Name}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />
          <Stack direction="row" sx={{ marginTop: 2, justifyContent: "space-between" }}>
            <Tabs value={navigation} onChange={(_, value) => setNavigation(value)}>
              <Tab
                value="1"
                label="Details"
                sx={{
                  fontSize: isScreenSmall ? "10px" : "12px",
                  fontWeight: 600,
                }}
              />
            </Tabs>
          </Stack>

          <Stack gap={2} sx={{ marginTop: 2, justifyContent: "space-between" }}>
            <Stack
              sx={{
                width: "100%",
                background: theme.palette.bgForm.black2,
                padding: 2,
                borderRadius: "20px",
              }}
            >
              {/* DETAILS */}
              {isScreenSmall ? (
                <>
                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                      borderRadius: "20px 20px 0 0",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Ticket Number:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >{`${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Request Type:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        {data?.request_Type}
                      </Typography>
                    </Box>
                  </Stack>

                  {data?.request_Type === "Rework" && (
                    <Stack
                      sx={{
                        width: "100%",
                        padding: 1,
                        border: "1px solid #2D3748",
                      }}
                    >
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          Rework Ticket #:
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Department:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Channel:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        {data?.channel_Name}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Category:
                      </Typography>
                    </Box>

                    {data?.getOpenTicketCategories?.length > 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          ml: 1,
                        }}
                      >
                        {data?.getOpenTicketCategories?.map((item, i) => (
                          <Box key={i}>
                            <Chip
                              variant="filled"
                              size="small"
                              label={item.category_Description ? item.category_Description : "-"}
                              sx={{
                                backgroundColor: theme.palette.bgForm.black_1,
                                fontSize: "10px",
                                color: "#ffffff",
                                borderRadius: "none",
                                maxWidth: "300px",
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          -
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Sub Category:
                      </Typography>
                    </Box>

                    {data?.getOpenTicketSubCategories?.length > 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          ml: 1,
                        }}
                      >
                        {data?.getOpenTicketSubCategories?.map((item, i) => (
                          <Box key={i}>
                            <Chip
                              variant="filled"
                              size="small"
                              label={item.subCategory_Description ? item.subCategory_Description : "-"}
                              sx={{
                                backgroundColor: theme.palette.bgForm.black_1,
                                fontSize: "10px",
                                color: "#ffffff",
                                borderRadius: "none",
                                maxWidth: "300px",
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          -
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Concern Category*/}
                  {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
                    <Stack
                      sx={{
                        width: "100%",
                        padding: 1,
                        border: "1px solid #2D3748",
                      }}
                    >
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          Concern Category:
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          {data?.getForClosingTickets?.[0]?.categoryConcernName ? data?.getForClosingTickets?.[0]?.categoryConcernName : "-"}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Assigned to:
                      </Typography>
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        {data?.issue_Handler}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* For OnHold Remarks */}
                  {data?.ticket_Status === "For On-Hold" && (
                    <Stack
                      sx={{
                        width: "100%",
                        padding: 1,
                        border: "1px solid #2D3748",
                      }}
                    >
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          Hold Reason:
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.getForOnHolds?.[0]?.reason}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* OnHold Remarks */}
                  {data?.ticket_Status === "On-Hold" && (
                    <Stack
                      sx={{
                        width: "100%",
                        padding: 1,
                        border: "1px solid #2D3748",
                      }}
                    >
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          On Hold Reason:
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.getOnHolds?.[0]?.reason}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* Transfer Remarks */}
                  {data?.ticket_Status === "For Transfer" && (
                    <Stack
                      sx={{
                        width: "100%",
                        padding: 1,
                        border: "1px solid #2D3748",
                      }}
                    >
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          Transfer Remarks:
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.getForTransferTickets?.[0]?.transfer_Remarks}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* Transfer Approval Remarks */}
                  {data?.ticket_Status === "Transfer Approval" && (
                    <Stack
                      sx={{
                        width: "100%",
                        padding: 1,
                        border: "1px solid #2D3748",
                      }}
                    >
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          Transfer Remarks:
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.transferApprovalTickets?.[0]?.transfer_Remarks}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Date Needed:
                      </Typography>
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        {data?.date_Needed ? moment(data?.date_Needed).format("LL") : "--"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Target Date:
                      </Typography>
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        {moment(data?.target_Date).format("LL")}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Closing Date with Remarks */}
                  {(channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Closing Ticket") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "Closed") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Confirmation" && (
                      <>
                        <Stack
                          sx={{
                            width: "100%",
                            padding: 1,
                            border: "1px solid #2D3748",
                          }}
                        >
                          <Box sx={{ ml: 2 }}>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontWeight: "500",
                                fontSize: "12px",
                              }}
                            >
                              Backdate:
                            </Typography>
                          </Box>

                          <Box sx={{ ml: 2 }}>
                            <Typography
                              sx={{
                                color: theme.palette.text.main,
                                fontWeight: "500",
                                fontSize: "12px",
                              }}
                            >
                              {data?.getForClosingTickets?.[0]?.backDate ? moment(data?.getForClosingTickets?.[0]?.backDate).format("LL") : "--"}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          sx={{
                            width: "100%",
                            padding: 1,
                            border: "1px solid #2D3748",
                          }}
                        >
                          <Box sx={{ ml: 2 }}>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontWeight: "500",
                                fontSize: "12px",
                              }}
                            >
                              Backdate Remarks:
                            </Typography>
                          </Box>

                          <Box sx={{ ml: 2 }}>
                            <Typography
                              sx={{
                                color: theme.palette.text.main,
                                fontWeight: "500",
                                fontSize: "12px",
                              }}
                            >
                              {data?.getForClosingTickets?.[0]?.backDateRemarks ? data?.getForClosingTickets?.[0]?.backDateRemarks : "--"}
                            </Typography>
                          </Box>
                        </Stack>
                      </>
                    ))}

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Ticket Description:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                          wordBreak: "break-word",
                        }}
                      >
                        {data?.concern_Description?.split("\r\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    sx={{
                      width: "100%",
                      padding: 1,
                      border: "1px solid #2D3748",
                    }}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Notes:
                      </Typography>
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "12px",
                          wordBreak: "break-word",
                        }}
                      >
                        {data?.notes !== null ? data?.notes : "--"}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Resolution */}
                  {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
                    <Stack
                      sx={{
                        width: "100%",
                        padding: 1,
                        border: "1px solid #2D3748",
                        borderRadius: "0 0 20px 20px",
                      }}
                    >
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "12px",
                          }}
                        >
                          Resolution:
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "12px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.getForClosingTickets?.[0]?.resolution?.split("\r\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </>
              ) : (
                <>
                  <Stack
                    direction="row"
                    sx={{
                      padding: 1,
                      border: "1px solid #2D3748",
                      borderRadius: "20px 20px 0 0",
                    }}
                  >
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Ticket Number:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >{`${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Request Type:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {data?.request_Type}
                      </Typography>
                    </Box>
                  </Stack>

                  {data?.request_Type === "Back Job" && (
                    <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ width: "15%", ml: 2 }}>
                        <Typography
                          sx={{
                            textAlign: "right",
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Rework Ticket Number:
                        </Typography>
                      </Box>
                      <Box sx={{ width: "10%" }} />
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Department:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Channel:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {data?.channel_Name}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Category:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />

                    {data?.getOpenTicketCategories?.length > 0 ? (
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                          {data?.getOpenTicketCategories?.map((item, i) => (
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
                    ) : (
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          -
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Sub Category:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />

                    {data?.getOpenTicketSubCategories?.length > 0 ? (
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                          {data?.getOpenTicketSubCategories?.map((item, i) => (
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
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.subCategory_Description}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          -
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Concern Category */}
                  {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
                    <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ width: "15%", ml: 2 }}>
                        <Typography
                          sx={{
                            textAlign: "right",
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Concern Category:
                        </Typography>
                      </Box>
                      <Box sx={{ width: "10%" }} />
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          {data?.getForClosingTickets?.[0]?.categoryConcernName ? data?.getForClosingTickets?.[0]?.categoryConcernName : "-"}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Assigned to:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {data?.issue_Handler}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* For OnHold Remarks */}
                  {data?.ticket_Status === "For On-Hold" && (
                    <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ width: "15%", ml: 2 }}>
                        <Typography
                          sx={{
                            textAlign: "right",
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Hold Reason:
                        </Typography>
                      </Box>
                      <Box sx={{ width: "10%" }} />
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.getForOnHolds?.[0]?.reason}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* OnHold Remarks */}
                  {data?.ticket_Status === "On-Hold" && (
                    <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ width: "15%", ml: 2 }}>
                        <Typography
                          sx={{
                            textAlign: "right",
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          On Hold Reason:
                        </Typography>
                      </Box>
                      <Box sx={{ width: "10%" }} />
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.getOnHolds?.[0]?.reason}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* Transfer Remarks */}
                  {data?.ticket_Status === "For Transfer" && (
                    <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ width: "15%", ml: 2 }}>
                        <Typography
                          sx={{
                            textAlign: "right",
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Transfer Remarks:
                        </Typography>
                      </Box>
                      <Box sx={{ width: "10%" }} />
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.getForTransferTickets?.[0]?.transfer_Remarks}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* Transfer Approval Remarks */}
                  {data?.ticket_Status === "Transfer Approval" && (
                    <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ width: "15%", ml: 2 }}>
                        <Typography
                          sx={{
                            textAlign: "right",
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Transfer Remarks:
                        </Typography>
                      </Box>
                      <Box sx={{ width: "10%" }} />
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.transferApprovalTickets?.[0]?.transfer_Remarks}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Date Needed:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {data?.date_Needed ? moment(data?.date_Needed).format("LL") : "--"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Target Date:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {moment(data?.target_Date).format("LL")}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Closing Date with Remarks */}
                  {(channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Closing Ticket") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "Closed") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Confirmation" && (
                      <>
                        <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                          <Box sx={{ width: "15%", ml: 2 }}>
                            <Typography
                              sx={{
                                textAlign: "right",
                                color: theme.palette.text.secondary,
                                fontWeight: "500",
                                fontSize: "14px",
                              }}
                            >
                              Backdate:
                            </Typography>
                          </Box>
                          <Box sx={{ width: "10%" }} />
                          <Box sx={{ width: "75%", ml: 2 }}>
                            <Typography
                              sx={{
                                color: theme.palette.text.main,
                                fontWeight: "500",
                                fontSize: "14px",
                              }}
                            >
                              {data?.getForClosingTickets?.[0]?.backDate ? moment(data?.getForClosingTickets?.[0]?.backDate).format("LL") : "--"}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                          <Box sx={{ width: "15%", ml: 2 }}>
                            <Typography
                              sx={{
                                textAlign: "right",
                                color: theme.palette.text.secondary,
                                fontWeight: "500",
                                fontSize: "14px",
                              }}
                            >
                              Backdate Remarks:
                            </Typography>
                          </Box>
                          <Box sx={{ width: "10%" }} />
                          <Box sx={{ width: "75%", ml: 2 }}>
                            <Typography
                              sx={{
                                color: theme.palette.text.main,
                                fontWeight: "500",
                                fontSize: "14px",
                              }}
                            >
                              {data?.getForClosingTickets?.[0]?.backDateRemarks ? data?.getForClosingTickets?.[0]?.backDateRemarks : "--"}
                            </Typography>
                          </Box>
                        </Stack>
                      </>
                    ))}

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "15%", ml: 2 }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Ticket Description:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />

                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                          wordBreak: "break-word",
                        }}
                      >
                        {data?.concern_Description?.split("\r\n").map((line, index) => (
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
                      <Typography
                        sx={{
                          textAlign: "right",
                          color: theme.palette.text.secondary,
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Notes:
                      </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }} />
                    <Box sx={{ width: "75%", ml: 2 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.main,
                          fontWeight: "500",
                          fontSize: "14px",
                          wordBreak: "break-word",
                        }}
                      >
                        {data?.notes !== null ? data?.notes : "--"}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Resolution */}
                  {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
                    <Stack
                      direction="row"
                      sx={{
                        padding: 1,
                        border: "1px solid #2D3748",
                        borderRadius: "0 0 20px 20px",
                      }}
                    >
                      <Box sx={{ width: "15%", ml: 2 }}>
                        <Typography
                          sx={{
                            textAlign: "right",
                            color: theme.palette.text.secondary,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Resolution:
                        </Typography>
                      </Box>
                      <Box sx={{ width: "10%" }} />
                      <Box sx={{ width: "75%", ml: 2 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.main,
                            fontWeight: "500",
                            fontSize: "14px",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.getForClosingTickets?.[0]?.resolution?.split("\r\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </>
              )}

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
                  <GetAppOutlined
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: isScreenSmall ? "16px" : "18px",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: isScreenSmall ? "12px" : "14px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Attachment(s):
                  </Typography>
                </Stack>

                {attachments?.length > 0 && (
                  <Stack sx={{ gap: 1.5 }}>
                    {/* Image thumbnails, grid layout */}
                    {imageAttachments.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.5,
                          paddingTop: 1,
                        }}
                      >
                        {imageAttachments.map((fileName) => (
                          <ImageAttachmentPreviewCard
                            key={`img-${fileName.ticketAttachmentId}`}
                            fileName={fileName}
                            onView={handleViewImage}
                            onDownload={handleDownloadAttachment}
                            viewIsLoading={viewIsLoading}
                            downloadIsLoading={downloadIsLoading}
                            isOpening={loadingAttachmentId === fileName.ticketAttachmentId}
                          />
                        ))}
                      </Box>
                    )}

                    {/* Non-image files, row list (unchanged from before) */}
                    {otherAttachments.map((fileName, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 1,
                        }}
                      >
                        {getAttachmentIcon(fileName)}
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 0.5,
                            borderBottom: "1px solid #2D3748",
                          }}
                        >
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography
                              sx={{
                                fontSize: isScreenSmall ? "12px" : "14px",
                              }}
                            >
                              {fileName.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: isScreenSmall ? "12px" : "14px",
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {fileName.size} Mb
                            </Typography>
                          </Box>

                          <Box>
                            <ViewTicketMenuActions
                              fileName={fileName}
                              onView={handleViewImage}
                              onDownload={handleDownloadAttachment}
                              isImageFile={isImageFile}
                              viewIsLoading={viewIsLoading}
                              downloadIsLoading={downloadIsLoading}
                            />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}

                {(attachmentIsLoading || attachmentIsFetching) && (
                  <Stack sx={{ width: "100%" }}>
                    <Stack
                      sx={{
                        padding: 2,
                        flexDirection: "row",
                        gap: 1,
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton animation="wave" variant="circular" width={45} height={40} />
                      <Stack sx={{ width: "100%" }}>
                        <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
                        <Skeleton animation="wave" height={20} />
                      </Stack>
                    </Stack>
                  </Stack>
                )}

                {attachmentIsSuccess && !attachments?.length && !attachmentIsLoading && !attachmentIsFetching && (
                  <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                    <Stack direction="row" gap={0.5} justifyContent="center" alignItems="center">
                      <AttachFileOutlined
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: isScreenSmall ? "16px" : "18px",
                        }}
                      />
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: isScreenSmall ? "14px" : "16px",
                        }}
                      >
                        No attached file
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <>
              <TicketHistory data={data} />
            </>
          </Stack>
        </DialogContent>

        <DialogActions>
          {/* BUTTONS */}
          {data?.ticket_Status === "Open Ticket" && (
            <>
              <Stack direction="row" gap={0.5} alignItems="center" mb={1}>
                <Button variant="contained" size="small" onClick={() => onClosing(data)} color="success" startIcon={<ChecklistRtlOutlined />} sx={{ borderRadius: "1px" }}>
                  <Typography sx={{ fontSize: "12px" }}>Close</Typography>
                </Button>

                <Button variant="contained" size="small" onClick={() => onTransfer(data)} color="info" startIcon={<MoveDownOutlined />} sx={{ borderRadius: "1px" }}>
                  <Typography sx={{ fontSize: "12px" }}>Transfer</Typography>
                </Button>

                <Button variant="contained" size="small" onClick={() => onHold(data)} color="warning" startIcon={<PendingOutlined />} sx={{ borderRadius: "1px" }}>
                  <Typography sx={{ fontSize: "12px" }}>Hold</Typography>
                </Button>
              </Stack>
            </>
          )}
        </DialogActions>

        <IssueHandlerClosingDialog data={data} viewOnClose={onCloseHandler} />
        <TicketForTransferDialog data={data} viewOnClose={onTransferCloseHandler} />
        <IssueHandlerHoldDialog data={data} viewOnClose={onHoldCloseHandler} />
      </Dialog>

      {selectedImage && <ImageViewerDialog imageUrl={selectedImage} open={isViewDialogOpen} onClose={handleViewClose} />}
    </>
  );
};

export default IssueViewDialog;

const isImagePreview = (fileName) => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

const EXT_TO_MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

// ---------------------------------------------------------------------------
// Full-size image viewer. Owns the zoom/pan state so dragging or wheel-zooming
// only re-renders this small component, not the whole ticket dialog.
// ---------------------------------------------------------------------------
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

const ImageViewerDialog = memo(function ImageViewerDialog({ imageUrl, open, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewport, setViewport] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Native, non-passive wheel listener so preventDefault actually works
  useEffect(() => {
    if (!viewport) return;
    const onWheel = (event) => {
      event.preventDefault();
      setZoom((z) => (event.deltaY < 0 ? Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)) : Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2))));
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [viewport]);

  // Snap the pan offset back to center whenever zoom returns to 100% or below
  // (only updates state if it actually changes)
  useEffect(() => {
    if (zoom <= 1) setPosition((p) => (p.x === 0 && p.y === 0 ? p : { x: 0, y: 0 }));
  }, [zoom]);

  // Dragging to pan: only active once zoomed in. Listens on window so a drag
  // that ends outside the image still releases cleanly.
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event) => {
      setPosition({
        x: positionStartRef.current.x + (event.clientX - dragStartRef.current.x),
        y: positionStartRef.current.y + (event.clientY - dragStartRef.current.y),
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleImageMouseDown = (event) => {
    if (zoom <= 1) return;
    event.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    positionStartRef.current = { ...position };
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogContent sx={{ height: "auto", padding: 0 }}>
        <Box sx={{ position: "relative" }}>
          {/* Zoom controls */}
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "20px",
              padding: "2px 6px",
            }}
          >
            <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} sx={{ color: "#fff" }}>
              <ZoomOut fontSize="small" />
            </IconButton>

            <Typography
              sx={{
                color: "#fff",
                fontSize: "12px",
                minWidth: 38,
                textAlign: "center",
              }}
            >
              {Math.round(zoom * 100)}%
            </Typography>

            <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} sx={{ color: "#fff" }}>
              <ZoomIn fontSize="small" />
            </IconButton>

            <IconButton size="small" onClick={handleZoomReset} sx={{ color: "#fff" }}>
              <RestartAlt fontSize="small" />
            </IconButton>
          </Stack>

          <Box
            ref={setViewport}
            sx={{
              width: "100%",
              height: "70vh",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000",
            }}
          >
            <img
              src={imageUrl}
              alt="Preview"
              onMouseDown={handleImageMouseDown}
              draggable={false}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                display: "block",
                userSelect: "none",
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.15s ease",
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
});

// ---------------------------------------------------------------------------
// Thumbnails: downscale the full image so the browser doesn't decode
// multi-megapixel files just to draw a 120x80 preview.
// ---------------------------------------------------------------------------
const THUMB_WIDTH = 240; // 2x of the 120px card, sharp on retina

const createThumbnailBlob = async (blob, mime) => {
  const typed = new Blob([blob], { type: mime });
  try {
    if (typeof createImageBitmap !== "function") return typed;
    const bitmap = await createImageBitmap(typed);
    const scale = Math.min(1, THUMB_WIDTH / bitmap.width);
    if (scale === 1) {
      bitmap.close();
      return typed;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const outType = mime === "image/jpeg" ? "image/jpeg" : "image/png";
    const thumb = await new Promise((resolve) => canvas.toBlob(resolve, outType, 0.8));
    return thumb || typed;
  } catch {
    return typed; // fall back to the original file
  }
};

const ImageAttachmentPreviewCard = memo(function ImageAttachmentPreviewCard({ fileName, onView, onDownload, viewIsLoading, downloadIsLoading, isOpening }) {
  const [getAttachmentPreview] = useLazyGetViewAttachmentQuery();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const ext = fileName.name.split(".").pop()?.toLowerCase();

  useEffect(() => {
    let cancelled = false;
    let objectUrl;

    (async () => {
      try {
        const response = await getAttachmentPreview(fileName?.ticketAttachmentId);
        if (cancelled) return;

        if (response?.data) {
          const mime = EXT_TO_MIME[ext] || response.data.type || "application/octet-stream";
          const thumbBlob = await createThumbnailBlob(response.data, mime);
          if (cancelled) return;
          objectUrl = URL.createObjectURL(thumbBlob);
          setPreviewUrl(objectUrl);
        } else {
          setPreviewError(true);
        }
      } catch (error) {
        console.error("Thumbnail preview error:", error);
        if (!cancelled) setPreviewError(true);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileName?.ticketAttachmentId, ext, getAttachmentPreview]);

  return (
    <Box
      sx={{
        position: "relative",
        width: 120,
        height: 116,
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #2D3748",
        backgroundColor: theme.palette.bgForm?.black3 || "#1A202C",
        cursor: isOpening ? "wait" : "pointer",
      }}
      onClick={() => {
        if (isOpening) return;
        onView(fileName);
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "absolute",
          top: 2,
          right: 2,
          zIndex: 2,
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        <ViewTicketMenuActions fileName={fileName} onView={onView} onDownload={onDownload} isImageFile={isImagePreview} viewIsLoading={viewIsLoading} downloadIsLoading={downloadIsLoading} />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: 80,
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      >
        {previewUrl && !previewError && (
          <Box
            component="img"
            src={previewUrl}
            alt={fileName.name}
            onError={() => setPreviewError(true)}
            sx={{
              width: "100%",
              height: 80,
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {!previewUrl && !previewError && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={20} thickness={4} sx={{ color: theme.palette.text.secondary }} />
          </Box>
        )}

        {previewError && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getAttachmentIcon(fileName)}
          </Box>
        )}

        {isOpening && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <CircularProgress size={22} thickness={4} sx={{ color: "#fff" }} />
          </Box>
        )}
      </Box>

      <Box sx={{ padding: "6px 8px", overflow: "hidden" }}>
        <Typography
          noWrap
          title={fileName.name}
          sx={{
            fontSize: "11px",
            fontWeight: 500,
            color: theme.palette.text.main,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {fileName.name}
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: "10px",
            color: theme.palette.text.secondary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {ext?.toUpperCase()} · {fileName.size} MB
        </Typography>
      </Box>
    </Box>
  );
});

// Layout 3
// import { useEffect, useRef, useState } from "react";
// import { AccountCircleRounded, AttachFileOutlined, ChecklistRtlOutlined, Close, GetAppOutlined, MoveDownOutlined, PendingOutlined, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";
// import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
// import moment from "moment";
// import { useSelector } from "react-redux";
// import { toast } from "sonner";

// import { theme } from "../../../theme/theme";
// import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
// import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
// import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";

// import TicketHistory from "./TicketHistory";
// import ViewTicketMenuActions from "./MenuActions/ViewTicketMenuActions";
// import IssueHandlerClosingDialog from "./IssueHandlerClosingDialog";
// import TicketForTransferDialog from "./TicketForTransferDialog";
// import IssueHandlerHoldDialog from "./IssueHandlerHoldDialog";

// const BORDER = "#2D3748";
// const SURFACE = theme.palette.bgForm?.black2 || "#1C2536";
// const SURFACE_DARK = theme.palette.bgForm?.black1 || "#111927";

// const IssueViewDialog = ({ data, viewOpen, viewOnClose, onClosing, onTransfer, onHold }) => {
//   const [attachments, setAttachments] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [viewIsLoading, setViewIsLoading] = useState(false);
//   const [loadingAttachmentId, setLoadingAttachmentId] = useState(null);
//   const [downloadIsLoading, setDownloadIsLoading] = useState(false);

//   const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

//   const [zoom, setZoom] = useState(1);
//   const MIN_ZOOM = 0.5;
//   const MAX_ZOOM = 4;
//   const ZOOM_STEP = 0.25;

//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const dragStartRef = useRef({ x: 0, y: 0 });
//   const positionStartRef = useRef({ x: 0, y: 0 });

//   const channelNameValidation = useSelector((state) => state?.user?.channels?.[0]?.channelName);

//   const [getRequestorAttachment, { isLoading: attachmentIsLoading, isFetching: attachmentIsFetching, isSuccess: attachmentIsSuccess }] = useLazyGetRequestorAttachmentQuery();
//   const [getViewAttachment] = useLazyGetViewAttachmentQuery();
//   const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

//   const getAttachmentData = async (id) => {
//     try {
//       const res = await getRequestorAttachment({ Id: id }).unwrap();

//       setAttachments(
//         res?.value?.[0]?.attachments?.map((item) => ({
//           ticketAttachmentId: item.ticketAttachmentId,
//           name: item.fileName,
//           size: (item.fileSize / (1024 * 1024)).toFixed(2),
//           link: item.attachment,
//         })) || [],
//       );
//     } catch (error) {
//       setAttachments([]);
//     }
//   };

//   useEffect(() => {
//     if (data?.ticketConcernId) {
//       getAttachmentData(data.ticketConcernId);
//     } else {
//       setAttachments([]);
//     }
//   }, [data]);

//   const onCloseHandler = () => {
//     viewOnClose();
//   };

//   const onTransferCloseHandler = () => {
//     viewOnClose();
//   };

//   const onHoldCloseHandler = () => {
//     viewOnClose();
//   };

//   const handleViewImage = async (file) => {
//     setViewIsLoading(true);
//     setLoadingAttachmentId(file?.ticketAttachmentId);

//     try {
//       const response = await getViewAttachment(file?.ticketAttachmentId);

//       if (response?.data) {
//         const imageUrl = URL.createObjectURL(response.data);
//         setSelectedImage(imageUrl);
//         setZoom(1);
//         setPosition({ x: 0, y: 0 });
//         setIsViewDialogOpen(true);
//       }
//     } catch (error) {
//       toast.error("Error!", {
//         description: "View file error!",
//         duration: 1500,
//       });
//     } finally {
//       setViewIsLoading(false);
//       setLoadingAttachmentId(null);
//     }
//   };

//   const isImageFile = (fileName) => /\.(jpg|jpeg|png)$/i.test(fileName);

//   const handleDownloadAttachment = async (file) => {
//     setDownloadIsLoading(true);

//     try {
//       const response = await getDownloadAttachment(file?.ticketAttachmentId);

//       if (response?.data) {
//         const blob = new Blob([response.data], { type: response.data.type });
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");

//         link.href = url;
//         link.setAttribute("download", `${file?.name || "attachment"}`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       }
//     } catch (error) {
//       console.log("error: ", error);
//       toast.error("Error!", {
//         description: "Download file error!",
//         duration: 1500,
//       });
//     } finally {
//       setDownloadIsLoading(false);
//     }
//   };

//   const handleViewClose = () => {
//     if (selectedImage) {
//       URL.revokeObjectURL(selectedImage);
//     }

//     setIsViewDialogOpen(false);
//     setSelectedImage(null);
//     setZoom(1);
//     setPosition({ x: 0, y: 0 });
//   };

//   const handleZoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
//   const handleZoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));

//   const handleZoomReset = () => {
//     setZoom(1);
//     setPosition({ x: 0, y: 0 });
//   };

//   const handleWheelZoom = (event) => {
//     event.preventDefault();

//     if (event.deltaY < 0) {
//       handleZoomIn();
//     } else {
//       handleZoomOut();
//     }
//   };

//   useEffect(() => {
//     if (zoom <= 1) {
//       setPosition({ x: 0, y: 0 });
//     }
//   }, [zoom]);

//   useEffect(() => {
//     if (!isDragging) return;

//     const handleMouseMove = (event) => {
//       const dx = event.clientX - dragStartRef.current.x;
//       const dy = event.clientY - dragStartRef.current.y;

//       setPosition({
//         x: positionStartRef.current.x + dx,
//         y: positionStartRef.current.y + dy,
//       });
//     };

//     const handleMouseUp = () => setIsDragging(false);

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging]);

//   const handleImageMouseDown = (event) => {
//     if (zoom <= 1) return;

//     event.preventDefault();
//     setIsDragging(true);
//     dragStartRef.current = { x: event.clientX, y: event.clientY };
//     positionStartRef.current = { ...position };
//   };

//   const statusLabel = data?.ticket_Status || "Ticket Details";
//   const isClosingStatus = ["For Closing Ticket", "For Confirmation", "Closed"].includes(data?.ticket_Status);
//   const isHardwareChannel = channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)";

//   return (
//     <>
//       <Dialog
//         fullWidth
//         maxWidth="md"
//         open={viewOpen}
//         onClose={(event, reason) => {
//           if (reason === "backdropClick") {
//             event.stopPropagation();
//             return;
//           }

//           onCloseHandler();
//         }}
//         disableEscapeKeyDown={false}
//         sx={{
//           backdropFilter: "blur(5px)",
//           "& .MuiDialog-paper": {
//             margin: { xs: 1, sm: 2 },
//             width: "calc(100% - 16px)",
//             maxHeight: "calc(100% - 32px)",
//             overflow: "hidden",
//             borderRadius: { xs: 2, md: 3 },
//             backgroundColor: SURFACE_DARK,
//             backgroundImage: "none",
//             color: theme.palette.text.main,
//             border: `1px solid ${BORDER}`,
//             boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
//           },
//         }}
//       >
//         {/* HEADER */}
//         <Box
//           sx={{
//             px: { xs: 2, md: 3 },
//             pt: { xs: 2, md: 2.5 },
//             pb: 1.75,
//             borderBottom: `1px solid ${BORDER}`,
//             backgroundColor: SURFACE_DARK,
//           }}
//         >
//           <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
//             <Stack direction="row" alignItems="center" spacing={{ xs: 1.25, md: 1.5 }} minWidth={0}>
//               <AccountCircleRounded
//                 sx={{
//                   flexShrink: 0,
//                   fontSize: { xs: 48, md: 58 },
//                   color: "#EDF2F7",
//                 }}
//               />

//               <Box minWidth={0}>
//                 <Typography
//                   sx={{
//                     fontSize: { xs: 10, md: 11 },
//                     color: theme.palette.primary.main,
//                     fontStyle: "italic",
//                     letterSpacing: 0.8,
//                     lineHeight: 1.3,
//                   }}
//                 >
//                   created by:
//                 </Typography>

//                 <Typography
//                   noWrap
//                   title={data?.requestor_Name || ""}
//                   sx={{
//                     fontSize: { xs: 13, md: 15 },
//                     color: "#6dc993",
//                     fontWeight: 700,
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {data?.requestor_Name || "--"}
//                 </Typography>

//                 <Typography
//                   noWrap
//                   title={`${data?.department_Code || ""} - ${data?.department_Name || ""}`}
//                   sx={{
//                     fontSize: { xs: 10, md: 11 },
//                     color: theme.palette.text.secondary,
//                     fontWeight: 500,
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {`${data?.department_Code || "--"} - ${data?.department_Name || "--"}`}
//                 </Typography>
//               </Box>
//             </Stack>

//             <IconButton
//               onClick={onCloseHandler}
//               aria-label="Close ticket dialog"
//               sx={{
//                 color: theme.palette.text.secondary,
//                 flexShrink: 0,
//                 "&:hover": {
//                   color: theme.palette.text.main,
//                   backgroundColor: "rgba(255,255,255,0.06)",
//                 },
//               }}
//             >
//               <Close />
//             </IconButton>
//           </Stack>
//         </Box>

//         <DialogContent
//           sx={{
//             p: 0,
//             overflowY: "auto",
//             backgroundColor: SURFACE_DARK,
//             "&::-webkit-scrollbar": { width: 7 },
//             "&::-webkit-scrollbar-track": { background: SURFACE_DARK },
//             "&::-webkit-scrollbar-thumb": {
//               backgroundColor: "#354052",
//               borderRadius: 10,
//             },
//           }}
//         >
//           <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 1.75, md: 2.5 } }}>
//             {/* SECTION LABEL */}
//             <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
//               <Box>
//                 <Typography
//                   sx={{
//                     color: theme.palette.primary.main,
//                     fontSize: { xs: 10, md: 11 },
//                     fontWeight: 700,
//                     letterSpacing: 0.8,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Details
//                 </Typography>
//                 <Typography
//                   sx={{
//                     color: theme.palette.text.secondary,
//                     fontSize: 11,
//                     mt: 0.25,
//                   }}
//                 >
//                   Ticket information and current request status
//                 </Typography>
//               </Box>

//               <Chip
//                 size="small"
//                 label={statusLabel}
//                 sx={{
//                   height: 26,
//                   maxWidth: { xs: 150, sm: 240 },
//                   borderRadius: 1.5,
//                   backgroundColor: "rgba(158,119,237,0.16)",
//                   color: theme.palette.primary.main,
//                   border: "1px solid rgba(158,119,237,0.22)",
//                   fontSize: 10,
//                   fontWeight: 600,
//                   "& .MuiChip-label": {
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   },
//                 }}
//               />
//             </Stack>

//             {/* TICKET DETAILS */}
//             <Box
//               sx={{
//                 backgroundColor: SURFACE,
//                 border: `1px solid rgba(255,255,255,0.04)`,
//                 borderRadius: { xs: 2, md: 3 },
//                 p: { xs: 1.5, md: 2.25 },
//               }}
//             >
//               <SectionHeader icon={<ChecklistRtlOutlined />} title="Ticket Details" />

//               <Box
//                 sx={{
//                   mt: 1.5,
//                   display: "grid",
//                   gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
//                   gap: { xs: 0.75, md: 1.25 },
//                 }}
//               >
//                 <DetailItem label="Ticket Number">{`${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId || "--"}`}</DetailItem>

//                 <DetailItem label="Request Type">
//                   <ValueChip label={data?.request_Type} />
//                 </DetailItem>

//                 {data?.request_Type === "Back Job" && <DetailItem label="Rework Ticket Number">{`${data?.backJobId || "--"} - ${data?.back_Job_Concern || "--"}`}</DetailItem>}

//                 <DetailItem label="Department">{`${data?.department_Code || "--"} - ${data?.department_Name || "--"}`}</DetailItem>

//                 <DetailItem label="Channel">{data?.channel_Name || "--"}</DetailItem>

//                 <DetailItem label="Category">
//                   <ChipList items={data?.getOpenTicketCategories} getLabel={(item) => item?.category_Description || "-"} />
//                 </DetailItem>

//                 <DetailItem label="Sub Category">
//                   <ChipList items={data?.getOpenTicketSubCategories} getLabel={(item) => item?.subCategory_Description || "-"} />
//                   {data?.subCategory_Description && <Typography sx={detailTextSx}>{data.subCategory_Description}</Typography>}
//                 </DetailItem>

//                 {isClosingStatus && <DetailItem label="Concern Category">{data?.getForClosingTickets?.[0]?.categoryConcernName || "-"}</DetailItem>}

//                 <DetailItem label="Assigned To">{data?.issue_Handler || "--"}</DetailItem>

//                 {data?.ticket_Status === "For On-Hold" && <DetailItem label="Hold Reason">{data?.getForOnHolds?.[0]?.reason || "--"}</DetailItem>}

//                 {data?.ticket_Status === "On-Hold" && <DetailItem label="On Hold Reason">{data?.getOnHolds?.[0]?.reason || "--"}</DetailItem>}

//                 {data?.ticket_Status === "For Transfer" && <DetailItem label="Transfer Remarks">{data?.getForTransferTickets?.[0]?.transfer_Remarks || "--"}</DetailItem>}

//                 {data?.ticket_Status === "Transfer Approval" && <DetailItem label="Transfer Remarks">{data?.transferApprovalTickets?.[0]?.transfer_Remarks || "--"}</DetailItem>}

//                 <DetailItem label="Date Needed">{data?.date_Needed ? moment(data.date_Needed).format("LL") : "--"}</DetailItem>

//                 <DetailItem label="Target Date">{data?.target_Date ? moment(data.target_Date).format("LL") : "--"}</DetailItem>

//                 {isHardwareChannel && data?.ticket_Status === "For Confirmation" && (
//                   <>
//                     <DetailItem label="Backdate">{data?.getForClosingTickets?.[0]?.backDate ? moment(data.getForClosingTickets[0].backDate).format("LL") : "--"}</DetailItem>

//                     <DetailItem label="Backdate Remarks">{data?.getForClosingTickets?.[0]?.backDateRemarks || "--"}</DetailItem>
//                   </>
//                 )}

//                 <DetailItem label="Ticket Description" fullWidth>
//                   <MultilineText value={data?.concern_Description} />
//                 </DetailItem>

//                 <DetailItem label="Notes" fullWidth>
//                   {data?.notes !== null && data?.notes !== undefined && data?.notes !== "" ? data.notes : "--"}
//                 </DetailItem>

//                 {isClosingStatus && (
//                   <DetailItem label="Resolution" fullWidth>
//                     <MultilineText value={data?.getForClosingTickets?.[0]?.resolution} />
//                   </DetailItem>
//                 )}
//               </Box>
//             </Box>

//             {/* ATTACHMENTS */}
//             <Box
//               sx={{
//                 mt: 2,
//                 backgroundColor: SURFACE,
//                 border: `1px solid rgba(255,255,255,0.04)`,
//                 borderRadius: { xs: 2, md: 3 },
//                 p: { xs: 1.5, md: 2.25 },
//               }}
//             >
//               <SectionHeader icon={<AttachFileOutlined />} title="Attachments" />

//               {attachments?.length > 0 && (
//                 <Stack spacing={1.5} mt={1.5}>
//                   {attachments.filter((a) => isImagePreview(a.name)).length > 0 && (
//                     <Box
//                       sx={{
//                         display: "grid",
//                         gridTemplateColumns: {
//                           xs: "repeat(2, minmax(0, 1fr))",
//                           sm: "repeat(3, 120px)",
//                           md: "repeat(4, 120px)",
//                         },
//                         gap: 1.25,
//                       }}
//                     >
//                       {attachments
//                         .filter((a) => isImagePreview(a.name))
//                         .map((fileName, index) => (
//                           <ImageAttachmentPreviewCard
//                             key={`img-${index}`}
//                             fileName={fileName}
//                             onView={handleViewImage}
//                             onDownload={handleDownloadAttachment}
//                             viewIsLoading={viewIsLoading}
//                             downloadIsLoading={downloadIsLoading}
//                             isOpening={loadingAttachmentId === fileName.ticketAttachmentId}
//                           />
//                         ))}
//                     </Box>
//                   )}

//                   {attachments
//                     .filter((a) => !isImagePreview(a.name))
//                     .map((fileName, index) => (
//                       <AttachmentRow
//                         key={index}
//                         fileName={fileName}
//                         isImageFile={isImageFile}
//                         onView={handleViewImage}
//                         onDownload={handleDownloadAttachment}
//                         viewIsLoading={viewIsLoading}
//                         downloadIsLoading={downloadIsLoading}
//                       />
//                     ))}
//                 </Stack>
//               )}

//               {(attachmentIsLoading || attachmentIsFetching) && (
//                 <Stack spacing={1.25} mt={1.5}>
//                   <Stack direction="row" gap={1.25} alignItems="center">
//                     <Skeleton animation="wave" variant="rounded" width={46} height={46} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
//                     <Stack flex={1}>
//                       <Skeleton animation="wave" height={18} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
//                       <Skeleton animation="wave" height={18} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
//                     </Stack>
//                   </Stack>
//                 </Stack>
//               )}

//               {attachmentIsSuccess && !attachments?.length && !attachmentIsLoading && !attachmentIsFetching && (
//                 <Box
//                   sx={{
//                     mt: 1.5,
//                     minHeight: 70,
//                     border: `1px dashed ${BORDER}`,
//                     borderRadius: 2,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     px: 2,
//                   }}
//                 >
//                   <Stack direction="row" spacing={0.75} alignItems="center">
//                     <AttachFileOutlined sx={{ color: theme.palette.text.secondary, fontSize: 17 }} />
//                     <Typography sx={{ color: theme.palette.text.secondary, fontSize: 12 }}>No attached file</Typography>
//                   </Stack>
//                 </Box>
//               )}
//             </Box>

//             {/* TIMELINE */}
//             <Box
//               sx={{
//                 mt: 2,
//                 backgroundColor: SURFACE,
//                 border: `1px solid rgba(255,255,255,0.04)`,
//                 borderRadius: { xs: 2, md: 3 },
//                 overflow: "hidden",
//               }}
//             >
//               {/* <Box sx={{ p: { xs: 1.5, md: 2.25 } }}>
//                 <SectionHeader icon={<PendingOutlined />} title="lTicket Timeine" />
//               </Box> */}

//               <Box sx={{ px: { xs: 1.5, md: 2.25 }, pb: 2 }}>
//                 <TicketHistory data={data} />
//               </Box>
//             </Box>
//           </Box>
//         </DialogContent>

//         <DialogActions
//           sx={{
//             px: { xs: 1.5, md: 2.5 },
//             py: 1.5,
//             borderTop: `1px solid ${BORDER}`,
//             backgroundColor: SURFACE_DARK,
//             justifyContent: "flex-end",
//           }}
//         >
//           {data?.ticket_Status === "Open Ticket" && (
//             <Stack direction={{ xs: "column", sm: "row" }} spacing={0.75} width={{ xs: "100%", sm: "auto" }}>
//               <ActionButton label="Close" icon={<ChecklistRtlOutlined />} color="success" onClick={() => onClosing(data)} />

//               <ActionButton label="Transfer" icon={<MoveDownOutlined />} color="info" onClick={() => onTransfer(data)} />

//               <ActionButton label="Hold" icon={<PendingOutlined />} color="warning" onClick={() => onHold(data)} />
//             </Stack>
//           )}
//         </DialogActions>

//         <IssueHandlerClosingDialog data={data} viewOnClose={onCloseHandler} />
//         <TicketForTransferDialog data={data} viewOnClose={onTransferCloseHandler} />
//         <IssueHandlerHoldDialog data={data} viewOnClose={onHoldCloseHandler} />
//       </Dialog>

//       {/* IMAGE VIEWER */}
//       {selectedImage && (
//         <Dialog
//           fullWidth
//           maxWidth="md"
//           open={isViewDialogOpen}
//           onClose={handleViewClose}
//           sx={{
//             "& .MuiDialog-paper": {
//               backgroundColor: "#000",
//               backgroundImage: "none",
//               overflow: "hidden",
//             },
//           }}
//         >
//           <DialogContent sx={{ height: "auto", p: 0, backgroundColor: "#000" }}>
//             <Box sx={{ position: "relative" }}>
//               <Stack
//                 direction="row"
//                 spacing={0.25}
//                 alignItems="center"
//                 sx={{
//                   position: "absolute",
//                   top: 8,
//                   right: 8,
//                   zIndex: 2,
//                   backgroundColor: "rgba(0,0,0,0.65)",
//                   border: "1px solid rgba(255,255,255,0.15)",
//                   borderRadius: "20px",
//                   px: 0.5,
//                   py: 0.25,
//                 }}
//               >
//                 <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} sx={{ color: "#fff" }}>
//                   <ZoomOut fontSize="small" />
//                 </IconButton>

//                 <Typography
//                   sx={{
//                     color: "#fff",
//                     fontSize: 11,
//                     minWidth: 38,
//                     textAlign: "center",
//                   }}
//                 >
//                   {Math.round(zoom * 100)}%
//                 </Typography>

//                 <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} sx={{ color: "#fff" }}>
//                   <ZoomIn fontSize="small" />
//                 </IconButton>

//                 <IconButton size="small" onClick={handleZoomReset} sx={{ color: "#fff" }}>
//                   <RestartAlt fontSize="small" />
//                 </IconButton>
//               </Stack>

//               <Box
//                 onWheel={handleWheelZoom}
//                 sx={{
//                   width: "100%",
//                   height: isScreenSmall ? "65vh" : "70vh",
//                   overflow: "hidden",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backgroundColor: "#000",
//                 }}
//               >
//                 <img
//                   src={selectedImage}
//                   alt="Preview"
//                   onMouseDown={handleImageMouseDown}
//                   draggable={false}
//                   style={{
//                     maxWidth: "100%",
//                     maxHeight: isScreenSmall ? "65vh" : "70vh",
//                     display: "block",
//                     userSelect: "none",
//                     transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
//                     transformOrigin: "center center",
//                     transition: isDragging ? "none" : "transform 0.15s ease",
//                     cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
//                   }}
//                 />
//               </Box>
//             </Box>
//           </DialogContent>

//           <DialogActions
//             sx={{
//               backgroundColor: "#000",
//               borderTop: "1px solid #222",
//             }}
//           >
//             <Button onClick={handleViewClose} sx={{ color: "#fff" }}>
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </>
//   );
// };

// export default IssueViewDialog;

// const SectionHeader = ({ icon, title }) => (
//   <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
//     <Stack direction="row" alignItems="center" spacing={0.8} minWidth={0}>
//       <Box
//         sx={{
//           width: 28,
//           height: 28,
//           borderRadius: 1.5,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: theme.palette.primary.main,
//           backgroundColor: "rgba(158,119,237,0.12)",
//           flexShrink: 0,
//         }}
//       >
//         {icon}
//       </Box>

//       <Typography
//         sx={{
//           color: theme.palette.text.main,
//           fontSize: { xs: 12, md: 13 },
//           fontWeight: 700,
//         }}
//       >
//         {title}
//       </Typography>
//     </Stack>
//   </Stack>
// );

// const DetailItem = ({ label, children, fullWidth = false }) => (
//   <Box
//     sx={{
//       gridColumn: { xs: "1 / -1", md: fullWidth ? "1 / -1" : "auto" },
//       minWidth: 0,
//       px: { xs: 0.25, md: 0.5 },
//       py: { xs: 0.75, md: 1 },
//       borderBottom: `1px solid rgba(45,55,72,0.65)`,
//     }}
//   >
//     <Typography
//       sx={{
//         color: theme.palette.text.secondary,
//         fontSize: 10,
//         fontWeight: 600,
//         mb: 0.45,
//         textTransform: "uppercase",
//         letterSpacing: 0.45,
//       }}
//     >
//       {label}
//     </Typography>

//     <Box
//       sx={{
//         color: theme.palette.text.main,
//         fontSize: { xs: 12, md: 13 },
//         fontWeight: 500,
//         lineHeight: 1.6,
//         wordBreak: "break-word",
//         minWidth: 0,
//       }}
//     >
//       {children}
//     </Box>
//   </Box>
// );

// const ValueChip = ({ label }) => (
//   <Chip
//     size="small"
//     label={label || "--"}
//     sx={{
//       height: 24,
//       borderRadius: 1.25,
//       backgroundColor: "rgba(158,119,237,0.16)",
//       color: theme.palette.primary.main,
//       fontSize: 10,
//       fontWeight: 600,
//       maxWidth: "100%",
//       "& .MuiChip-label": {
//         overflow: "hidden",
//         textOverflow: "ellipsis",
//       },
//     }}
//   />
// );

// const ChipList = ({ items, getLabel }) => {
//   if (!items?.length) {
//     return <Typography sx={detailTextSx}>-</Typography>;
//   }

//   return (
//     <Stack direction="row" flexWrap="wrap" gap={0.75}>
//       {items.map((item, index) => (
//         <Chip
//           key={index}
//           size="small"
//           label={getLabel(item)}
//           sx={{
//             height: 24,
//             borderRadius: 1.25,
//             backgroundColor: "rgba(158,119,237,0.14)",
//             color: "#E8E2F8",
//             fontSize: 10,
//             maxWidth: "100%",
//             "& .MuiChip-label": {
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//             },
//           }}
//         />
//       ))}
//     </Stack>
//   );
// };

// const MultilineText = ({ value }) => {
//   if (!value) {
//     return <Typography sx={detailTextSx}>--</Typography>;
//   }

//   return (
//     <Typography component="div" sx={detailTextSx}>
//       {String(value)
//         .split("\r\n")
//         .map((line, index) => (
//           <span key={index}>
//             {line}
//             {index < String(value).split("\r\n").length - 1 && <br />}
//           </span>
//         ))}
//     </Typography>
//   );
// };

// const AttachmentRow = ({ fileName, isImageFile, onView, onDownload, viewIsLoading, downloadIsLoading }) => (
//   <Box
//     sx={{
//       display: "flex",
//       alignItems: "center",
//       gap: 1,
//       width: "100%",
//       minWidth: 0,
//       p: 1,
//       border: `1px solid rgba(45,55,72,0.75)`,
//       borderRadius: 1.75,
//       backgroundColor: "rgba(255,255,255,0.015)",
//     }}
//   >
//     <Box sx={{ flexShrink: 0 }}>{getAttachmentIcon(fileName)}</Box>

//     <Box sx={{ minWidth: 0, flex: 1 }}>
//       <Typography
//         noWrap
//         title={fileName.name}
//         sx={{
//           fontSize: 12,
//           fontWeight: 500,
//           color: theme.palette.text.main,
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//         }}
//       >
//         {fileName.name}
//       </Typography>

//       <Typography sx={{ fontSize: 10, color: theme.palette.text.secondary, mt: 0.2 }}>{fileName.size} MB</Typography>
//     </Box>

//     <Box sx={{ flexShrink: 0 }}>
//       <ViewTicketMenuActions fileName={fileName} onView={onView} onDownload={onDownload} isImageFile={isImageFile} viewIsLoading={viewIsLoading} downloadIsLoading={downloadIsLoading} />
//     </Box>
//   </Box>
// );

// const ActionButton = ({ label, icon, color, onClick }) => (
//   <Button
//     fullWidth
//     variant="contained"
//     size="small"
//     color={color}
//     onClick={onClick}
//     startIcon={icon}
//     sx={{
//       minWidth: { sm: 92 },
//       height: 34,
//       borderRadius: 1,
//       px: 1.5,
//       fontSize: 11,
//       fontWeight: 600,
//       boxShadow: "none",
//       textTransform: "none",
//     }}
//   >
//     {label}
//   </Button>
// );

// const detailTextSx = {
//   color: theme.palette.text.main,
//   fontSize: { xs: 12, md: 13 },
//   fontWeight: 500,
//   wordBreak: "break-word",
//   lineHeight: 1.6,
// };

// const isImagePreview = (fileName) => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

// const EXT_TO_MIME = {
//   png: "image/png",
//   jpg: "image/jpeg",
//   jpeg: "image/jpeg",
//   gif: "image/gif",
//   webp: "image/webp",
// };

// const ImageAttachmentPreviewCard = ({ fileName, onView, onDownload, viewIsLoading, downloadIsLoading, isOpening }) => {
//   const [getAttachmentPreview] = useLazyGetViewAttachmentQuery();
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [previewError, setPreviewError] = useState(false);
//   const ext = fileName.name.split(".").pop()?.toLowerCase();

//   useEffect(() => {
//     let cancelled = false;
//     let objectUrl;

//     (async () => {
//       try {
//         const response = await getAttachmentPreview(fileName?.ticketAttachmentId);
//         if (cancelled) return;

//         if (response?.data) {
//           const mime = EXT_TO_MIME[ext] || response.data.type || "application/octet-stream";
//           const typedBlob = new Blob([response.data], { type: mime });
//           objectUrl = URL.createObjectURL(typedBlob);
//           setPreviewUrl(objectUrl);
//         } else {
//           setPreviewError(true);
//         }
//       } catch (error) {
//         console.error("Thumbnail preview error:", error);
//         if (!cancelled) setPreviewError(true);
//       }
//     })();

//     return () => {
//       cancelled = true;
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, [fileName?.ticketAttachmentId, ext, getAttachmentPreview]);

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100%",
//         maxWidth: 120,
//         height: 116,
//         borderRadius: 1.75,
//         overflow: "hidden",
//         border: `1px solid ${BORDER}`,
//         backgroundColor: theme.palette.bgForm?.black3 || "#1A202C",
//         cursor: isOpening ? "wait" : "pointer",
//       }}
//       onClick={() => {
//         if (isOpening) return;
//         onView(fileName);
//       }}
//     >
//       <Box
//         onClick={(e) => e.stopPropagation()}
//         sx={{
//           position: "absolute",
//           top: 2,
//           right: 2,
//           zIndex: 2,
//           borderRadius: "50%",
//           backgroundColor: "rgba(0,0,0,0.55)",
//         }}
//       >
//         <ViewTicketMenuActions fileName={fileName} onView={onView} onDownload={onDownload} isImageFile={isImagePreview} viewIsLoading={viewIsLoading} downloadIsLoading={downloadIsLoading} />
//       </Box>

//       <Box
//         sx={{
//           position: "relative",
//           zIndex: 1,
//           width: "100%",
//           height: 80,
//           backgroundColor: "rgba(255,255,255,0.04)",
//         }}
//       >
//         {previewUrl && !previewError && (
//           <Box
//             component="img"
//             src={previewUrl}
//             alt={fileName.name}
//             onError={() => setPreviewError(true)}
//             sx={{
//               width: "100%",
//               height: 80,
//               objectFit: "cover",
//               display: "block",
//             }}
//           />
//         )}

//         {!previewUrl && !previewError && (
//           <Box
//             sx={{
//               position: "absolute",
//               inset: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <CircularProgress size={20} thickness={4} sx={{ color: theme.palette.text.secondary }} />
//           </Box>
//         )}

//         {previewError && (
//           <Box
//             sx={{
//               position: "absolute",
//               inset: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {getAttachmentIcon(fileName)}
//           </Box>
//         )}

//         {isOpening && (
//           <Box
//             sx={{
//               position: "absolute",
//               inset: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "rgba(0,0,0,0.5)",
//             }}
//           >
//             <CircularProgress size={22} thickness={4} sx={{ color: "#fff" }} />
//           </Box>
//         )}
//       </Box>

//       <Box sx={{ px: 1, py: 0.75, overflow: "hidden" }}>
//         <Typography
//           noWrap
//           title={fileName.name}
//           sx={{
//             fontSize: 10,
//             fontWeight: 500,
//             color: theme.palette.text.main,
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {fileName.name}
//         </Typography>

//         <Typography
//           noWrap
//           sx={{
//             fontSize: 9,
//             color: theme.palette.text.secondary,
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {ext?.toUpperCase()} · {fileName.size} MB
//         </Typography>
//       </Box>
//     </Box>
//   );
// };
