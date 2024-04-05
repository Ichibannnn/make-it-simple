import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArticleOutlined,
  Close,
  CloseOutlined,
  CloudDownload,
  DescriptionOutlined,
  FileCopyOutlined,
  InsertPhotoOutlined,
  PictureAsPdfOutlined,
  WallpaperOutlined,
} from "@mui/icons-material";
import React, { useRef, useState } from "react";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { useGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";

const ConcernViewDialog = ({ viewData, open, onClose }) => {
  const [clickedImage, setClickedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const id = viewData?.requestGeneratorId;

  const onCloseAction = () => {
    onClose();
  };

  const { data: attachmentData } = useGetRequestorAttachmentQuery({
    Id: id,
  });

  // console.log("id: ", id);
  // console.log("attachmentData: ", attachmentData);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        sx={{ borderRadius: "none", padding: 0 }}
        PaperProps={{ style: { overflow: "unset" } }}
      >
        <DialogContent sx={{ paddingBottom: 8 }}>
          <Stack width="100%" direction="column" sx={{ padding: "5px" }}>
            <Stack>
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#48BB78",
                  }}
                >
                  Concern Details
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction="column"
              justifyContent="flex-start"
              sx={{ padding: "5px", marginTop: 4 }}
            >
              <Stack direction="row" gap={2}>
                <Typography sx={{ color: theme.palette.text.secondary }}>
                  REQUESTOR:
                </Typography>
                <Typography>
                  {viewData?.empId} - {viewData?.fullName}
                </Typography>
              </Stack>

              <Stack direction="row" gap={2}>
                <Typography sx={{ color: theme.palette.text.secondary }}>
                  CONCERN DETAILS:
                </Typography>
                <Typography>
                  {viewData?.requestConcerns?.map((item) => item.concern)}
                </Typography>
              </Stack>

              <Stack direction="row" gap={2}>
                <Typography sx={{ color: theme.palette.text.secondary }}>
                  ATTACHMENT:
                </Typography>
                <Box
                  sx={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    backgroundColor: theme.palette.bgForm.black1,
                    border: "2px dashed  #2D3748 ",
                    borderRadius: "10px",
                    minHeight: "200px",
                    paddingLeft: 2,
                    paddingTop: 2,
                    cursor: "pointer",
                    position: "relative",
                    overflowY: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                    }}
                  >
                    {attachmentData?.value?.[0]?.attachments?.map((url) => {
                      // Get file extension
                      const fileExtension = url.attachment
                        .split(".")
                        .pop()
                        .toLowerCase();

                      // Check if it's an image file
                      const isImage = ["jpg", "jpeg", "png"].includes(
                        fileExtension
                      );

                      return (
                        <img
                          key={url.attachment}
                          src={url.attachment}
                          onClick={() => {
                            setClickedImage(url.attachment);
                            setLightboxOpen(true);
                          }}
                        />
                      );
                    })}

                    {/* {attachmentData?.value?.[0]?.attachments?.map(
                      (item, index) => {
                        // Get file extension
                        const fileExtension = item.attachment
                          .split(".")
                          .pop()
                          .toLowerCase();

                        // Check if it's an image file
                        const isImage = ["jpg", "jpeg", "png"].includes(
                          fileExtension
                        );

                        // Check if it's a PDF or DOC file
                        const isPdf = fileExtension === "pdf";
                        const isDoc =
                          fileExtension === "doc" || fileExtension === "docx";

                        // Render image or download link accordingly
                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "2px",
                              padding: "5px",
                              background: theme.palette.bgForm.black2,
                              borderRadius: "5px",
                              maxWidth: "100%",
                              overflow: "hidden",
                            }}
                          >
                            {isImage ? (
                              // Render image
                              <img
                                src={item.attachment} // Assuming item.attachment is the URL of the image
                                alt={`Attachment ${index}`}
                                style={{ maxWidth: "100%", maxHeight: "200px" }} // Adjust dimensions as needed
                                onClick={() => {
                                  setClickedImage(item.attachment);
                                  setLightboxOpen(true);
                                }}
                                download
                              />
                            ) : (
                              <Stack width="100%" justifyContent="center">
                                <a href={item.attachment} download>
                                  Download {fileExtension.toUpperCase()} File
                                </a>
                                <a href={item.attachment} download>
                                  <ArticleOutlined
                                    color="primary"
                                    sx={{ fontSize: "120px" }}
                                  />
                                </a>
                              </Stack>
                            )}
                          </div>
                        );
                      }
                    )} */}
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={onCloseAction}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Lightbox
        open={lightboxOpen}
        onClose={() => {
          setLightboxOpen(false);
          setClickedImage(null);
        }}
        imageUrl={clickedImage}
      />
    </>
  );
};

export default ConcernViewDialog;

const Lightbox = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <Close />
        </IconButton>
        <img src={imageUrl} style={{ maxWidth: "100%", maxHeight: "90vh" }} />
      </DialogContent>
    </Dialog>
  );
};
