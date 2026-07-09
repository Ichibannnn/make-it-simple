import { Box, Typography } from "@mui/material";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CanvasField from "./CanvasField";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { formCanvasStyles as s } from "./styles/formStyle";

export const CANCEL_DROP_ID = "cancel-drop";

export default function FormCanvas({
  fields,
  selectedId,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
  data,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-droppable" });
  const { active } = useDndContext();

  // Floating "drop here to cancel" target. A click can't work mid-drag (the
  // pointer is held down the whole time), so cancelling is done by releasing
  // the dragged field over this zone — handled in FormBuilder's onDragEnd.
  const { setNodeRef: setCancelRef, isOver: isOverCancel } = useDroppable({
    id: CANCEL_DROP_ID,
  });

  return (
    <Box sx={s.scroll}>
      {/* Floating cancel-drag target — only while a field is being dragged */}
      {active && (
        <Box ref={setCancelRef} sx={s.cancelDropFab(isOverCancel)}>
          <CloseIcon sx={s.cancelDropIcon(isOverCancel)} />
          <Typography sx={s.cancelDropText(isOverCancel)}>
            {isOverCancel ? "Release to cancel" : "Drop here to cancel"}
          </Typography>
        </Box>
      )}

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
                    onDuplicate={() => onDuplicate(field.id)}
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
