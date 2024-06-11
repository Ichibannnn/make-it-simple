import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { theme } from "../../../theme/theme";
import { AccessTimeOutlined, AccountCircleRounded, Add, FiberManualRecord, FileDownloadOutlined, GetAppOutlined, PeopleOutlined } from "@mui/icons-material";
import moment from "moment";

import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";

const IssueViewDialog = ({ data, viewOpen, viewOnClose }) => {
  const [attachments, setAttachments] = useState([]);

  const [getRequestorAttachment, { data: attachmentData }] = useLazyGetRequestorAttachmentQuery();

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

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
      console.log("Data: ", data);

      getAttachmentData(data.ticketConcernId);
    }
  }, [data]);

  const onCloseHandler = () => {
    viewOnClose();
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={viewOpen}>
        <Toaster richColors position="top-right" closeButton />

        <DialogContent>
          {/* REQUESTOR */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <AccountCircleRounded sx={{ fontSize: "70px" }} />
              <Stack>
                <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>{data?.empId}</Typography>
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

            {/* <Stack direction="row" gap={0.5} alignItems="center">
              <AccessTimeOutlined
                sx={{ fontSize: "16px", color: theme.palette.text.secondary }}
              />
              <Typography
                sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
              >{` ${moment(data?.created_At).format("LL")}`}</Typography>
            </Stack> */}
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />

          {/* CONCERN DETAILS */}
          <Stack
            marginTop={3}
            padding={2}
            gap={1}
            sx={{
              border: "1px solid #2D3748",
              width: "100%",
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
                <Typography sx={{ fontSize: "14px" }}>{data?.concern_Description}</Typography>
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
                  <Typography sx={{ fontSize: "14px" }}>{data?.issue_Handler}</Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {data?.channel_Name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
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

            <Stack sx={{ flexDirection: "column", maxHeight: "äuto" }}>
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
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          {/* <LoadingButton type="submit" form="user" variant="contained">
            Save
          </LoadingButton> */}
          <Button onClick={onCloseHandler}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IssueViewDialog;
