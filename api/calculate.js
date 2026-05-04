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
                        content: `Ты — аналитик отдела закупа. Твоя задача — найти реальные цены в городе ${city} на май 2026.
                        ТРЕБОВАНИЯ:
                        1. ЦЕНЫ: Пиши ТОЧНУЮ цену до тенге (например, 2843, а не 3000). НЕ ОКРУГЛЯЙ.
                        2. ССЫЛКИ: Генерируй прямую ссылку на товар в Kaspi.kz или магазины типа Строймарт/12 Месяцев.
                        3. МАГАЗИН: Обязательно укажи название магазина.
                        4. ГРУППИРОВКА: Объединяй одинаковые позиции.
                        
                        ОТВЕТ В JSON:
                        [{"n": "Товар", "q": "Кол-во", "u": "ед. изм.", "p": цена_числом_точно, "m": "Магазин", "l": "URL_ссылка"}]`
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
