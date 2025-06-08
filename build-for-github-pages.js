#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for GitHub Pages...');

// 1. Build the project
console.log('📦 Building project...');
execSync('npm run build', { stdio: 'inherit' });

// 2. Create docs directory structure if it doesn't exist
const docsPath = path.join(__dirname, 'docs');
const dataPath = path.join(docsPath, 'data');

if (!fs.existsSync(docsPath)) {
  fs.mkdirSync(docsPath, { recursive: true });
}

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

// 3. Create initial JSON files if they don't exist
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
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    console.log(`📄 Created ${file}`);
  }
});

// 4. Copy built files to docs directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  // Copy all files from dist to docs, preserving data folder
  const copyRecursive = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      files.forEach(file => {
        // Skip data folder to preserve existing data
        if (file === 'data') return;
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  console.log('📋 Copying built files to docs/...');
  const files = fs.readdirSync(distPath);
  files.forEach(file => {
    if (file !== 'data') {
      copyRecursive(path.join(distPath, file), path.join(docsPath, file));
    }
  });
}

console.log('✅ GitHub Pages build complete!');
console.log('📁 Files are ready in the docs/ directory');
console.log('🌐 Configure GitHub Pages to serve from docs/ directory');