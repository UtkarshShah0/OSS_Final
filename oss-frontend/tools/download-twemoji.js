// downloads Twemoji SVGs for the emoji codes used in the project
// Usage: node tools/download-twemoji.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const codes = [
  '1f4f1', // mobile phone
  '1f455', // t-shirt
  '1f3e0', // house
  '26bd',  // soccer ball
  '1f4da', // books
  '1f484', // lipstick
  '1f4e6'  // package (fallback)
];

const outDir = path.join(__dirname, '..', 'src', 'assets', 'icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function download(code) {
  const url = `https://twemoji.maxcdn.com/v/latest/svg/${code}.svg`;
  const dest = path.join(outDir, `${code}.svg`);
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

(async () => {
  console.log('Downloading Twemoji svgs to', outDir);
  for (const c of codes) {
    try {
      await download(c);
      console.log('Saved', c + '.svg');
    } catch (err) {
      console.error('Error downloading', c, err.message);
    }
  }
  console.log('Done');
})();
