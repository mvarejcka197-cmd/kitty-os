// === TADY SEM VLOŽ SVŮJ GROQ API KLÍČ ===
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

    // 1. Zobrazení tvého textu v chatu
    chatWindow.innerHTML += `<div><b>Ty:</b> ${textUzivatele}</div>`;
    input.value = ""; 
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Zapnutí modré záře (přemýšlení)
    if (avatar) {
        avatar.classList.remove('glow-green', 'glow-red');
        avatar.classList.add('glow-blue');
    }

    let odpovedKitty = "";
    let barvaZare = "glow-green";

    // 2. Volání umělé inteligence přes proxy most
    try {
        // Používáme veřejnou proxy 'cors-anywhere', která schová to, že voláš z localhostu v mobilu
        const proxyUrl = "https://herokuapp.com";
        const apiUrl = "https://groq.com";

        const response = await fetch(proxyUrl + apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", 
                messages: [
                    {
                        role: "system",
                        content: "Jsi umělá inteligence asistentka Kitty v systému Kitty OS. Odpovídej vždy v češtině, velmi stručně, přátelsky, maximálně jednou nebo dvěma větami."
                    },
                    {
                        role: "user",
                        content: textUzivatele
                    }
                ],
                max_tokens: 100
            })
        });

        const data = await response.json();
        
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            odpovedKitty = data.choices[0].message.content;
        } else {
            odpovedKitty = "Chyba: Server poslal data, ale v jiném formátu.";
            barvaZare = "glow-red";
        }

    } catch (chyba) {
        console.error("Chyba:", chyba);
        odpovedKitty = "Most přes proxy selhal nebo chybí internet. Zkus to znovu.";
        barvaZare = "glow-red";
    }

    // 3. Zobrazení odpovědi Kitty v chatu
    chatWindow.innerHTML += `<div style="color: #ff4081;"><b>Kitty:</b> ${odpovedKitty}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // ROZPOHYBOVÁNÍ: Spustíme video s mluvením
    if (avatar) {
        avatar.play().catch(e => console.log("Spuštění videa: ", e));
    }

    // MLUVENÍ: Mobil přečte text nahlas
    let hlas = new SpeechSynthesisUtterance(odpovedKitty);
    hlas.lang = 'cs-CZ';
    
    // ZASTAVENÍ: Jakmile domluví, video se stopne a barva se změní na zelenou
    const finalniBarva = barvaZare;
    hlas.onend = function() {
        if (avatar) {
            avatar.pause();
            avatar.currentTime = 0;
            avatar.classList.remove('glow-blue', 'glow-red', 'glow-green'); 
            avatar.classList.add(finalniBarva);
        }
    };

    window.speechSynthesis.speak(hlas);
}
