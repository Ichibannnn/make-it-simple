import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { theme } from "../../../theme/theme";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import useDisclosure from "../../../hooks/useDisclosure";

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { AttachFileOutlined, Attachment, Close, FileDownloadOutlined, Receipt, VisibilityOutlined } from "@mui/icons-material";

import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import AssignTicketDrawer from "./AssignTicketDrawer";

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
    // console.log("event: ", event);
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !attachments?.some((existingFile) => existingFile.name === newFile.name));

    // console.log("uniqueFiles: ", uniqueNewFiles);

    setAttachments((prevFiles) => (Array.isArray(prevFiles) ? [...prevFiles, ...uniqueNewFiles] : [...uniqueNewFiles]));
  };

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

      //   console.log("res", res);

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
          file: item,
        }))
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

      console.log("Res: ", response);

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

  console.log("Data: ", data);

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <Stack>
                <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "600", fontSize: "16px" }}>
                  {`Concern Number - ${data?.requestConcernId}`}
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

          <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
            <Stack gap={2} sx={{ borderRadius: "20px" }}>
              <Stack sx={{ width: "100%" }}>
                {/* REQUESTOR DETAILS */}
                <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                  <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "500", fontSize: "16px" }}>
                    Requestor Details:
                  </Typography>

                  <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "600", fontSize: "16px" }}></Typography>
                </Stack>

                <Stack sx={{ width: "100%", mt: 1 }}>
                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Requestor Type</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.request_Type}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Requestor Name</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.fullName}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Contact Number</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
                        {data?.contact_Number !== null ? data?.contact_Number : "N/A"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Company</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.company_Code} - ${data?.company_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Business Unit</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography
                        sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}
                      >{`${data?.businessUnit_Code} - ${data?.businessUnit_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Department</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Unit</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.unit_Code} - ${data?.unit_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Sub Unit</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.subUnit_Code} - ${data?.subUnit_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Location</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{`${data?.location_Code} - ${data?.location_Name}`}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Created by</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
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
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Date Needed</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{moment(data?.date_Needed).format("LL")}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Channel</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.channel_Name}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Category</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.category_Description}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Sub Category</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.subCategory_Description}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Concern</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
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
                    <Box sx={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Notes</Typography>
                    </Box>
                    <Box width={{ width: "50%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.notes !== null ? data?.notes : "-"}</Typography>
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
                  {/* ASSIGNED TO */}
                  <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                    <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "500", fontSize: "16px" }}>
                      Assigned To:
                    </Typography>

                    <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "600", fontSize: "16px" }}></Typography>
                  </Stack>

                  <Stack sx={{ width: "100%", mt: 1 }}>
                    <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                      <Box sx={{ width: "50%", ml: 2 }}>
                        <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Issue Handler</Typography>
                      </Box>
                      <Box width={{ width: "50%", ml: 2 }}>
                        <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.ticketRequestConcerns?.[0]?.issue_Handler}</Typography>
                      </Box>
                    </Stack>
                  </Stack>

                  <Stack sx={{ width: "100%" }}>
                    <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "0 0 20px 20px" }}>
                      <Box sx={{ width: "50%", ml: 2 }}>
                        <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Target Date</Typography>
                      </Box>
                      <Box width={{ width: "50%", ml: 2 }}>
                        <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
                          {moment(data?.ticketRequestConcerns?.[0]?.target_Date).format("LL")}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
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
                      display: "flex",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "space-between",
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
                        <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{fileName.name}</Typography>

                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {fileName.size} Mb
                        </Typography>
                      </Box>

                      <Box>
                        {isImageFile(fileName.name) && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewImage(fileName)} // View image in dialog
                            style={{ background: "none" }}
                          >
                            {viewLoading ? <CircularProgress size={14} /> : <VisibilityOutlined />}
                          </IconButton>
                        )}

                        <Tooltip title="Download">
                          {downloadLoading ? (
                            <CircularProgress size={14} />
                          ) : (
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
                          )}
                        </Tooltip>
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
                  accept=".png,.jpg,.jpeg,.docx"
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

        <DialogActions>
          {data?.ticketRequestConcerns?.[0]?.is_Assigned === false && (
            <Stack sx={{ width: "100%", padding: 2, justifyContent: "end" }}>
              <Button size="small" variant="contained" color="success" startIcon={<Receipt sx={{ color: "#fff" }} />} onClick={() => onAssignAction()}>
                <Typography sx={{ fontSize: "12px", color: "#fff" }}>Assign Ticket</Typography>
              </Button>
            </Stack>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog to view image */}
      <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
        <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <AssignTicketDrawer data={data} setData={setData} open={assignTicketOpen} onClose={assignTicketOnClose} viewConcernDetailsOnClose={onClose} />
    </>
  );
};

export default ViewConcernDetails;
