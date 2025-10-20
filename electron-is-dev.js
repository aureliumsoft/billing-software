module.exports = !process.argv.includes('--no-dev') && (process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath));


