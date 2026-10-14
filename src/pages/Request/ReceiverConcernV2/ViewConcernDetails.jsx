import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AttachFileOutlined,
  Close,
  RestartAlt,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";

import * as yup from "yup";
import moment from "moment";
import { toast } from "sonner";
import { global } from "../../../styles/global";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { theme } from "../../../theme/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { receiverStyle as sx } from "./styles/receiverStyle";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import useDisclosure from "../../../hooks/useDisclosure";

import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
import {
  useLazyGetDownloadAttachmentQuery,
  useLazyGetViewAttachmentQuery,
} from "../../../features/api_attachments/attachmentsApi";

import MenuActions from "./MenuActions";
import AssignTicketDrawer from "./AssignTicketDrawer";
import ViewTicketMenuActions from "../../Tickets/IssueHandlerConcerns/MenuActions/ViewTicketMenuActions";

const requestorSchema = yup.object().shape({
  RequestAttachmentsFiles: yup.array().nullable(),
});

const ViewConcernDetails = ({ data, setData, open, onClose }) => {
  // const [attachments, setAttachments] = useState([]);
  // const [ticketAttachmentId, setTicketAttachmentId] = useState(null);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  // const [downloadLoading, setDownloadLoading] = useState(false);
  // const [viewLoading, setViewLoading] = useState(false);

  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [viewIsLoading, setViewIsLoading] = useState(false);

  const [loadingAttachmentId, setLoadingAttachmentId] = useState(null);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);

  const fileInputRef = useRef();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [
    getRequestorAttachment,
    {
      isLoading: attachmentIsLoading,
      isError: attachmentIsError,
      isFetching: attachmentIsFetching,
      isSuccess: attachmentIsSuccess,
    },
  ] = useLazyGetRequestorAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

  const {
    open: assignTicketOpen,
    onToggle: assignTicketOnToggle,
    onClose: assignTicketOnClose,
  } = useDisclosure();

  const { control } = useForm({
    resolver: yupResolver(requestorSchema),
    defaultValues: {
      RequestAttachmentsFiles: [],
    },
  });

  // const handleAttachments = (event) => {
  //   const newFiles = Array.from(event.target.files);

  //   const fileNames = newFiles.map((file) => ({
  //     name: file.name,
  //     size: (file.size / (1024 * 1024)).toFixed(2),
  //   }));

  //   const uniqueNewFiles = fileNames.filter(
  //     (newFile) =>
  //       !attachments?.some(
  //         (existingFile) => existingFile.name === newFile.name,
  //       ),
  //   );

  //   setAttachments((prevFiles) =>
  //     Array.isArray(prevFiles)
  //       ? [...prevFiles, ...uniqueNewFiles]
  //       : [...uniqueNewFiles],
  //   );
  // };

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
          file: item,
        })),
      );
    } catch (error) {}
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
  const imageAttachments = useMemo(
    () => attachments?.filter((a) => isImagePreview(a.name)),
    [attachments],
  );

  const otherAttachments = useMemo(
    () => attachments?.filter((a) => !isImagePreview(a.name)),
    [attachments],
  );

  const onCloseHandler = () => {
    onClose();
  };

  useEffect(() => {
    if (data) {
      getAttachmentData(data?.ticketRequestConcerns?.[0]?.ticketConcernId);
    }
  }, [data]);

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
        maxWidth="md"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseHandler();
        }}
        disableEscapeKeyDown={false}
        sx={global.dialog}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogContent>
          {/* Header */}
          <Stack sx={sx.headerSection}>
            <Stack sx={sx.avatarAndTitleBox}>
              <Avatar sx={sx.avatarIcon}>{trimLetters(data?.fullName)}</Avatar>

              <Box>
                <Typography
                  sx={sx.header}
                >{`Ticket Number ${moment(data?.created_At).format("YYYY")}-${data?.ticketRequestConcerns[0]?.ticketConcernId}`}</Typography>
                <Typography
                  sx={sx.subHeader}
                >{`New request from ${data?.fullName}`}</Typography>
              </Box>
            </Stack>

            <IconButton onClick={onCloseHandler}>
              <Close />
            </IconButton>
          </Stack>

          {/* Sections */}
          <Stack>
            {/* Requestor Details */}
            <Stack sx={sx.section}>
              <Stack gap={2} sx={{ borderRadius: "20px" }}>
                <Stack sx={{ width: "100%" }}>
                  <Typography sx={sx.sectionHeader}>
                    Requestor Details:
                  </Typography>

                  <Stack sx={sx.detailBox}>
                    {/* Requestor Type */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Requestor Type:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.request_Type}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Backjob Ticket */}
                    {data?.request_Type === "Back Job" && (
                      <>
                        <Stack sx={sx.rowContent}>
                          <Box sx={sx.titleDetailBox}>
                            <Typography sx={sx.label}>
                              Backjob Ticket #:
                            </Typography>
                          </Box>
                          <Box sx={sx.spacer} />
                          <Box sx={sx.descDetailBox}>
                            <Typography
                              sx={sx.description}
                            >{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
                          </Box>
                        </Stack>

                        <Divider variant="fullWidth" sx={sx.divider} />
                      </>
                    )}

                    {/* Requestor Name */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Requestor Name:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.fullName}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Contact Number */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Contact Number:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.contact_Number !== null
                            ? data?.contact_Number
                            : "N/A"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Company */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Company:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography
                          sx={sx.description}
                        >{`${data?.company_Code} - ${data?.company_Name}`}</Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Business Unit */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Business Unit:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography
                          sx={sx.description}
                        >{`${data?.businessUnit_Code} - ${data?.businessUnit_Name}`}</Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Business Unit */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Business Unit:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography
                          sx={sx.description}
                        >{`${data?.businessUnit_Code} - ${data?.businessUnit_Name}`}</Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Department */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Department:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography
                          sx={sx.description}
                        >{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Unit */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Unit:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography
                          sx={sx.description}
                        >{`${data?.unit_Code} - ${data?.unit_Name}`}</Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Sub Unit */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Sub Unit:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography
                          sx={sx.description}
                        >{`${data?.subUnit_Code} - ${data?.subUnit_Name}`}</Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Location */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Location:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography
                          sx={sx.description}
                        >{`${data?.location_Code} - ${data?.location_Name}`}</Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Created By */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Created by:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.added_By}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>

            {/* Concern Information */}
            <Stack sx={sx.section}>
              <Stack gap={2} sx={{ borderRadius: "20px" }}>
                <Stack sx={{ width: "100%" }}>
                  <Typography sx={sx.sectionHeader}>
                    Concern Information:
                  </Typography>

                  <Stack sx={sx.detailBox}>
                    {/* Date Needed */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Date Needed:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {moment(data?.date_Needed).format("LL")}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Target Date */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Target Date:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.targetDate
                            ? moment(data?.targetDate).format("LL")
                            : "--"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Service Provider */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Service Provider:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.serviceProviderName
                            ? data?.serviceProviderName
                            : "--"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Channel */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Channel:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.channel_Name ? data?.channel_Name : "--"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Category */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Category:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        {data?.getRequestTicketCategories?.length === 0 ? (
                          <Typography sx={sx.description}>{`--`}</Typography>
                        ) : (
                          <>
                            {data?.getRequestTicketCategories?.map(
                              (item, i) => (
                                <Typography
                                  key={i}
                                  sx={sx.description}
                                >{`- ${item.category_Description}`}</Typography>
                              ),
                            )}
                          </>
                        )}
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Sub Category */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Sub Category:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        {data?.getRequestSubTicketCategories?.length === 0 ? (
                          <Typography sx={sx.description}>{`--`}</Typography>
                        ) : (
                          <>
                            {data?.getRequestSubTicketCategories?.map(
                              (item, i) => (
                                <Typography
                                  key={i}
                                  sx={sx.description}
                                >{`- ${item.subCategory_Description}`}</Typography>
                              ),
                            )}
                          </>
                        )}
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Concern */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Concern:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.concern?.split("\r\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Notes */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Notes:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>
                          {data?.notes !== null ? data?.notes : "--"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>

            {/* Assign To */}
            {data?.ticketRequestConcerns?.[0]?.is_Assigned === true && (
              <Stack sx={sx.section}>
                <Stack gap={2} sx={{ borderRadius: "20px" }}>
                  <Stack sx={{ width: "100%" }}>
                    <Typography sx={sx.sectionHeader}>Assign to:</Typography>

                    <Stack sx={sx.detailBox}>
                      {/* Issue Handler */}
                      <Stack sx={sx.rowContent}>
                        <Box sx={sx.titleDetailBox}>
                          <Typography sx={sx.label}>Issue Handler:</Typography>
                        </Box>
                        <Box sx={sx.spacer} />
                        <Box sx={sx.descDetailBox}>
                          <Typography sx={sx.description}>
                            {data?.ticketRequestConcerns?.[0]?.issue_Handler}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider variant="fullWidth" sx={sx.divider} />

                      {/* Target Date */}
                      <Stack sx={sx.rowContent}>
                        <Box sx={sx.titleDetailBox}>
                          <Typography sx={sx.label}>Target Date:</Typography>
                        </Box>
                        <Box sx={sx.spacer} />
                        <Box sx={sx.descDetailBox}>
                          <Typography sx={sx.description}>
                            {moment(
                              data?.ticketRequestConcerns?.[0]?.target_Date,
                            ).format("LL")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Stack>

          <Stack sx={sx.section}>
            <Stack gap={2} sx={{ borderRadius: "20px" }}>
              <Stack sx={{ width: "100%" }}>
                <Typography sx={sx.sectionHeader}>Attachments:</Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* ATTACHMENTS */}
          <Stack
            sx={{
              border: "1px solid #2D3748",
              borderRadius: "10px",
              mt: 1,
            }}
          >
            <Stack padding={2}>
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
                          isOpening={
                            loadingAttachmentId === fileName.ticketAttachmentId
                          }
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
                          <Typography sx={sx.fontSize}>
                            {fileName.name}
                          </Typography>
                          <Typography sx={sx.fontSize}>
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
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={45}
                      height={40}
                    />
                    <Stack sx={{ width: "100%" }}>
                      <Skeleton
                        animation="wave"
                        height={20}
                        style={{ marginBottom: 6 }}
                      />
                      <Skeleton animation="wave" height={20} />
                    </Stack>
                  </Stack>
                </Stack>
              )}

              {attachmentIsError && (
                <Stack sx={sx.noAttachmentBox}>
                  <Stack sx={sx.attachmentContent}>
                    <AttachFileOutlined sx={sx.titleSubIcon} />
                    <Typography sx={sx.titleSubText}>
                      Something went wrong.
                    </Typography>
                  </Stack>
                </Stack>
              )}

              {attachmentIsSuccess &&
                !attachments?.length &&
                !attachmentIsLoading &&
                !attachmentIsFetching && (
                  <Stack sx={sx.noAttachmentBox}>
                    <Stack sx={sx.attachmentContent}>
                      <AttachFileOutlined sx={sx.titleSubIcon} />
                      <Typography sx={sx.titleSubText}>
                        No attached file
                      </Typography>
                    </Stack>
                  </Stack>
                )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Dialog to view image */}
      {selectedImage && (
        <ImageViewerDialog
          imageUrl={selectedImage}
          open={isViewDialogOpen}
          onClose={handleViewClose}
        />
      )}

      {assignTicketOpen && (
        <AssignTicketDrawer
          data={data}
          setData={setData}
          open={assignTicketOpen}
          onClose={assignTicketOnClose}
        />
      )}
    </>
  );
};

export default ViewConcernDetails;

const isImagePreview = (fileName) =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

const EXT_TO_MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

const ImageViewerDialog = memo(function ImageViewerDialog({
  imageUrl,
  open,
  onClose,
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewport, setViewport] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Native, non-passive wheel listener so preventDefault actually works
  useEffect(() => {
    if (!viewport) return;
    const onWheel = (event) => {
      event.preventDefault();
      setZoom((z) =>
        event.deltaY < 0
          ? Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2))
          : Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)),
      );
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [viewport]);

  // Snap the pan offset back to center whenever zoom returns to 100% or below
  // (only updates state if it actually changes)
  useEffect(() => {
    if (zoom <= 1)
      setPosition((p) => (p.x === 0 && p.y === 0 ? p : { x: 0, y: 0 }));
  }, [zoom]);

  // Dragging to pan: only active once zoomed in. Listens on window so a drag
  // that ends outside the image still releases cleanly.
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event) => {
      setPosition({
        x:
          positionStartRef.current.x + (event.clientX - dragStartRef.current.x),
        y:
          positionStartRef.current.y + (event.clientY - dragStartRef.current.y),
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
            <IconButton
              size="small"
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              sx={{ color: "#fff" }}
            >
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

            <IconButton
              size="small"
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              sx={{ color: "#fff" }}
            >
              <ZoomIn fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={handleZoomReset}
              sx={{ color: "#fff" }}
            >
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
                cursor:
                  zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
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
    canvas
      .getContext("2d")
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const outType = mime === "image/jpeg" ? "image/jpeg" : "image/png";
    const thumb = await new Promise((resolve) =>
      canvas.toBlob(resolve, outType, 0.8),
    );
    return thumb || typed;
  } catch {
    return typed; // fall back to the original file
  }
};

const ImageAttachmentPreviewCard = memo(function ImageAttachmentPreviewCard({
  fileName,
  onView,
  onDownload,
  viewIsLoading,
  downloadIsLoading,
  isOpening,
}) {
  const [getAttachmentPreview] = useLazyGetViewAttachmentQuery();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const ext = fileName.name.split(".").pop()?.toLowerCase();

  useEffect(() => {
    let cancelled = false;
    let objectUrl;

    (async () => {
      try {
        const response = await getAttachmentPreview(
          fileName?.ticketAttachmentId,
        );
        if (cancelled) return;

        if (response?.data) {
          const mime =
            EXT_TO_MIME[ext] ||
            response.data.type ||
            "application/octet-stream";
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
          // top: 2,
          right: 2,
          zIndex: 2,
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        <ViewTicketMenuActions
          fileName={fileName}
          onView={onView}
          onDownload={onDownload}
          isImageFile={isImagePreview}
          viewIsLoading={viewIsLoading}
          downloadIsLoading={downloadIsLoading}
        />
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
            <CircularProgress
              size={20}
              thickness={4}
              sx={{ color: theme.palette.text.secondary }}
            />
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
