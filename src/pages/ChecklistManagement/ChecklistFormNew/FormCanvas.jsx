import { Box, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CanvasField from "./CanvasField";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";

export default function FormCanvas({
  fields,
  selectedId,
  onSelect,
  onDelete,
  onUpdate,
  data,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-droppable" });

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        bgcolor: "#0D1117",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Canvas inner */}
      <Box
        sx={{
          maxWidth: 960,
          width: "100%",
          mx: "auto",
          px: 3,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          flex: 1,
        }}
      >
        {/* Form title area */}
        <Box
          sx={{
            mb: 2.5,
            p: 2.5,
            borderRadius: 2,
            border: "1px solid #30363D",
            bgcolor: "#161B22",
          }}
        >
          <Typography
            sx={{ fontSize: 22, fontWeight: 700, color: "#E6EDF3", mb: 0.5 }}
          >
            {data?.title}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#8B949E" }}>
            {data?.description}
          </Typography>
        </Box>

        {/* Drop zone */}
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box
            ref={setNodeRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              flex: 1,
              minHeight: 300,
              borderRadius: 2,
              transition: "all 0.15s ease",
              ...(isOver &&
                fields.length === 0 && {
                  border: "2px dashed #7C3AED",
                  bgcolor: "rgba(124,58,237,0.05)",
                  p: 2,
                }),
            }}
          >
            {fields.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  py: 10,
                  border: "2px dashed",
                  borderColor: isOver ? "#7C3AED" : "#30363D",
                  borderRadius: 2,
                  bgcolor: isOver ? "rgba(124,58,237,0.05)" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <GridViewOutlinedIcon
                  sx={{ fontSize: 44, color: isOver ? "#7C3AED" : "#30363D" }}
                />
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isOver ? "#9D5CF6" : "#8B949E",
                      mb: 0.5,
                    }}
                  >
                    {isOver ? "Release to add field" : "Your form is empty"}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "#8B949E", opacity: 0.7 }}
                  >
                    Drag a field from the left panel to start building
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                {fields.map((field) => (
                  <CanvasField
                    key={field.id}
                    field={field}
                    isSelected={selectedId === field.id}
                    onSelect={() => onSelect(field.id)}
                    onDelete={() => onDelete(field.id)}
                    onUpdate={onUpdate}
                  />
                ))}

                {/* Drop here indicator at the bottom */}
                <Box
                  sx={{
                    mt: 0.5,
                    py: 1.5,
                    border: "2px dashed",
                    borderColor: isOver ? "#7C3AED" : "#30363D",
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: isOver ? "rgba(124,58,237,0.05)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: isOver ? "#9D5CF6" : "#8B949E",
                      opacity: isOver ? 1 : 0.5,
                    }}
                  >
                    {isOver ? "Release to add field here" : "+ Drop field here"}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </SortableContext>
      </Box>
    </Box>
  );
}
