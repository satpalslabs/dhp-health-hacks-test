"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  CornerUpLeft,
  CornerUpRight,
  Plus,
  Image as ImageIcon,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileVideo,
  Quote,
  Code,
  Minus,
  ListTodo,
} from "lucide-react";
import { Toggle } from "./toggle";
import Link from "@tiptap/extension-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Form } from "./form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./input";
import { Button } from "./button";
import { useState } from "react";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlock from "@tiptap/extension-code-block";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Youtube from "@tiptap/extension-youtube";
import { BlockAlign } from "./block-align";
import Document from "@tiptap/extension-document";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";

const RichTextEditor = ({
  value = "",
  onChange,
}: {
  value: string;
  onChange: (value: string | null) => void;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] max-h-[150px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: "text-xl text-gray-700",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Write something …",
        emptyEditorClass: "is-editor-empty",
        showOnlyWhenEditable: false,
      }),
      Link.extend({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
      }),
      Image,
      Text,
      CodeBlock.configure({
        defaultLanguage: "js",
        HTMLAttributes: {
          class: "dark:!bg-[#1d202a] !bg-[#f4f7fa]",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"], // Ensure it applies to paragraph & headings
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Document,
      BlockAlign,
    ],
    content: value, // Set the initial content with the provided value
    onUpdate: ({ editor }) => {
      let content: string | null = editor.getHTML();
      const json = editor.getJSON().content;

      if (
        Array.isArray(json) &&
        json.length === 1 &&
        !json[0].hasOwnProperty("content")
      ) {
        content = null; // or any other default value
      }
      onChange(content); // Call the onChange callback with the updated HTML content
    },
  });

  return (
    <div className="flex flex-col gap-0 mb-3 border border-border rounded-lg [&_a]:underline  [&_a]:cursor-pointer">
      {editor ? <RichTextEditorToolbar editor={editor} /> : null}
      <EditorContent
        placeholder="Write content here"
        className="mt-0 [&_div]:border-none [&_div]:overflow-x-hidden  no-tailwind "
        editor={editor}
      />
    </div>
  );
};

const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className=" bg-transparent border-b flex justify-between p-2 font-inter">
      <div className=" flex flex-row items-center gap-1">
        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive({ BlockAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setBlockAlign("left").run()
          }
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive({ BlockAlign: "center" })}
          onPressedChange={() => {
            editor.chain().focus().setBlockAlign("center").run();
          }}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive({ BlockAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setBlockAlign("right").run()
          }
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Toggle
          className="p-[10px]"
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        {/* Set Link Button */}
        <LinkButton editor={editor} />
        {/* Unset Link Button */}
        <button
          type="button"
          className="p-[10px]"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink className="h-4 w-4" />
        </button>

        <Toggle
          className="p-[10px] text-button-filter-text"
          size="sm"
          pressed={editor.isActive("undo")}
          onPressedChange={() => editor.chain().focus().undo().run()}
        >
          <CornerUpLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          className="p-[10px] text-button-filter-text"
          size="sm"
          pressed={editor.isActive("redo")}
          onPressedChange={() => editor.chain().focus().redo().run()}
        >
          <CornerUpRight className="h-4 w-4" />
        </Toggle>
      </div>
      <InsertDropDown editor={editor} />
    </div>
  );
};

export default RichTextEditor;

const InsertDropDown = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Toggle
          className="p-[10px] font-normal font-inter"
          size="sm"
          pressed={editor.isActive("insert")}
          onPressedChange={() => editor.chain().focus().redo().run()}
        >
          <Plus className="h-4 w-4" /> Insert
        </Toggle>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <InsertContent editor={editor} />
        <Button
          className="p-0 h-8 px-2 hover:bg-accent w-full hover:shadow-none text-foreground font-normal justify-start bg-transparent"
          onClick={() => {
            editor.chain().focus().setHorizontalRule().run();
            setOpen(false);
          }}
        >
          <Minus />
          Horizontal Line
        </Button>
        <Button
          className="p-0 h-8 px-2 hover:bg-accent w-full hover:shadow-none text-foreground font-normal justify-start bg-transparent"
          onClick={() => {
            editor.chain().focus().toggleCodeBlock().run();
            setOpen(false);
          }}
        >
          <Code />
          Code block
        </Button>
        <Button
          className="p-0 h-8 px-2 hover:bg-accent w-full hover:shadow-none text-foreground font-normal justify-start bg-transparent"
          onClick={() => {
            editor.chain().focus().toggleTaskList().run();
            setOpen(false);
          }}
        >
          <ListTodo />
          Task List
        </Button>
        <InsertContent editor={editor} insert="youtube" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkButton = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    url: z
      .string({ message: "URL is required" })
      .url({ message: "Invalid URL" }),
    name: z.string().nonempty({ message: "Name is required Field" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      name: "",
    },
  });

  const handleDropdownOpenChange = (open: boolean) => {
    if (open) {
      const selectedText = editor.state.selection.empty
        ? ""
        : editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
          );

      form.setValue("name", selectedText);
      form.resetField("url");
    } else {
      setOpen(false);
      form.reset();
    }
  };

  const setLink = (url: string, name?: string) => {
    if (!url) return; // Exit if URL is empty

    const selectedText = editor.state.selection.empty
      ? null
      : editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        );

    const linkText = selectedText || name || url; // Use selected text, then input name, then fallback to URL

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .insertContent(`<a href="${url}" target="_blank">${linkText}</a>`)
      .run();
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`p-[10px] rounded-md ${
            editor.isActive("link") || open ? "bg-accent" : "bg-transparent"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            const selectedText = editor.state.selection.empty
              ? ""
              : editor.state.doc.textBetween(
                  editor.state.selection.from,
                  editor.state.selection.to
                );
            form.setValue("name", selectedText); // Prefill name if text is selected
            setOpen(true);
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[380px] p-4 " side="top">
        <Form {...form}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <FormFieldWrapper
                control={form.control}
                name="name"
                label="Name"
                required={false}
                tooltip="Text to display for the link"
                className="min-h-0"
                placeholder="Write Name here"
                component={Input}
              />
              <FormFieldWrapper
                control={form.control}
                name="url"
                label="URL"
                required
                tooltip="Enter full URL including https://"
                className="min-h-0"
                placeholder="Write URL here"
                component={Input}
              />
            </div>
            <div className="w-full flex justify-between items-center font-inter">
              <div
                className="px-3 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Cancel
              </div>
              <Button
                className="px-[13px] bg-foreground dark:text-black"
                disabled={!form.formState.isValid}
                onClick={(e) => {
                  e.preventDefault(); // Prevent outer form submission

                  const url = form.getValues("url");
                  const name = form.getValues("name") || ""; // Allow empty name

                  setLink(url, name);
                  setOpen(false);
                }}
              >
                Add Link
              </Button>
            </div>
          </div>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const InsertContent = ({
  editor,
  insert = "image",
}: {
  editor: Editor;
  insert?: "youtube" | "image";
}) => {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    url: z
      .string({ message: "URL is required" })
      .url({ message: "Invalid URL" }),
    alt:
      insert == "image"
        ? z.string().nonempty({ message: "Alt text is required Field" })
        : z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      alt: "",
    },
  });

  const handleDropdownOpenChange = (open: boolean) => {
    if (open) {
      const selectedText = editor.state.selection.empty
        ? ""
        : editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
          );

      form.setValue("alt", selectedText);
      form.resetField("url");
    } else {
      setOpen(false);
      form.reset();
    }
  };

  const setLink = (url: string, name?: string) => {
    if (!url) return; // Exit if URL is empty
    if (insert == "image") {
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: name, title: name })
        .run();
    } else {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          className="p-0 h-8 px-2 hover:bg-accent w-full hover:shadow-none text-foreground font-normal justify-start bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {insert == "image" ? <ImageIcon /> : <FileVideo />}
          Insert {insert == "image" ? "Image" : "YouTube Video"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[380px] p-4 " side="top">
        <Form {...form}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <FormFieldWrapper
                control={form.control}
                name="url"
                label="URL"
                required
                tooltip="Enter full URL including https://"
                className="min-h-0"
                placeholder={
                  insert == "image"
                    ? "https://www.example.com/images/abc.jpg"
                    : "https://www.youtube.com/watch?v=abcd.."
                }
                component={Input}
              />
              {insert == "image" && (
                <FormFieldWrapper
                  control={form.control}
                  name="alt"
                  label="Alt"
                  required={false}
                  tooltip="Alt text for the Image"
                  className="min-h-0"
                  placeholder="Write Alt Text"
                  component={Input}
                />
              )}
            </div>
            <div className="w-full flex justify-between items-center font-inter">
              <div
                className="px-3 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Cancel
              </div>
              <Button
                className="px-[13px] bg-foreground dark:text-black"
                disabled={!form.formState.isValid}
                onClick={(e) => {
                  e.preventDefault(); // Prevent outer form submission

                  const url = form.getValues("url");
                  const name = form.getValues("alt") || ""; // Allow empty name

                  setLink(url, name);
                  setOpen(false);
                }}
              >
                Insert {insert == "image" ? "Image" : "YouTube Video"}
              </Button>
            </div>
          </div>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
