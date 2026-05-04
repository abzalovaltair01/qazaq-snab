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
                        content: `Ты — эксперт по закупкам стройматериалов в Казахстане (${city}).
                        
                        ПРАВИЛА ПО ССЫЛКАМ:
                        1. Для каждой позиции дай 3 варианта.
                        2. ВАРИАНТ 1: Обязательно Kaspi.kz (прямая ссылка на товар, а не поиск).
                        3. ВАРИАНТ 2 и 3: Другие магазины (12mes.kz, stroymart.kz, leroymerlin.kz) с прямыми ссылками на карточку товара.
                        4. ССЫЛКИ ДОЛЖНЫ БЫТЬ РЕАЛЬНЫМИ (не выдуманными шаблонами).
                        
                        ФОКУС: Только строительная сфера. Если "ведро" — то оцинкованное или пластмассовое строительное.
                        
                        ФОРМАТ JSON:
                        [{"n": "Название", "q": "5", "u": "шт", "offers": [{"m": "Магазин", "p": 1500, "l": "URL"}]}]`
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
