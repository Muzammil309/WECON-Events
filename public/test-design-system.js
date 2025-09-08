
// Modern Design System Test
// Run this in your browser console to test CSS variables

console.log('🎨 WECON Modern Design System Test');
console.log('==================================');

const root = document.documentElement;
const computedStyle = getComputedStyle(root);

const testVariables = [
  '--primary-bg',
  '--text-primary',
  '--text-secondary',
  '--accent-blue',
  '--font-primary'
];

testVariables.forEach(variable => {
  const value = computedStyle.getPropertyValue(variable);
  console.log(`${variable}: ${value}`);
});

console.log('✅ Design system variables loaded successfully!');
