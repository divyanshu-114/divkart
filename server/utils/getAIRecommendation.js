export async function getAIRecommendation(req, res, userPrompt, products) {
    const api_key = process.env.GEMINI_API_KEY
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}`;

    try{
        const geminiPrompt = `
            here is a list of available products: 
            ${JSON.stringify(products,null,2)}

            base on the following user request, filter and suggest the best matching products:
            "${userPrompt}"

            Only return the matching products in the JSON format. Do not add any explanation.

        `

        const response = await fetch(URL, {
            method : "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: geminiPrompt
                            }
                        ]
                    }
                ]
            })
        } )

        const data = await response.json();

        const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "";

        const cleanedText = aiResponseText.replace(/```json|```/g, '').trim();
        // replace me jo hai usse fromtend par json format pat recieve ho jayega

        if(!cleanedText){
            return res.status(500).json({success: false, message: "Failed to get AI recommendation"});
        }

        let parseProducts ;

        try{
            parseProducts = JSON.parse(cleanedText);
        }catch(error){
            return res.status(500).json({success: false, message: "Failed to parse AI response"});
        }

        return {success : true, products : parseProducts};

    }catch(error){
        console.error("Error getting AI recommendation:", error);
        res.status(500).json({success: false, message: "internal server error"});
    }
}

