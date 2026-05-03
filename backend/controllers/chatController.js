const { genAI } = require('../config/aiConfig');
const Document = require('../models/Document');

const handleChat = async (req, res) => {
    try {
        const { question, history = [], fileName } = req.body; 

        // 1. Get Question Embedding
        const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const queryEmbeddingResult = await embeddingModel.embedContent(question);
        const queryVector = queryEmbeddingResult.embedding.values;

        // 2. Vector Search
        const searchResults = await Document.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryVector,
                    numCandidates: 10,
                    limit: 3,
                    filter: fileName ? { "metadata.fileName": fileName } : {}
                }
            },
            { $project: { _id: 0, content: 1, metadata: 1, score: { $meta: "vectorSearchScore" } } }
        ]);

        const contextText = searchResults.map(doc => doc.content).join("\n\n---\n\n");
        
        // 🛠️ Using the Free & Stable Lite Model
        const chatModel = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
        const chatSession = chatModel.startChat({ history });

        const systemPrompt = `You are a Universal AI Analyzer. Context: ${contextText}. 
        Answer based ONLY on this context. File: ${fileName || "All"}`;

        const result = await chatSession.sendMessage(systemPrompt + "\n\nUser: " + question);
        
        res.status(200).json({ 
            answer: result.response.text(),
            sources: searchResults.map(r => r.metadata.fileName)
        });

    } catch (error) {
        console.error("❌ Chat Error:", error);
        res.status(500).json({ error: "Internal Error" });
    }
};

module.exports = { handleChat };