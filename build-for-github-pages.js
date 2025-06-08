import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildForGitHubPages() {
  try {
    console.log('Building for GitHub Pages...');

    // Build using the GitHub Pages config
    await build({
      configFile: resolve(__dirname, 'vite.github.config.ts'),
    });

    // Create .nojekyll file to prevent GitHub from processing with Jekyll
    await fs.writeFile(resolve(__dirname, 'docs', '.nojekyll'), '');

    // Create a proper 404.html for SPA routing
    const indexContent = await fs.readFile(resolve(__dirname, 'docs', 'index.html'), 'utf-8');
    await fs.writeFile(resolve(__dirname, 'docs', '404.html'), indexContent);

    console.log('Build completed successfully!');
    console.log('Files are ready in the docs/ directory for GitHub Pages deployment.');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForGitHubPages();