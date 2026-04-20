import { NoteAddOutlined } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { checklistStyles } from "./styles/checklistStyles";

const CreateCard = () => {
  return (
    <Card
      variant="outlined"
      sx={checklistStyles.createCard}
      role="button"
      aria-label="Create new form"
      // onClick={onClick}
    >
      <Box textAlign="center">
        <NoteAddOutlined sx={checklistStyles.createAddIcon} />
        <Typography variant="caption" sx={checklistStyles.createNewFormText}>
          CREATE NEW FORM
        </Typography>
      </Box>
    </Card>
  );
};

export default CreateCard;
