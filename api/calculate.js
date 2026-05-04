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
                        content: `Ты — жесткий аудитор цен стройматериалов в ${city}. 
                        
                        ТРЕБОВАНИЯ К ЦЕНАМ:
                        1. ЗАПРЕЩЕНО округлять цены до сотен. Если цена 148 — пиши 148. Если 4560 — пиши 4560.
                        2. Использyй реальные рыночные данные на 2024 год для Казахстана.
                        3. "p" — это цена за ОДНУ единицу (шт/м2/кг).
                        
                        ТРЕБОВАНИЯ К ССЫЛКАМ:
                        - Только поисковые запросы. Ссылка ДОЛЖНА содержать название товара.
                        - Пример для Kaspi: https://kaspi.kz/shop/search/?q=[Название+характеристики]
                        
                        JSON ФОРМАТ (СТРОГО):
                        [{"n": "Точное название товара", "q": 300, "u": "шт", "offers": [
                            {"m": "Kaspi", "p": 152.5, "l": "URL"},
                            {"m": "Строймарт", "p": 149, "l": "URL"},
                            {"m": "12 Месяцев", "p": 155, "l": "URL"}
                        ]}]`
                    },
                    { role: "user", content: materials }
                ],
                temperature: 0 // Минимальная фантазия, максимальная точность
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
}
