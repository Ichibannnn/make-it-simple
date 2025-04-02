import { Autocomplete, Button, Dialog, DialogActions, DialogContent, IconButton, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { Close, DeleteOutlineOutlined, DragIndicator } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useCreateEditApproverMutation, useLazyGetSubUnitListQuery, useLazyGetApproverListQuery } from "../../../features/api_channel_setup/approver/approverApi";

import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const subUnitSchema = yup.object().shape({
  subUnitId: yup.object().nullable(),
});

const approverSchema = yup.object().shape({
  approvers: yup.object().required().label("Approvers"),
});

const ApproverDialog = ({ data, open, onClose }) => {
  const [approvers, setApprovers] = useState([]);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [createEditApprover, { isLoading: createEditApproverIsLoading, isFetching: createEditApproverIsFetching }] = useCreateEditApproverMutation();

  const [getSubUnitList, { data: subUnitListData, isLoading: subUnitListIsLoading, isSuccess: subUnitListIsSuccess }] = useLazyGetSubUnitListQuery();

  const [getApproverList, { data: approverListData, isLoading: approverListIsLoading, isSuccess: approverListIsSuccess }] = useLazyGetApproverListQuery();

  const {
    control: subUnitFormControl,
    handleSubmit: subUnitFormHandleSubmit,
    setValue: subUnitFormSetValue,
    watch: subUnitFormWatch,
    reset: subUnitFormReset,
    formState: { errors: subUnitFormErrors },
  } = useForm({
    resolver: yupResolver(subUnitSchema),
    defaultValues: {
      subUnitId: null,
    },
  });

  const {
    control: approverFormControl,
    handleSubmit: approverFormHandleSubmit,
    setValue: approverFormSetValue,
    watch: approverFormWatch,
    reset: approverFormReset,
    formState: { errors: approverFormErrors },
  } = useForm({
    resolver: yupResolver(approverSchema),
    defaultValues: {
      approvers: null,
    },
  });

  const onApproverFormSubmit = (formData) => {
    if (!data) {
      const subUnitIdParams = formData?.subUnitId?.subUnitId;
      const addPayload = approvers?.map((item) => ({
        userId: item.userId,
        approverLevel: item.id,
      }));

      createEditApprover({ id: subUnitIdParams, approvers: addPayload })
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Approver added successfully!",
            duration: 1500,
          });
          setApprovers([]);
          subUnitFormReset();
          approverFormReset();
          onClose();
        })
        .catch((error) => {
          toast.success("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    } else {
      const subUnitIdParams = data?.subUnitId;
      const editPayload = approvers?.map((item) => ({
        approverId: item?.approverId,
        userId: item.userId,
        approverLevel: item.id,
      }));

      console.log("editSubUnit: ", subUnitIdParams);
      console.log("Edit Payload", editPayload);
      // console.log("Data: ", data);

      createEditApprover({ id: subUnitIdParams, approvers: editPayload })
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated successfully!",
            duration: 1500,
          });
          setApprovers([]);
          subUnitFormReset();
          approverFormReset();
          onClose();
        })
        .catch((error) => {
          toast.success("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    }
  };

  const onApproverListFormAdd = (data) => {
    // console.log("Data: ", data);

    setApprovers((currentValue) => [
      ...currentValue,
      {
        id: approvers.length + 1,
        userId: data.approvers.userId,
        fullName: data.approvers.fullName,
        approverId: null,
      },
    ]);

    approverFormReset();
  };

  const onApproverListFormDelete = (index) => {
    console.log("Deleting approver at index:", index);

    setApprovers((approvers) => {
      const updatedApprovers = approvers.filter((_, i) => i !== index);

      const updatedWithIds = updatedApprovers.map((approver, i) => ({
        ...approver,
        id: `${i + 1}`,
      }));

      return updatedWithIds;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setApprovers((approvers) => {
      const originalIndex = approvers.findIndex((approver) => approver.id === active.id);
      const newIndex = approvers.findIndex((approver) => approver.id === over.id);

      const updatedApprovers = arrayMove(approvers, originalIndex, newIndex);

      // Update the id property of each approver based on their new index
      const updatedWithIds = updatedApprovers.map((approver, index) => ({
        ...approver,
        id: `${index + 1}`, // Assuming ids are in the format "approver-1", "approver-2", etc.
      }));

      return updatedWithIds;
    });
  };

  const onCloseAction = () => {
    onClose();
    setApprovers([]);
    subUnitFormReset();
    approverFormReset();
  };

  useEffect(() => {
    if (data) {
      subUnitFormSetValue("subUnitId", {
        subUnitId: data?.subUnitId,
        subUnit_Code: data?.subUnit_Code,
        subUnit_Name: data?.subUnit_Name,
      });

      const editApproversList = data?.approvers?.map((item) => ({
        id: item?.approverLevel,
        userId: item?.userId,
        fullName: item?.fullname,
        approverId: item?.approverId,
      }));

      setApprovers(editApproversList);

      const subUnitId = subUnitFormWatch("subUnitId")?.subUnitId;
      getApproverList({ SubUnitId: subUnitId });
    }
  }, [data]);

  // console.log("Table: ", approvers);

  // console.log("Data: ", data);

  // console.log("Sub unit: ", subUnitFormWatch("subUnitId"));

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open} sx={{ borderRadius: "none", padding: 0 }} PaperProps={{ style: { overflow: "unset" } }}>
        <DialogContent sx={{ paddingBottom: 10 }}>
          <Stack direction="column" sx={{ padding: "5px" }}>
            <Stack>
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: isSmallScreen ? "15px" : "18px",
                    fontWeight: 700,
                    color: "#48BB78",
                  }}
                >
                  Approver Form
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                }}
              >
                Select sub unit and tag approvers
              </Typography>
            </Stack>

            <Stack id="approverForm" component="form" onSubmit={subUnitFormHandleSubmit(onApproverFormSubmit)} sx={{ paddingTop: 2, gap: 2 }}>
              <Controller
                control={subUnitFormControl}
                name="subUnitId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      size="small"
                      value={value}
                      // options={subUnitListData?.value || []}
                      options={data ? [] : subUnitListData?.value || []}
                      loading={subUnitListIsLoading}
                      renderInput={(params) => <TextField {...params} label="Sub Unit" size="small" />}
                      onOpen={() => {
                        if (!subUnitListIsSuccess) getSubUnitList();
                      }}
                      onChange={(_, value) => {
                        onChange(value);

                        getApproverList({
                          SubUnitId: value?.subUnitId,
                        });
                      }}
                      getOptionLabel={(option) => `${option.subUnit_Code} - ${option.subUnit_Name}`}
                      isOptionEqualToValue={(option, value) => option.subUnitId === value.subUnitId}
                      noOptionsText={"No sub unit available"}
                      disabled={data ? true : false}
                      sx={{
                        flex: 2,
                      }}
                      componentsProps={{
                        popper: {
                          sx: {
                            "& .MuiAutocomplete-listbox": {
                              fontSize: isSmallScreen ? "13px" : "16px",
                            },
                          },
                        },
                      }}
                      fullWidth
                      disablePortal
                      disableClearable
                    />
                  );
                }}
              />
            </Stack>

            <Stack sx={{ paddingTop: 2, gap: 2 }}>
              <Stack component="form" onSubmit={approverFormHandleSubmit(onApproverListFormAdd)} direction={isSmallScreen ? "column" : "row"} gap={2}>
                <Controller
                  control={approverFormControl}
                  name="approvers"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        size="small"
                        value={value}
                        options={approverListData?.value || []}
                        loading={approverListIsLoading}
                        renderInput={(params) => <TextField {...params} label="Approvers" size="small" />}
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        getOptionLabel={(option) => option.fullName}
                        isOptionEqualToValue={(option, value) => option.userId === value.userId}
                        getOptionDisabled={(option) => approvers.some((item) => item.userId === option.userId)}
                        noOptionsText={"No approver available"}
                        sx={{
                          flex: 2,
                        }}
                        componentsProps={{
                          popper: {
                            sx: {
                              "& .MuiAutocomplete-listbox": {
                                fontSize: isSmallScreen ? "13px" : "16px",
                              },
                            },
                          },
                        }}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    );
                  }}
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  color="primary"
                  disabled={!approverFormWatch("approvers")}
                  sx={{
                    ":disabled": {
                      backgroundColor: theme.palette.secondary.main,
                      color: "black",
                    },
                  }}
                >
                  Add approver
                </LoadingButton>
              </Stack>

              <DndProvider backend={HTML5Backend}>
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                  <Column approvers={approvers} onDelete={onApproverListFormDelete} isSmallScreen={isSmallScreen} />
                </DndContext>
              </DndProvider>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" paddingBottom={1} gap={1}>
            <LoadingButton
              variant="contained"
              type="submit"
              form="approverForm"
              loading={createEditApproverIsLoading || createEditApproverIsFetching}
              disabled={!subUnitFormWatch("subUnitId") || !approvers.length}
            >
              Save
            </LoadingButton>
            <Button variant="text" onClick={onCloseAction}>
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproverDialog;

export const Column = ({ approvers, onDelete, isSmallScreen }) => {
  return (
    <div className="column">
      <Typography
        sx={{
          fontSize: isSmallScreen ? "14px" : "17px",
          fontWeight: 500,
          // color: "#48BB78",
        }}
      >
        List of Approvers
      </Typography>
      <SortableContext items={approvers} strategy={verticalListSortingStrategy}>
        {approvers.map((approver, index) => (
          <ApproversName id={approver.id} userId={approver.userId} fullName={approver.fullName} key={index} onDelete={() => onDelete(index)} isSmallScreen={isSmallScreen} />
        ))}
      </SortableContext>
    </div>
  );
};

export const ApproversName = ({ id, fullName, onDelete, isSmallScreen }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    cursor: "grab",
    userSelect: "none",
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <>
      <div ref={setNodeRef} style={style} className="style-draggable">
        <Stack direction="row" justifyContent="space-between" alignItems="center" {...attributes} {...listeners}>
          <DragIndicator />
        </Stack>

        <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: isSmallScreen ? "13px" : "15px" }}>
            {id} - {fullName}
          </Typography>
          <IconButton onClick={handleDelete}>
            <DeleteOutlineOutlined />
          </IconButton>
        </Stack>
      </div>
    </>
  );
};
