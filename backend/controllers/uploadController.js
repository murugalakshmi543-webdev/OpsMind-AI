const multer = require('multer');
const Document = require('../models/Document');
const pdfParser = require('../utils/pdfParser');
const embeddingService = require('../utils/embeddingService');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
}).single('file');

exports.uploadDocument = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const userId = req.user.id;
      
      // Parse PDF
      const parsedData = await pdfParser.parsePDF(req.file.buffer);
      
      // Generate embeddings for each chunk
      const chunksWithEmbeddings = [];
      for (const chunk of parsedData.chunks) {
        const embedding = await embeddingService.generateEmbedding(chunk.text);
        chunksWithEmbeddings.push({
          ...chunk,
          embedding
        });
      }
      
      // Create document record
      const document = new Document({
        filename: `${Date.now()}-${req.file.originalname}`,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        totalChunks: chunksWithEmbeddings.length,
        chunks: chunksWithEmbeddings,
        uploadedBy: userId
      });
      
      await document.save();
      
      res.status(201).json({
        message: 'Document uploaded and processed successfully',
        document: {
          id: document._id,
          filename: document.originalName,
          totalChunks: document.totalChunks,
          uploadedAt: document.uploadedAt
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user.id })
      .sort({ uploadedAt: -1 })
      .select('originalName fileSize totalChunks uploadedAt');
    
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user owns the document or is admin
    if (document.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await document.deleteOne();
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};