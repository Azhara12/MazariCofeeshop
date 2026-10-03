const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // Match "dark:" followed by any valid tailwind class characters
      const regex = /dark:[a-zA-Z0-9\-\/\[\]#%]+(\s+)?/g;
      content = content.replace(regex, '');
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Cleaned:', fullPath);
      }
    }
  }
}

processDir('./src/sections');
processDir('./src/components/common');
processDir('./src/components/cards');
processDir('./src/components/ui');
processDir('./src/pages');
