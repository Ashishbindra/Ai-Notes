// ==========================================
// AI NOTES
// editor.js
// Part 1
// ==========================================

// Elements

const backBtn = document.getElementById("backBtn");
const saveBtn = document.getElementById("saveBtn");
const attachmentBtn = document.getElementById("attachmentBtn");
const title = document.getElementById("title");
const content = document.getElementById("content");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const imageViewer = document.getElementById("imageViewer");
const viewerImage = document.getElementById("viewerImage");
const closeViewer = document.getElementById("closeViewer");
const aiSheet = document.getElementById("aiSheet");
const closeAiSheet = document.getElementById("closeAiSheet");
const aiChatBtn = document.getElementById("aiChatBtn");
const aiChatModal = document.getElementById("aiChatModal");
const closeAiChat = document.getElementById("closeAiChat");
const aiMessages = document.getElementById("aiMessages");
const aiQuestion = document.getElementById("aiQuestion");
const sendAi = document.getElementById("sendAi");

// Variables
let lastQuestion = "";
let isSending = false;
let selectedImage = "";
let selectedColor = "#FFFFFF";
let selectedLabel = "Personal";
let editingId = null;
let autoSaveTimer = null;

// ==========================================
// Page Load
// ==========================================

window.onload = () => {

    loadNote();

};

// ==========================================
// Load Note / Draft
// ==========================================

function loadNote() {

    const id = localStorage.getItem("edit_note_id");

    // ==========================
    // Edit Mode
    // ==========================
    if (id) {

        const note = getNoteById(Number(id));

        if (!note) return;

        editingId = note.id;

        title.value = note.title || "";
        content.value = note.content || "";

        // Label
        selectedLabel = note.label || "Personal";
        selectChip(selectedLabel);

        // Color
        selectedColor = note.color || "#FFFFFF";

        const editor = document.querySelector(".editor");
        if (editor) {
            editor.style.background = selectedColor;
        }

        // Image
        selectedImage = note.image || "";

        if (selectedImage) {

            previewImage.src = selectedImage;
            previewImage.style.display = "block";
            previewImage.hidden = false;

        } else {

            previewImage.src = "";
            previewImage.style.display = "none";
            previewImage.hidden = true;

        }

        updateCounter();

        return;
    }

    // ==========================
    // New Note (Draft)
    // ==========================

    const draft = JSON.parse(
        localStorage.getItem("draft_note")
    );

    if (draft) {

        title.value = draft.title || "";
        content.value = draft.content || "";

        selectedLabel = draft.label || "Personal";

        selectedColor = draft.color || "#FFFFFF";

        selectedImage = draft.image || "";

    } else {

        selectedLabel = "Personal";
        selectedColor = "#FFFFFF";
        selectedImage = "";

    }

    selectChip(selectedLabel);

    const editor = document.querySelector(".editor");

    if (editor) {
        editor.style.background = selectedColor;
    }

    if (selectedImage) {

        previewImage.src = selectedImage;
        previewImage.style.display = "block";
        previewImage.hidden = false;

    } else {

        previewImage.src = "";
        previewImage.style.display = "none";
        previewImage.hidden = true;

    }

    updateCounter();
}

// ==========================================
// Back
// ==========================================

backBtn.addEventListener("click", () => {

    localStorage.removeItem("edit_note_id");

    window.location.href = "index.html";

});

// ==========================================
// Save
// ==========================================

saveBtn.addEventListener("click", saveNote);

function saveNote() {

    const noteTitle = title.value.trim();

    const noteContent = content.value.trim();

    const noteLabel = selectedLabel;

    if (noteTitle === "" && noteContent === "") {

        alert("Please write something.");

        return;

    }

    // Edit
    if (editingId) {

        const notes = getNotes();

        const index = notes.findIndex(

            note => note.id === editingId

        );

        if (index !== -1) {

            notes[index].title = noteTitle;

            notes[index].content = noteContent;

            notes[index].label = noteLabel;

            notes[index].color = selectedColor;

            if (selectedImage) {
                notes[index].image = selectedImage;
            }

            notes[index].updatedAt =
                new Date().toLocaleString();

            saveNotes(notes);

        }

    }

    // New
    else {

        addNote({

            id: Date.now(),

            title: noteTitle,

            content: noteContent,

            label: noteLabel,

            color: selectedColor,

            image: selectedImage,

            pinned: false,

            favorite: false,

            createdAt: new Date().toLocaleString(),

            updatedAt: new Date().toLocaleString()

        });

    }

    localStorage.removeItem("draft_note");

    localStorage.removeItem("edit_note_id");

    window.location.href = "index.html";

}

// ==========================================
// Auto Save Draft
// ==========================================

title.addEventListener("input", autoSave);

content.addEventListener("input", autoSave);

function autoSave() {

    if (editingId) return;

    clearTimeout(autoSaveTimer);

    autoSaveTimer = setTimeout(() => {

        localStorage.setItem(

            "draft_note",

            JSON.stringify({

                title: title.value,

                content: content.value,

                label: selectedLabel,

                color: selectedColor,

                image: selectedImage
            })

        );

    }, 500);

}

// ==========================================
// AI NOTES
// editor.js
// Part 2
// Theme + AI + Counter + Save Status
// ==========================================

// Elements

const themeBtn = document.querySelector(".theme-btn");
const aiBtn = document.getElementById("aiBtn");
const aiMenu = document.getElementById("aiMenu");

const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const saveStatus = document.getElementById("saveStatus");


// ==========================================
// Theme
// ==========================================

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        toggleTheme();

    });

}


// ==========================================
// AI Menu
// ==========================================

if (aiBtn && aiMenu) {

    aiBtn.addEventListener("click", () => {

        aiMenu.classList.toggle("show");

    });

    document.querySelectorAll(".ai-item").forEach(item => {

        item.addEventListener("click", () => {

            alert(item.dataset.action + " feature coming soon.");

            aiMenu.classList.remove("show");

        });

    });

}


// ==========================================
// Word Counter
// ==========================================

function updateCounter() {

    if (!wordCount || !charCount) return;

    const text = content.value.trim();

    const words =
        text === ""
            ? 0
            : text.split(/\s+/).length;

    wordCount.innerText =
        "Words : " + words;

    charCount.innerText =
        "Characters : " + text.length;

}

title.addEventListener("input", updateCounter);
content.addEventListener("input", updateCounter);


// ==========================================
// Save Status
// ==========================================

function showSaving() {

    if (!saveStatus) return;

    saveStatus.innerText = "Saving...";

    saveStatus.style.color = "#FF9800";

}

function showSaved() {

    if (!saveStatus) return;

    saveStatus.innerText = "Saved";

    saveStatus.style.color = "#4CAF50";

}


// ==========================================
// Improve Auto Save
// ==========================================

const oldAutoSave = autoSave;

autoSave = function () {

    if (editingId) return;

    showSaving();

    clearTimeout(autoSaveTimer);

    autoSaveTimer = setTimeout(() => {

        localStorage.setItem(

            "draft_note",

            JSON.stringify({

                title: title.value,

                content: content.value

            })

        );

        showSaved();

    }, 500);

};


// ==========================================
// Initial Counter
// ==========================================

updateCounter();

// ==========================================
// AI NOTES
// editor.js
// Part 3
// ==========================================


// ==========================================
// Keyboard Shortcuts
// ==========================================

document.addEventListener("keydown", (e) => {

    // Ctrl + S

    if (e.ctrlKey && e.key === "s") {

        e.preventDefault();

        saveNote();

    }

    // ESC

    if (e.key === "Escape") {

        window.location.href = "index.html";

    }

});


// ==========================================
// Last Edited
// ==========================================

function updateEditedTime() {

    const time = document.getElementById("lastEdited");

    if (!time) return;

    time.innerHTML =

        "Last Edited : "

        +

        new Date().toLocaleString();

}


// ==========================================
// Save Hook
// ==========================================

const oldSave = saveNote;

saveNote = function () {

    oldSave();

    updateEditedTime();

};


// ==========================================
// Favorite
// ==========================================

const favoriteBtn = document.getElementById("favoriteBtn");

if (favoriteBtn) {

    favoriteBtn.onclick = () => {

        favoriteBtn.classList.toggle("active");

    };

}


// ==========================================
// Pin
// ==========================================

const pinBtn = document.getElementById("pinBtn");

if (pinBtn) {

    pinBtn.onclick = () => {

        pinBtn.classList.toggle("active");

    };

}


// ==========================================
// Auto Focus
// ==========================================

title.focus();


// ==========================================
// Initial
// ==========================================

updateEditedTime();

document.getElementById("colorBtn").onclick = () => {

    alert("Color Picker - Coming Soon");

};

document.getElementById("voiceBtn").onclick = () => {

    alert("Voice Note - Coming Soon");

};

const colorBtn = document.getElementById("colorBtn");
const colorPicker = document.getElementById("colorPicker");

colorBtn.onclick = () => {

    colorPicker.classList.toggle("show");

};

document.querySelectorAll(".color-item").forEach(item => {

    item.onclick = () => {

        selectedColor = item.dataset.color;

        document.querySelector(".editor").style.background = selectedColor;

    };

});

attachmentBtn.onclick = () => {

    imageInput.click();

};

imageInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        selectedImage = reader.result;

        previewImage.src = selectedImage;

        previewImage.style.display = "block";

        previewImage.hidden = false;

    };

    reader.readAsDataURL(file);

});

function selectChip(label) {

    selectedLabel = label;

    document.querySelectorAll(".label-chip").forEach(chip => {

        chip.classList.remove("active");

        if (chip.dataset.label === label) {
            chip.classList.add("active");
        }

    });

}

document.querySelectorAll(".label-chip").forEach(chip => {

    chip.addEventListener("click", () => {

        selectChip(chip.dataset.label);

    });

});

previewImage.onclick = function () {

    if (!selectedImage) return;

    viewerImage.src = selectedImage;

    imageViewer.classList.add("show");

};

closeViewer.onclick = function () {

    imageViewer.classList.remove("show");

};

imageViewer.onclick = function (e) {

    if (e.target === imageViewer) {

        imageViewer.classList.remove("show");

    }

};

// ==========================================
// Voice To Text
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "hi-IN";

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.onstart = () => {

        voiceBtn.classList.add("recording");

    };

    recognition.onresult = (event) => {

        let text = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {

            text += event.results[i][0].transcript;

        }

        content.value += text + " ";

        updateCounter();

        autoSave();

    };

    recognition.onend = () => {

        voiceBtn.classList.remove("recording");

    };

    recognition.onerror = (event) => {

        console.log("Speech Error:", event.error);

        alert("Voice Error : " + event.error);

        voiceBtn.classList.remove("recording");

    };

}

voiceBtn.onclick = () => {

    if (!recognition) {

        alert("Speech Recognition Supported नहीं है।");

        return;

    }

    recognition.start();

};

aiBtn.onclick = () => {

    aiSheet.classList.add("show");

};

closeAiSheet.onclick = () => {

    aiSheet.classList.remove("show");

};

document.querySelectorAll(".ai-action").forEach(btn => {

    btn.onclick = async () => {

        const action = btn.dataset.action;

        let result = "";

        switch (action) {

            case "summarize":

                result = await AI.summarize(content.value);

                break;

            case "rewrite":

                result = await AI.rewrite(content.value);

                break;

            case "translate":

                result = await AI.translate(content.value);

                break;

            case "grammar":

                result = await AI.grammar(content.value);

                break;

            case "continue":

                result = await AI.continueWriting(content.value);

                break;

        }

        if (result) {

            content.value = result;

            updateCounter();

            autoSave();

        }

        aiSheet.classList.remove("show");

    };

});

aiChatBtn.onclick = () => {

    aiChatModal.classList.add("show");

}


closeAiChat.onclick = () => {

    aiChatModal.classList.remove("show");

}

// ==============================
// Enter to Send
// ==============================
aiQuestion.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        if (!isSending) {
            sendAi.click();
        }

    }

});
// ==========================================
// Send AI Message
// ==========================================

sendAi.onclick = async () => {

    const question = aiQuestion.value.trim();
    if (isSending) return;
    isSending = true;
    lastQuestion = question;

    if (!question) return;
    // User Message
    aiMessages.innerHTML += `
        <div class="user-message">
            <div class="user-msg">
                ${question}
            </div>
        </div>
    `;

    aiQuestion.value = "";

    aiMessages.scrollTop = aiMessages.scrollHeight;

    // Loading Bubble
    const loadingId = "loading-" + Date.now();
    const typingId = "typing-" + Date.now();

    aiMessages.innerHTML += `
        <div class="ai-message" id="${loadingId}">

            <div class="avatar">
                <span class="material-icons">smart_toy</span>
            </div>

            <div class="ai-msg">

                <div id="${typingId}" class="typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>
    `;

    aiMessages.scrollTop = aiMessages.scrollHeight;
    try {

        const reply = await AI.ask(
            question,
            content.value
        );

        const typingBox = document.getElementById(typingId);

        typingBox.classList.remove("typing");
        typingBox.innerHTML = "";

        await typeWriter(typingBox, reply);

        typingBox.insertAdjacentHTML("afterend", `
        <div class="ai-footer">

            <span class="ai-time">
                ${new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })}
            </span>

            <div class="ai-tools">

                <button class="copy-btn" title="Copy">
                    <span class="material-icons">content_copy</span>
                </button>

                <button class="regen-btn" title="Regenerate">
                    <span class="material-icons">refresh</span>
                </button>

            </div>

        </div>
    `);

    } catch (err) {
        const typingBox = document.getElementById(typingId);
        isSending = false;
        typingBox.classList.remove("typing");

        typingBox.innerHTML = `
        <span style="color:#e53935;">
            ${err.message || "Something went wrong."}
        </span>
    `;

    } finally {

        isSending = false;

        aiQuestion.focus();

        aiMessages.scrollTop = aiMessages.scrollHeight;

    }

};

async function typeWriter(element, text) {

    element.innerHTML = "";

    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {

        element.innerHTML += words[i] + " ";

        aiMessages.scrollTop = aiMessages.scrollHeight;

        await new Promise(resolve => setTimeout(resolve, 35));

    }

}

document.addEventListener("click", async (e) => {

    const btn = e.target.closest(".copy-btn");

    if (!btn) return;

    const text = btn.closest(".ai-msg").querySelector("div").innerText;

    await navigator.clipboard.writeText(text);

    btn.innerHTML = `
        <span class="material-icons">done</span>
    `;

    setTimeout(() => {

        btn.innerHTML = `
            <span class="material-icons">content_copy</span>
        `;

    }, 1500);

});

document.addEventListener("click", (e) => {

    const btn = e.target.closest(".regen-btn");

    if (!btn) return;

    if (!lastQuestion) return;

    aiQuestion.value = lastQuestion;

    sendAi.click();

});
