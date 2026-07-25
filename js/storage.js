const STORAGE_KEY = "ai_notes";

function getNotes() {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
}

function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function addNote(note) {

    const notes = getNotes();

    note.pinned = note.pinned ?? false;
    note.favorite = note.favorite ?? false;
    note.color = note.color ?? "#FFFFFF";
    note.label = note.label ?? "Personal";

    notes.unshift(note);

    saveNotes(notes);

}

function deleteNote(index) {
    const notes = getNotes();
    notes.splice(index, 1);
    saveNotes(notes);
}

function updateNote(index, note) {
    const notes = getNotes();
    notes[index] = note;
    saveNotes(notes);
}

function getNoteById(id) {

    const notes = getNotes();

    return notes.find(note => note.id == id);

}

function togglePin(id) {

    const notes = getNotes();

    const index = notes.findIndex(note => note.id == id);

    if (index === -1) return;

    notes[index].pinned = !notes[index].pinned;

    saveNotes(notes);

}

function toggleFavorite(id) {

    const notes = getNotes();

    const index = notes.findIndex(note => note.id == id);

    if (index === -1) return;

    notes[index].favorite = !notes[index].favorite;

    saveNotes(notes);

}

function changeColor(id, color) {

    const notes = getNotes();

    const index = notes.findIndex(note => note.id == id);

    if (index == -1) return;

    notes[index].color = color;

    saveNotes(notes);

}