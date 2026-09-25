const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");

async function loadNotes() {
    try {
        const response = await fetch("/notes");
        const notes = await response.json();

        displayNotes(notes);
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

function displayNotes(notes) {
    notesContainer.innerHTML = "";

    if (notes.length === 0) {
        notesContainer.innerHTML =
            '<p class="empty-message">No notes yet.</p>';
        return;
    }

    notes.forEach(note => {
        const noteElement = document.createElement("div");
        noteElement.className = "note";

        noteElement.innerHTML = `
            <div class="note-text">${escapeHTML(note.text)}</div>
            <button class="delete-btn" onclick="deleteNote('${note.id}')">
                Delete
            </button>
        `;

        notesContainer.appendChild(noteElement);
    });
}

async function addNote() {
    const text = noteInput.value.trim();

    if (!text) {
        alert("Please write a note first.");
        return;
    }

    try {
        const response = await fetch("/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            throw new Error("Failed to add note");
        }

        noteInput.value = "";
        loadNotes();
    } catch (error) {
        console.error("Error adding note:", error);
    }
}

async function deleteNote(id) {
    try {
        const response = await fetch(`/notes/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete note");
        }

        loadNotes();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

addNoteBtn.addEventListener("click", addNote);

loadNotes();
