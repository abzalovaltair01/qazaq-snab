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
                        content: `Ты — эксперт по снабжению строительных объектов в Казахстане. 
                        
                        ТВОЯ СПЕЦИАЛИЗАЦИЯ: Строительные материалы, инструменты, расходники. 
                        Если товар двусмысленный (например, "перчатки" или "ведро"), всегда выбирай СТРОИТЕЛЬНЫЙ вариант.

                        ТВОЯ ЗАДАЧА: Для каждой позиции в списке пользователя найти 3 РЕАЛЬНЫХ варианта цены в городе ${city} на 2026 год.
                        
                        ФОРМАТ ОТВЕТА (СТРОГИЙ JSON):
                        [
                          {
                            "n": "Название товара (строительный тип)",
                            "q": "Кол-во",
                            "u": "ед. изм.",
                            "offers": [
                              {"m": "Магазин 1", "p": 1250, "l": "поисковая_ссылка_1"},
                              {"m": "Магазин 2", "p": 1300, "l": "поисковая_ссылка_2"},
                              {"m": "Магазин 3", "p": 1100, "l": "поисковая_ссылка_3"}
                            ]
                          }
                        ]
                        
                        Ссылки делай на поиск Kaspi: https://kaspi.kz/shop/search/?q=Товар+Магазин+${city}`
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
