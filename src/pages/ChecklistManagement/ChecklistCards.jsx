import React from "react";
import { Folder } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

const ChecklistCards = ({ data }) => {
  return (
    <Card variant="outlined" sx={{ height: "100%", position: "relative", "&:hover": { borderColor: "primary.main" } }}>
      <CardActionArea>
        <CardContent>
          <Folder sx={{ fontSize: 52, color: "primary.main", mb: 0.5 }} />

          <Typography>{data?.title}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ChecklistCards;
