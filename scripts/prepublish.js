import { existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const nodeModulesPath = join(__dirname, '..', 'src', 'mcp', 'node_modules');

if (existsSync(nodeModulesPath)) {
  console.log('清理 src/mcp/node_modules...');
  rmSync(nodeModulesPath, { recursive: true, force: true });
  console.log('已清理 src/mcp/node_modules');
} else {
  console.log('src/mcp/node_modules 不存在，跳过清理');
}

