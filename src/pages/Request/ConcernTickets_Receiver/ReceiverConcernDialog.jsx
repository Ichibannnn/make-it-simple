import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { theme } from "../../../theme/theme";
import {
  AccessTimeOutlined,
  AccountCircleRounded,
  Add,
  FiberManualRecord,
  GetAppOutlined,
  PeopleOutlined,
} from "@mui/icons-material";
import moment from "moment";
import { useLazyGetReceiverAttachmentQuery } from "../../../features/api_request/concerns_receiver/concernReceiverApi";

const ReceiverConcernDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);

  // console.log("Attachment Data: ", attachments);

  const [getReceiverAttachment, { data: attachmentData }] =
    useLazyGetReceiverAttachmentQuery();

  const getAttachmentData = async (id) => {
    try {
      const res = await getReceiverAttachment({ Id: id }).unwrap();

      // console.log("res", res);

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
      getAttachmentData(data.requestGeneratorId);
    }
  }, [data]);

  const onCloseHandler = () => {
    onClose();
  };

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={open}>
        <Toaster richColors position="top-right" closeButton />

        <DialogContent>
          {/* REQUESTOR */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" gap={1} alignItems="center">
              <AccountCircleRounded sx={{ fontSize: "70px" }} />
              <Stack>
                <Typography
                  sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
                >
                  {data?.empId}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "#6dc993",
                    fontWeight: 700,
                  }}
                >
                  {data?.fullName}
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
                >
                  {data?.department_Name}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <AccessTimeOutlined
                sx={{ fontSize: "16px", color: theme.palette.text.secondary }}
              />
              <Typography
                sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
              >{` ${moment(data?.created_At).format("LL")}`}</Typography>
            </Stack>
          </Stack>

          <Divider
            variant="fullWidth"
            sx={{ background: "#2D3748", marginTop: 1 }}
          />

          {/* CONCERN DETAILS */}
          <Stack
            marginTop={3}
            padding={4}
            sx={{
              border: "1px solid #2D3748",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.2,
                  color: theme.palette.text.main,
                }}
              >
                Concern Details:
              </Typography>

              <Typography
                sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
              >{` ${moment(data?.created_At).format("LT")}`}</Typography>
            </Stack>

            <Stack direction="row" padding={2} gap={1}>
              <FiberManualRecord color="success" fontSize="20px" />
              <Typography sx={{ fontSize: "14px" }}>{data?.concern}</Typography>
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
              <GetAppOutlined />

              <Typography
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.2,
                  color: theme.palette.text.main,
                }}
              >
                Attachment(s):
              </Typography>
            </Stack>

            <Stack sx={{ flexDirection: "column", maxHeight: 500 }}>
              {attachments.map((fileName, index) => (
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
                      <Typography sx={{ fontWeight: 500 }}>
                        {fileName.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {fileName.size} Mb
                      </Typography>

                      {/* <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: !!fileName.ticketAttachmentId
                                      ? theme.palette.success.main
                                      : theme.palette.primary.main,
                                  }}
                                >
                                  {!!fileName.ticketAttachmentId
                                    ? "Attached file"
                                    : "Uploaded the file successfully"}
                                </Typography>

                                {!!fileName.ticketAttachmentId && (
                                  <CheckOutlined
                                    color="success"
                                    fontSize="small"
                                  />
                                )}
                              </Box> */}
                    </Box>

                    {/* <Box>
                              <Tooltip title="Remove">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteFile(fileName)}
                                  style={{
                                    background: "none",
                                  }}
                                >
                                  <RemoveCircleOutline />
                                </IconButton>
                              </Tooltip>

                              {!!fileName.ticketAttachmentId && (
                                <Tooltip title="Upload">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleUpdateFile(
                                        fileName.ticketAttachmentId
                                      )
                                    }
                                    style={{
                                      background: "none",
                                    }}
                                  >
                                    <FileUploadOutlined />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {!!fileName.ticketAttachmentId && (
                                <Tooltip title="Download">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      window.location = fileName.link;
                                    }}
                                    style={{
                                      background: "none",
                                    }}
                                  >
                                    <FileDownloadOutlined />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box> */}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Stack>

          {/* ASSIGN TO */}
          <Stack
            marginTop={3}
            padding={4}
            sx={{
              border: "1px solid #2D3748",
            }}
          >
            <Stack direction="row" gap={1} alignItems="center">
              <PeopleOutlined />
              <Typography
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.2,
                  color: theme.palette.text.main,
                }}
              >
                Assign To:
              </Typography>
            </Stack>

            <Stack
              marginTop={1}
              padding={2}
              sx={{
                border: "1px solid #2D3748",
              }}
            >
              <Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <FiberManualRecord color="success" fontSize="20px" />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {data?.empId}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "#6dc993",
                    fontWeight: 700,
                  }}
                >
                  {data?.fullName}
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
                >
                  {data?.department_Name}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton type="submit" form="user" variant="contained">
            Save
          </LoadingButton>
          <Button onClick={onCloseHandler}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceiverConcernDialog;
