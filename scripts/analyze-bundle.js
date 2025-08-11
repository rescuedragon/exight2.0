#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Install bundle analyzer if not present
  try {
    execSync('npm list --depth=0 | grep -q "rollup-plugin-visualizer"', { stdio: 'ignore' });
  } catch {
    console.log('📊 Installing bundle analyzer...');
    execSync('npm install --save-dev rollup-plugin-visualizer', { stdio: 'inherit' });
  }
  
  // Update Vite config to include bundle analyzer
  const viteConfigPath = resolve(__dirname, '../vite.config.ts');
  let viteConfig = readFileSync(viteConfigPath, 'utf8');
  
  if (!viteConfig.includes('rollup-plugin-visualizer')) {
    console.log('⚙️  Adding bundle analyzer to Vite config...');
    
    const analyzerImport = "import { visualizer } from 'rollup-plugin-visualizer';";
    const analyzerPlugin = `
  visualizer({
    filename: 'dist/bundle-analysis.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  }),`;
    
    viteConfig = viteConfig.replace(
      'plugins: [',
      `plugins: [${analyzerPlugin}`
    );
    
    if (!viteConfig.includes(analyzerImport)) {
      viteConfig = analyzerImport + '\n' + viteConfig;
    }
    
    writeFileSync(viteConfigPath, viteConfig);
  }
  
  // Rebuild with analyzer
  console.log('📊 Building with bundle analyzer...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Bundle analysis complete!');
  console.log('📁 Check dist/bundle-analysis.html for detailed breakdown');
  
  // Generate summary report
  const distPath = resolve(__dirname, '../dist');
  const files = execSync('ls -la dist/', { cwd: distPath, encoding: 'utf8' });
  
  console.log('\n📋 Bundle Summary:');
  console.log(files);
  
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
