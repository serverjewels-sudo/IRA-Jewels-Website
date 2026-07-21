const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const searchStr = /slug/i;
walkDir('./', function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
      const lines = fs.readFileSync(filePath, 'utf8').split('\n');
      lines.forEach((line, index) => {
        if (searchStr.test(line) && (line.includes('generate') || line.includes('replace') || line.includes('toLowerCase'))) {
          console.log(`${filePath}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  }
});
