import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircleRounded,
  AttachFileOutlined,
  ChecklistRtlOutlined,
  Close,
  GetAppOutlined,
  MoveDownOutlined,
  PendingOutlined,
} from "@mui/icons-material";

import { theme } from "../../../theme/theme";
import moment from "moment";

import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
import {
  useLazyGetDownloadAttachmentQuery,
  useLazyGetViewAttachmentQuery,
} from "../../../features/api_attachments/attachmentsApi";

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
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const channelNameValidation = useSelector((state) => state?.user?.channels?.[0]?.channelName);

  const [getRequestorAttachment] = useLazyGetRequestorAttachmentQuery();
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
        })),
      );
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
      getAttachmentData(data.ticketConcernId);
    }
  }, [data]);

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

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
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
      console.log("error: ", error);
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

  const componentRef = useRef();

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
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Ticket Number:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                      >{`${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Request Type:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                      >
                        {data?.request_Type}
                      </Typography>
                    </Box>
                  </Stack>

                  {data?.request_Type === "Rework" && (
                    <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                        >
                          Rework Ticket #:
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                        >{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Department:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                      >{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Channel:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                      >
                        {data?.channel_Name}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Category:
                      </Typography>
                    </Box>

                    {data?.getOpenTicketCategories?.length > 0 ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ml: 1 }}>
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
                          sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                        >
                          -
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Sub Category:
                      </Typography>
                    </Box>

                    {data?.getOpenTicketSubCategories?.length > 0 ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ml: 1 }}>
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
                          sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                        >
                          -
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Concern Category*/}
                  {(data?.ticket_Status === "For Closing Ticket" ||
                    data?.ticket_Status === "For Confirmation" ||
                    data?.ticket_Status === "Closed") && (
                    <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                        >
                          Concern Category:
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                        >
                          {data?.getForClosingTickets?.[0]?.categoryConcernName
                            ? data?.getForClosingTickets?.[0]?.categoryConcernName
                            : "-"}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Assigned to:
                      </Typography>
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                      >
                        {data?.issue_Handler}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* For OnHold Remarks */}
                  {data?.ticket_Status === "For On-Hold" && (
                    <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
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
                    <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
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
                    <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
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
                    <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
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

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Date Needed:
                      </Typography>
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                      >
                        {data?.date_Needed ? moment(data?.date_Needed).format("LL") : "--"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
                      >
                        Target Date:
                      </Typography>
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                      >
                        {moment(data?.target_Date).format("LL")}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Closing Date with Remarks */}
                  {(channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" &&
                    data?.ticket_Status === "") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" &&
                      data?.ticket_Status === "For Closing Ticket") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" &&
                      data?.ticket_Status === "Closed") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" &&
                      data?.ticket_Status === "For Confirmation" && (
                        <>
                          <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
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
                                sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                              >
                                {data?.getForClosingTickets?.[0]?.backDate
                                  ? moment(data?.getForClosingTickets?.[0]?.backDate).format("LL")
                                  : "--"}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
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
                                sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "12px" }}
                              >
                                {data?.getForClosingTickets?.[0]?.backDateRemarks
                                  ? data?.getForClosingTickets?.[0]?.backDateRemarks
                                  : "--"}
                              </Typography>
                            </Box>
                          </Stack>
                        </>
                      ))}

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
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

                  <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
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
                  {(data?.ticket_Status === "For Closing Ticket" ||
                    data?.ticket_Status === "For Confirmation" ||
                    data?.ticket_Status === "Closed") && (
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
                          sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "12px" }}
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
                    sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}
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
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
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
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
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
                          sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
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
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
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
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
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
                          sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
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
                          sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
                        >
                          -
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Concern Category */}
                  {(data?.ticket_Status === "For Closing Ticket" ||
                    data?.ticket_Status === "For Confirmation" ||
                    data?.ticket_Status === "Closed") && (
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
                          sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
                        >
                          {data?.getForClosingTickets?.[0]?.categoryConcernName
                            ? data?.getForClosingTickets?.[0]?.categoryConcernName
                            : "-"}
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
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
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
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
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
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
                      >
                        {moment(data?.target_Date).format("LL")}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Closing Date with Remarks */}
                  {(channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" &&
                    data?.ticket_Status === "") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" &&
                      data?.ticket_Status === "For Closing Ticket") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" &&
                      data?.ticket_Status === "Closed") ||
                    (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" &&
                      data?.ticket_Status === "For Confirmation" && (
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
                                sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
                              >
                                {data?.getForClosingTickets?.[0]?.backDate
                                  ? moment(data?.getForClosingTickets?.[0]?.backDate).format("LL")
                                  : "--"}
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
                                sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
                              >
                                {data?.getForClosingTickets?.[0]?.backDateRemarks
                                  ? data?.getForClosingTickets?.[0]?.backDateRemarks
                                  : "--"}
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
                  {(data?.ticket_Status === "For Closing Ticket" ||
                    data?.ticket_Status === "For Confirmation" ||
                    data?.ticket_Status === "Closed") && (
                    <Stack
                      direction="row"
                      sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}
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
                    sx={{ color: theme.palette.text.secondary, fontSize: isScreenSmall ? "16px" : "18px" }}
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

                {!attachments?.length ? (
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
                ) : (
                  <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                    {attachments?.map((fileName, index) => (
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
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography sx={{ fontSize: isScreenSmall ? "12px" : "14px" }}>
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
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onClosing(data)}
                  color="success"
                  startIcon={<ChecklistRtlOutlined />}
                  sx={{ borderRadius: "1px" }}
                >
                  <Typography sx={{ fontSize: "12px" }}>Close</Typography>
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onTransfer(data)}
                  color="info"
                  startIcon={<MoveDownOutlined />}
                  sx={{ borderRadius: "1px" }}
                >
                  <Typography sx={{ fontSize: "12px" }}>Transfer</Typography>
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onHold(data)}
                  color="warning"
                  startIcon={<PendingOutlined />}
                  sx={{ borderRadius: "1px" }}
                >
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

      {selectedImage && (
        <>
          <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
            <DialogContent sx={{ height: "auto" }}>
              {selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleViewClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default IssueViewDialog;
