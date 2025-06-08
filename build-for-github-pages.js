#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Building for GitHub Pages...');

// 1. Preserve existing data directory
const docsPath = path.join(__dirname, 'docs');
const dataPath = path.join(docsPath, 'data');
let existingData = {};

if (fs.existsSync(dataPath)) {
  // Backup existing data files
  const dataFiles = fs.readdirSync(dataPath);
  dataFiles.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(dataPath, file);
      try {
        existingData[file] = fs.readFileSync(filePath, 'utf8');
      } catch (e) {
        console.log(`⚠️  Could not backup ${file}`);
      }
    }
  });
}

// 2. Build the project with correct base path
console.log('📦 Building project...');
process.env.NODE_ENV = 'production';
execSync('npx vite build --outDir=../docs-temp --base="./" --mode=production', { 
  stdio: 'inherit',
  cwd: path.join(__dirname, 'client')
});

// 3. Fix HTML paths for GitHub Pages
const tempIndexPath = path.join(__dirname, 'docs-temp', 'index.html');
if (fs.existsSync(tempIndexPath)) {
  let htmlContent = fs.readFileSync(tempIndexPath, 'utf8');
  htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
  htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');
  
  // Add SPA routing fix
  const routingFix = `
    <!-- GitHub Pages SPA routing fix -->
    <script>
      (function() {
        const redirect = sessionStorage.getItem('pathToRedirect');
        if (redirect) {
          sessionStorage.removeItem('pathToRedirect');
          history.replaceState(null, null, redirect);
        }
      })();
    </script>`;
  
  htmlContent = htmlContent.replace('<div id="root"></div>', `<div id="root"></div>${routingFix}`);
  fs.writeFileSync(tempIndexPath, htmlContent, 'utf8');
  console.log('📄 Fixed HTML paths for GitHub Pages');
}

// 4. Copy built files to docs
const distPath = path.join(__dirname, 'docs-temp');
if (fs.existsSync(distPath)) {
  console.log('📋 Copying built files to docs/...');
  
  // Copy all files except data folder
  const copyRecursive = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      files.forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  // Remove old files but preserve data
  if (fs.existsSync(docsPath)) {
    const files = fs.readdirSync(docsPath);
    files.forEach(file => {
      if (file !== 'data' && file !== '.nojekyll') {
        const filePath = path.join(docsPath, file);
        if (fs.statSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      }
    });
  }
  
  copyRecursive(distPath, docsPath);
}

// 4. Restore/create data directory
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

// 5. Restore existing data or create initial files
const jsonFiles = [
  'users.json',
  'products.json', 
  'categories.json',
  'colors.json',
  'pricing-tables.json',
  'promotions.json',
  'announcements.json'
];

jsonFiles.forEach(file => {
  const filePath = path.join(dataPath, file);
  if (existingData[file]) {
    // Restore existing data
    fs.writeFileSync(filePath, existingData[file], 'utf8');
    console.log(`📄 Restored ${file}`);
  } else if (!fs.existsSync(filePath)) {
    // Create empty file
    fs.writeFileSync(filePath, '[]', 'utf8');
    console.log(`📄 Created ${file}`);
  }
});

// 6. Ensure .nojekyll exists
const nojekyllPath = path.join(docsPath, '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '', 'utf8');
  console.log('📄 Created .nojekyll');
}

console.log('✅ GitHub Pages build complete!');
console.log('📁 Files are ready in the docs/ directory');
console.log('🌐 Configure GitHub Pages to serve from docs/ directory');