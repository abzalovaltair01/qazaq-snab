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
                        content: `Ты — профессиональный снабженец. Твоя задача: сгруппировать материалы из списка и найти цены для города ${city} на 2026 год.
                        
                        ПРАВИЛА ГРУППИРОВКИ:
                        1. Если пользователь пишет "5 мешков цемента", не делай 5 строк. Сделай ОДНУ строку, где количество "5", а единица "мешков".
                        2. Четко различай единицы измерения: кг, шт, м, м2, мешков, литров.
                        3. Для каждой позиции найди самый дешевый вариант (Kaspi, Строймарт и т.д.).
                        
                        ОТВЕТ В JSON:
                        [{"n": "Название", "q": "Кол-во (число)", "u": "ед. изм.", "p": "цена за ВСЁ кол-во", "m": "Магазин", "l": "ссылка"}]`
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
