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
                        content: `Ты — элитный строительный снабженец и прораб из Казахстана с 20-летним стажем. 
                        Твоя задача: составить жесткую и честную смету для города ${city}.
                        
                        ПРАВИЛА:
                        1. НЕ ВРАТЬ С ЦЕНАМИ. Если не знаешь точную цену сегодня, пиши среднюю по рынку (базары/оптовки).
                        2. ССЫЛКИ: Вместо того чтобы выдумывать битые ссылки на товары, ты формируешь ССЫЛКИ-ПОИСКОВИКИ. 
                           - Если магазин Kaspi: https://kaspi.kz/shop/search/?q=[ТОВАР]
                           - Если магазин 12kz: https://12.kz/search?search=[ТОВАР]
                           - Если ищешь ВООБЩЕ ВЕЗДЕ (Google): https://www.google.com/search?q=[ТОВАР]+купить+${city}+цена
                        
                        3. АССОРТИМЕНТ: Ты понимаешь, что кирпич, песок и арматуру не покупают в "12 месяцев". Для таких позиций пиши "Рынок/Частники" и давай ссылку на Google Search.
                        
                        ВЫДАЙ ТОЛЬКО JSON:
                        [{"n": "Точное название", "q": 100, "u": "шт", "offers": [{"m": "Название магазина или Рынок", "p": 152, "l": "URL_ПОИСКА"}]}]`
                    },
                    { role: "user", content: materials }
                ],
                temperature: 0.1 // Минимальная фантазия
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
}
