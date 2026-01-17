const mongoose = require('mongoose');

const ChunkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  pageNumber: {
    type: Number,
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  },
  metadata: {
    type: Map,
    of: String
  }
});

const DocumentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  totalChunks: {
    type: Number,
    required: true
  },
  chunks: [ChunkSchema],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for vector search
DocumentSchema.index({ 'chunks.embedding': '2dsphere' });

module.exports = mongoose.model('Document', DocumentSchema);