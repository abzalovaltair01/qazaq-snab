export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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
                        content: `Ты — профессиональный снабженец в Казахстане (${city}). Твоя цель — дать ОРИЕНТИРОВОЧНУЮ цену и ПРЯМУЮ ссылку на поиск товара.
                        
                        ССЫЛКИ (СТРОГО):
                        - 12 Месяцев: https://12.kz/search?search=[QUERY]
                        - Строймарт: https://stroymart.kz/search?q=[QUERY]
                        - Kaspi: https://kaspi.kz/shop/search/?q=[QUERY]+${city}

                        ПРАВИЛА:
                        1. ЦЕНА (p): Не округляй до сотен. Пиши реальную цену за 1 шт (например, 148, 4560).
                        2. КОЛИЧЕСТВО (q): Строго бери из текста пользователя.
                        3. Для каждой позиции дай предложения от 12.kz, stroymart.kz и Kaspi.
                        
                        JSON:
                        [{"n": "Товар", "q": 300, "u": "шт", "offers": [{"m": "12 Месяцев", "p": 148, "l": "URL"}]}]`
                    },
                    { role: "user", content: materials }
                ],
                temperature: 0
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
}
