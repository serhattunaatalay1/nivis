const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'www');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

const filesToCopy = [
  'index.html',
  'styles.css',
  'manifest.json',
  'sw.js',
  'qrcode.min.js',
  'jsqr.min.js',
  'icon-192.png',
  'icon-512.png'
];

for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, file));
  }
}

const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, path.join(outDir, 'src'), { recursive: true });
}

console.log('✓ Successfully prepared www/ directory for Capacitor Android build');
