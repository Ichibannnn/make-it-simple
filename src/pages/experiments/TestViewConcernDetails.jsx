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

  const [viewPendingData, setViewPendingData] = useState(null);

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
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <Avatar sx={sx.avatarIcon}>{trimLetters(data?.fullName)}</Avatar>
              <Stack>
                <Typography sx={sx.header}>{`Ticket Number ${moment(data?.created_At).format("YYYY")}-${data?.ticketRequestConcerns[0]?.ticketConcernId}`}</Typography>
                <Typography sx={sx.subHeader}>{`New request from ${data?.fullName}`}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          {isScreenSmall ? (
            <>
              <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
                <Stack gap={2} sx={{ borderRadius: "20px" }}>
                  <Stack sx={{ width: "100%" }}>
                    <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "500", fontSize: "14px" }}>
                        Requestor Details:
                      </Typography>

                      <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "600", fontSize: "14px" }}></Typography>
                    </Stack>

                    <Stack sx={{ width: "100%", mt: 1 }}>
                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Requestor Type:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.request_Type}</Typography>
                        </Box>
                      </Stack>

                      {data?.request_Type === "Rework" && (
                        <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                          <Box>
                            <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Backjob Ticket Number:</Typography>
                          </Box>

                          <Box>
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
                          </Box>
                        </Stack>
                      )}

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Requestor Name:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.fullName}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Contact Number:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.contact_Number !== null ? data?.contact_Number : "N/A"}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Company:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{`${data?.company_Code} - ${data?.company_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Business Unit:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{`${data?.businessUnit_Code} - ${data?.businessUnit_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Department:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Unit:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{`${data?.unit_Code} - ${data?.unit_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Sub Unit:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{`${data?.subUnit_Code} - ${data?.subUnit_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Location:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{`${data?.location_Code} - ${data?.location_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ width: "100%", padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Created by:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.added_By}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
                <Stack gap={2} sx={{ borderRadius: "20px" }}>
                  <Stack sx={{ width: "100%" }}>
                    <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "500", fontSize: isScreenSmall ? "14px" : "16px" }}>
                      Concern Information:
                    </Typography>

                    <Stack sx={{ width: "100%", mt: 1 }}>
                      <Stack sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Date Needed:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.date_Needed ? moment(data?.date_Needed).format("LL") : "-"}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Target Date:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.targetDate ? moment(data?.targetDate).format("LL") : "-"}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Service Channel:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.serviceProviderName}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Channel:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.channel_Name ? data?.channel_Name : "-"}</Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Category:</Typography>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          {data?.getRequestTicketCategories?.length === 0 ? (
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>-</Typography>
                          ) : (
                            <>
                              {data?.getRequestTicketCategories?.map((item, i) => (
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
                            </>
                          )}
                        </Box>
                      </Stack>

                      <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Sub Category:</Typography>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          {data?.getRequestSubTicketCategories?.length === 0 ? (
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>-</Typography>
                          ) : (
                            <>
                              {data?.getRequestSubTicketCategories?.map((item, i) => (
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
                            </>
                          )}
                        </Box>
                      </Stack>

                      <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Concern:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px", wordBreak: "break-word" }}>
                            {data?.concern?.split("\r\n").map((line, index) => (
                              <span key={index}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                        <Box>
                          <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Notes:</Typography>
                        </Box>

                        <Box>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px", wordBreak: "break-word" }}>{data?.notes !== null ? data?.notes : "-"}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              {data?.ticketRequestConcerns?.[0]?.is_Assigned === true && (
                <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
                  <Stack gap={2} sx={{ borderRadius: "20px" }}>
                    <Stack sx={{ width: "100%" }}>
                      {/* Assigned to */}
                      <Stack sx={{ width: "100%", justifyContent: "space-between" }}>
                        <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "500", fontSize: isScreenSmall ? "14px" : "16px" }}>
                          Assigned To:
                        </Typography>

                        <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "600", fontSize: isScreenSmall ? "14px" : "16px" }}></Typography>
                      </Stack>

                      {/* Issue Handler */}
                      <Stack sx={{ width: "100%", mt: 1 }}>
                        <Stack sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                          <Box>
                            <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Issue Handler:</Typography>
                          </Box>

                          <Box width={{ width: "75%", ml: 2 }}>
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{data?.ticketRequestConcerns?.[0]?.issue_Handler}</Typography>
                          </Box>
                        </Stack>
                      </Stack>

                      {/* Target Date */}
                      <Stack sx={{ width: "100%" }}>
                        <Stack sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                          <Box>
                            <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "13px" }}>Target Date:</Typography>
                          </Box>

                          <Box>
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>{moment(data?.ticketRequestConcerns?.[0]?.target_Date).format("LL")}</Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              )}
            </>
          ) : (
            <>
              <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
                <Stack gap={2} sx={{ borderRadius: "20px" }}>
                  <Stack sx={{ width: "100%" }}>
                    <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "500", fontSize: "16px" }}>
                        Requestor Details:
                      </Typography>

                      <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "600", fontSize: "16px" }}></Typography>
                    </Stack>

                    <Stack sx={{ width: "100%", mt: 1 }}>
                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Requestor Type:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.request_Type}</Typography>
                        </Box>
                      </Stack>

                      {data?.request_Type === "Back Job" && (
                        <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                          <Box sx={{ width: "15%" }}>
                            <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Backjob Ticket Number:</Typography>
                          </Box>

                          <Box sx={{ width: "10%" }} />

                          <Box width={{ width: "75%" }}>
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
                          </Box>
                        </Stack>
                      )}

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Requestor Name:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.fullName}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Contact Number:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.contact_Number !== null ? data?.contact_Number : "N/A"}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Company:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.company_Code} - ${data?.company_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Business Unit:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.businessUnit_Code} - ${data?.businessUnit_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Department:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Unit:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.unit_Code} - ${data?.unit_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Sub Unit:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.subUnit_Code} - ${data?.subUnit_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Location:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.location_Code} - ${data?.location_Name}`}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                        <Box sx={{ width: "15%" }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Created by:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%" }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.added_By}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
                <Stack gap={2} sx={{ borderRadius: "20px" }}>
                  <Stack sx={{ width: "100%" }}>
                    {/* CONCERN INFORMATION */}
                    <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "500", fontSize: "16px" }}>
                        Concern Information:
                      </Typography>

                      <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "600", fontSize: "16px" }}></Typography>
                    </Stack>

                    <Stack sx={{ width: "100%", mt: 1 }}>
                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                        <Box sx={{ width: "15%", ml: 2 }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Date Needed:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%", ml: 2 }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{moment(data?.date_Needed).format("LL")}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%", ml: 2 }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Target Date:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%", ml: 2 }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.targetDate ? moment(data?.targetDate).format("LL") : "-"}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%", ml: 2 }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Service Provider:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%", ml: 2 }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.serviceProviderName ? data?.serviceProviderName : "-"}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%", ml: 2 }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Channel:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%", ml: 2 }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.channel_Name ? data?.channel_Name : "-"}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%", ml: 2 }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Category:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%", ml: 2 }}>
                          {data?.getRequestTicketCategories?.length === 0 ? (
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>-</Typography>
                          ) : (
                            <>
                              <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                                {data?.getRequestTicketCategories?.map((item, i) => (
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
                            </>
                          )}
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%", ml: 2 }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Sub Category:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%", ml: 2 }}>
                          {data?.getRequestSubTicketCategories?.length === 0 ? (
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "13px" }}>-</Typography>
                          ) : (
                            <>
                              <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                                {data?.getRequestSubTicketCategories?.map((item, i) => (
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
                            </>
                          )}
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                        <Box sx={{ width: "15%", ml: 2 }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Concern:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%", ml: 2 }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px", wordBreak: "break-word" }}>
                            {data?.concern?.split("\r\n").map((line, index) => (
                              <span key={index}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                        <Box sx={{ width: "15%", ml: 2 }}>
                          <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Notes:</Typography>
                        </Box>

                        <Box sx={{ width: "10%" }} />

                        <Box width={{ width: "75%", ml: 2 }}>
                          <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px", wordBreak: "break-word" }}>{data?.notes !== null ? data?.notes : "-"}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              {data?.ticketRequestConcerns?.[0]?.is_Assigned === true && (
                <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
                  <Stack gap={2} sx={{ borderRadius: "20px" }}>
                    <Stack sx={{ width: "100%" }}>
                      <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                        <Typography variant="h5" sx={{ textAlign: "right", color: theme.palette.primary.main, fontWeight: "500", fontSize: "16px" }}>
                          Assigned To:
                        </Typography>

                        <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "600", fontSize: "16px" }}></Typography>
                      </Stack>

                      <Stack sx={{ width: "100%", mt: 1 }}>
                        <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                          <Box sx={{ width: "15%", ml: 2 }}>
                            <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Issue Handler:</Typography>
                          </Box>

                          <Box sx={{ width: "10%" }} />

                          <Box width={{ width: "75%", ml: 2 }}>
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.ticketRequestConcerns?.[0]?.issue_Handler}</Typography>
                          </Box>
                        </Stack>
                      </Stack>

                      <Stack sx={{ width: "100%" }}>
                        <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                          <Box sx={{ width: "15%", ml: 2 }}>
                            <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Target Date:</Typography>
                          </Box>

                          <Box sx={{ width: "10%" }} />

                          <Box width={{ width: "75%", ml: 2 }}>
                            <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{moment(data?.ticketRequestConcerns?.[0]?.target_Date).format("LL")}</Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
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
              <Attachment sx={{ color: theme.palette.primary.main }} />

              <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "600", fontSize: "16px" }}>
                Attachments
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
