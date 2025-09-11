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
      <head>
        <title>AIvent - Exact Pixel Perfect Replica</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/aivent-mirror/images/icon.webp" />

        {/* Load mirrored CSS files in exact order */}
        <link href="/aivent-mirror/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/aivent-mirror/css/vendors.css" rel="stylesheet" />
        <link href="/aivent-mirror/css/style.css" rel="stylesheet" />
        <link href="/aivent-mirror/css/colors/scheme-01.css" rel="stylesheet" />

        {/* Google Fonts - Manrope (as used in original) */}
        <link href="https://fonts.googleapis.com/css2?family=Manrope:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
      </head>
      <body className="dark-scheme">
        {/* Inject mirrored body content */}
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />

        {/* Load mirrored JS in original order for exact functionality */}
        <Script src="/aivent-mirror/js/vendors.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/designesia.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/countdown-custom.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/custom-marquee.js" strategy="afterInteractive" />

        {/* Initialize Jarallax and other effects after all scripts load */}
        <Script id="init-effects" strategy="afterInteractive">
          {`
            window.addEventListener('load', function() {
              // Ensure Jarallax is initialized for background video effects
              if (typeof jQuery !== 'undefined' && jQuery.fn.jarallax) {
                jQuery('.jarallax').jarallax();
              }

              // Initialize any other effects that might be needed
              if (typeof jQuery !== 'undefined') {
                // Ensure countdown is working
                if (jQuery.fn.countdown) {
                  jQuery('.countdown').each(function() {
                    var element = jQuery(this);
                    if (!element.hasClass('countdown-initialized')) {
                      element.addClass('countdown-initialized');
                    }
                  });
                }

                // Ensure marquee effects are working
                if (typeof initMarquee === 'function') {
                  initMarquee();
                }
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}

