import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { theme } from "../../../theme/theme";

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, Tab, Tabs, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { AccountCircleRounded, AttachFileOutlined, FiberManualRecord, FileDownloadOutlined, GetAppOutlined, VisibilityOutlined } from "@mui/icons-material";

import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";

import TicketHistory from "./TicketHistory";

const IssueViewDialog = ({ data, ticketStatus, viewOpen, viewOnClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [navigation, setNavigation] = useState("1");

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [viewLoading, setViewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [getRequestorAttachment, { data: attachmentData }] = useLazyGetRequestorAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

  const isSmallScreen = useMediaQuery("(max-width: 1024px) and (max-height: 911px)");

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        }))
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
      <Dialog fullWidth maxWidth="xl" open={viewOpen}>
        <Toaster richColors position="top-right" closeButton />

        <DialogContent>
          {/* REQUESTOR */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <AccountCircleRounded sx={{ fontSize: "70px" }} />
              <Stack>
                <Typography sx={{ fontSize: "14px", color: theme.palette.primary.main, fontStyle: "italic", letterSpacing: 1, fontWeight: 400 }}>created by: </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "#6dc993",
                    fontWeight: 700,
                  }}
                >
                  {data?.requestor_Name}
                </Typography>
                <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>{data?.department_Name}</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />

          <Stack sx={{ marginTop: 2 }}>
            <Tabs value={navigation} onChange={(_, value) => setNavigation(value)}>
              <Tab
                value="1"
                label="Details"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
            </Tabs>
          </Stack>

          <Stack gap={2} sx={{ flexDirection: isSmallScreen ? "column" : "row", marginTop: 2, justifyContent: "space-between" }}>
            <Stack sx={{ width: isSmallScreen ? "100%" : "50%", background: theme.palette.bgForm.black2, padding: 2, borderRadius: "20px" }}>
              {/* CONCERN DETAILS */}
              <Stack
                marginTop={3}
                padding={2}
                gap={1}
                sx={{
                  border: "1px solid #2D3748",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Ticket Number:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Typography sx={{ fontSize: "14px" }}>{data?.ticketConcernId}</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Concern Details:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Typography
                      sx={{ fontSize: "14px" }}
                      dangerouslySetInnerHTML={{
                        __html: data?.concern_Description.replace(/\r\n/g, "<br />"),
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Transfer Remarks */}
                {data?.ticket_Status === "For Transfer" && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingLeft={8}
                    paddingRight={8}
                    gap={2}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Stack
                      sx={{
                        width: "30%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        Transfer Remarks
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      gap={1}
                      sx={{
                        width: "65%",
                      }}
                    >
                      <FiberManualRecord color="primary" fontSize="20px" />
                      <Typography sx={{ fontSize: "14px" }}>{data?.getForTransferTickets?.[0]?.transfer_Remarks}</Typography>
                    </Stack>
                  </Stack>
                )}

                {/* Resoulution */}
                {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingLeft={8}
                    paddingRight={8}
                    gap={2}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Stack
                      sx={{
                        width: "30%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        Resolution
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      gap={1}
                      sx={{
                        width: "65%",
                      }}
                    >
                      {/* <FiberManualRecord color="primary" fontSize="20px" />
                      <Typography
                        sx={{ fontSize: "14px" }}
                        dangerouslySetInnerHTML={{
                          __html: data?.getForClosingTickets?.[0]?.resolution.replace(/\r\n/g, "<br />"),
                        }}
                      /> */}

                      <FiberManualRecord color="primary" fontSize="20px" />
                      <Typography sx={{ fontSize: "14px" }}>{data?.getForClosingTickets?.[0]?.resolution}</Typography>
                    </Stack>
                  </Stack>
                )}

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Category:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Typography sx={{ fontSize: "14px" }}>{data?.category_Description}</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Sub Category:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Typography sx={{ fontSize: "14px" }}>{data?.subCategory_Description}</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Assigned to:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Stack>
                      <Typography sx={{ fontSize: "15px" }}>{data?.issue_Handler}</Typography>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {data?.channel_Name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {data?.unitId} - {data?.unit_Name}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              {/* ATTACHMENTS */}
              <Stack
                marginTop={3}
                padding={4}
                sx={{
                  border: "1px solid #2D3748",
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
                            <Typography sx={{ fontSize: "14px" }}>{fileName.name}</Typography>

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
                            <>
                              {isImageFile(fileName.name) && (
                                <Tooltip title="View">
                                  <IconButton size="small" color="primary" onClick={() => handleViewImage(fileName)} style={{ background: "none" }}>
                                    {viewLoading ? <CircularProgress size={14} /> : <VisibilityOutlined />}
                                  </IconButton>
                                </Tooltip>
                                // <ViewAttachment fileName={fileName} loading={loading} handleViewImage={handleViewImage} />
                              )}
                            </>

                            {downloadLoading ? (
                              <CircularProgress size={14} />
                            ) : (
                              <Tooltip title="Download">
                                <IconButton
                                  size="small"
                                  color="error"
                                  // onClick={() => {
                                  //   window.location = fileName.link;
                                  // }}
                                  onClick={() => handleDownloadAttachment(fileName)}
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
          <Button onClick={onCloseHandler}>Close</Button>
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

export default IssueViewDialog;
