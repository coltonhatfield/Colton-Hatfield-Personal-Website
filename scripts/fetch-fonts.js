import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';

async function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': userAgent } }, (res) => {
      let data = Buffer.alloc(0);
      res.on('data', chunk => { data = Buffer.concat([data, chunk]); });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async function main() {
  try {
    const cssUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@1,700&display=swap';
    const cssData = await download(cssUrl);
    let cssText = cssData.toString('utf-8');
    
    // Parse url(...)
    const fontUrls = [];
    cssText = cssText.replace(/url\((https:\/\/[^\)]+)\)/g, (match, url) => {
      fontUrls.push(url);
      const parts = url.split('/');
      const filename = `${parts[parts.length - 2]}-${parts[parts.length - 1]}`;
      return `url('/fonts/${filename}')`;
    });

    const fontsDir = path.join(__dirname, '../public/fonts');
    if (!fs.existsSync(fontsDir)) {
      fs.mkdirSync(fontsDir, { recursive: true });
    }

    // download all fonts
    for (const url of fontUrls) {
      console.log('Downloading', url);
      const fontData = await download(url);
      const parts = url.split('/');
      const filename = `${parts[parts.length - 2]}-${parts[parts.length - 1]}`;
      fs.writeFileSync(path.join(fontsDir, filename), fontData);
    }

    fs.writeFileSync(path.join(__dirname, '../public/fonts.css'), cssText);
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
})();
