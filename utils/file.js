const fs = require('fs');
const path = require('path');

function readJSON(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  const content = fs.readFileSync(fullPath, 'utf-8'); // ✅ ini penting!
  return JSON.parse(content);
}

function writeJSON(filePath, data) {
  const fullPath = path.join(__dirname, '..', filePath);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON };
