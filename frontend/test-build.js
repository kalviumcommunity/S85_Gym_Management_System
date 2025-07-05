// Test build script
const { execSync } = require('child_process');

console.log('🧪 Testing build process...');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  execSync('rm -rf dist', { stdio: 'inherit' });
  
  // Run build
  console.log('🔨 Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 