// =============================
// OpenRouter AI
// =============================

const OPENROUTER_API_KEY = "";

const OPENROUTER_URL =
"https://openrouter.ai/api/v1/chat/completions";

async function askAI(prompt){

    try{

        const response = await fetch(OPENROUTER_URL,{

            method:"POST",

            headers:{

                "Authorization":"Bearer " + OPENROUTER_API_KEY,

                "Content-Type":"application/json",

                "HTTP-Referer":window.location.origin,

                "X-Title":"AI Notes"

            },

            body:JSON.stringify({

                model:"openrouter/free",

                messages:[

                    {

                        role:"user",

                        content:prompt

                    }

                ]

            })

        });

        const data = await response.json();

        if(data.error){

            throw new Error(data.error.message);

        }

        return data.choices[0].message.content;

    }

    catch(e){

        console.error(e);

        return "AI Error : " + e.message;

    }

}


const AI={

    async summarize(text){

        return askAI(
            "Summarize this note:\n\n"+text
        );

    },

    async rewrite(text){

        return askAI(
            "Rewrite this professionally:\n\n"+text
        );

    },

    async translate(text){

        return askAI(
            "Translate this into Hindi:\n\n"+text
        );

    },

    async grammar(text){

        return askAI(
            "Correct grammar only:\n\n"+text
        );

    },

    async continueWriting(text){

        return askAI(
            "Continue writing:\n\n"+text
        );

    },

    async ask(question,note){

        return askAI(

`Current Note:

${note}

Question:

${question}`

        );

    }

};