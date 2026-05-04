const { GoogleGenerativeAI } = require("@google/generative-ai");

// Local pe agar .env fail bhi ho jaye, toh app crash na ho isliye ek dummy string de rahe hain.
// Render par ye process.env.GEMINI_API_KEY se seedha asli key utha lega.
const rawKey = process.env.GEMINI_API_KEY || "DUMMY_KEY_TO_PREVENT_CRASH";
const cleanKey = rawKey.trim(); 

const genAI = new GoogleGenerativeAI(cleanKey);

module.exports = { genAI };