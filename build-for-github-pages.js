#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// 2. Build the project (builds to dist/public)
console.log('📦 Building project...');
execSync('vite build --outDir=dist/github-pages --base="./"', { 
  stdio: 'inherit',
  cwd: path.join(__dirname, 'client')
});

// 3. Copy built files to docs
const distPath = path.join(__dirname, 'dist', 'github-pages');
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