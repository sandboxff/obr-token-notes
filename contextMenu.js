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
    onClick() {},
  });
}