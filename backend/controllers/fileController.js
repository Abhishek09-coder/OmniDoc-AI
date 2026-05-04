const fs = require('fs');
const path = require('path');
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Document = require('../models/Document');

// 🧠 THE SMART ROUTER (Cloud vs Local)
let genAI;
if (process.env.GEMINI_API_KEY) {
    // RENDER (CLOUD): Dahboard se key uthayega
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
    // LOCAL MACHINE: Hardcoded config file se key uthayega
    const aiConfig = require('../config/aiConfig');
    genAI = aiConfig.genAI;
}

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "File upload fail!" });

        const filePath = req.file.path;
        const originalFileName = req.file.originalname;

        const loader = new PDFLoader(filePath);
        const docs = await loader.load();
        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
        const chunks = await textSplitter.splitDocuments(docs);
        
        const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const requests = chunks.map(chunk => ({
            content: { role: "user", parts: [{ text: chunk.pageContent }] }
        }));

        const batchResponse = await embeddingModel.batchEmbedContents({ requests });
        const embeddings = batchResponse.embeddings.map(e => e.values);

        const docsToSave = chunks.map((chunk, index) => ({
            content: chunk.pageContent,
            embedding: embeddings[index], 
            metadata: { fileName: originalFileName }
        }));

        await Document.insertMany(docsToSave);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.status(200).json({ message: "File processed and indexed!", chunks: chunks.length });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getFiles = async (req, res) => {
    try {
        const files = await Document.distinct("metadata.fileName");
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: "Fetch error" });
    }
};

const deleteFile = async (req, res) => {
    try {
        const { fileName } = req.params;
        await Document.deleteMany({ "metadata.fileName": fileName });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Delete fail" });
    }
};

module.exports = { uploadDocument, getFiles, deleteFile };