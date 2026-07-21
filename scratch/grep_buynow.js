const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const searchStr = /buyNow|Buy Now/i;
walkDir('./', function(filePath) {
  if (filePath.endsWith('.jsx') && !filePath.includes('node_modules') && !filePath.includes('.next')) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (searchStr.test(line)) {
        console.log(`${filePath}:${index + 1}: ${line.trim()}`);
      }
    });
  }
});
