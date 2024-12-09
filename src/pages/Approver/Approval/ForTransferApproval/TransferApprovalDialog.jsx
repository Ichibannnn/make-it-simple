import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { AccountCircleRounded, AttachFileOutlined, Check, Close, FiberManualRecord, FileDownloadOutlined, GetAppOutlined, VisibilityOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import * as yup from "yup";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Swal from "sweetalert2";
import { Toaster, toast } from "sonner";
import { theme } from "../../../../theme/theme";
import useDisclosure from "../../../../hooks/useDisclosure";
import { useApproveTransferMutation } from "../../../../features/api_ticketing/approver/ticketApprovalApi";
import TransferDisapproveDialog from "./TransferDisapproveDialog";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../../features/api_notification/notificationApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../../features/api_attachments/attachmentsApi";
import { notificationMessageApi } from "../../../../features/api_notification_message/notificationMessageApi";
import useSignalRConnection from "../../../../hooks/useSignalRConnection";
import ForTransferDialogMenuActions from "./MenuActions/ForTransferDialogMenuActions";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ThemeContext } from "@emotion/react";

const schema = yup.object().shape({
  // transferTicketId: yup.string().nullable(),
  targetDate: yup.date().notRequired(),
});

const TransferApprovalDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [disapproveData, setDisapproveData] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [viewLoading, setViewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const dispatch = useDispatch();
  useSignalRConnection();

  const [approveTransfer, { isLoading: approveTransferIsLoading, isFetching: approveTransferIsFetching }] = useApproveTransferMutation();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

  const { open: disapproveOpen, onToggle: disapproveOnToggle, onClose: disapproveOnClose } = useDisclosure();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      targetDate: null,
    },
  });

  const onApproveAction = (formData) => {
    // console.log("FormData: ", formData);`

    const approvePayload = {
      transferTicketId: data?.transferTicketId,
      target_Date: data?.approver_Level === 1 ? watch("targetDate") : moment(watch("targetDate")).format("YYYY-MM-DD"),
    };

    console.log("approvePayload: ", approvePayload);

    Swal.fire({
      title: "Confirmation",
      text: "Approve this request transfer?",
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
        approveTransfer(approvePayload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Approve request successfully!",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            onClose();
          })
          .catch((err) => {
            console.log("Error", err);
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
        data?.transferAttachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        }))
      );

      if (data?.approver_Level >= 2) {
        setValue("targetDate", data?.target_Date);
      } else {
        setValue("targetDate", data?.current_Target_Date);
      }
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

  console.log("Data: ", data);
  // console.log("Target Date: ", moment(watch("targetDate")).format("YYYY-MM-DD`"));

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogContent>
          {/* REQUESTOR */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <AccountCircleRounded sx={{ fontSize: "70px" }} />
              <Stack>
                <Typography sx={{ fontSize: "14px", color: theme.palette.primary.main, fontStyle: "italic", letterSpacing: 1, fontWeight: 400 }}>
                  for transfer approval:{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "#6dc993",
                    fontWeight: 700,
                  }}
                >
                  {data?.fullname}
                </Typography>
                <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>{data?.department_Name}</Typography>
                <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>{data?.channel_Name}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Stack gap={2} sx={{ marginTop: 2, justifyContent: "space-between" }}>
            <Stack sx={{ background: theme.palette.bgForm.black2, padding: 2, borderRadius: "20px" }}>
              {/* CONCERN DETAILS */}
              <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748", borderRadius: "20px 20px 0 0" }}>
                <Box sx={{ width: "15%", ml: 2 }}>
                  <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Ticket Number:</Typography>
                </Box>
                <Box sx={{ width: "10%" }} />
                <Box width={{ width: "75%", ml: 2 }}>
                  <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.ticketConcernId}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                <Box sx={{ width: "15%", ml: 2 }}>
                  <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Ticket Description:</Typography>
                </Box>
                <Box sx={{ width: "10%" }} />
                <Box width={{ width: "75%", ml: 2 }}>
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
                  <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Transfer Remarks:</Typography>
                </Box>
                <Box sx={{ width: "10%" }} />
                <Box width={{ width: "75%", ml: 2 }}>
                  <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
                    {data?.transfer_Remarks?.split("\r\n").map((line, index) => (
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
                  <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Channel:</Typography>
                </Box>
                <Box sx={{ width: "10%" }} />
                <Box width={{ width: "75%", ml: 2 }}>
                  <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>{data?.channel_Name}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                <Box sx={{ width: "15%", ml: 2 }}>
                  <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Category:</Typography>
                </Box>
                <Box sx={{ width: "10%" }} />
                <Box width={{ width: "75%", ml: 2 }}>
                  <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                    {data?.getTransferTicketCategories?.map((item, i) => (
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

              <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                <Box sx={{ width: "15%", ml: 2 }}>
                  <Typography sx={{ textAlign: "right", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Sub Category:</Typography>
                </Box>
                <Box sx={{ width: "10%" }} />
                <Box width={{ width: "75%", ml: 2 }}>
                  <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                    {data?.getTransferTicketSubCategories?.map((item, i) => (
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

              {/* <Stack
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
                        __html: data?.concern_Details.replace(/\r\n/g, "<br />"),
                      }}
                    />
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
                      Transfer Remarks:
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
                        __html: data?.transfer_Remarks.replace(/\r\n/g, "<br />"),
                      }}
                    />
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
              </Stack> */}

              {/* ATTACHMENTS */}
              <Stack
                marginTop={3}
                padding={2}
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
                                fontSize: "14px",
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {fileName.size} Mb
                            </Typography>
                          </Box>

                          <Box>
                            <ForTransferDialogMenuActions fileName={fileName} onView={handleViewImage} onDownload={handleDownloadAttachment} isImageFile={isImageFile} />
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

              <Stack sx={{ width: "100%", gap: 1, mt: 2 }}>
                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: theme.palette.primary.main,
                    }}
                  >
                    New Target Date:
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                      control={control}
                      name="targetDate"
                      render={({ field }) => (
                        <DatePicker
                          value={field.value ? moment(field.value) : null}
                          onChange={(newValue) => {
                            const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                            field.onChange(formattedValue);
                          }}
                          // label="Select Target Date"
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              sx: {
                                "& .MuiInputBase-input": {
                                  padding: "10.5px 14px",
                                },
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "15px",
                                },
                              },
                            },
                          }}
                          minDate={new moment()}
                          error={!!errors.targetDate}
                          helperText={errors.targetDate ? errors.targetDate.message : null}
                        />
                      )}
                    />
                    {errors.targetDate && <Typography>{errors.targetDate.message}</Typography>}
                  </LocalizationProvider>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ flexDirection: "row", gap: 0.5, padding: 2 }}>
            <LoadingButton
              variant="contained"
              color="success"
              onClick={onApproveAction}
              disabled={data?.approver_Level === 1 && !watch("targetDate") ? true : false}
              loading={approveTransferIsLoading || approveTransferIsFetching}
              startIcon={<Check />}
              sx={{
                ":disabled": {
                  backgroundColor: "",
                  color: "black",
                },
              }}
            >
              Approve
            </LoadingButton>

            <LoadingButton
              type="submit"
              variant="outlined"
              onClick={onDisapproveHandler}
              color="error"
              loading={approveTransferIsLoading || approveTransferIsFetching}
              startIcon={<Close />}
            >
              Disapprove
            </LoadingButton>
          </Stack>
        </DialogActions>

        <TransferDisapproveDialog data={disapproveData} open={disapproveOpen} onClose={disapproveOnClose} approvalOnClose={onCloseHandler} />
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

export default TransferApprovalDialog;
