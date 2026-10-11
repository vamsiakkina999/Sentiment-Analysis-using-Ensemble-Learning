const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.resolve(rootDir, 'backend');

const candidatePythons = [
  path.join(rootDir, 'venv', 'Scripts', 'python.exe'),
  path.join(rootDir, 'venv', 'bin', 'python'),
  path.join(backendDir, 'venv', 'Scripts', 'python.exe'),
  path.join(backendDir, 'venv', 'bin', 'python'),
  'python'
];

let pythonExe = 'python';
for (const candidate of candidatePythons) {
  if (candidate !== 'python' && fs.existsSync(candidate)) {
    pythonExe = candidate;
    break;
  }
}

const uvicorn = spawn(
  pythonExe,
  ['-m', 'uvicorn', 'app.main:app', '--reload', '--port', '8000'],
  {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  }
);

uvicorn.on('exit', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  uvicorn.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  uvicorn.kill('SIGTERM');
  process.exit(0);
});
