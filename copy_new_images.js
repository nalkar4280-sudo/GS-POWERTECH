const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\d88a6404-8bf5-4054-aa36-cd2e2263c80f';
const destDir = path.join(__dirname, 'assets');

try {
    fs.copyFileSync(path.join(srcDir, 'media__1777305638185.jpg'), path.join(destDir, 'anim1.jpg'));
    fs.copyFileSync(path.join(srcDir, 'media__1777305714668.jpg'), path.join(destDir, 'anim2.jpg'));
    fs.copyFileSync(path.join(srcDir, 'media__1777305714734.jpg'), path.join(destDir, 'anim3.jpg'));
    console.log('Images copied successfully!');
} catch (err) {
    console.error('Error copying images:', err);
}
