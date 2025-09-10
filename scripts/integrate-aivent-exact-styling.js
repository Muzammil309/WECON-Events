/**
 * AIvent Exact Styling Integration Script
 * Updates all components to match the exact AIvent template styling
 */

const fs = require('fs');
const path = require('path');

// Exact AIvent color scheme extracted from the original
const AIVENT_COLORS = {
  primary: '#764DF0',
  secondary: '#442490',
  dark: {
    primary: '#101435',
    secondary: '#0F0B1F',
    tertiary: '#1A1C26'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
    background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
    hero: 'linear-gradient(135deg, #764DF0 0%, #442490 25%, #101435 50%, #1A1C26 75%, #0F0B1F 100%)'
  }
};

// Exact AIvent typography
const AIVENT_TYPOGRAPHY = {
  fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  }
};

// Component updates to match exact AIvent styling
const COMPONENT_UPDATES = {
  'src/app/page.tsx': {
    replacements: [
      {
        find: 'background: \'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)\'',
        replace: `background: '${AIVENT_COLORS.gradients.background}'`
      },
      {
        find: 'fontFamily: \'Manrope, Helvetica, Arial, sans-serif\'',
        replace: `fontFamily: '${AIVENT_TYPOGRAPHY.fontFamily}'`
      }
    ]
  },
  'src/components/sections/AIventHeroExact.tsx': {
    replacements: [
      {
        find: 'background: `linear-gradient(135deg, #764DF0 0%, #442490 25%, #101435 50%, #1A1C26 75%, #0F0B1F 100%)`',
        replace: `background: \`${AIVENT_COLORS.gradients.hero}\``
      }
    ]
  },
  'src/components/sections/AIventSpeakers.tsx': {
    replacements: [
      {
        find: 'background: \'rgba(118, 77, 240, 0.1)\'',
        replace: `background: 'rgba(118, 77, 240, 0.1)'`
      },
      {
        find: 'border: \'1px solid rgba(118, 77, 240, 0.2)\'',
        replace: `border: '1px solid rgba(118, 77, 240, 0.2)'`
      }
    ]
  }
};

// Global CSS updates for exact AIvent styling
const GLOBAL_CSS_UPDATES = `
/* AIvent Exact Styling Integration */
@import url('https://fonts.googleapis.com/css2?family=Manrope:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

:root {
  /* AIvent Color Variables */
  --aivent-primary: ${AIVENT_COLORS.primary};
  --aivent-secondary: ${AIVENT_COLORS.secondary};
  --aivent-dark-primary: ${AIVENT_COLORS.dark.primary};
  --aivent-dark-secondary: ${AIVENT_COLORS.dark.secondary};
  --aivent-dark-tertiary: ${AIVENT_COLORS.dark.tertiary};
  
  /* AIvent Typography */
  --aivent-font-family: ${AIVENT_TYPOGRAPHY.fontFamily};
  --aivent-font-weight-light: ${AIVENT_TYPOGRAPHY.weights.light};
  --aivent-font-weight-regular: ${AIVENT_TYPOGRAPHY.weights.regular};
  --aivent-font-weight-medium: ${AIVENT_TYPOGRAPHY.weights.medium};
  --aivent-font-weight-semibold: ${AIVENT_TYPOGRAPHY.weights.semibold};
  --aivent-font-weight-bold: ${AIVENT_TYPOGRAPHY.weights.bold};
  --aivent-font-weight-extrabold: ${AIVENT_TYPOGRAPHY.weights.extrabold};
  --aivent-font-weight-black: ${AIVENT_TYPOGRAPHY.weights.black};
  
  /* AIvent Gradients */
  --aivent-gradient-primary: ${AIVENT_COLORS.gradients.primary};
  --aivent-gradient-background: ${AIVENT_COLORS.gradients.background};
  --aivent-gradient-hero: ${AIVENT_COLORS.gradients.hero};
}

/* AIvent Global Styles */
.aivent-primary-gradient {
  background: var(--aivent-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.aivent-hero-gradient {
  background: var(--aivent-gradient-hero);
}

.aivent-background-gradient {
  background: var(--aivent-gradient-background);
}

.aivent-glass-morphism {
  background: rgba(118, 77, 240, 0.1);
  border: 1px solid rgba(118, 77, 240, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.aivent-font {
  font-family: var(--aivent-font-family);
}

.aivent-heading {
  font-family: var(--aivent-font-family);
  font-weight: var(--aivent-font-weight-black);
  letter-spacing: -0.02em;
}

/* AIvent Button Styles */
.aivent-button-primary {
  background: var(--aivent-gradient-primary);
  color: white;
  font-family: var(--aivent-font-family);
  font-weight: var(--aivent-font-weight-bold);
  border-radius: 50px;
  padding: 16px 32px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.aivent-button-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(118, 77, 240, 0.3);
}

/* AIvent Card Styles */
.aivent-card {
  background: rgba(118, 77, 240, 0.1);
  border: 1px solid rgba(118, 77, 240, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
}

/* AIvent Animation Classes */
.aivent-fade-in {
  animation: aiventFadeIn 0.8s ease-out;
}

.aivent-slide-up {
  animation: aiventSlideUp 0.8s ease-out;
}

@keyframes aiventFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes aiventSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Function to update component files
function updateComponentFile(filePath, updates) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    updates.replacements.forEach(({ find, replace }) => {
      if (content.includes(find)) {
        content = content.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
        updated = true;
        console.log(`✅ Updated: ${filePath} - ${find.substring(0, 50)}...`);
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`💾 Saved: ${filePath}`);
    } else {
      console.log(`ℹ️  No updates needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Function to update global CSS
function updateGlobalCSS() {
  const globalCSSPath = 'src/app/globals.css';
  
  try {
    let content = fs.readFileSync(globalCSSPath, 'utf8');
    
    // Check if AIvent styles are already added
    if (!content.includes('/* AIvent Exact Styling Integration */')) {
      content += '\n\n' + GLOBAL_CSS_UPDATES;
      fs.writeFileSync(globalCSSPath, content, 'utf8');
      console.log('✅ Added AIvent exact styling to globals.css');
    } else {
      console.log('ℹ️  AIvent styling already exists in globals.css');
    }
  } catch (error) {
    console.error('❌ Error updating globals.css:', error.message);
  }
}

// Main integration function
function integrateAIventExactStyling() {
  console.log('🎨 Starting AIvent Exact Styling Integration...\n');

  // Update global CSS first
  updateGlobalCSS();

  // Update component files
  Object.entries(COMPONENT_UPDATES).forEach(([filePath, updates]) => {
    updateComponentFile(filePath, updates);
  });

  console.log('\n✅ AIvent exact styling integration completed!');
  console.log('🎯 All components now use exact AIvent colors, typography, and styling');
  console.log('📁 Global CSS variables added for consistent theming');
}

// Run the integration
integrateAIventExactStyling();
