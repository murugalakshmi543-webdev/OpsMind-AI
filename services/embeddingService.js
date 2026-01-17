// embeddingService.js
const OpenAI = require("openai");

// Use your Gemini API key from .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Point to Gemini's OpenAI‑compatible endpoint
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function createEmbedding(text) {
  try {
    const response = await client.embeddings.create({
      model: "gemini-embedding-001",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw error;
  }
}


module.exports = { createEmbedding };
