import OBR from "@owlbear-rodeo/sdk";

const ID = "localhost";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: "/note.svg",
        label: "Token notes",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      console.log(1);
      if (context.items.length == 1) {
        const editorElement = document.getElementById("editor")
        document.getElementById("current-note").value = context.items[0].id
        editorElement.editor.insertString(context.items[0].id)
      }
    },
  });
}