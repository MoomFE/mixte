import { execSync } from 'node:child_process';

execSync('rollup -c', { stdio: 'inherit' });
