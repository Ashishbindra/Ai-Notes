function shareNote(noteId){

    const note = getNoteById(noteId);

    if(!note) return;

    const text =
`${note.title}

${note.content}`;

    if(navigator.share){

        navigator.share({

            title:note.title,

            text:text

        });

    }else{

        navigator.clipboard.writeText(text);

        alert("Note copied to clipboard.");

    }

}   