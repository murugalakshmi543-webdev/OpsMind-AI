const pdfParse = require("pdf-parse/lib/pdf-parse.js");

async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

module.exports = { extractTextFromPDF };
