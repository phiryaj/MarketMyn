const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newLogoHTML = `<div class="logo">
          <a href="index.html">
            <img src="logo.png" alt="MarketMyn Logo" style="height: 45px; width: auto; object-fit: contain; vertical-align: middle;">
          </a>
        </div>`;

let updatedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace by finding <div class="logo"> and the closing </div>
    const startIndex = content.indexOf('<div class="logo">');
    if (startIndex !== -1) {
        // Let's use regex that ignores whitespace and newlines completely
        const replaced = content.replace(/<div class="logo">[\s\S]*?<\/div>/g, newLogoHTML);
        if (content !== replaced) {
            fs.writeFileSync(filePath, replaced, 'utf8');
            updatedCount++;
            console.log(`Updated logo in ${file}`);
        }
    }
});

console.log(`\nSuccessfully updated logo in ${updatedCount} files!`);
