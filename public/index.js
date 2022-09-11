document.addEventListener('DOMContentLoaded', event => {
  renderNotes();
  document.addEventListener('click', handleClicks)
});

function handleClicks() {
  event.preventDefault();
  let input = document.getElementById('newNote');
  let clicked = event.target;

  if (clicked.className === "deleteButton") {
    deleteNote(clicked.parentNode);
  } else if (clicked.id === "submitbutton") {
    addNewNote(input.value);
  }
}

function deleteNote(node) {
  let id = node.getAttribute('data-id');
  fetch(`http://localhost:3000/note/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) {
      renderNotes()
    }
  });
}

function addNewNote(newNoteContent) {
  fetch('http://localhost:3000/note', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({note: newNoteContent}),
  })
  .then(response => {
    if (response.ok) {
      renderNotes()
      document.getElementById('noteform').reset();
    }
  });
}

function renderNotes() {
  let list = document.getElementById('notes');

  fetch('http://localhost:3000/notes', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
    }
  })
    .then(response => response.json())
    .then(data => {
      list.innerHTML = '';
      data.notes.forEach(obj => {
        addNoteToList(obj, list);
      });
    })
    .catch(err => console.log('ERROR:: ' + err));
}

function addNoteToList(data, list) {
  let listItem = document.createElement('li');
  let noteContent = document.createTextNode(data['note']);
  let buttonName = document.createTextNode('DELETE');
  let deleteButton = document.createElement('button');

  deleteButton.setAttribute('class', 'deleteButton');
  deleteButton.setAttribute('type', 'button');
  deleteButton.appendChild(buttonName);

  listItem.setAttribute('data-id', data['id'])
  listItem.appendChild(noteContent);
  listItem.appendChild(deleteButton);
  list.appendChild(listItem);
}