import React, { useRef, useState } from "react";
import { MoreVertOutlined } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, IconButton, Stack, Typography } from "@mui/material";

import moment from "moment";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import Folder from "../../assets/lotties/folder-yellow.json";
import { toast } from "sonner";
import { theme } from "../../theme/theme";
import { checklistStyles } from "./styles/checklistStyles";
import useDisclosure from "../../hooks/useDisclosure";
import { useArchiveChecklistMutation } from "../../features/api masterlist/checklist_management/checklistManagementApi";

import ChecklistCardActions from "./ChecklistCardActions";
import CreateNewChecklistDialog from "./CreateNewChecklistDialog";
import ChecklistFormDialog from "./ChecklistFormDialog";

const ChecklistCards = ({ data }) => {
  const [checklistData, setChecklistData] = useState(null);
  const [editData, setEditData] = useState(null);
  const lottieRef = useRef();
  const isHovering = useRef(false);

  const { open: checklistOpen, onToggle: checklistOnToggle, onClose: checklistOnClose } = useDisclosure();
  const { open: editOpen, onToggle: editOnToggle, onClose: editOnClose } = useDisclosure();
  const [archiveChecklist] = useArchiveChecklistMutation();

  const TOTAL_FRAMES = 101;
  const MID_FRAME = TOTAL_FRAMES / 2;

  const handleMouseEnter = () => {
    isHovering.current = true;
    lottieRef.current.setDirection(1);
    lottieRef.current.goToAndPlay(0, true);
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    lottieRef.current.setDirection(-1);
    lottieRef.current.play();
  };

  const handleEnterFrame = (e) => {
    // Stop at mid frame ONLY when hovering and playing forward
    if (isHovering.current && e.direction === 1 && Math.floor(e.currentTime) >= MID_FRAME) {
      lottieRef.current.pause();
    }
    // Stop at frame 0 ONLY when not hovering and playing backward
    if (!isHovering.current && e.direction === -1 && Math.floor(e.currentTime) <= 0) {
      lottieRef.current.pause();
    }
  };

  const onChecklistAction = (data) => {
    setChecklistData(data);
    checklistOnToggle();
  };

  const onEditAction = (data) => {
    editOnToggle();
    setEditData(data);
  };

  const onArchiveAction = (data) => {
    if (data.isActive === true) {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the checklist to the archived.",
        icon: "warning",
        color: "white",
        showCancelButton: true,
        background: "#111927",
        confirmButtonColor: "#9e77ed",
        cancelButtonColor: "#1C2536",
        heightAuto: false,
        width: "30em",
        allowOutsideClick: false,
        customClass: {
          container: "custom-container",
          title: "custom-title",
          htmlContainer: "custom-text",
          icon: "custom-icon",
          confirmButton: "custom-confirm-btn",
          cancelButton: "custom-cancel-btn",
        },
        preConfirm: async () => {
          try {
            Swal.getConfirmButton().innerHTML = `
            <div class="mui-btn-content">
             <span class="mui-spinner"></span>
             <span class="mui-label">Archiving...</span>
            </div>
            `;
            Swal.getConfirmButton().disabled = true;

            await archiveChecklist(data.id)
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Checklist archived successfully!",
                });
              })
              .catch((error) => {
                toast.error("Error!", {
                  description: error.data.error.message,
                });
              });

            return true; // resolves success
          } catch (err) {
            console.log("Error", err);
            Swal.hideLoading();
            Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
            return false; // keeps modal open
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the checklist to the active.",
        icon: "warning",
        color: "white",
        showCancelButton: true,
        background: "#111927",
        confirmButtonColor: "#9e77ed",
        cancelButtonColor: "#1C2536",
        heightAuto: false,
        width: "30em",
        allowOutsideClick: false,
        customClass: {
          container: "custom-container",
          title: "custom-title",
          htmlContainer: "custom-text",
          icon: "custom-icon",
          confirmButton: "custom-confirm-btn",
          cancelButton: "custom-cancel-btn",
        },
        preConfirm: async () => {
          try {
            Swal.getConfirmButton().innerHTML = `
            <div class="mui-btn-content">
              <span class="mui-spinner"></span>
              <span class="mui-label">Restoring...</span>
            </div>
            `;
            Swal.getConfirmButton().disabled = true;

            await archiveChecklist(data.id)
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Checklist restored successfully!",
                });
              })
              .catch((error) => {
                toast.error("Error!", {
                  description: error.data.error.message,
                });
              });

            return true;
          } catch (err) {
            console.log("Error", err);
            Swal.hideLoading();
            Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
            return false;
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
        }
      });
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={checklistStyles.cardContainer}
      >
        <CardActionArea component="div">
          <CardContent>
            <Stack>
              <Stack justifyContent="center" sx={{ width: "100%" }}>
                <div
                  style={{
                    width: 150,
                    cursor: "pointer",
                  }}
                  onClick={() => onChecklistAction(data)}
                >
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={Folder}
                    loop={false}
                    autoplay={false}
                    onEnterFrame={handleEnterFrame}
                  />
                </div>
              </Stack>

              <Stack>
                <Typography sx={checklistStyles.cardTitle}>{data?.title}</Typography>

                <Stack direction="row" justifyContent="space-between">
                  <Stack mt={2}>
                    <Typography sx={checklistStyles.cardDescription}>{data?.description}</Typography>

                    <Stack mt={1}>
                      <Typography
                        sx={{
                          ...checklistStyles.cardDetails,
                          color: data?.isActive ? theme.palette.success.main : theme.palette.error.main,
                        }}
                      >
                        {data?.isActive ? "Active" : "Inactive"}
                      </Typography>
                      <Typography
                        sx={checklistStyles.cardDetails}
                      >{`Created at: ${moment(data?.createdAt).format("LL")}`}</Typography>
                    </Stack>
                  </Stack>

                  <Stack mt={2}>
                    <ChecklistCardActions data={data} onArchive={onArchiveAction} onEdit={onEditAction} />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>

      <CreateNewChecklistDialog data={editData} open={editOpen} onClose={editOnClose} />
      <ChecklistFormDialog data={checklistData} open={checklistOpen} onClose={checklistOnClose} />
    </>
  );
};

export default ChecklistCards;
