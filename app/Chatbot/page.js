// // "use client";

// // import { useEffect } from "react";

// // export default function Chatbot({ children }) {
// //     useEffect(() => {
// //         window.watsonAssistantChatOptions = {
// //             integrationID: "ea607e2c-7266-401d-980b-71fff45d6903", 
// //             region: "au-syd", 
// //             serviceInstanceID: "d6c3cf7b-5dcd-4242-b81c-f75a30e18f26", 
// //             onLoad: async (instance) => {
// //                 await instance.render();
// //             },
// //         };

// //         const script = document.createElement("script");
// //         script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
// //         script.async = true;
// //         document.head.appendChild(script);

// //         return () => {
// //             document.head.removeChild(script);
// //         };
// //     }, []);

// //     return <>{children}</>;
// // }
// "use client";

// import { useEffect } from "react";

// export default function Chatbot({ children }) {
//     useEffect(() => {
//         // Watson Assistant Chat Options
//         window.watsonAssistantChatOptions = {
//             integrationID: "ea607e2c-7266-401d-980b-71fff45d6903", 
//             region: "au-syd", 
//             serviceInstanceID: "d6c3cf7b-5dcd-4242-b81c-f75a30e18f26", 
//             onLoad: async (instance) => {
//                 // Attach a custom handler for messages
//                 instance.on({ type: "message", handler: (message) => handleBotResponse(message) });

//                 // Render the chat interface
//                 await instance.render();
//             },
//         };

//         // Load Watson Assistant Chat script
//         const script = document.createElement("script");
//         script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
//         script.async = true;
//         document.head.appendChild(script);

//         return () => {
//             document.head.removeChild(script);
//         };
//     }, []);

//     // Text-to-Speech Integration
//     const handleBotResponse = (message) => {
//         // Check if the message is from the bot and contains text
//         if (message?.output?.generic) {
//             const botReply = message.output.generic.find((response) => response.response_type === "text");
//             if (botReply?.text) {
//                 playAudioFromText(botReply.text);
//             }
//         }
//     };

//     const playAudioFromText = async (text) => {
//         const apiKey = "qbAMAPzG2Sea3z31d_qYff3jvPjSGo2M28IJYKtg27lk";
//         const url = "https://api.au-syd.text-to-speech.watson.cloud.ibm.com/instances/6aa88c74-f7ed-4e04-ae96-7b6846852cf6";
//         const voice = "en-US_AllisonV3Voice"; // You can change the voice here

//         try {
//             // Fetch the audio stream from the Watson Text-to-Speech API
//             const response = await fetch(`${url}/v1/synthesize?voice=${voice}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Basic ${btoa(`apikey:${apiKey}`)}`,
//                 },
//                 body: JSON.stringify({ text, accept: "audio/mp3" }),
//             });

//             // Convert response to audio and play
//             if (response.ok) {
//                 const audioBlob = await response.blob();
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 const audio = new Audio(audioUrl);
//                 audio.play();
//             } else {
//                 console.error("Text-to-Speech API error:", response.statusText);
//             }
//         } catch (error) {
//             console.error("Error fetching audio:", error);
//         }
//     };

//     return <>{children}</>;
// }

"use client";

import { useEffect } from "react";

export default function Chatbot({ children }) {
    useEffect(() => {
        window.watsonAssistantChatOptions = {
            integrationID: "ea607e2c-7266-401d-980b-71fff45d6903", 
            region: "au-syd", 
            serviceInstanceID: "d6c3cf7b-5dcd-4242-b81c-f75a30e18f26", 
            onLoad: async (instance) => {
                // Attach a custom handler for messages
                instance.on({ type: "message", handler: (message) => handleBotResponse(message) });

                // Render the chatbot interface
                await instance.render();
            },
        };

        // Load Watson Assistant Chat script dynamically
        const script = document.createElement("script");
        script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // Text-to-Speech Integration
    const handleBotResponse = (message) => {
        if (message?.output?.generic) {
            const botReply = message.output.generic.find((response) => response.response_type === "text");
            if (botReply?.text) {
                playAudioFromText(botReply.text);
            }
        }
    };

    const playAudioFromText = async (text) => {
        const apiKey = "qbAMAPzG2Sea3z31d_qYff3jvPjSGo2M28IJYKtg27lk";
        const url = "https://api.au-syd.text-to-speech.watson.cloud.ibm.com/instances/6aa88c74-f7ed-4e04-ae96-7b6846852cf6";
        const voice = "en-US_AllisonV3Voice"; // Voice can be customized

        try {
            const response = await fetch(`${url}/v1/synthesize?voice=${voice}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${btoa(`apikey:${apiKey}`)}`,
                },
                body: JSON.stringify({ text, accept: "audio/mp3" }),
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                console.error("Text-to-Speech API error:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching audio:", error);
        }
    };

    return <>{children}</>;
}
