import fs from 'fs';
import https from 'https';
import path from 'path';

const CSS_URL = 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,700;0,900;1,900&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@1,700&display=swap';

https.get(CSS_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102 Safari/537.36' } }, (res) => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', () => {
    const regex = /url\((https:\/\/[^\)]+\.woff2)\)/g;
    let match;
    fs.mkdirSync('./public/fonts', { recursive: true });
    
    let fontCount = 0;
    const downloads = [];
    
    const newCss = css.replace(regex, (full, url) => {
      const fileName = `font-${++fontCount}.woff2`;
      downloads.push(new Promise((resolve) => {
        https.get(url, (resFont) => {
          const file = fs.createWriteStream(path.join('./public/fonts', fileName));
          resFont.pipe(file);
          resFont.on('end', resolve);
        });
      }));
      return `url('/fonts/${fileName}')`;
    });
    
    fs.writeFileSync('./public/fonts.css', newCss);
    
    Promise.all(downloads).then(() => {
      console.log('Downloaded fonts successfully.');
    });
  });
});
