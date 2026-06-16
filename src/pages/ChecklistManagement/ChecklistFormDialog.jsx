import {
  Box,
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
  ClearAllOutlined,
  CloseOutlined,
  Delete,
  DeleteOutline,
  DeleteOutlineOutlined,
  DragHandleOutlined,
  DragIndicatorOutlined,
  FiberManualRecord,
  Save,
} from "@mui/icons-material";
import React, { useEffect } from "react";

import * as yup from "yup";
import { theme } from "../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { checklistStyles } from "./styles/checklistStyles";
import RichTextEditor from "../../components/RichTextEditor";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  checklistName: yup.string().required("Checlist Name is required."),
  description: yup.string().required("Description is required."),

  sections: yup.array().of(
    yup.object({
      sectionName: yup.string().required("Section Name is required"),
      questions: yup.array().of(
        yup.object({
          question: yup.string().required("Question is required"),

          types: yup
            .array()
            .of(
              yup.object({
                type: yup.string().required("Type is required"),
              }),
            )
            .min(1, "At least one type is required"),
        }),
      ),
    }),
  ),
});

const CreateNewChecklistDialog = ({ data, open, onClose }) => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      checklistName: "",
      sections: [
        {
          sectionName: "",
          questions: [
            {
              question: "",
              types: [{ type: "" }],
            },
          ],
        },
      ],
    },
  });

  const {
    fields: sections,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmitAction = async (data) => {
    console.log("FormData:", data);
  };

  const onCloseAction = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={checklistStyles.checklistDialogContent}>
              <Stack sx={checklistStyles.checklistBodyContainer}>
                {/* Header */}
                <Stack sx={checklistStyles.checklistDialogHeader}>
                  <Stack>
                    <IconButton onClick={() => onCloseAction()}>
                      <ArrowBackOutlined sx={checklistStyles.arrowButton} />
                    </IconButton>
                  </Stack>

                  <Stack>
                    <Typography sx={checklistStyles.checklistHeaderText}>
                      Checklist Form Builder
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: "13px" }}
                    >
                      Create and manage your checklist
                    </Typography>
                  </Stack>
                </Stack>

                <Stack sx={checklistStyles.checklistSectionsContainer}>
                  {/* <Box sx={checklistStyles.boxStyling} /> */}

                  {/* Checklist Content */}
                  <Stack sx={checklistStyles.checklistSectionContent}>
                    {/* Checklist Header   */}
                    <Stack sx={checklistStyles.checklistSectionHeader}>
                      <Stack>
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: 600,
                            letterSpacing: -0.5,
                          }}
                        >
                          Build your Checklist
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: "13px" }}
                        >
                          Let's start with the basic information for your
                          checklist.
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Checklist Name */}
                    <Stack mt={4} gap={2}>
                      <Stack gap={0.2}>
                        <Stack sx={checklistStyles.checklistFormDescription}>
                          <Typography
                            color="text.secondary"
                            sx={checklistStyles.checklistFormText}
                          >
                            CHECKLIST NAME
                          </Typography>
                          <FiberManualRecord
                            color="error"
                            sx={checklistStyles.dotIcon}
                          />
                        </Stack>

                        <TextField
                          size="small"
                          value={data?.title || ""}
                          readOnly
                          InputProps={checklistStyles.inputProps}
                          InputLabelProps={checklistStyles.inputLabelProps}
                        />
                      </Stack>
                    </Stack>

                    {/* Sections */}
                    {sections.map((section, sectionIndex) => (
                      <SectionItem
                        key={section.id}
                        control={control}
                        sectionIndex={sectionIndex}
                        removeSection={removeSection}
                      />
                    ))}

                    <Stack
                      sx={{
                        ...checklistStyles.checklistFormActions,
                        width: "100%",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Add />}
                        sx={{ padding: "6px 16px" }}
                        onClick={() =>
                          appendSection({
                            sectionName: "",
                            questions: [
                              {
                                question: "",
                                types: [{ type: "" }],
                              },
                            ],
                          })
                        }
                      >
                        Add Section
                      </Button>

                      <Stack direction="row" gap={1}>
                        <LoadingButton
                          size="small"
                          type="submit"
                          variant="contained"
                          loadingPosition="start"
                          startIcon={<Save />}
                          sx={checklistStyles.gradientButton}
                          // disabled
                          // sx={{
                          //   ":disabled": {
                          //     backgroundColor: theme.palette.secondary.main,
                          //     color: "black",
                          //   },
                          //   // fontSize: "11px",
                          //   padding: "6px 16px",
                          // }}
                        >
                          Save Checklist
                        </LoadingButton>

                        <LoadingButton
                          size="small"
                          variant="outlined"
                          onClick={() => onCloseAction()}
                          sx={{
                            // fontSize: "11px",
                            padding: "6px 16px",
                          }}
                        >
                          Cancel
                        </LoadingButton>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default CreateNewChecklistDialog;

const SectionItem = ({ control, sectionIndex, removeSection }) => {
  const {
    fields: questions,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  return (
    <Stack sx={checklistStyles.checklistSectionsContent}>
      <Stack sx={checklistStyles.sectionDraggable}>
        <Chip
          variant="filled"
          icon={<DragHandleOutlined color="text.primary" />}
          label={`Section ${sectionIndex + 1}`}
          sx={{
            ...checklistStyles.sectionChipStyle,
            color: "#ffffffde",
            // backgroundColor: theme.palette.primary.main,
          }}
        />

        <Stack gap={0.5} direction="row">
          <IconButton sx={checklistStyles.sectionIconButton}>
            <DeleteOutline
              color="error"
              onClick={() => removeSection(sectionIndex)}
              sx={{ fontSize: "24px" }}
            />
          </IconButton>

          <IconButton sx={checklistStyles.sectionIconButton}>
            <DragIndicatorOutlined color="inherit" sx={{ fontSize: "24px" }} />
          </IconButton>
        </Stack>
      </Stack>

      <Stack gap={0.2} mt={1}>
        <Stack sx={checklistStyles.checklistFormDescription}>
          <Typography
            color="text.secondary"
            sx={checklistStyles.checklistFormText}
          >
            SECTION NAME
          </Typography>
          <FiberManualRecord color="error" sx={checklistStyles.dotIcon} />
        </Stack>

        <Stack sx={checklistStyles.sectionTextField}>
          <Controller
            name={`sections.${sectionIndex}.sectionName`}
            control={control}
            render={({ field, fieldState }) => (
              // <TextField
              //   size="small"
              //   placeholder="Input Section Name"
              //   InputProps={checklistStyles.inputProps}
              //   InputLabelProps={checklistStyles.inputLabelProps}
              //   sx={{ flex: 1 }}
              // />

              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error}
              />
            )}
          />
        </Stack>
      </Stack>

      {/* Questions */}
      <Stack mt={3}>
        <Typography
          color="text.secondary"
          sx={checklistStyles.questionHeaderText}
        >
          QUESTIONS
        </Typography>
        {questions.map((question, questionIndex) => (
          <QuestionItem
            key={question.id}
            control={control}
            sectionIndex={sectionIndex}
            questionIndex={questionIndex}
            removeQuestion={removeQuestion}
          />
        ))}
      </Stack>

      {/* Add Question */}
      <Stack>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Add />}
          sx={checklistStyles.addQuestionButton}
          onClick={() =>
            appendQuestion({
              question: "",
              type: [{ type: "" }],
            })
          }
        >
          Add question
        </Button>
      </Stack>
    </Stack>
  );
};

const QuestionItem = ({
  control,
  sectionIndex,
  questionIndex,
  removeQuestion,
}) => {
  const {
    fields: types,
    append: appendType,
    remove: removeType,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions.${questionIndex}.types`,
  });

  return (
    <Stack>
      <Stack sx={checklistStyles.questionItemContainer}>
        <Typography
          color="text.secondary"
          sx={checklistStyles.questionHeaderText}
        >{`${questionIndex + 1}. QUESTION DESCRIPTION`}</Typography>

        <Stack sx={checklistStyles.questionDesc}>
          <Controller
            name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                size="small"
                placeholder="Input Description"
                InputProps={checklistStyles.inputProps}
                InputLabelProps={checklistStyles.inputLabelProps}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ flex: 1 }}
              />
            )}
          />

          <IconButton sx={checklistStyles.sectionIconButton}>
            <DeleteOutlineOutlined
              color="error"
              onClick={() => removeQuestion(questionIndex)}
              sx={{ fontSize: "24px" }}
            />
          </IconButton>
        </Stack>

        {/* Types */}
        <Stack mt={3}>
          <Typography
            color="text.secondary"
            sx={checklistStyles.questionHeaderText}
          >
            QUESTION TYPE
          </Typography>
          {types.map((type, typeIndex) => (
            <TypeItem
              key={type.id}
              control={control}
              questionIndex={questionIndex}
              typeIndex={typeIndex}
              removeType={removeType}
            />
          ))}
        </Stack>

        {/* Add Type */}
        <Stack>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Add />}
            sx={checklistStyles.addTypeButton}
            onClick={() =>
              appendType({
                type: [{ type: "" }],
              })
            }
          >
            Add question type
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

const TypeItem = ({
  control,
  sectionIndex,
  questionIndex,
  typeIndex,
  removeType,
}) => {
  return (
    <Stack>
      <Stack sx={checklistStyles.typeItemContainer}>
        <Typography
          sx={checklistStyles.questionHeaderText}
        >{`${typeIndex + 1}.`}</Typography>

        <Stack sx={checklistStyles.questionDesc}>
          <Controller
            name={`sections.${sectionIndex}.questions.${questionIndex}.types.${typeIndex}.type`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                size="small"
                placeholder="Input Type"
                InputProps={checklistStyles.inputProps}
                InputLabelProps={checklistStyles.inputLabelProps}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ flex: 1 }}
              />
            )}
          />

          <IconButton sx={checklistStyles.sectionIconButton}>
            <DeleteOutlineOutlined
              color="error"
              onClick={() => removeType(typeIndex)}
              sx={{ fontSize: "24px" }}
            />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
