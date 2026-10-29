// Layout 2
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AttachFile, AttachFileOutlined, ChecklistRtlOutlined, Close, MoveDownOutlined, PendingOutlined, Receipt, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";

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
import { useSelector } from "react-redux";
import { global } from "../../../styles/global";
import { ticketStyle as sx } from "./style/ticketStyle";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";

const IssueViewDialog = ({ data, viewOpen, viewOnClose, onClosing, onTransfer, onHold }) => {
  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [viewIsLoading, setViewIsLoading] = useState(false);

  const [loadingAttachmentId, setLoadingAttachmentId] = useState(null);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);

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

  // Only refetch when the ticket itself changes, not whenever the `data` object reference changes
  useEffect(() => {
    if (data?.ticketConcernId) {
      getAttachmentData(data.ticketConcernId);
    }
  }, [data?.ticketConcernId]);

  const TABLE_COLUMNS = ["TICKET NO.", "TICKET DESCRIPTION", "DATE NEEDED", "TARGET DATE"];

  const trimLetters = (name) => {
    if (!name) return "";
    const nameArray = name.split(" ").filter((n) => n);
    const initials = nameArray
      .slice(0, 2)
      .map((n) => n[0])
      .join("");
    return initials.split("").reverse().join("");
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
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
          {/* Requestor*/}
          <Stack sx={sx.header}>
            <Stack direction="row" gap={1} alignItems="center">
              <Avatar sx={sx.avatarIcon}>{trimLetters(data?.requestor_Name)}</Avatar>

              <Stack>
                <Typography sx={sx.secondaryText}>Created by</Typography>
                <Typography sx={sx.requestorText}>{data?.requestor_Name}</Typography>
                <Typography sx={sx.departmentText}>{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Stack gap={2} sx={{ marginTop: 2 }}>
            <Stack sx={sx.ticketDetailsSection}>
              <Stack sx={sx.titleHeader}>
                <Receipt sx={sx.titleHeaderIcon} />
                <Typography sx={sx.titleText}>Ticket Details</Typography>
              </Stack>

              {/* Detail Box */}
              <Stack sx={sx.detailBox}>
                {/* Request Type */}
                <Stack sx={sx.detailLayout}>
                  <Box sx={sx.detailRowTextLayout}>
                    <Typography sx={sx.ticketTitleLabel}>Request Type:</Typography>
                  </Box>

                  <Box sx={sx.spacer} />
                  <Box sx={sx.valueBox}>
                    <Typography sx={sx.ticketDescLabel}>{data?.request_Type}</Typography>
                  </Box>
                </Stack>

                {/* Rework Ticket Number */}
                {data?.request_Type === "Back Job" && (
                  <Stack sx={sx.detailLayout}>
                    <Box sx={sx.detailRowTextLayout}>
                      <Typography sx={sx.ticketTitleLabel}>Rework Ticket Number:</Typography>
                    </Box>

                    <Box sx={sx.spacer} />
                    <Box sx={sx.valueBox}>
                      <Typography sx={sx.ticketDescLabel}>{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
                    </Box>
                  </Stack>
                )}

                {/* Department */}
                <Stack sx={sx.detailLayout}>
                  <Box sx={sx.detailRowTextLayout}>
                    <Typography sx={sx.ticketTitleLabel}>Department:</Typography>
                  </Box>

                  <Box sx={sx.spacer} />
                  <Box sx={sx.valueBox}>
                    <Typography sx={sx.ticketDescLabel}>{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
                  </Box>
                </Stack>

                {/* Channel */}
                <Stack sx={sx.detailLayout}>
                  <Box sx={sx.detailRowTextLayout}>
                    <Typography sx={sx.ticketTitleLabel}>Channel:</Typography>
                  </Box>
                  <Box sx={sx.spacer} />
                  <Box sx={sx.valueBox}>
                    <Typography sx={sx.ticketDescLabel}> {data?.channel_Name}</Typography>
                  </Box>
                </Stack>

                {/* Category */}
                <Stack mt={2} sx={sx.detailLayout}>
                  <Box sx={sx.detailRowTextLayout}>
                    <Typography sx={sx.ticketTitleLabel}>Category:</Typography>
                  </Box>
                  <Box sx={sx.spacer} />
                  <Box sx={sx.valueBox}>
                    {data?.getOpenTicketCategories?.length > 0 ? (
                      <>
                        {data?.getOpenTicketCategories?.map((item, i) => (
                          <>
                            <Typography key={i} sx={sx.ticketDescLabel}>
                              {item.category_Description}
                            </Typography>
                          </>
                        ))}
                      </>
                    ) : (
                      <Typography sx={sx.ticketDescLabel}>--</Typography>
                    )}
                  </Box>
                </Stack>

                {/* Sub-Category */}
                <Stack sx={sx.detailLayout}>
                  <Box sx={sx.detailRowTextLayout}>
                    <Typography sx={sx.ticketTitleLabel}>Sub Category:</Typography>
                  </Box>
                  <Box sx={sx.spacer} />
                  <Box sx={sx.valueBox}>
                    {data?.getOpenTicketSubCategories?.length > 0 ? (
                      <>
                        {data?.getOpenTicketSubCategories?.map((item, i) => (
                          <>
                            <Typography key={i} sx={sx.ticketDescLabel}>
                              {item.subCategory_Description}
                            </Typography>
                          </>
                        ))}
                      </>
                    ) : (
                      <Typography sx={sx.ticketDescLabel}>--</Typography>
                    )}
                  </Box>
                </Stack>

                {/* Concern Category */}
                {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
                  <Stack sx={sx.detailLayout}>
                    <Box sx={sx.detailRowTextLayout}>
                      <Typography sx={sx.ticketTitleLabel}>Concern Category:</Typography>
                    </Box>
                    <Box sx={sx.spacer} />
                    <Box sx={sx.valueBox}>
                      <Typography sx={sx.ticketDescLabel}>{data?.getForClosingTickets?.[0]?.categoryConcernName ? data?.getForClosingTickets?.[0]?.categoryConcernName : "--"}</Typography>
                    </Box>
                  </Stack>
                )}

                {/* Assigned To */}
                <Stack sx={sx.detailLayout}>
                  <Box sx={sx.detailRowTextLayout}>
                    <Typography sx={sx.ticketTitleLabel}>Assigned to:</Typography>
                  </Box>
                  <Box sx={sx.spacer} />
                  <Box sx={sx.valueBox}>
                    <Typography sx={sx.ticketDescLabel}>{data?.issue_Handler}</Typography>
                  </Box>
                </Stack>

                {/* For Onhold Remarks */}
                {data?.ticket_Status === "For On-Hold" && (
                  <Stack sx={sx.detailLayout}>
                    <Box sx={sx.detailRowTextLayout}>
                      <Typography sx={sx.ticketTitleLabel}>Hold Reason:</Typography>
                    </Box>
                    <Box sx={sx.spacer} />
                    <Box sx={sx.valueBox}>
                      <Typography sx={sx.ticketDescLabel}>{data?.getForOnHolds?.[0]?.reason}</Typography>
                    </Box>
                  </Stack>
                )}

                {/* For Transfer Remarks */}
                {data?.ticket_Status === "For Transfer" && (
                  <Stack sx={sx.detailLayout}>
                    <Box sx={sx.detailRowTextLayout}>
                      <Typography sx={sx.ticketTitleLabel}>Transfer Remarks:</Typography>
                    </Box>
                    <Box sx={sx.spacer} />
                    <Box sx={sx.valueBox}>
                      <Typography sx={sx.ticketDescLabel}>{data?.getForTransferTickets?.[0]?.transfer_Remarks}</Typography>
                    </Box>
                  </Stack>
                )}

                {/* Transfer Approval Remarks */}
                {data?.ticket_Status === "Transfer Approval" && (
                  <Stack sx={sx.detailLayout}>
                    <Box sx={sx.detailRowTextLayout}>
                      <Typography sx={sx.ticketTitleLabel}>Transfer Remarks:</Typography>
                    </Box>
                    <Box sx={sx.spacer} />
                    <Box sx={sx.valueBox}>
                      <Typography sx={sx.ticketDescLabel}>{data?.transferApprovalTickets?.[0]?.transfer_Remarks}</Typography>
                    </Box>
                  </Stack>
                )}

                {/* Closing Date Remarks */}
                {(channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "") ||
                  (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Closing Ticket") ||
                  (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "Closed") ||
                  (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Confirmation" && (
                    <>
                      <Stack sx={sx.detailLayout}>
                        <Box sx={sx.detailRowTextLayout}>
                          <Typography sx={sx.ticketTitleLabel}>Backdate:</Typography>
                        </Box>
                        <Box sx={sx.spacer} />
                        <Box sx={sx.valueBox}>
                          <Typography sx={sx.ticketDescLabel}>{data?.getForClosingTickets?.[0]?.backDate ? moment(data?.getForClosingTickets?.[0]?.backDate).format("LL") : "--"}</Typography>
                        </Box>
                      </Stack>

                      {/* Backdate Remarks */}
                      <Stack sx={sx.detailLayout}>
                        <Box sx={sx.detailRowTextLayout}>
                          <Typography sx={sx.ticketTitleLabel}>Backdate Remarks:</Typography>
                        </Box>
                        <Box sx={sx.spacer} />
                        <Box sx={sx.valueBox}>
                          <Typography sx={sx.ticketDescLabel}>{data?.getForClosingTickets?.[0]?.backDateRemarks ? data?.getForClosingTickets?.[0]?.backDateRemarks : "--"}</Typography>
                        </Box>
                      </Stack>
                    </>
                  ))}

                {/* Notes */}
                <Stack sx={sx.detailLayout}>
                  <Box sx={sx.detailRowTextLayout}>
                    <Typography sx={sx.ticketTitleLabel}>Notes:</Typography>
                  </Box>
                  <Box sx={sx.spacer} />
                  <Box sx={sx.valueBox}>
                    <Typography sx={sx.ticketDescLabel}>{data?.notes !== null ? data?.notes : "--"}</Typography>
                  </Box>
                </Stack>

                {/* Resolution */}
                {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
                  <Stack sx={sx.detailLayout}>
                    <Box sx={sx.detailRowTextLayout}>
                      <Typography sx={sx.ticketTitleLabel}>Resolution:</Typography>
                    </Box>
                    <Box sx={sx.spacer} />
                    <Box sx={sx.valueBox}>
                      <Typography sx={sx.ticketDescLabel}>
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

                <Stack mt={3}>
                  <TableContainer>
                    <Table size="small" sx={global.table}>
                      <TableHead sx={global.tableHead}>
                        <TableRow>
                          {TABLE_COLUMNS.map((column) => (
                            <TableCell key={column} sx={global.headCell}>
                              {column}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <TableCell sx={global.bodyCell}>
                            <Typography sx={global.ticketNoText}>{`${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
                          </TableCell>
                          <TableCell sx={global.bodyCell}>
                            {data?.concern_Description?.split("\r\n").map((line, index) => (
                              <span key={index}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </TableCell>
                          <TableCell sx={global.bodyCell}>{data?.date_Needed ? moment(data?.date_Needed).format("LL") : "--"}</TableCell>
                          <TableCell sx={global.bodyCell}>{moment(data?.target_Date).format("LL")}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </Stack>
            </Stack>

            <Stack sx={sx.attachmentBox}>
              {/* Attachments */}
              <Stack marginTop={1} padding={2}>
                <Stack sx={sx.titleHeader}>
                  <AttachFile sx={sx.titleHeaderIcon} />
                  <Typography sx={sx.titleText}>Attachments</Typography>
                </Stack>

                {attachments?.length > 0 && (
                  <Stack sx={{ gap: 1 }}>
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
                      <Box key={index} sx={sx.attachmentCards}>
                        {getAttachmentIcon(fileName)}
                        <Box sx={sx.attachmentNameBox}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography sx={sx.fontSize}>{fileName.name}</Typography>
                            <Typography sx={sx.fontSize}>{fileName.size} Mb</Typography>
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
                  <Stack sx={sx.noAttachmentBox}>
                    <Stack sx={sx.attachmentContent}>
                      <AttachFileOutlined sx={sx.titleSubIcon} />
                      <Typography sx={sx.titleSubText}>No attached file</Typography>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <TicketHistory data={data} />
          </Stack>
        </DialogContent>

        <DialogActions>
          {/* BUTTONS */}
          {data?.ticket_Status === "Open Ticket" && (
            <>
              <Stack direction="row" gap={0.5} alignItems="center" mb={1}>
                <Button variant="contained" size="small" onClick={() => onClosing(data)} color="success" startIcon={<ChecklistRtlOutlined />}>
                  <Typography sx={global.customButtonText}>Close</Typography>
                </Button>
                <Button variant="contained" size="small" onClick={() => onTransfer(data)} color="info" startIcon={<MoveDownOutlined />}>
                  <Typography sx={global.customButtonText}>Transfer</Typography>
                </Button>
                <Button variant="contained" size="small" onClick={() => onHold(data)} color="warning" startIcon={<PendingOutlined />}>
                  <Typography sx={global.customButtonText}>Hold</Typography>
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
