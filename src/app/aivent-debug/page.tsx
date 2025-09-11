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
        <title>AIvent Debug - Video Background Analysis</title>
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
        
        {/* Debug styles */}
        <style>{`
          .debug-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            max-height: 80vh;
            overflow-y: auto;
          }
          .debug-panel h3 {
            margin: 0 0 10px 0;
            color: #00ff00;
          }
          .debug-panel .status {
            margin: 5px 0;
            padding: 3px 6px;
            border-radius: 3px;
          }
          .debug-panel .status.success {
            background: #004400;
            color: #00ff00;
          }
          .debug-panel .status.error {
            background: #440000;
            color: #ff0000;
          }
          .debug-panel .status.warning {
            background: #444400;
            color: #ffff00;
          }
          .debug-panel .log {
            background: #222;
            padding: 5px;
            margin: 5px 0;
            border-radius: 3px;
            max-height: 200px;
            overflow-y: auto;
          }
        `}</style>
      </head>
      <body className="dark-scheme">
        {/* Debug Panel */}
        <div id="debug-panel" className="debug-panel">
          <h3>AIvent Video Debug</h3>
          <div id="debug-status">Initializing...</div>
          <div id="debug-log" className="log"></div>
        </div>

        {/* Inject mirrored body content */}
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />

        {/* Load mirrored JS in original order for exact functionality */}
        <Script src="/aivent-mirror/js/vendors.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/designesia.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/countdown-custom.js" strategy="afterInteractive" />
        <Script src="/aivent-mirror/js/custom-marquee.js" strategy="afterInteractive" />
        
        {/* Comprehensive debugging and initialization */}
        <Script id="debug-jarallax" strategy="afterInteractive">
          {`
            let debugLog = [];
            
            function addDebugLog(message, type = 'info') {
              const timestamp = new Date().toLocaleTimeString();
              debugLog.push({ timestamp, message, type });
              updateDebugPanel();
              console.log('[AIvent Debug]', message);
            }
            
            function updateDebugPanel() {
              const statusEl = document.getElementById('debug-status');
              const logEl = document.getElementById('debug-log');
              
              if (statusEl && logEl) {
                // Update status
                const lastLog = debugLog[debugLog.length - 1];
                if (lastLog) {
                  statusEl.innerHTML = '<div class="status ' + lastLog.type + '">' + lastLog.message + '</div>';
                }
                
                // Update log
                logEl.innerHTML = debugLog.map(log => 
                  '<div class="status ' + log.type + '">[' + log.timestamp + '] ' + log.message + '</div>'
                ).join('');
                logEl.scrollTop = logEl.scrollHeight;
              }
            }
            
            // Start debugging
            addDebugLog('Debug panel initialized', 'success');
            
            // Check for required libraries
            function checkLibraries() {
              addDebugLog('Checking libraries...', 'info');
              
              if (typeof jQuery === 'undefined') {
                addDebugLog('jQuery not found!', 'error');
                return false;
              } else {
                addDebugLog('jQuery found: v' + jQuery.fn.jquery, 'success');
              }
              
              if (typeof jQuery.fn.jarallax === 'undefined') {
                addDebugLog('Jarallax not found!', 'error');
                return false;
              } else {
                addDebugLog('Jarallax found', 'success');
              }
              
              return true;
            }
            
            // Analyze hero section
            function analyzeHeroSection() {
              const heroSection = document.querySelector('#section-hero');
              if (!heroSection) {
                addDebugLog('Hero section not found!', 'error');
                return;
              }
              
              addDebugLog('Hero section found', 'success');
              addDebugLog('Classes: ' + heroSection.className, 'info');
              
              const videoSrc = heroSection.getAttribute('data-video-src');
              if (videoSrc) {
                addDebugLog('Video source: ' + videoSrc, 'success');
              } else {
                addDebugLog('No video source found!', 'error');
              }
              
              // Check for existing video elements
              const existingVideo = heroSection.querySelector('video');
              if (existingVideo) {
                addDebugLog('Existing video element found', 'success');
                addDebugLog('Video src: ' + existingVideo.src, 'info');
              } else {
                addDebugLog('No video element found yet', 'warning');
              }
            }
            
            // Initialize Jarallax with debugging
            function initializeJarallax() {
              if (!checkLibraries()) {
                setTimeout(initializeJarallax, 1000);
                return;
              }
              
              analyzeHeroSection();
              
              addDebugLog('Initializing Jarallax...', 'info');
              
              try {
                // Initialize with detailed options
                jQuery('.jarallax').jarallax({
                  speed: 0.2,
                  videoSrc: 'mp4:/aivent-mirror/video/2.mp4',
                  videoStartTime: 0,
                  videoEndTime: 0,
                  videoVolume: 0,
                  videoLoop: true,
                  videoPlayOnlyVisible: true,
                  videoLazyLoading: false,
                  disableParallax: false,
                  disableVideo: false,
                  keepImg: false,
                  elementInViewport: null,
                  zIndex: -100,
                  noAndroid: false,
                  noIos: false,
                  onScroll: function(calculations, percentY) {
                    // addDebugLog('Scroll: ' + percentY.toFixed(2), 'info');
                  },
                  onInit: function() {
                    addDebugLog('Jarallax initialized successfully!', 'success');
                    setTimeout(checkVideoStatus, 1000);
                  },
                  onDestroy: function() {
                    addDebugLog('Jarallax destroyed', 'warning');
                  },
                  onCoverImage: function() {
                    addDebugLog('Cover image applied', 'info');
                  }
                });
                
                addDebugLog('Jarallax init called', 'success');
                
              } catch (error) {
                addDebugLog('Jarallax init error: ' + error.message, 'error');
              }
            }
            
            // Check video status after initialization
            function checkVideoStatus() {
              const heroSection = document.querySelector('#section-hero');
              const videoElement = heroSection ? heroSection.querySelector('video') : null;
              
              if (videoElement) {
                addDebugLog('Video element created!', 'success');
                addDebugLog('Video ready state: ' + videoElement.readyState, 'info');
                addDebugLog('Video paused: ' + videoElement.paused, 'info');
                addDebugLog('Video muted: ' + videoElement.muted, 'info');
                addDebugLog('Video loop: ' + videoElement.loop, 'info');
                
                // Try to play the video
                videoElement.play().then(() => {
                  addDebugLog('Video playing successfully!', 'success');
                }).catch(error => {
                  addDebugLog('Video play error: ' + error.message, 'error');
                });
              } else {
                addDebugLog('Video element still not found', 'error');
              }
            }
            
            // Start initialization when DOM is ready
            document.addEventListener('DOMContentLoaded', function() {
              addDebugLog('DOM ready, starting initialization...', 'info');
              setTimeout(initializeJarallax, 1000);
            });
            
            // Also try on window load
            window.addEventListener('load', function() {
              addDebugLog('Window loaded', 'info');
              setTimeout(initializeJarallax, 500);
            });
          `}
        </Script>
      </body>
    </html>
  );
}
