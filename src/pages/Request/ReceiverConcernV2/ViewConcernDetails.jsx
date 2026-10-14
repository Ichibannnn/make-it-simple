import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { theme } from "../../../theme/theme";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import useDisclosure from "../../../hooks/useDisclosure";

import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import { AttachFileOutlined, Attachment, Close } from "@mui/icons-material";

import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import AssignTicketDrawer from "./AssignTicketDrawer";
import MenuActions from "./MenuActions";
import { toast } from "sonner";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import { global } from "../../../styles/global";
import { receiverStyle as sx } from "./styles/receiverStyle";

const requestorSchema = yup.object().shape({
  RequestAttachmentsFiles: yup.array().nullable(),
});

const ViewConcernDetails = ({ data, setData, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const fileInputRef = useRef();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [getRequestorAttachment] = useLazyGetRequestorAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

  const { open: assignTicketOpen, onToggle: assignTicketOnToggle, onClose: assignTicketOnClose } = useDisclosure();

  const { control } = useForm({
    resolver: yupResolver(requestorSchema),
    defaultValues: {
      RequestAttachmentsFiles: [],
    },
  });

  const handleAttachments = (event) => {
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !attachments?.some((existingFile) => existingFile.name === newFile.name));

    setAttachments((prevFiles) => (Array.isArray(prevFiles) ? [...prevFiles, ...uniqueNewFiles] : [...uniqueNewFiles]));
  };

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

  useEffect(() => {
    if (data) {
      getAttachmentData(data?.ticketRequestConcerns?.[0]?.ticketConcernId);
    }
  }, [data]);

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
      setViewLoading(false);
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error!", {
        description: "View file error!",
        duration: 1500,
      });
      setViewLoading(false);
    }
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
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error!", {
        description: "Download file error!",
        duration: 1500,
      });
      setDownloadLoading(false);
    }
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  const onAssignAction = () => {
    assignTicketOnToggle();
  };

  const onCloseHandler = () => {
    onClose();
  };

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
                <Typography sx={sx.header}>{`Ticket Number ${moment(data?.created_At).format("YYYY")}-${data?.ticketRequestConcerns[0]?.ticketConcernId}`}</Typography>
                <Typography sx={sx.subHeader}>{`New request from ${data?.fullName}`}</Typography>
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
                  <Typography sx={sx.sectionHeader}>Requestor Details:</Typography>

                  <Stack sx={sx.detailBox}>
                    {/* Requestor Type */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Requestor Type:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>{data?.request_Type}</Typography>
                      </Box>
                    </Stack>

                    <Divider variant="fullWidth" sx={sx.divider} />

                    {/* Backjob Ticket */}
                    {data?.request_Type === "Back Job" && (
                      <>
                        <Stack sx={sx.rowContent}>
                          <Box sx={sx.titleDetailBox}>
                            <Typography sx={sx.label}>Backjob Ticket #:</Typography>
                          </Box>
                          <Box sx={sx.spacer} />
                          <Box sx={sx.descDetailBox}>
                            <Typography sx={sx.description}>{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
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
                        <Typography sx={sx.description}>{data?.fullName}</Typography>
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
                        <Typography sx={sx.description}>{data?.contact_Number !== null ? data?.contact_Number : "N/A"}</Typography>
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
                        <Typography sx={sx.description}>{`${data?.company_Code} - ${data?.company_Name}`}</Typography>
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
                        <Typography sx={sx.description}>{`${data?.businessUnit_Code} - ${data?.businessUnit_Name}`}</Typography>
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
                        <Typography sx={sx.description}>{`${data?.businessUnit_Code} - ${data?.businessUnit_Name}`}</Typography>
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
                        <Typography sx={sx.description}>{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
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
                        <Typography sx={sx.description}>{`${data?.unit_Code} - ${data?.unit_Name}`}</Typography>
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
                        <Typography sx={sx.description}>{`${data?.subUnit_Code} - ${data?.subUnit_Name}`}</Typography>
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
                        <Typography sx={sx.description}>{`${data?.location_Code} - ${data?.location_Name}`}</Typography>
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
                        <Typography sx={sx.description}>{data?.added_By}</Typography>
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
                  <Typography sx={sx.sectionHeader}>Concern Information:</Typography>

                  <Stack sx={sx.detailBox}>
                    {/* Date Needed */}
                    <Stack sx={sx.rowContent}>
                      <Box sx={sx.titleDetailBox}>
                        <Typography sx={sx.label}>Date Needed:</Typography>
                      </Box>
                      <Box sx={sx.spacer} />
                      <Box sx={sx.descDetailBox}>
                        <Typography sx={sx.description}>{moment(data?.date_Needed).format("LL")}</Typography>
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
                        <Typography sx={sx.description}>{data?.targetDate ? moment(data?.targetDate).format("LL") : "--"}</Typography>
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
                        <Typography sx={sx.description}>{data?.serviceProviderName ? data?.serviceProviderName : "--"}</Typography>
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
                        <Typography sx={sx.description}>{data?.channel_Name ? data?.channel_Name : "--"}</Typography>
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
                            {data?.getRequestTicketCategories?.map((item, i) => (
                              <Typography key={i} sx={sx.description}>{`- ${item.category_Description}`}</Typography>
                            ))}
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
                            {data?.getRequestSubTicketCategories?.map((item, i) => (
                              <Typography key={i} sx={sx.description}>{`- ${item.subCategory_Description}`}</Typography>
                            ))}
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
                        <Typography sx={sx.description}>{data?.notes !== null ? data?.notes : "--"}</Typography>
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
                          <Typography sx={sx.description}>{data?.ticketRequestConcerns?.[0]?.issue_Handler}</Typography>
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
                          <Typography sx={sx.description}>{moment(data?.ticketRequestConcerns?.[0]?.target_Date).format("LL")}</Typography>
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
            }}
          >
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
                      width: "100%",
                      display: "flex",
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
                        <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: isScreenSmall ? "12px" : "14px" }}>{fileName.name}</Typography>

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
                        <MenuActions
                          fileName={fileName}
                          onView={handleViewImage}
                          isImageFile={isImageFile}
                          onDownload={handleDownloadAttachment}
                          viewIsLoading={viewLoading}
                          downloadIsLoading={downloadLoading}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}

            <Controller
              control={control}
              name="RequestAttachmentsFiles"
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
        </DialogContent>
      </Dialog>

      {/* Dialog to view image */}
      <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
        <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {assignTicketOpen && <AssignTicketDrawer data={data} setData={setData} open={assignTicketOpen} onClose={assignTicketOnClose} />}
    </>
  );
};

export default ViewConcernDetails;
