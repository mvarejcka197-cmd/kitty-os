// === TVŮJ GROQ API KLÍČ ===
const GROQ_API_KEY = "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";

document.addEventListener("DOMContentLoaded", () => {
    const avatar = document.getElementById('kitty-avatar');
    if (avatar) {
        avatar.pause();
        avatar.currentTime = 0;
    }
});

async function odeslatZpravu() {
    const input = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const avatar = document.getElementById('kitty-avatar');

    const textUzivatele = input.value.trim();
    if (textUzivatele === "") return;

    chatWindow.innerHTML += `<div style="color:#00ffff;margin:5px 0"><b>Ty:</b> ${textUzivatele}</div>`;
    input.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight;

    if (avatar) {
        avatar.classList.remove('glow-green', 'glow-red');
        avatar.classList.add('glow-blue');
    }

    let odpovedKitty = "";
    let barvaZare = "glow-green";

    try {
        // TVOJE PROXY ADRESA
        const response = await fetch("https://mvarejcka197-cmd.github.io/kitty-os/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content: "Jsi Kitty, AI asistentka v Artlife OS. Odpovídej česky, stručně, přátelsky, max 2 věty. Když uživatel řekne 'otevři baterka/hub/centrum/domů', potvrď že otevíráš."
                    },
                    {role: "user", content: textUzivatele}
                ],
                max_tokens: 100,
                temperature: 0.8
            })
        });

        if(!response.ok) throw new Error('API ' + response.status);
        const data = await response.json();

        if (data?.choices?.[0]?.message?.content) {
            odpovedKitty = data.choices[0].message.content;
        } else {
            odpovedKitty = "Chyba: Server neodpověděl správně.";
            barvaZare = "glow-red";
        }

    } catch (chyba) {
        console.error("Chyba:", chyba);
        odpovedKitty = "Chyba připojení k serveru.";
        barvaZare = "glow-red";
    }

    chatWindow.innerHTML += `<div style="color: #ff4081;margin:5px 0"><b>Kitty:</b> ${odpovedKitty}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;

    if (avatar) {
        avatar.play().catch(e => console.log("Video:", e));
    }

    let hlas = new SpeechSynthesisUtterance(odpovedKitty);
    hlas.lang = 'cs-CZ';
    hlas.pitch = 1.2;
    hlas.rate = 0.95;

    const finalniBarva = barvaZare;
    hlas.onend = function() {
        if (avatar) {
            avatar.pause();
            avatar.currentTime = 0;
            avatar.classList.remove('glow-blue', 'glow-red', 'glow-green');
            avatar.classList.add(finalniBarva);
        }

        const txt = textUzivatele.toLowerCase();
        if(txt.includes('otevři hub')) {
            closeKitty();
            currentPage=1;
            slider.style.transform='translateX(-100vw)';
        }
        if(txt.includes('otevři centrum')) {
            closeKitty();
            currentPage=2;
            slider.style.transform='translateX(-200vw)';
        }
        if(txt.includes('domů') || txt.includes('domu')) {
            closeKitty();
            currentPage=0;
            slider.style.transform='translateX(0vw)';
        }
    };

    window.speechSynthesis.speak(hlas);
}

function closeKitty() {
  document.getElementById('kitty-modal').style.display = 'none';
}