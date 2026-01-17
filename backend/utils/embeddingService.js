const { GoogleGenerativeAI } = require("@google/generative-ai");

class EmbeddingService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "embedding-001" });
  }

  async generateEmbedding(text) {
    try {
      const result = await this.model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      // Fallback: Return a simple vector based on text length
      return this.fallbackEmbedding(text);
    }
  }

  fallbackEmbedding(text) {
    // Simple fallback embedding (in production, use proper embeddings)
    const vector = new Array(768).fill(0);
    const length = Math.min(text.length, 768);
    for (let i = 0; i < length; i++) {
      vector[i] = text.charCodeAt(i % text.length) / 255;
    }
    return vector;
  }

  async generateResponse(query, contextChunks) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const context = contextChunks.map(chunk => 
        `[From ${chunk.filename}, Page ${chunk.pageNumber}]: ${chunk.text}`
      ).join('\n\n');
      
      const prompt = `You are an expert assistant for company SOPs. Answer the question based ONLY on the provided context. 
      If the answer is not in the context, say "I don't know" or "This information is not available in the SOPs."
      
      Context:
      ${context}
      
      Question: ${query}
      
      Answer:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Response generation failed:', error);
      return "I apologize, but I'm having trouble processing your request. Please try again.";
    }
  }
}

module.exports = new EmbeddingService();