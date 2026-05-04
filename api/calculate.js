export default async function handler(req, res) {
    // Устанавливаем заголовки безопасности
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const apiKey = "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";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Поменял модель на чуть более мощную и стабильную
                model: "llama-3.3-70b-versatile", 
                messages: [
                    { role: "system", content: "Ты снабженец в Казахстане. Дай цены в тенге на 2026 год. Отвечай ТОЛЬКО JSON массивом: [{\"n\":\"товар\", \"p\":12300}]." },
                    { role: "user", content: req.body.materials }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Если Groq ругается, мы передадим его ошибку на фронтенд
            return res.status(response.status).json({ 
                error: data.error?.message || "Ошибка API Groq" 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера: " + error.message });
    }
}
