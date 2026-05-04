export default async function handler(req, res) {
    const apiKey = "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";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "Ты снабженец в Казахстане. Отвечай строго в формате JSON: [{\"n\":\"товар\", \"p\":123}]. Цены в тенге." },
                    { role: "user", content: req.body.materials }
                ],
                temperature: 0
            })
        });

        const data = await response.json();
        
        // Проверка: если Groq вернул ошибку (например, лимит ключа)
        if (!data.choices || !data.choices[0]) {
            console.error("Ошибка Groq API:", data);
            return res.status(500).json({ error: "Нейронка не ответила. Проверьте логи сервера." });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
