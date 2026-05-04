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
                        content: `Ты — эксперт-снабженец строительных объектов в Казахстане. Твоя задача: составить честную смету.
                        
                        ПРАВИЛА ДЛЯ ССЫЛОК (СТРОГО):
                        Не выдумывай прямые ссылки на товары! Делай только ссылки на поиск:
                        1. Kaspi: https://kaspi.kz/shop/search/?q=[ТОВАР]+${city}
                        2. 12kz: https://12.kz/search?search=[ТОВАР]
                        3. Google (для кирпича/песка/бетона): https://www.google.com/search?q=[ТОВАР]+купить+${city}+цена
                        
                        ЦЕНЫ: 
                        - Если товар общестроительный (кирпич, арматура), пиши среднюю цену по базам.
                        - Если товар отделочный, бери цены Kaspi/12kz.
                        
                        ВЫДАВАЙ ТОЛЬКО JSON:
                        [{"n": "Название", "q": 10, "u": "шт", "offers": [{"m": "Магазин/Рынок", "p": 500, "l": "URL"}]}]`
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
