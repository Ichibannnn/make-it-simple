import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Add,
  ArrowBackOutlined,
  CloseOutlined,
  Delete,
  DeleteOutlineOutlined,
  FiberManualRecord,
  Save,
} from "@mui/icons-material";
import React, { useEffect } from "react";

import * as yup from "yup";
import { theme } from "../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";
import { checklistStyles } from "./styles/checklistStyles";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  title: yup.string().required("Title is required."),
  description: yup.string().required("Description is required."),
});

const CreateNewChecklistDialog = ({ data, open, onClose }) => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const onSubmitAction = async (data) => {
    // if (!data.id) {
    //   const addPayload = {
    //     title: data.title,
    //     description: data.description,
    //   };
    //   await addEditChecklist(addPayload)
    //     .unwrap()
    //     .then(() => {
    //       toast.success("Success!", {
    //         description: "New Checklist added!",
    //         duration: 1500,
    //       });
    //       reset();
    //       onClose();
    //     })
    //     .catch((error) => {
    //       console.log("Error: ", error);
    //       toast.error("Error!", {
    //         description: "Title has already been taken.",
    //         duration: 1500,
    //       });
    //     });
    // } else {
    //   const editPayload = {
    //     id: data.id,
    //     title: data.title,
    //     description: data.description,
    //   };
    //   await addEditChecklist(editPayload)
    //     .unwrap()
    //     .then(() => {
    //       toast.success("Success!", {
    //         description: "Checklist updated!",
    //         duration: 1500,
    //       });
    //       reset();
    //       onClose();
    //     })
    //     .catch((error) => {
    //       toast.error("Error!", {
    //         description: "Title has already been taken.",
    //         duration: 1500,
    //       });
    //     });
    // }
  };

  const onCloseAction = () => {
    console.log("closed");
    onClose();
  };

  console.log("ChecklistData: ", data);

  return (
    <>
      <Dialog fullScreen open={open} onClose={onClose} PaperProps={{ style: { overflow: "unset" } }}>
        {/* <form onSubmit={handleSubmit(onSubmitAction)}> */}
        <DialogContent>
          <Stack sx={checklistStyles.checklistDialogContent}>
            {/* Header */}
            <Stack sx={checklistStyles.checklistDialogHeader}>
              <Stack>
                <IconButton onClick={() => onCloseAction()}>
                  <ArrowBackOutlined sx={checklistStyles.arrowButton} />
                </IconButton>
              </Stack>

              <Stack gap={0} p={0}>
                <Typography sx={checklistStyles.checklistHeaderText}>Checklist Form Builder</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "13px" }}>
                  Create and manage your checklist
                </Typography>
              </Stack>
            </Stack>

            {/* Checklist Setup */}
            <Stack sx={checklistStyles.checklistBodyContainer}>
              <Stack sx={checklistStyles.checklistSectionsContainer}>
                <Stack sx={checklistStyles.checklistSectionContent}>
                  {/* Checklist Header   */}
                  <Stack sx={checklistStyles.checklistSectionHeader}>
                    <Stack>
                      <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>Build your Checklist</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: "12px", fontWeight: 400 }}>
                        Let's start with the basic information for your checklist.
                      </Typography>
                    </Stack>

                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Add />}
                      sx={{ fontSize: "11px", padding: "6px 16px" }}
                    >
                      Add Section
                    </Button>
                  </Stack>

                  {/* Checklist Name */}
                  <Stack mt={4} gap={2}>
                    <Stack gap={0.5}>
                      <Stack sx={checklistStyles.checklistFormDescription}>
                        <FiberManualRecord color="error" sx={checklistStyles.dotIcon} />
                        <Typography sx={checklistStyles.checklistFormText}>Checklist Name</Typography>
                      </Stack>

                      <TextField
                        size="small"
                        value={data?.title || ""}
                        placeholder="Checklist Name"
                        disabled
                        InputProps={checklistStyles.inputProps}
                        InputLabelProps={checklistStyles.inputLabelProps}
                      />
                    </Stack>
                  </Stack>

                  {/* Checklist Section */}
                  <Stack sx={checklistStyles.checklistSectionsContent}>
                    <Stack>
                      <Chip
                        variant="filled"
                        label={`Section 1`}
                        sx={{
                          ...checklistStyles.sectionChipStyle,
                          color: "#ffffffde",
                          backgroundColor: theme.palette.primary.main,
                        }}
                      />
                    </Stack>

                    <Stack gap={0.5} mt={1}>
                      <Stack sx={checklistStyles.checklistFormDescription}>
                        <Typography sx={checklistStyles.checklistFormText}>Section Title</Typography>
                        <FiberManualRecord color="error" sx={checklistStyles.dotIcon} />
                      </Stack>

                      <Stack sx={checklistStyles.sectionTextField}>
                        <TextField
                          size="small"
                          placeholder="Input Section Title"
                          InputProps={checklistStyles.inputProps}
                          InputLabelProps={checklistStyles.inputLabelProps}
                          sx={{ flex: 1 }}
                        />
                        <IconButton sx={checklistStyles.sectionIconButton}>
                          <DeleteOutlineOutlined color="error" sx={{ fontSize: "24px" }} />
                        </IconButton>
                      </Stack>
                    </Stack>

                    {/* Add Question */}
                    <Stack>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        sx={{ fontSize: "11px", padding: "6px 16px", mt: 2 }}
                      >
                        Add Question
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loadingPosition="start"
            startIcon={<Save />}
            //   loading={addEditChecklistIsLoading || addEditChecklistIsFetching}
            //   disabled={!watch("title") || !watch("description")}
            sx={{
              ":disabled": {
                backgroundColor: theme.palette.secondary.main,
                color: "black",
              },
            }}
          >
            Save Checklist
          </LoadingButton>
          <LoadingButton variant="outlined" onClick={() => onCloseAction()}>
            Cancel
          </LoadingButton>
        </DialogActions>
        {/* </form> */}
      </Dialog>
    </>
  );
};

export default CreateNewChecklistDialog;
