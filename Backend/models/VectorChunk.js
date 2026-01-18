const mongoose = require("mongoose");

const vectorChunkSchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
  source: {
    fileId: mongoose.Schema.Types.ObjectId,
    filename: String,
    page: Number
  }
});


vectorChunkSchema.index({ embedding: "2dsphere" });

module.exports = mongoose.model("VectorChunk", vectorChunkSchema);
