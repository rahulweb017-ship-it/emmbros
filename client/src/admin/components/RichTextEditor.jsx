import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image as ImageExtension } from "@tiptap/extension-image";
import { Link as LinkExtension } from "@tiptap/extension-link";
import { Table as TableExtension } from "@tiptap/extension-table";
import { TableRow as TableRowExtension } from "@tiptap/extension-table-row";
import { TableCell as TableCellExtension } from "@tiptap/extension-table-cell";
import { TableHeader as TableHeaderExtension } from "@tiptap/extension-table-header";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImageIcon,
  Table as TableIcon,
  Code2,
} from "lucide-react";

import { MediaPicker } from "./MediaPicker";

export function RichTextEditor({ content = "", onChange, placeholder = "Write post content here..." }) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(content);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TableExtension.configure({
        resizable: true,
      }),
      TableRowExtension,
      TableCellExtension,
      TableHeaderExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlValue(html);
      if (onChange) onChange(html);
    },
  });

  // Keep editor in sync if content changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
      setHtmlValue(content);
    }
  }, [content, editor]);

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Switching from HTML to TipTap Editor
      if (editor) editor.commands.setContent(htmlValue);
      setIsHtmlMode(false);
    } else {
      // Switching from TipTap Editor to Raw HTML
      if (editor) setHtmlValue(editor.getHTML());
      setIsHtmlMode(true);
    }
  };

  const handleHtmlTextareaChange = (e) => {
    const val = e.target.value;
    setHtmlValue(val);
    if (onChange) onChange(val);
  };

  const handleMediaSelect = (media) => {
    if (editor && media?.url) {
      editor.chain().focus().setImage({ src: media.url, alt: media.alt || "" }).run();
      const updatedHtml = editor.getHTML();
      setHtmlValue(updatedHtml);
      if (onChange) onChange(updatedHtml);
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) {
    return <div className="admin-input" style={{ height: 200 }}>Loading editor...</div>;
  }

  return (
    <div className="admin-editor-wrapper" style={{ border: "1px solid var(--admin-border)", borderRadius: 6, overflow: "hidden" }}>
      {/* Editor Toolbar */}
      <div className="admin-editor-toolbar" style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 8, background: "#fafafa", borderBottom: "1px solid var(--admin-border)" }}>
        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("heading", { level: 1 }) ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("heading", { level: 3 }) ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div style={{ width: 1, background: "#dcdcde", margin: "0 4px" }} />

        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("bold") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("italic") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <div style={{ width: 1, background: "#dcdcde", margin: "0 4px" }} />

        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("bulletList") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("orderedList") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("blockquote") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        <div style={{ width: 1, background: "#dcdcde", margin: "0 4px" }} />

        <button
          type="button"
          className={`admin-btn-icon ${editor.isActive("link") ? "active" : ""}`}
          onClick={setLink}
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          className="admin-btn-icon"
          onClick={() => setMediaPickerOpen(true)}
          title="Insert Image from Media Library"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          className="admin-btn-icon"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"
        >
          <TableIcon size={16} />
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button
            type="button"
            className={`admin-btn admin-btn-secondary ${isHtmlMode ? "active" : ""}`}
            style={{ padding: "4px 8px", fontSize: 12 }}
            onClick={toggleHtmlMode}
            title="Toggle Raw HTML Mode"
          >
            <Code2 size={14} />
            <span>{isHtmlMode ? "Visual View" : "Raw HTML"}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Surface */}
      {isHtmlMode ? (
        <textarea
          value={htmlValue}
          onChange={handleHtmlTextareaChange}
          rows={14}
          className="admin-textarea"
          style={{ border: "none", fontFamily: "monospace", fontSize: 13, padding: 16 }}
        />
      ) : (
        <div style={{ padding: 16, minHeight: 280, background: "#fff" }}>
          <EditorContent editor={editor} />
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        title="Insert Image into Post"
      />
    </div>
  );
}
