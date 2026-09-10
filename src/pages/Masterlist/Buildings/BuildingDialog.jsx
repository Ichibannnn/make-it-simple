import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { AddCircleOutline, EditOutlined, Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useAddEditSitesMutation } from "../../../features/api masterlist/sites/sitesApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";
import { useAddEditBuildingMutation } from "../../../features/api masterlist/buildings/buildingApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  name: yup.string().required("Building name is required."),
});

const BuildingDialog = ({ data, open, onClose }) => {
  const [addEditBuilding, { isLoading: addEditBuildingIsLoading, isFetching: addEditBuildingIsFetching }] =
    useAddEditBuildingMutation();

  const isEditMode = Boolean(data?.id);

  const {
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
      name: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("name", data?.name);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    console.log("Form Data: ", formData);

    if (formData.id) {
      const editPayload = {
        id: data.id,
        name: formData?.name,
      };

      addEditBuilding(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated Building! ",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("error: ", error);
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    } else {
      const addPayload = {
        name: formData?.name,
      };

      addEditBuilding(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Building added successsfully!",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("error: ", error);
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    }
  };

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ sx: sx.dialogPaper }}>
        <Typography sx={sx.dialogTitle}>{data ? "Edit Building" : "Add Building"}</Typography>
        <Typography sx={sx.dialogSubtitle}>
          {isEditMode ? "Update the details of this building." : "Create a new building location."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Building Name</Typography>
                <TextField
                  {...register("name")}
                  variant="outlined"
                  size="small"
                  placeholder="Enter Building Name"
                  helperText={errors?.name?.message}
                  error={!!errors?.name?.message}
                  sx={{ borderColor: "primary" }}
                  fullWidth
                  autoComplete="off"
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Cancel</Typography>
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={addEditBuildingIsLoading || addEditBuildingIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("name")}
              sx={sx.disabledSaveButton}
            >
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Save</Typography>
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default BuildingDialog;
