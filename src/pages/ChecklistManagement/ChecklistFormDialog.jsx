import {
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
import { ArrowBackOutlined, CloseOutlined, Save } from "@mui/icons-material";
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

const CreateNewChecklistDialog = ({ open, onClose }) => {
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
                <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
                  Create and manage your checklist
                </Typography>
              </Stack>
            </Stack>

            {/* Checklist Setup */}
            <Stack sx={checklistStyles.checklistBodyContainer}>
              <Stack sx={checklistStyles.checklistSectionsContainer}>
                <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>Checklist Title</Typography>
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
