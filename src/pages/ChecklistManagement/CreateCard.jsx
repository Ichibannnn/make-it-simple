import { NoteAddOutlined } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { checklistStyles } from "./styles/checklistStyles";
import useDisclosure from "../../hooks/useDisclosure";
import CreateNewChecklistDialog from "./CreateNewChecklistDialog";

const CreateCard = () => {
  const { open: createNewChecklistOpen, onToggle: createNewChecklistOnToggle, onClose: createNewChecklistOnClose } = useDisclosure();

  const createNewFormHandler = () => {
    createNewChecklistOnToggle();
  };

  return (
    <>
      <Card variant="outlined" sx={checklistStyles.createCard} role="button" aria-label="Create new form" onClick={createNewFormHandler}>
        <Box textAlign="center">
          <NoteAddOutlined sx={checklistStyles.createAddIcon} />
          <Typography variant="caption" sx={checklistStyles.createNewFormText}>
            CREATE NEW CHECKLIST
          </Typography>
        </Box>
      </Card>
      <CreateNewChecklistDialog open={createNewChecklistOpen} onClose={createNewChecklistOnClose} />
    </>
  );
};

export default CreateCard;
