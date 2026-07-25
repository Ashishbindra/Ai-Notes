const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const emojiGrid = document.getElementById("emojiGrid");

const emojis = [
"😀","😁","😂","🤣","😊","😍","🥰","😘",
"😎","🤩","🤔","😭","😡","👍","👏","🙏",
"❤️","💙","💚","💛","🔥","⭐","🎉","🎂",
"🎁","📚","📝","💻","📱","🎵","🍕","☕",
"🌹","🌞","🌙","⚽","🏆","🚀","🎯","💡"
];

// Emoji Load
emojis.forEach(emoji => {

    const item = document.createElement("span");

    item.className = "emoji-item";

    item.textContent = emoji;

    item.onclick = () => {

        const start = content.selectionStart;
        const end = content.selectionEnd;

        content.setRangeText(
            emoji,
            start,
            end,
            "end"
        );

        content.focus();

        emojiPicker.style.display = "none";

    };

    emojiGrid.appendChild(item);

});

// Open / Close
emojiBtn.onclick = () => {

    emojiPicker.style.display =
        emojiPicker.style.display === "grid"
            ? "none"
            : "grid";

};

// Click Outside Close
document.addEventListener("click",(e)=>{

    if(
        !emojiPicker.contains(e.target) &&
        !emojiBtn.contains(e.target)
    ){
        emojiPicker.style.display="none";
    }

});