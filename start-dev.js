const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Cafe POS Development Environment...\n');

// Start React development server
console.log('📦 Starting React development server...');
const reactServer = spawn('npm', ['start'], {
  stdio: 'pipe',
  shell: true
});

reactServer.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[React] ${output}`);
  
  // Check if server is ready
  if (output.includes('webpack compiled successfully') || 
      output.includes('You can now view cafe-pos-system in the browser')) {
    
    console.log('\n✅ React server is ready!');
    console.log('🔧 Starting Electron in 3 seconds...\n');
    
    setTimeout(() => {
      console.log('⚡ Launching Electron...');
      const electron = spawn('npx', ['electron', 'electron-dev.js'], {
        stdio: 'inherit',
        shell: true
      });
      
      electron.on('close', (code) => {
        console.log(`\n🔚 Electron exited with code ${code}`);
        process.exit(0);
      });
      
      electron.on('error', (err) => {
        console.error('❌ Electron error:', err);
        process.exit(1);
      });
    }, 3000);
  }
});

reactServer.stderr.on('data', (data) => {
  console.error(`[React Error] ${data}`);
});

reactServer.on('close', (code) => {
  console.log(`\n🔚 React server exited with code ${code}`);
});

reactServer.on('error', (err) => {
  console.error('❌ React server error:', err);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development environment...');
  reactServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development environment...');
  reactServer.kill();
  process.exit(0);
});
