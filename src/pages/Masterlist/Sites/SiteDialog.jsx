import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useAddEditSitesMutation } from "../../../features/api masterlist/sites/sitesApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  name: yup.string().required("Site name is required."),
});

const SiteDialog = ({ data, open, onClose }) => {
  const [
    addEditSite,
    { isLoading: addEditSiteIsLoading, isFetching: addEditSiteIsFetching },
  ] = useAddEditSitesMutation();

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
        siteNames: [
          {
            id: data.id,
            name: formData?.name,
          },
        ],
      };

      addEditSite(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated Site! ",
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
        siteNames: [
          {
            name: formData?.name,
          },
        ],
      };

      addEditSite(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Site added successsfully!",
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
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        PaperProps={{ style: { overflow: "unset" } }}
      >
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
          {data ? "Edit Site" : "Add Site"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 1.5 }}>
              <TextField
                {...register("name")}
                variant="outlined"
                label="Site Name"
                helperText={errors?.name?.message}
                error={!!errors?.name?.message}
                sx={{ borderColor: "primary" }}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={addEditSiteIsLoading || addEditSiteIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("name")}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "black",
                },
              }}
            >
              Save
            </LoadingButton>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              Close
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default SiteDialog;
