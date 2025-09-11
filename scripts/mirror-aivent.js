#!/usr/bin/env node
/**
 * Mirror the AIvent template locally under public/aivent-mirror with exact assets and HTML.
 * - Fetches the main HTML
 * - Extracts asset URLs (css, js, images, video, demo assets)
 * - Downloads assets preserving folder structure
 * - Parses CSS for url(...) and downloads referenced assets (fonts, images)
 * - Writes rewritten index.html and body.html with local paths
 */

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ORIGIN = 'https://madebydesignesia.com/themes/aivent/';
const ENTRY = new URL('index.html', ORIGIN).toString();
const OUT_DIR = path.join(process.cwd(), 'public', 'aivent-mirror');

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Failed to fetch ${url} → ${res.status}`);
  return await res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Failed to fetch ${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function absolutize(u) {
  return new URL(u, ORIGIN).toString();
}

function collectFromHtml(html) {
  const assets = new Set();
  // link href
  for (const m of html.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)) assets.add(m[1]);
  // script src
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) assets.add(m[1]);
  // img src
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) assets.add(m[1]);
  // video data-video-src like mp4:video/2.mp4
  for (const m of html.matchAll(/data-video-src=["']([^"']+)["']/gi)) {
    const val = m[1];
    const parts = val.split(':');
    if (parts.length === 2) assets.add(parts[1]);
  }
  // demo assets (e.g., demo/envato.svg)
  for (const m of html.matchAll(/src=["'](demo\/[^"']+)["']/gi)) assets.add(m[1]);
  return Array.from(assets);
}

function rewriteHtmlPaths(html) {
  // Convert relative paths to /aivent-mirror/...; handle data-video-src specially
  html = html.replace(/(href|src)=["']([^"']+)["']/gi, (all, attr, url) => {
    if (/^https?:\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('#')) return all;
    const newUrl = `/aivent-mirror/${url.replace(/^\/?/, '')}`;
    return `${attr}="${newUrl}"`;
  });
  html = html.replace(/data-video-src=["']([^"']+)["']/gi, (all, val) => {
    const parts = val.split(':');
    if (parts.length === 2) {
      const newUrl = `/aivent-mirror/${parts[1].replace(/^\/?/, '')}`;
      return `data-video-src="mp4:${newUrl}"`;
    }
    return all;
  });
  return html;
}

function extractBody(html) {
  const bodyMatch = /<body[\s\S]*?>[\s\S]*?<\/body>/i.exec(html);
  if (!bodyMatch) return html;
  const inner = bodyMatch[0].replace(/^[\s\S]*?>/, '').replace(/<\/body>\s*$/i, '');
  return inner.trim();
}

function collectUrlsFromCss(cssText) {
  const urls = new Set();
  for (const m of cssText.matchAll(/url\(([^)]+)\)/gi)) {
    let u = m[1].trim().replace(/["']/g, '');
    // ignore data URIs
    if (/^data:/i.test(u)) continue;
    urls.add(u);
  }
  return Array.from(urls);
}

async function downloadAsset(assetRelPath) {
  const abs = absolutize(assetRelPath);
  const outPath = path.join(OUT_DIR, assetRelPath);
  await ensureDir(path.dirname(outPath));
  const buf = await fetchBuffer(abs);
  await fs.promises.writeFile(outPath, buf);
  return outPath;
}

async function main() {
  console.log('Mirroring AIvent from', ENTRY);
  await ensureDir(OUT_DIR);

  const html = await fetchText(ENTRY);
  const assets = collectFromHtml(html);

  // First: download HTML-linked assets
  for (const a of assets) {
    try {
      console.log('Downloading', a);
      await downloadAsset(a);
    } catch (e) {
      console.warn('Failed to download', a, e.message);
    }
  }

  // Second: parse CSS files for url(...) and download those
  const cssRelFiles = assets.filter((a) => a.endsWith('.css'));
  for (const cssRel of cssRelFiles) {
    try {
      const cssPath = path.join(OUT_DIR, cssRel);
      const cssText = await fs.promises.readFile(cssPath, 'utf8');
      const cssUrls = collectUrlsFromCss(cssText);
      for (const u of cssUrls) {
        try {
          // Skip data URIs and external URLs
          if (u.startsWith('data:') || u.startsWith('http')) continue;

          // Resolve relative to the CSS file location
          const cssDir = path.posix.dirname(cssRel);
          const resolvedRel = path.posix.normalize(path.posix.join(cssDir, u));
          console.log('Downloading CSS asset', resolvedRel);
          await downloadAsset(resolvedRel);
        } catch (e) {
          console.warn('Failed CSS asset', u, e.message);
        }
      }
    } catch (e) {
      console.warn('CSS parse failed', cssRel, e.message);
    }
  }

  // Third: Download common font files that might be missing
  const commonFontPaths = [
    'fonts/icofont/fonts/icofont.woff2',
    'fonts/icofont/fonts/icofont.woff',
    'fonts/icofont/fonts/icofont.ttf',
    'fonts/fontawesome4/fonts/fontawesome-webfont.woff2',
    'fonts/fontawesome4/fonts/fontawesome-webfont.woff',
    'fonts/fontawesome4/fonts/fontawesome-webfont.ttf',
    'fonts/fontawesome6/webfonts/fa-brands-400.woff2',
    'fonts/fontawesome6/webfonts/fa-brands-400.woff',
    'fonts/fontawesome6/webfonts/fa-brands-400.ttf',
    'fonts/fontawesome6/webfonts/fa-solid-900.woff2',
    'fonts/fontawesome6/webfonts/fa-solid-900.woff',
    'fonts/fontawesome6/webfonts/fa-solid-900.ttf'
  ];

  for (const fontPath of commonFontPaths) {
    try {
      console.log('Downloading font', fontPath);
      await downloadAsset(fontPath);
    } catch (e) {
      console.warn('Failed to download font', fontPath, e.message);
    }
  }

  // Write rewritten HTML copies
  const rewritten = rewriteHtmlPaths(html);
  const bodyOnly = extractBody(rewritten);
  await ensureDir(OUT_DIR);
  await fs.promises.writeFile(path.join(OUT_DIR, 'index.html'), rewritten, 'utf8');
  await fs.promises.writeFile(path.join(OUT_DIR, 'body.html'), bodyOnly, 'utf8');

  console.log('Mirror complete at public/aivent-mirror');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

