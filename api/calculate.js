export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { materials, city } = req.body;
    const apiKey = "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";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `Ты профессиональный снабженец в Казахстане. Твоя цель: найти лучшие цены в городе ${city} на 2026 год.
                        Группируй одинаковые товары в одну строку (например, вместо пяти строк по мешку сделай одну: 5 мешков).
                        Ответ дай СТРОГО в формате JSON массива:
                        [{"n": "Товар", "q": "Кол-во", "u": "ед. изм.", "p": цена_за_все, "m": "Магазин", "l": "ссылка"}]`
                    },
                    { role: "user", content: materials }
                ],
                temperature: 0.1
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
