import OBR from "@owlbear-rodeo/sdk"
import Trix from 'trix'

const ID = "localhost";
const editorElement = document.getElementById("editor")
const currentNote = document.getElementById("current-note")
let deletionFlag = true

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
  deletionFlag = false
  fetch('http://localhost:3001/' + id, {
    method: 'GET'
  })
  .then((res) => res.text())
  .then((res) => {
    editorElement.value = res
    deletionFlag = true
    fetch('http://localhost:3001/attachment/' + id, {method: 'GET'})
    .then((res) => {return res.json()} )
    .then((res) => {
      console.log(res);
      res.attachments.forEach(element => {
        console.log(element)
        const mimeType = 'image/jpeg'
        editorElement.editor.insertAttachment(new Trix.Attachment({content:`<img src="data:${mimeType};base64,${element}" />`}))
      });
    })
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

addEventListener("trix-attachment-add", (e) => {
  if (e.attachment.file && currentNote.value != "") {
    const blob = new Blob([e.attachment.file])
    const filename = String(Date.now()) + '.' + e.attachment.file.type.split('/')[1]
    const formData = new FormData();
    console.log(filename);
    console.log(e.attachment.file.size)
    formData.append('id', currentNote.value)
    formData.append('file', blob, filename)
    console.log(formData);
    fetch('http://localhost:3001/attachment', {
      method: 'POST',
      body: formData
    });
  }
})

addEventListener("trix-initialize", function(e) {
  var buttonHTML, buttonGroup
  buttonHTML  = `<button type="button" data-trix-attribute="del" id="deleteAttachmentButton">DEL</button>`
	buttonGroup = e.target.toolbarElement.querySelector(".trix-button-group--file-tools")
  buttonGroup.insertAdjacentHTML("beforeend", buttonHTML)
  deleteAttachmentButton = document.getElementById("deleteAttachmentButton")
  deleteAttachmentButton.addEventListener('click', () => {
    if (currentNote.value != "") {
      fetch('http://localhost:3001/attachment', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({id: currentNote.value})
      });
      getNote(currentNote.value)
    }
  })
  
})


