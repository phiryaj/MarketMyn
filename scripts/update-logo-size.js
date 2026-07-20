const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldLogo = `style="height: 45px; width: auto; object-fit: contain; vertical-align: middle;"`;
const newLogo = `style="height: 65px; width: auto; object-fit: contain; vertical-align: middle; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"`;

let updatedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldLogo)) {
        content = content.split(oldLogo).join(newLogo);
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`\nDone! Updated logo size in ${updatedCount} files.`);
