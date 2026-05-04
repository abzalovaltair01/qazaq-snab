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
                        content: `Ты — профессиональный снабженец. Твоя задача — найти максимально ТОЧНЫЕ цены за 1 ЕДИНИЦУ товара в ${city}.
                        
                        КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
                        1. Округлять цены (пиши 148.5, если это так).
                        2. Придумывать ссылки. Ссылки должны вести на конкретный товар.
                        3. Использовать медицинские или бытовые аналоги (только стройка).

                        ВАЖНО: Поле "p" — это цена за ОДНУ штуку/метр/кг.
                        
                        JSON ФОРМАТ:
                        [
                          {
                            "n": "Точное название материала",
                            "q": 300, 
                            "u": "шт",
                            "offers": [
                              {"m": "Kaspi", "p": 150.45, "l": "https://kaspi.kz/shop/p/..."},
                              {"m": "Stroymart", "p": 149.00, "l": "https://stroymart.kz/p/..."},
                              {"m": "12 Mesyacev", "p": 155.20, "l": "https://12mes.kz/p/..."}
                            ]
                          }
                        ]`
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
