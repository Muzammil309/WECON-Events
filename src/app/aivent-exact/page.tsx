import fs from 'fs';
import path from 'path';
import Script from 'next/script';

export const dynamic = 'force-static';

function readBodyHtml(): string {
  try {
    const p = path.join(process.cwd(), 'public', 'aivent-mirror', 'body.html');
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return '<div style="padding:2rem;color:#fff;background:#111">Mirror not found. Run: node scripts/mirror-aivent.js</div>';
  }
}

export default function Page() {
  const html = readBodyHtml();
  return (
    <html suppressHydrationWarning>
      <body>
        {/* Ensure original body class for exact styling */}
        <Script id="apply-dark-scheme" strategy="beforeInteractive">{
          `document.addEventListener('DOMContentLoaded',function(){document.body.classList.add('dark-scheme');});`}
        </Script>

        {/* Inject mirrored body content */}
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />

        {/* Load mirrored JS in original order */}
        <Script src="/aivent-mirror/js/vendors.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/designesia.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/countdown-custom.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/custom-marquee.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

