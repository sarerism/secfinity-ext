const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '../src/assets/img/icons/secfinity_logo.svg');
const outputDir = path.join(__dirname, '../src/assets/img/icons');

const sizes = [16, 32, 48, 128];

async function convert() {
    try {
        const svgBuffer = fs.readFileSync(svgPath);
        
        for (const size of sizes) {
            const outputPath = path.join(outputDir, `secfinity_logo${size}.png`);
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputPath);
            console.log(`Created ${outputPath}`);
        }
    } catch (error) {
        console.error('Error converting SVG to PNG:', error);
        process.exit(1);
    }
}

convert();
