const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
// const { callGemini } = require("../services/llmService");
require("dotenv").config();

const { extractTextFromPDF } = require("../services/pdfProcessor");
const { chunkText } = require("../services/chunker");
const { createEmbedding } = require("../services/embeddingService");
const VectorChunk = require("./models/VectorChunk");

// Multer
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });


// ======================
// UPLOAD PDF
router.post("/file", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const uploadStream = bucket.openUploadStream(req.file.originalname);
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const fileId = uploadStream.id;
      const downloadStream = bucket.openDownloadStream(fileId);

      let buffer = Buffer.alloc(0);
      for await (const chunk of downloadStream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const text = await extractTextFromPDF(buffer);
      const chunks = chunkText(text);

      for (let i = 0; i < chunks.length; i++) {
        const embedding = await createEmbedding(chunks[i]);
        await VectorChunk.create({
          text: chunks[i],
          embedding,
          source: {
            fileId,
            filename: req.file.originalname,
            page: i + 1
          }
        });
      }

      res.json({ message: "Upload successful", chunks: chunks.length });
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});


// ======================
// -------------------------
// Query route (STABLE VERSION - NO LLM)
// -------------------------
router.post("/query", async (req, res) => {
  const { question, topN = 3 } = req.body;

  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const questionEmbedding = await createEmbedding(question);

    const allChunks = await VectorChunk.find({});

    const cosineSimilarity = (a, b) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (normA * normB);
    };

    const topChunks = allChunks
      .map(c => ({ chunk: c, score: cosineSimilarity(questionEmbedding, c.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    if (topChunks.length === 0) {
      return res.json({ answer: "I don't know.", sources: [] });
    }

    const contextText = topChunks.map(c => c.chunk.text).join("\n---\n");

    res.json({
      answer: contextText,
      sources: topChunks.map(c => c.chunk.source)
    });

  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: "Query failed" });
  }
});


// // ======================
// // QUERY RAG
// // ======================
// router.post("/query", async (req, res) => {
//   const { question, history = [], topN = 3 } = req.body;

//   if (!question) return res.status(400).json({ error: "Question is required" });

//   try {
//     const questionEmbedding = await createEmbedding(question);

//     const allChunks = await VectorChunk.find({});

//     const cosineSimilarity = (a, b) => {
//       const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
//       const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
//       const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
//       return dot / (normA * normB);
//     };

//     const topChunks = allChunks
//       .map(c => ({ chunk: c, score: cosineSimilarity(questionEmbedding, c.embedding) }))
//       .sort((a, b) => b.score - a.score)
//       .slice(0, topN);

//     if (topChunks.length === 0) {
//       return res.json({ answer: "I don't know.", sources: [] });
//     }

//     const contextText = topChunks.map(c => c.chunk.text).join("\n---\n");

//     const fullPrompt = `
// You are an Enterprise SOP assistant.
// Answer strictly from the context.
// If the answer is not in the context, say "I don't know."

// Context:
// ${contextText}

// Conversation:
// ${history.map(m => `${m.role}: ${m.text}`).join("\n")}

// User question:
// ${question}
// `;

//     // Call Gemini / LLM
//     const llmResponse = await createEmbedding(fullPrompt); // TEMP: replace with LLM call later
//     // const //answer// = await callGemini(fullPrompt); for now we return context only (safe, accurate)//

//     const { callGemini } = require("../services/llmService");

//     const answer = await callGemini(fullPrompt);

//     res.json({
//       answer,
//       sources: topChunks.map(c => c.chunk.source)
//     });


//   } catch (err) {
//     console.error("Query failed:", err);
//     res.status(500).json({ error: "Query failed" });
//   }
// });

module.exports = router;
