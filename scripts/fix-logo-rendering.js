const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldStyle = `style="height: 65px; width: auto; object-fit: contain; vertical-align: middle; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"`;
const newStyle = `style="height: 65px; width: auto; object-fit: contain; vertical-align: middle; image-rendering: smooth; -webkit-font-smoothing: antialiased;"`;

let updatedCount = 0;
files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldStyle)) {
        content = content.split(oldStyle).join(newStyle);
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Fixed: ${file}`);
    }
});
console.log(`\nFixed rendering in ${updatedCount} files.`);
