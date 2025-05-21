import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    blockAlign: {
      /**
       * Align selected block-level elements (image, video, etc.)
       * @param alignment - 'left' | 'center' | 'right'
       */
      setBlockAlign: (alignment: "left" | "center" | "right") => ReturnType;
    };
  }
}

export const BlockAlign = Extension.create({
  name: "blockAlign",

  addGlobalAttributes() {
    return [
      {
        types: ["image", "doc", "video", "paragraph"], // ✅ Ensure all block-level elements are covered
        attributes: {
          "data-align": {
            default: "left",
            parseHTML: (element) => element.getAttribute("data-align") || "left",
            renderHTML: (attributes) => {
              return { "data-align": attributes["data-align"] };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBlockAlign:
        (alignment) =>
          ({ chain, editor }) => {
            const { state } = editor;
            const { selection } = state;
            const pos = selection.anchor; // Get the exact position of the cursor
            const nodePOs = state.doc.nodeAt(pos);
            if (nodePOs && ["image", "youtube", "paragraph"].includes(nodePOs.type.name)) {
              return chain().updateAttributes(nodePOs.type.name, { "data-align": alignment }).run();
            }

            return chain().updateAttributes("paragraph", { "data-align": alignment }).run();
          },
    };
  },
});

