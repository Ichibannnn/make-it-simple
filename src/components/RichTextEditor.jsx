// components/RichTextEditor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box } from "@mui/material";
import { useEffect } from "react";

export default function RichTextEditor({ value, onChange, error }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html); // 🔥 send to react-hook-form
    },
  });

  // Sync external value (important!)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: error ? "red" : "#555",
        borderRadius: 1,
        p: 1,
        minHeight: 120,
        flex: 1,
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
}
