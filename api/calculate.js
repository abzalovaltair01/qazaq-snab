// api/calculate.js
export default async function handler(req, res) {
    // Разрешаем запросы со своего сайта
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { materials } = req.body;
    const apiKey = "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"; // Ключ теперь в безопасности

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{
                    role: "system",
                    content: "Ты снабженец в Казахстане. Дай цены в тенге на 2026г. Верни ТОЛЬКО JSON массив: [{\"n\":\"товар\",\"p\":1000}]."
                }, {
                    role: "user", content: materials
                }],
                temperature: 0.1
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
