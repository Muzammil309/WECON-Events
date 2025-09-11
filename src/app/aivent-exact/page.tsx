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

        {/* Enhanced CSS for exact AIvent video background effects */}
        <style>{`
          /* CSS Variables matching original AIvent theme */
          :root {
            --bg-dark-1: #101435;
            --bg-dark-1-rgb: 16, 20, 53;
            --primary-color-rgb: 250, 208, 76;
          }

          /* Ensure proper Jarallax video positioning and effects */
          .jarallax {
            position: relative;
            z-index: 0;
            overflow: hidden;
          }

          .jarallax > .jarallax-img {
            position: absolute;
            object-fit: cover;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            transition: opacity 0.3s ease;
          }

          .jarallax-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
          }

          .jarallax-video video {
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            transform: translate(-50%, -50%);
            object-fit: cover;
          }

          /* Exact overlay positioning and effects from original */
          #section-hero .gradient-edge-top {
            z-index: 1;
            position: absolute;
            top: 0;
            width: 100%;
            height: 30%;
            background: linear-gradient(180deg, rgba(var(--bg-dark-1-rgb), 1) 0%, rgba(var(--bg-dark-1-rgb), 0) 100%);
          }

          #section-hero .gradient-edge-top.color {
            background: linear-gradient(180deg, rgba(var(--primary-color-rgb), 1) 0%, rgba(var(--primary-color-rgb), 0) 100%);
          }

          #section-hero .gradient-edge-bottom {
            z-index: 1;
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 30%;
            background: linear-gradient(0deg, rgba(var(--bg-dark-1-rgb), 1) 0%, rgba(var(--bg-dark-1-rgb), 0) 100%);
          }

          #section-hero .sw-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: linear-gradient(0deg, rgba(var(--bg-dark-1-rgb), .8) 0%, rgba(var(--bg-dark-1-rgb), .8) 50%);
          }

          /* Ensure content is above video and overlays */
          #section-hero .abs-centered {
            z-index: 2;
          }

          /* Force minimum height and proper positioning for hero section */
          #section-hero {
            min-height: 800px;
            position: relative;
            overflow: hidden;
          }

          /* Ensure video loads and plays properly */
          .jarallax-video video {
            opacity: 1 !important;
          }
        `}</style>
      </head>
      <body className="dark-scheme">
        {/* Inject mirrored body content */}
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />

        {/* Load mirrored JS in original order for exact functionality */}
        <Script src="/aivent-mirror/js/vendors.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/designesia.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/countdown-custom.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/custom-marquee.js" strategy="afterInteractive" />

        {/* Initialize Jarallax and other effects with exact configuration */}
        <Script id="init-effects" strategy="afterInteractive">
          {`
            // Exact initialization sequence matching the original AIvent template
            function initializeAIventEffects() {
              console.log('Starting AIvent initialization...');

              // Check if all required libraries are loaded
              if (typeof jQuery === 'undefined') {
                console.log('jQuery not loaded, retrying...');
                setTimeout(initializeAIventEffects, 500);
                return;
              }

              if (typeof jQuery.fn.jarallax === 'undefined') {
                console.log('Jarallax not loaded, retrying...');
                setTimeout(initializeAIventEffects, 500);
                return;
              }

              console.log('All libraries loaded, initializing...');

              // Initialize Jarallax exactly as in the original designesia.js
              jQuery('.jarallax').jarallax();

              // Verify video initialization
              setTimeout(function() {
                var heroSection = jQuery('#section-hero');
                if (heroSection.length) {
                  console.log('Hero section found');
                  var videoSrc = heroSection.attr('data-video-src');
                  console.log('Video source:', videoSrc);

                  // Check if video element was created
                  var videoElement = heroSection.find('video');
                  if (videoElement.length) {
                    console.log('Video element created successfully');
                    console.log('Video element:', videoElement[0]);

                    // Ensure video plays
                    videoElement[0].play().then(function() {
                      console.log('Video playing successfully');
                    }).catch(function(error) {
                      console.log('Video play error:', error);
                    });
                  } else {
                    console.log('Video element not found, checking Jarallax container...');
                    var jarallaxVideo = heroSection.find('.jarallax-video');
                    if (jarallaxVideo.length) {
                      console.log('Jarallax video container found:', jarallaxVideo[0]);
                    } else {
                      console.log('No video container found');
                    }
                  }
                }
              }, 2000);

              // Initialize WOW animations if available
              if (typeof WOW !== 'undefined') {
                new WOW().init();
                console.log('WOW animations initialized');
              }

              // Initialize countdown
              if (jQuery('#defaultCountdown').length && jQuery.fn.countdown) {
                var countdownDate = new Date();
                countdownDate.setDate(countdownDate.getDate() + 30);
                jQuery('#defaultCountdown').countdown(countdownDate, function(event) {
                  jQuery(this).html(event.strftime('%D days %H:%M:%S'));
                });
                console.log('Countdown initialized');
              }

              console.log('AIvent initialization complete');
            }

            // Start initialization when DOM is ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initializeAIventEffects);
            } else {
              initializeAIventEffects();
            }

            // Also try on window load as backup
            window.addEventListener('load', function() {
              setTimeout(initializeAIventEffects, 1000);
            });
          `}
        </Script>
      </body>
    </html>
  );
}

