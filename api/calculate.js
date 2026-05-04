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
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `Ты эксперт-снабженец по Казахстану. Твоя цель: найти самые низкие цены в городе ${city} на 2026 год.
                        Для каждого товара найди: цену, название магазина (например: Kaspi, 12 Месяцев, Строймарт или местный рынок) и сгенерируй реалистичную ссылку на товар.
                        Ответ дай СТРОГО в формате JSON массива:
                        [{"n": "Наименование", "p": 1500, "m": "Магазин", "l": "ссылка"}]
                        Никакого лишнего текста.`
                    },
                    { role: "user", content: materials }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
