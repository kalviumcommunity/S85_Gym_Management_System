// Test import script
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing AuthContext import...');

try {
  const authContextPath = join(__dirname, 'src', 'context', 'AuthContext.jsx');
  console.log('📁 Checking file path:', authContextPath);
  
  if (fs.existsSync(authContextPath)) {
    console.log('✅ AuthContext.jsx file exists');
    
    // Try to read the file
    const content = fs.readFileSync(authContextPath, 'utf8');
    console.log('✅ File can be read, size:', content.length, 'characters');
    
    // Check if it has the expected exports
    if (content.includes('export const AuthProvider')) {
      console.log('✅ AuthProvider export found');
    }
    
    if (content.includes('export const useAuth')) {
      console.log('✅ useAuth export found');
    }
    
  } else {
    console.log('❌ AuthContext.jsx file does not exist');
  }
  
} catch (error) {
  console.error('❌ Error testing import:', error.message);
} 