import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { IconButton, Tooltip, Divider, Box } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Link as LinkIcon,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Highlight as HighlightIcon,
  FormatClear,
} from "@mui/icons-material";
import "./../assets/styles/Tiptap.css";

const MenuButton = ({ onClick, active, title, children, disabled }) => (
  <Tooltip title={title} placement="top" arrow>
    <span>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: 30,
          height: 30,
          borderRadius: "4px",
          color: active ? "#673ab7" : "#5f6368",
          backgroundColor: active ? "#ede7f6" : "transparent",
          "&:hover": {
            backgroundColor: active ? "#d1c4e9" : "#f1f3f4",
          },
        }}
      >
        {children}
      </IconButton>
    </span>
  </Tooltip>
);

const ToolbarDivider = () => (
  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: "#e0e0e0" }} />
);

const TiptapEditor = ({ value, onChange, placeholder = "Description (optional)", error }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "tiptap-link" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html === "<p></p>" ? "" : html);
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <Box
      sx={{
        border: error ? "1px solid #d32f2f" : "1px solid #e0e0e0",
        borderRadius: "4px",
        overflow: "hidden",
        "&:focus-within": {
          borderColor: error ? "#d32f2f" : "#673ab7",
          boxShadow: error ? "0 0 0 1px #d32f2f" : "0 0 0 1px #673ab7",
        },
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "4px 8px",
          borderBottom: "1px solid #f1f3f4",
          backgroundColor: "#fafafa",
          flexWrap: "wrap",
        }}
      >
        <MenuButton
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <FormatBold sx={{ fontSize: 16 }} />
        </MenuButton>

        <MenuButton
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <FormatItalic sx={{ fontSize: 16 }} />
        </MenuButton>

        <MenuButton
          title="Underline (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <FormatUnderlined sx={{ fontSize: 16 }} />
        </MenuButton>

        <MenuButton
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <StrikethroughS sx={{ fontSize: 16 }} />
        </MenuButton>

        <ToolbarDivider />

        <MenuButton title="Link" onClick={setLink} active={editor.isActive("link")}>
          <LinkIcon sx={{ fontSize: 16 }} />
        </MenuButton>

        <ToolbarDivider />

        <MenuButton
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <FormatListBulleted sx={{ fontSize: 16 }} />
        </MenuButton>

        <MenuButton
          title="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <FormatListNumbered sx={{ fontSize: 16 }} />
        </MenuButton>

        <ToolbarDivider />

        <MenuButton
          title="Align left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <FormatAlignLeft sx={{ fontSize: 16 }} />
        </MenuButton>

        <MenuButton
          title="Align center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <FormatAlignCenter sx={{ fontSize: 16 }} />
        </MenuButton>

        <MenuButton
          title="Align right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <FormatAlignRight sx={{ fontSize: 16 }} />
        </MenuButton>

        <ToolbarDivider />

        <MenuButton
          title="Highlight"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
        >
          <HighlightIcon sx={{ fontSize: 16 }} />
        </MenuButton>

        <MenuButton
          title="Clear formatting"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <FormatClear sx={{ fontSize: 16 }} />
        </MenuButton>
      </Box>

      {/* Editor content */}
      <Box sx={{ padding: "10px 14px", minHeight: 60, backgroundColor: "#fff" }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default TiptapEditor;
