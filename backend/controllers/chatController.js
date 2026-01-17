const Document = require('../models/Document');
const embeddingService = require('../utils/embeddingService');

exports.queryDocuments = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Generate embedding for the question
    const queryEmbedding = await embeddingService.generateEmbedding(question);
    
    // Vector search across all documents
    const searchResults = await Document.aggregate([
      { $unwind: '$chunks' },
      {
        $project: {
          filename: '$originalName',
          chunkText: '$chunks.text',
          pageNumber: '$chunks.pageNumber',
          chunkIndex: '$chunks.chunkIndex',
          embedding: '$chunks.embedding',
          _id: 0
        }
      },
      {
        $addFields: {
          similarity: {
            $sqrt: {
              $reduce: {
                input: { $range: [0, { $size: '$embedding' }] },
                initialValue: 0,
                in: {
                  $add: [
                    '$$value',
                    {
                      $pow: [
                        { $subtract: [
                          { $arrayElemAt: ['$embedding', '$$this'] },
                          { $arrayElemAt: [queryEmbedding, '$$this'] }
                        ] },
                        2
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      },
      { $sort: { similarity: 1 } }, // Lower similarity = more similar
      { $limit: 5 }
    ]);
    
    if (searchResults.length === 0) {
      return res.json({
        answer: "I don't have enough information in the SOPs to answer this question.",
        sources: []
      });
    }
    
    // Generate response using LLM
    const answer = await embeddingService.generateResponse(question, searchResults);
    
    // Format sources
    const sources = searchResults.map(result => ({
      filename: result.filename,
      pageNumber: result.pageNumber,
      text: result.chunkText.substring(0, 200) + '...' // Preview
    }));
    
    res.json({
      answer,
      sources
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    // In a real app, you'd store chat history in a database
    res.json({ messages: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};