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
                        content: `Ты — эксперт-снабженец в Казахстане. Твоя цель — дать ТОЧНУЮ цену за 1 единицу и РАБОЧУЮ ссылку.
                        
                        ФОРМИРОВАНИЕ ССЫЛОК (СТРОГО):
                        - Для Kaspi: https://kaspi.kz/shop/search/?q=[Название+Товара]
                        - Для Строймарт: https://stroy-mart.kz/search?q=[Название+Товара]
                        - Для 12 Месяцев: https://12mes.ru/search?q=[Название+Товара]
                        
                        ТРЕБОВАНИЯ:
                        1. Только строительные товары (никакой бытовухи).
                        2. Цена (p) — реальная рыночная цена в ${city} за 1 единицу.
                        3. Для каждого материала дай 3 варианта из РАЗНЫХ магазинов (Kaspi, Строймарт, 12 Месяцев).
                        
                        JSON ФОРМАТ:
                        [{"n": "Кирпич керамический одинарный", "q": 300, "u": "шт", "offers": [
                            {"m": "Kaspi", "p": 145, "l": "URL"},
                            {"m": "Строймарт", "p": 142, "l": "URL"},
                            {"m": "12 Месяцев", "p": 150, "l": "URL"}
                        ]}]`
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
