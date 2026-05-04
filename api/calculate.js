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
                        content: `Ты — профессиональный снабженец в Казахстане. Твоя задача: рассчитать точную смету для города ${city} на 2026 год.
                        
                        ВАЖНО ПО ССЫЛКАМ:
                        В поле "l" записывай ТОЛЬКО поисковый запрос в формате: 
                        https://kaspi.kz/shop/search/?q=Название+Товара+Город
                        
                        ПРАВИЛА:
                        1. Цены пиши ТОЧНЫЕ (не округляй до тысяч).
                        2. Группируй товары (5 мешков = 1 строка).
                        3. Ответ СТРОГО в JSON:
                        [{"n": "Товар", "q": "5", "u": "мешков", "p": 12450, "m": "Магазин", "l": "ссылка_поиска"}]`
                    },
                    { role: "user", content: materials }
                ],
                temperature: 0
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
