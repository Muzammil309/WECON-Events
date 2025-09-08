/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const targets = [
  { url: 'https://madebydesignesia.com/themes/aivent/css/style.css', out: 'public/assets/aivent/css/style.css' },
  { url: 'https://madebydesignesia.com/themes/aivent/css/colors/scheme-01.css', out: 'public/assets/aivent/css/scheme-01.css' },
  { url: 'https://madebydesignesia.com/themes/aivent/images/misc/l3.webp', out: 'public/assets/aivent/images/misc/l3.webp' },
  { url: 'https://madebydesignesia.com/themes/aivent/images/misc/l4.webp', out: 'public/assets/aivent/images/misc/l4.webp' },
  { url: 'https://madebydesignesia.com/themes/aivent/images/misc/l5.webp', out: 'public/assets/aivent/images/misc/l5.webp' }
];

function ensureDir(p) {
  const dir = path.dirname(p);
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, out) {
  return new Promise((resolve, reject) => {
    ensureDir(out);
    const file = fs.createWriteStream(out);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(out, () => {});
          return reject(new Error(`${url} -> HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (err) => {
        file.close();
        fs.unlink(out, () => {});
        reject(err);
      });
  });
}

async function main() {
  let ok = 0, fail = 0;
  for (const t of targets) {
    try {
      await download(t.url, t.out);
      console.log('Downloaded:', t.url, '->', t.out);
      ok++;
    } catch (e) {
      console.warn('Failed:', t.url, String(e.message || e));
      fail++;
    }
  }
  console.log(`Done. Success: ${ok}, Failed: ${fail}`);
}

main();

