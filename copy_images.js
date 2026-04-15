const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'assets');

// Create assets directory if it doesn't exist
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
}

const filesToCopy = [
    {
        src: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\d56bbaef-e38b-48f4-9f48-09f0ade9ba8f\\gs_powertech_official_logo_1775901460402.png',
        dest: path.join(destDir, 'logo.png')
    },
    {
        src: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\d56bbaef-e38b-48f4-9f48-09f0ade9ba8f\\gs_powertech_hero_solar_1775900533929.png',
        dest: path.join(destDir, 'hero.png')
    },
    {
        src: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\d56bbaef-e38b-48f4-9f48-09f0ade9ba8f\\solar_panel_close_up_1775900553666.png',
        dest: path.join(destDir, 'panel.png')
    }
];

filesToCopy.forEach(({src, dest}) => {
    try {
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`Successfully copied to ${dest}`);
        } else {
            console.log(`Source file not found: ${src}`);
        }
    } catch (err) {
        console.error(`Error copying ${src} to ${dest}:`, err);
    }
});

console.log('Done copying images!');
