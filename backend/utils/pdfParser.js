const pdfParse = require('pdf-parse');

class PDFParser {
  constructor() {
    this.chunkSize = 1000;
    this.chunkOverlap = 100;
  }

  async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      const text = data.text;
      const pages = data.numpages;
      
      // Split text into chunks
      const chunks = this.splitIntoChunks(text, pages);
      
      return {
        text,
        pages,
        chunks
      };
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }

  splitIntoChunks(text, totalPages) {
    const chunks = [];
    const pages = Math.ceil(text.length / (this.chunkSize * 10)); // Estimate pages
    
    for (let i = 0; i < text.length; i += this.chunkSize - this.chunkOverlap) {
      const chunkText = text.substring(i, i + this.chunkSize);
      const estimatedPage = Math.ceil(i / (text.length / pages)) || 1;
      
      if (chunkText.trim().length > 50) { // Only add meaningful chunks
        chunks.push({
          text: chunkText,
          pageNumber: estimatedPage,
          chunkIndex: chunks.length,
          metadata: {
            startChar: i,
            endChar: i + chunkText.length
          }
        });
      }
    }
    
    return chunks;
  }
}

module.exports = new PDFParser();