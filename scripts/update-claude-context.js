/**
 * Updates Claude context files based on the current project state
 * 
 * This script scans the codebase and updates Claude's context files to reflect
 * the latest architecture, features, and coding patterns.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to collect files for analysis
async function collectFiles(patterns) {
  const files = await glob(patterns, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    cwd: path.resolve(__dirname, '..'),
    absolute: true,
  });
  return files;
}

const updateClaudeContext = async () => {
  console.log('Updating Claude context files...');
  
  try {
    // Find key files in the project
    const tsFiles = await collectFiles('src/**/*.ts');
    const tsxFiles = await collectFiles('src/**/*.tsx');
    const configFiles = await collectFiles('{vite,tsconfig,vitest,package}.{json,js,ts}');
    
    console.log(`Found ${tsFiles.length} TS files, ${tsxFiles.length} TSX files, and ${configFiles.length} config files`);
    
    // Extract key architectural patterns
    const componentFiles = tsxFiles.filter(file => file.includes('/components/'));
    const pageFiles = tsxFiles.filter(file => file.includes('/pages/'));
    const serviceFiles = tsFiles.filter(file => file.includes('/services/'));
    const storeFiles = tsFiles.filter(file => file.includes('/store/'));
    
    // Update architecture.md context file
    const architectureContent = `# DAMFront Architecture

The DAMFront application follows an MVC (Model-View-Controller) architecture with a service layer:

## Project Structure

- **Components**: ${componentFiles.length} reusable UI components
- **Pages**: ${pageFiles.length} page components
- **Services**: ${serviceFiles.length} API and business logic services
- **Store**: ${storeFiles.length} state management modules
- **Hooks**: Custom React hooks for shared logic
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions

## Data Flow

1. User interactions trigger events in the UI components
2. Events are handled by state management (Zustand)
3. Business logic is implemented in services
4. API calls are made through service layers
5. UI updates are driven by state changes

## Tech Stack

- React ${await getReactVersion()}
- TypeScript
- Vite ${await getViteVersion()}
- Styled Components
- React Router
- Zustand for state management
- React Query for data fetching
`;

    // Write updated context files
    const contextDir = path.join(__dirname, '../.claude/context');
    await fs.promises.writeFile(path.join(contextDir, 'architecture.md'), architectureContent);
    
    console.log('Context files updated successfully');
  } catch (error) {
    console.error('Error updating context files:', error);
  }
};

// Helper functions to get package versions
async function getReactVersion() {
  try {
    const packageJson = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json'), 'utf8'));
    return packageJson.dependencies.react;
  } catch (error) {
    return 'latest';
  }
}

async function getViteVersion() {
  try {
    const packageJson = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json'), 'utf8'));
    return packageJson.devDependencies.vite;
  } catch (error) {
    return 'latest';
  }
}

updateClaudeContext();
