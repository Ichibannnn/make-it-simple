import { Box, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CanvasField from "./CanvasField";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import { formCanvasStyles as s } from "./styles/formStyle";

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
    <Box sx={s.scroll}>
      {/* Canvas inner */}
      <Box sx={s.inner}>
        {/* Form title area */}
        <Box sx={s.titleCard}>
          <Typography sx={s.title}>{data?.title}</Typography>
          <Typography sx={s.description}>{data?.description}</Typography>
        </Box>

        {/* Drop zone */}
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box ref={setNodeRef} sx={s.dropZone(isOver, fields.length === 0)}>
            {fields.length === 0 ? (
              <Box sx={s.emptyState(isOver)}>
                <GridViewOutlinedIcon sx={s.emptyIcon(isOver)} />
                <Box sx={s.emptyTextWrap}>
                  <Typography sx={s.emptyTitle(isOver)}>
                    {isOver ? "Release to add field" : "Your form is empty"}
                  </Typography>
                  <Typography sx={s.emptySub}>
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
                <Box sx={s.dropIndicator(isOver)}>
                  <Typography sx={s.dropIndicatorText(isOver)}>
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
