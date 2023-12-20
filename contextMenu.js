import OBR from "@owlbear-rodeo/sdk"

const ID = "localhost";
const editorElement = document.getElementById("editor")
const currentNote = document.getElementById("current-note")

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
        getNote(context.items[0].id)
        currentNote.value = context.items[0].id
      }
    },
  });
}

const getNote = (id) => {
  fetch('http://localhost:3001/' + id, {
    method: 'GET'
  })
  .then((res) => res.text())
  .then((res) => {
    editorElement.value = res
  })
  .catch((err) => {
    console.error(err)
  })
}

const saveNote = () => {
  if (currentNote.value != "") {
    fetch('http://localhost:3001/', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({id: currentNote.value, content: editorElement.value})
    })
    .then((res) => res.text())
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
  }
} 

addEventListener("trix-blur", (e) => {
  saveNote();
})