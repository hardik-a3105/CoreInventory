import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to generate Prisma client
const prisma = spawn('npx', ['prisma', 'generate'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

prisma.on('close', (code) => {
  console.log(`Prisma generation exited with code ${code}`);
  process.exit(code);
});
