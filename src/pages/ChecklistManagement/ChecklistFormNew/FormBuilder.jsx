import { useState } from "react";
import { Box, Dialog } from "@mui/material";
import { Typography } from "@mui/material";

import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import BuilderTopBar from "./BuilderTopBar";
import FieldPalette from "./FieldPalette";
import FormCanvas from "./FormCanvas";

import PropertiesPanel from "./PropertiesPanel";
import FormRenderer from "./FormRenderer";

import { FIELD_TYPE_MAP } from "../../../constants/fieldTypes";

import { defaultChecklistColumns } from "../../../constants/checklistDefaults";
import { serialize } from "../../../schema";

const INITIAL_FIELDS = [
  { id: "f1", type: "section", label: "Basic Information" },
  {
    id: "f2",
    type: "text",
    label: "Requester Name",
    required: true,
    placeholder: "Input Name",
  },
  {
    id: "f3",
    type: "text",
    label: "Contact Number",
    required: false,
    placeholder: "Optional",
  },
  { id: "f4", type: "select", label: "Company", required: true },
  { id: "f5", type: "date", label: "Date", required: true },
  { id: "f6", type: "section", label: "A. Software" },
  {
    id: "f7",
    type: "checklist",
    label: "Software Checklist",
    rows: [
      "Check Adobe Acrobat Reader",
      "Check Date and Time",
      "Check and Update Anti-Virus",
      "Scan and Check Disk",
      "Remove unnecessary files",
    ],
    columns: [
      { id: "status", label: "STATUS", type: "status", requireWhen: "always" },
      { id: "remarks", label: "REMARKS", type: "text", requireWhen: "x" },
    ],
  },
  { id: "f8", type: "section", label: "B. Computer Hardware" },
  {
    id: "f9",
    type: "checklist",
    label: "Frontend PC",
    rows: ["System Unit", "Monitor", "Keyboard & Mouse", "Barcode Scanner", "UPS/Battery"],
    columns: [
      { id: "status", label: "STATUS", type: "status", requireWhen: "always" },
      { id: "asset", label: "ASSET TAG", type: "text", requireWhen: "check" },
      { id: "remarks", label: "REMARKS", type: "text", requireWhen: "x" },
    ],
  },
  { id: "f10", type: "section", label: "PMS Conducted By" },
  {
    id: "f11",
    type: "signature",
    label: "PMS Conducted By",
    required: true,
    multi: true,
    signerLabel: "Technician",
    addButtonLabel: "Add Technician",
    nameOptions: ["Manalang, Jonaber Sydney L.", "Marcelo, Carl Justine S."],
    digitalSig: true,
    minSigners: 1,
  },
];

let nextId = 200;

function DragOverlayContent({ item }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderRadius: 1,
        bgcolor: "#7C3AED",
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
        border: "1px solid rgba(255,255,255,0.2)",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>+ {item?.label}</Typography>
    </Box>
  );
}

const FormBuilder = ({ data, open, onClose }) => {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [selectedId, setSelectedId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("builder");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const selectedField = fields.find((f) => f.id === selectedId) ?? null;

  function handleDragStart({ active }) {
    if (String(active.id).startsWith("palette-")) {
      const type = String(active.id).replace("palette-", "");
      setActiveItem(FIELD_TYPE_MAP[type]);
    } else {
      setActiveItem(fields.find((f) => f.id === active.id));
    }
  }

  function handleDragEnd({ active, over }) {
    setActiveItem(null);
    if (!over) return;

    const activeId = String(active.id);

    if (activeId.startsWith("palette-")) {
      const type = activeId.replace("palette-", "");
      const def = FIELD_TYPE_MAP[type];
      const newField = {
        id: `f${nextId++}`,
        type,
        label: def.label,
        required: false,
        ...(type === "checklist" && {
          rows: ["Item 1", "Item 2"],
          descriptionLabel: "DESCRIPTION",
          columns: defaultChecklistColumns(),
        }),
        ...(type === "signature" && {
          digitalSig: true,
          multi: true,
          signerLabel: "Technician",
          addButtonLabel: "Add Technician",
          nameOptions: [],
          minSigners: 1,
        }),
      };

      const overId = String(over.id);
      if (overId === "canvas-droppable") {
        setFields((prev) => [...prev, newField]);
      } else {
        const overIndex = fields.findIndex((f) => f.id === overId);
        setFields((prev) => {
          const next = [...prev];
          next.splice(overIndex >= 0 ? overIndex + 1 : prev.length, 0, newField);
          return next;
        });
      }
      setSelectedId(newField.id);
    } else {
      const overId = String(over.id);
      if (activeId !== overId) {
        setFields((prev) => {
          const oldIdx = prev.findIndex((f) => f.id === activeId);
          const newIdx = prev.findIndex((f) => f.id === overId);
          return arrayMove(prev, oldIdx, newIdx);
        });
      }
    }
  }

  function handleDelete(id) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleUpdate(updated) {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }

  return (
    <>
      <Dialog fullScreen open={open} onClose={onClose} PaperProps={{ style: { overflow: "auto" } }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              width: "100vw",
              bgcolor: "#0D1117",
              overflow: "hidden",
            }}
          >
            <BuilderTopBar
              mode={mode}
              onTogglePreview={() => setMode((m) => (m === "builder" ? "preview" : "builder"))}
              onSave={() => {
                const payload = serialize(fields, {
                  id: "store-checklist",
                  name: data.title,
                });
                const blob = new Blob([JSON.stringify(payload, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${payload.form.id}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
              onClose={onClose}
              data={data}
            />
            {mode === "builder" ? (
              <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <FieldPalette />
                <FormCanvas
                  fields={fields}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  data={data}
                />
                <PropertiesPanel
                  field={selectedField}
                  onClose={() => setSelectedId(null)}
                  onUpdate={handleUpdate}
                />
              </Box>
            ) : (
              <FormRenderer fields={fields} />
            )}
          </Box>

          <DragOverlay dropAnimation={{ duration: 180 }}>
            {activeItem && <DragOverlayContent item={activeItem} />}
          </DragOverlay>
        </DndContext>
      </Dialog>
    </>
  );
};

export default FormBuilder;
