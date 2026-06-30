import { useState, useCallback, useRef, useEffect } from "react";
import { Box, Dialog, Snackbar, Alert } from "@mui/material";
import { Typography } from "@mui/material";

import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import BuilderTopBar from "./BuilderTopBar";
import FieldPalette from "./FieldPalette";
import FormCanvas from "./FormCanvas";
import PropertiesPanel from "./PropertiesPanel";
import FormRenderer from "./FormRenderer";
import SaveFormDialog from "./SaveFormDialog";

import {
  readDraft,
  writeDraft,
  clearDraft,
  hasDraft,
  getMaxId,
  getNewFormSessionKey,
  rememberLastOpen,
  forgetLastOpen,
} from "./../../../hooks/useFormDraft";

import { FIELD_TYPE_MAP } from "../../../constants/fieldTypes";
import { defaultChecklistColumns } from "../../../constants/checklistDefaults";
import { serialize } from "../../../schema";

// nextId is managed as a module-level variable that gets seeded lazily
// inside the component from the persisted draft (see initNextId below).
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
  // Use a stable per-tab session key for unsaved forms so hard-refresh
  // (Ctrl+Shift+R) within the same tab reloads the same draft, while a
  // new tab always starts fresh and never clobbers another tab's work.
  const draftKey = data?.id || getNewFormSessionKey();
  const draftMeta = { title: data?.title || "Untitled Form", description: data?.description || "" };

  // ── Initialize fields directly from localStorage — survives any refresh ──
  const [fields, setFields] = useState(() => {
    const restored = readDraft(draftKey) ?? [];

    // TEMP DEBUG — remove once confirmed working
    console.log("[FormBuilder mount]", {
      dataId: data?.id,
      draftKey,
      open,
      restoredCount: restored.length,
      restored,
    });

    // Seed nextId so new fields dragged in after a refresh never collide
    // with ids that were already assigned before the refresh.
    const maxSeen = getMaxId(draftKey);
    if (maxSeen >= nextId) nextId = maxSeen + 1;
    return restored;
  });

  const [selectedId, setSelectedId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("builder");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const showSnack = (message, severity = "success") => setSnack({ open: true, message, severity });

  // ── Persist which checklist is open so a hard-refresh can restore it ──────
  // When `open` becomes true (user clicked the card) we record data.id in
  // sessionStorage. On next mount ChecklistCards reads this and re-opens the
  // dialog automatically, which causes FormBuilder to mount with the correct
  // data prop and draftKey, so readDraft() finds the saved fields.
  useEffect(() => {
    if (open && data?.id) {
      rememberLastOpen(data.id);
    }
  }, [open, data?.id]);

  // ── Core updater — writes to localStorage immediately on every change ────
  // This is the single source of truth for persistence. No debounce, no async.
  // localStorage.setItem is synchronous so the data is always on disk before
  // the function returns, making hard-refresh safe at any moment.
  const updateFields = useCallback(
    (updater) => {
      setFields((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        writeDraft(draftKey, next, draftMeta);
        setDraftSavedAt(new Date().toISOString());
        return next;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draftKey],
  );

  // ── DnD ──────────────────────────────────────────────────────────────────
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
        updateFields((prev) => [...prev, newField]);
      } else {
        updateFields((prev) => {
          const overIndex = prev.findIndex((f) => f.id === overId);
          const next = [...prev];
          next.splice(overIndex >= 0 ? overIndex + 1 : prev.length, 0, newField);
          return next;
        });
      }
      setSelectedId(newField.id);
    } else {
      const overId = String(over.id);
      if (activeId !== overId) {
        updateFields((prev) => {
          const oldIdx = prev.findIndex((f) => f.id === activeId);
          const newIdx = prev.findIndex((f) => f.id === overId);
          return arrayMove(prev, oldIdx, newIdx);
        });
      }
    }
  }

  function handleDelete(id) {
    updateFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleUpdate(updated) {
    updateFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }

  function handleDiscardDraft() {
    clearDraft(draftKey);
    forgetLastOpen();
    setFields([]);
    setDraftSavedAt(null);
    showSnack("Draft discarded. Canvas cleared.", "warning");
  }

  // ── Save Form (final) ─────────────────────────────────────────────────────
  function handleSaveConfirm(validatedMeta) {
    setSaveLoading(true);

    setTimeout(() => {
      const payload = serialize(fields, {
        id: draftKey,
        name: validatedMeta.title,
        description: validatedMeta.description,
        version: validatedMeta.version,
      });

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${draftKey}-v${validatedMeta.version}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      clearDraft(draftKey);
      forgetLastOpen();
      setDraftSavedAt(null);

      setSaveLoading(false);
      setSaveDialogOpen(false);
      showSnack("Form saved successfully! JSON downloaded.", "success");
    }, 800);
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
              onSave={() => setSaveDialogOpen(true)}
              onClose={onClose}
              onDiscardDraft={handleDiscardDraft}
              data={data}
              draftSavedAt={draftSavedAt}
              hasDraft={hasDraft(draftKey)}
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

      <SaveFormDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        defaultMeta={{ title: data?.title, description: data?.description }}
        fields={fields}
        onConfirm={handleSaveConfirm}
        loading={saveLoading}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{
            bgcolor:
              snack.severity === "success"
                ? "#22C55E"
                : snack.severity === "info"
                  ? "#7C3AED"
                  : snack.severity === "warning"
                    ? "#F97316"
                    : "#EF4444",
            color: "#fff",
            fontSize: 12,
            "& .MuiAlert-icon": { color: "#fff" },
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormBuilder;
