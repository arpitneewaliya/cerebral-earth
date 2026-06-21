// pythonResolver.js
const fs = require('fs');
const path = require('path');

/**
 * Dynamically resolves the Python executable to use.
 * Checks for the local virtual environment (.venv) first, falling back to global 'python'.
 */
function getPythonExecutable() {
  const winVenvPath = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');
  const unixVenvPath = path.join(__dirname, '..', '.venv', 'bin', 'python');
  const winApiVenvPath = path.join(__dirname, '.venv', 'Scripts', 'python.exe');
  const unixApiVenvPath = path.join(__dirname, '.venv', 'bin', 'python');

  if (fs.existsSync(winVenvPath)) {
    return winVenvPath;
  } else if (fs.existsSync(unixVenvPath)) {
    return unixVenvPath;
  } else if (fs.existsSync(winApiVenvPath)) {
    return winApiVenvPath;
  } else if (fs.existsSync(unixApiVenvPath)) {
    return unixApiVenvPath;
  }

  // Fallback to global python
  return 'python';
}

module.exports = { getPythonExecutable };
