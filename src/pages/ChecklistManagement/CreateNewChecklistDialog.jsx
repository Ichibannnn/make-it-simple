import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import React from "react";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { theme } from "../../theme/theme";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAddEditChecklistMutation } from "../../features/api masterlist/checklist_management/checklistManagementApi";
import { toast } from "sonner";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  title: yup.string().required("Title is required."),
  description: yup.string().required("Description is required."),
});

const CreateNewChecklistDialog = ({ open, onClose }) => {
  const [addEditChecklist, { isLoading: addEditChecklistIsLoading, isFetching: addEditChecklistIsFetching }] = useAddEditChecklistMutation();

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: null,
      title: "",
      description: "",
    },
  });

  const onSubmitAction = async (data) => {
    console.log("Data", data);

    if (!data.id) {
      const addPayload = {
        title: data.title,
        description: data.description,
      };

      await addEditChecklist(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "New Checklist added!",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("Error: ", error);
          toast.error("Error!", {
            description: "Title has already been taken.",
            duration: 1500,
          });
        });
    } else {
      const editPayload = {
        id: data.id,
        title: data.title,
        description: data.description,
      };
    }
  };

  const onCloseAction = () => {
    onClose();
  };

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} PaperProps={{ style: { overflow: "unset" } }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#48BB78",
          }}
        >
          {/* {data ? "Edit Checklist" : "Add Checklist"} */}
          Create New Checklist
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 1.5 }}>
              <Controller
                control={control}
                name="title"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      value={value}
                      label="Title"
                      onChange={onChange}
                      sx={{
                        width: "100%",
                      }}
                      autoComplete="off"
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name="description"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      size="medium"
                      value={value}
                      label="Description"
                      onChange={onChange}
                      sx={{
                        width: "100%",
                      }}
                      autoComplete="off"
                    />
                  );
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={addEditChecklistIsLoading || addEditChecklistIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("title") || !watch("description")}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "black",
                },
              }}
            >
              Save
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default CreateNewChecklistDialog;
