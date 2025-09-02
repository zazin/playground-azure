#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// CLI Banner
console.log('🚀 Azure OAuth2 Playground');
console.log('📦 Interactive Microsoft Graph API testing environment');
console.log('');

// Parse command line arguments
const args = process.argv.slice(2);
const port = args.find(arg => arg.startsWith('--port='))?.split('=')[1] || '3000';
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log('Usage: npx playground-azure [options]');
  console.log('');
  console.log('Options:');
  console.log('  --port=PORT    Set the server port (default: 3000)');
  console.log('  --help, -h     Show this help message');
  console.log('');
  console.log('Features:');
  console.log('  • OAuth2 Authorization Code flow with Microsoft Graph');
  console.log('  • Auto-save scope management');
  console.log('  • Microsoft Teams Chat & Calendar APIs');
  console.log('  • Token management with refresh & revoke');
  console.log('  • Interactive JSON viewer with copy functionality');
  console.log('  • Persistent token storage');
  console.log('');
  console.log('After starting, open http://localhost:' + port + ' in your browser');
  process.exit(0);
}

// Check if required dependencies exist
const packageJsonPath = join(projectRoot, 'package.json');
const nodeModulesPath = join(projectRoot, 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('');
  
  const npm = spawn('npm', ['install'], {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  
  npm.on('close', (code) => {
    if (code === 0) {
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log(`🌟 Starting Azure OAuth2 Playground on port ${port}...`);
  console.log(`🔗 Open http://localhost:${port} in your browser`);
  console.log('');
  console.log('💡 Quick Start:');
  console.log('  1. Configure your Azure AD app credentials');
  console.log('  2. Select scopes for Microsoft Graph APIs');
  console.log('  3. Generate and test access tokens');
  console.log('  4. Explore Teams Chat & Calendar APIs');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('');

  // Set the PORT environment variable
  process.env.PORT = port;

  // Start the server
  const serverPath = join(projectRoot, 'src', 'server.js');
  const server = spawn('node', [serverPath], {
    cwd: projectRoot,
    stdio: 'inherit',
    env: { ...process.env, PORT: port }
  });

  // Handle server process events
  server.on('close', (code) => {
    if (code !== 0) {
      console.log(`\n❌ Server exited with code ${code}`);
    } else {
      console.log('\n👋 Thanks for using Azure OAuth2 Playground!');
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    server.kill('SIGTERM');
  });
}