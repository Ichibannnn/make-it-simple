import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  BorderColor,
  CloseOutlined,
  DeleteOutlineOutlined,
  DescriptionOutlined,
  InsertPhotoOutlined,
  PanoramaOutlined,
  PictureAsPdfOutlined,
  SaveOutlined,
  SyncOutlined,
  WallpaperOutlined,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useCreateEditRequestorConcernMutation } from "../../../features/api_request/concerns/concernApi";

const requestorSchema = yup.object().shape({
  RequestGeneratorId: yup.string().nullable(),
  Concern: yup.string().required().label("Concern Details"),
  RequestConcernId: yup.string().nullable(),
});

const ConcernDialog = ({ open, onClose }) => {
  const [attachments, setAttachments] = useState([]);

  const fileInputRef = useRef();

  const [
    createEditRequestorConcern,
    {
      isLoading: isCreateEditRequestorConcernLoading,
      isFetching: isCreateEditRequestorConcernFetching,
    },
  ] = useCreateEditRequestorConcernMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(requestorSchema),
    defaultValues: {
      RequestGeneratorId: "",
      Concern: "",
      RequestConcernId: "",
    },
  });

  const onConcernFormSubmit = (formData) => {};

  const onCloseAction = () => {
    onClose();
    reset();
  };

  const handleAttahments = (event) => {
    const newFiles = Array.from(event.target.files);
    const fileNames = newFiles.map((file) => file.name);
    setAttachments((prevFiles) => [...prevFiles, ...fileNames]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = (fileNameToDelete) => {
    setAttachments((prevFiles) =>
      prevFiles.filter((fileName) => fileName !== fileNameToDelete)
    );
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconMap = {
      png: <WallpaperOutlined />,
      jpg: <InsertPhotoOutlined />,
      pdf: <PictureAsPdfOutlined />,
      docx: <DescriptionOutlined />,
    };
    return iconMap[extension] || null;
  };

  console.log("Attachments: ", attachments);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        sx={{ borderRadius: "none", padding: 0 }}
        PaperProps={{ style: { overflow: "unset" } }}
      >
        <DialogContent sx={{ paddingBottom: 8 }}>
          <Stack direction="column" sx={{ padding: "5px" }}>
            <Stack>
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#48BB78",
                  }}
                >
                  Add Concern
                </Typography>
              </Stack>
            </Stack>

            {/* <Divider variant="fullWidth" sx={{ background: "#2D3748" }} /> */}

            <Stack padding={5} gap={3}>
              <Stack
                direction="row"
                width="100%"
                sx={{
                  paddingTop: 2,
                  gap: 2,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Concern Details*</Typography>

                <Controller
                  control={control}
                  name="Concern"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <TextField
                        inputRef={ref}
                        size="small"
                        value={value}
                        placeholder="Ex. System Name - Concern"
                        onChange={onChange}
                        sx={{
                          width: "80%",
                        }}
                        autoComplete="off"
                      />
                    );
                  }}
                />
              </Stack>

              <Stack
                direction="row"
                width="100%"
                sx={{
                  paddingTop: 2,
                  gap: 2,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography>Attachment*</Typography>

                <Box
                  sx={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    border: "2px dashed  #2D3748 ",
                    borderRadius: "10px",
                    minHeight: "200px",
                    paddingLeft: 2,
                  }}
                >
                  {attachments.map((fileName, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "2px",
                      }}
                    >
                      <Box marginRight={1}>{getFileIcon(fileName)}</Box>
                      <Typography size={{ fontSize: "5px" }}>
                        {fileName}
                      </Typography>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteFile(fileName)}
                        style={{ marginLeft: "2px" }}
                      >
                        <CloseOutlined />
                      </IconButton>
                    </div>
                  ))}
                </Box>

                <input
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  type="file"
                  onChange={handleAttahments}
                />
              </Stack>

              <Box
                width="100%"
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  padding: "5px",
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleUploadButtonClick}
                >
                  Choose file
                </Button>
              </Box>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            form="receiverForm"
            // disabled={!receiverFormWatch("userId") || !businessUnits.length}
            // loading={
            //   isCreateEditReceiverLoading || isCreateEditReceiverFetching
            // }
            sx={{
              ":disabled": {
                backgroundColor: theme.palette.secondary.main,
                color: "black",
              },
            }}
          >
            Save
          </LoadingButton>
          <Button variant="text" onClick={onCloseAction}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConcernDialog;
