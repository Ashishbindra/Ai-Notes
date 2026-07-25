const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNote");
const searchInput = document.getElementById("searchInput");
const menuBtn = document.querySelector(".menu-btn");
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const themeBtn = document.querySelector(".theme-btn");
const clearSearch = document.getElementById("clearSearch");
const popupMenu = document.getElementById("popupMenu");
const dialogOverlay = document.getElementById("dialogOverlay");

let deleteId = null;
let selectedNote = null;
let currentView = localStorage.getItem("view") || "grid";
function applyView() {

    if (currentView === "list") {

        notesContainer.classList.add("list");

    } else {

        notesContainer.classList.remove("list");

    }

}
applyView();
let currentFilter = "all";
// ==============================
// Load Notes
// ==============================

loadNotes();

function loadNotes(search = "") {

    let notes = getNotes();

    if (currentFilter === "favorite") {

        notes = notes.filter(note => note.favorite);

    }

    if (currentFilter === "pinned") {

        notes = notes.filter(note => note.pinned);

    }
    // Pinned Notes First
    notes.sort((a, b) => b.pinned - a.pinned);

    // Search
    notes = notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    );

    // Empty State
    if (notes.length === 0) {

        notesContainer.innerHTML = `
            <div class="empty">
                <span class="material-icons" style="font-size:70px;">
                    description
                </span>

                <h2>No Notes Found</h2>

                <p>Create your first note</p>
            </div>
        `;

        return;
    }

    notesContainer.innerHTML = "";

    notes.forEach(note => {

        notesContainer.innerHTML += `

    <div class="note-card fade-in" style="background:${note.color || '#FFFFFF'};">

        <div class="note-header">

            <span class="note-label">
                ${note.label}
            </span>

            <div class="note-status">

                ${note.favorite ? '<span class="material-icons star-icon">star</span>' : ''}

                ${note.pinned ? '<span class="material-icons pin-icon">push_pin</span>' : ''}

            </div>

        </div>

        <div class="note-body" onclick="openNote(${note.id})">

            ${note.image ? `
                <img
                    class="note-image-preview"
                    src="${note.image}">
            ` : ""}

            <h3>${note.title || "Untitled"}</h3>

            <p>${note.content}</p>

        </div>

        <div class="note-footer">

            <small>

                ${note.updatedAt || note.createdAt}

            </small>

            <div class="note-actions">

                 <button
                    class="favorite-btn ${note.favorite ? "active" : ""}"
                    onclick="favoriteNote(event,${note.id})">

                    <span class="material-icons">star</span>

                </button>

                <button
                    class="pin-btn ${note.pinned ? "active" : ""}"
                    onclick="pinNote(event,${note.id})">

                    <span class="material-icons">push_pin</span>

                </button>

                <button
                    class="more-btn"
                    onclick="openMenu(event,${note.id})">

                    <span class="material-icons">
                        more_vert
                    </span>

                </button>
            </div>

        </div>

    </div>

    `;

    });

}

// ==============================
// Open Note
// ==============================

function openNote(id) {

    localStorage.setItem("edit_note_id", id);

    window.location.href = "editor.html";

}

// ==============================
// Delete
// ==============================

function removeNote(event, id) {

    event.stopPropagation();

    deleteId = id;

    dialogOverlay.classList.add("show");

}

// ==============================
// Pin
// ==============================

function pinNote(event, id) {

    event.stopPropagation();

    togglePin(id);

    loadNotes(searchInput.value);

}

// ==============================
// Search
// ==============================

searchInput.addEventListener("input", () => {

    loadNotes(searchInput.value);

});

// ==============================
// Add Note
// ==============================

addNoteBtn.addEventListener("click", () => {

    localStorage.removeItem("edit_note_id");

    window.location.href = "editor.html";

});

function favoriteNote(event, id) {

    event.stopPropagation();

    toggleFavorite(id);

    loadNotes(searchInput.value);

}

menuBtn.onclick = () => {

    drawer.classList.add("show");
    drawerOverlay.classList.add("show");

};

drawerOverlay.onclick = () => {

    drawer.classList.remove("show");
    drawerOverlay.classList.remove("show");

};

document.getElementById("allNotes").onclick = () => {

    currentFilter = "all";

    loadNotes(searchInput.value);

    drawer.classList.remove("show");
    drawerOverlay.classList.remove("show");

};

document.getElementById("favoriteNotes").onclick = () => {

    currentFilter = "favorite";

    loadNotes(searchInput.value);

    drawer.classList.remove("show");
    drawerOverlay.classList.remove("show");

};

document.getElementById("pinnedNotes").onclick = () => {

    currentFilter = "pinned";

    loadNotes(searchInput.value);

    drawer.classList.remove("show");
    drawerOverlay.classList.remove("show");

};

themeBtn.onclick = () => {

    toggleTheme();

};

document.getElementById("exportNotes").onclick = () => {

    const notes = getNotes();

    if (notes.length === 0) {

        alert("No notes available.");
        return;

    }

    const data = JSON.stringify(notes, null, 2);

    const blob = new Blob([data], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "AI-Notes-Backup.json";

    a.click();

    URL.revokeObjectURL(url);

};

const importFile = document.getElementById("importFile");

document.getElementById("importNotes").onclick = () => {

    importFile.click();

};

importFile.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        try {

            const notes = JSON.parse(reader.result);

            if (!Array.isArray(notes)) {

                alert("Invalid Backup File");

                return;

            }

            saveNotes(notes);

            loadNotes();

            alert("Notes Imported Successfully");

        } catch (err) {

            alert("Invalid JSON File");

        }

    };

    reader.readAsText(file);

});

clearSearch.onclick = () => {

    searchInput.value = "";

    loadNotes();

    searchInput.focus();

};

function openMenu(event, id) {

    event.stopPropagation();

    selectedNote = id;

    const menu = document.getElementById("popupMenu");

    menu.classList.add("show");

    const rect = event.currentTarget.getBoundingClientRect();

    let left = rect.right - 220;
    let top = rect.bottom + 8;

    // Right overflow
    if (left < 10) left = 10;

    // Bottom overflow
    if (top + menu.offsetHeight > window.innerHeight) {
        top = rect.top - menu.offsetHeight - 8;
    }

    menu.style.left = left + "px";
    menu.style.top = top + "px";
}

document.addEventListener("click", () => {

    popupMenu.classList.remove("show");

});

popupMenu.addEventListener("click", (e) => {

    e.stopPropagation();

});

document.getElementById("cancelDelete").onclick = () => {

    dialogOverlay.classList.remove("show");

};

document.getElementById("confirmDelete").onclick = () => {

    const notes = getNotes().filter(note => note.id != deleteId);

    saveNotes(notes);

    loadNotes(searchInput.value);

    dialogOverlay.classList.remove("show");

};

document.getElementById("deleteAction").onclick = () => {

    popupMenu.classList.remove("show");

    deleteId = selectedNote;

    dialogOverlay.classList.add("show");

};

document.getElementById("copyAction").onclick = async () => {

    popupMenu.classList.remove("show");

    const note = getNotes().find(n => n.id == selectedNote);

    if (!note) return;

    const text =
        `${note.title}

        ${note.content}`;

    await navigator.clipboard.writeText(text);

    alert("Note copied successfully.");

};


document.getElementById("shareAction").onclick = async () => {

    popupMenu.classList.remove("show");

    const note = getNotes().find(n => n.id == selectedNote);

    if (!note) return;

    const text =
        `${note.title}

        ${note.content}`;

    if (navigator.share) {

        try {

            await navigator.share({

                title: note.title,

                text: text

            });

        } catch (e) { }

    } else {

        await navigator.clipboard.writeText(text);

        alert("Sharing is not supported.\nNote copied instead.");

    }

};
