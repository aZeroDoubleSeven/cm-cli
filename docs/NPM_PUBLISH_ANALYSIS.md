# NPM 包发布分析

## 当前问题

### 1. 路径解析问题 ⚠️

**问题**：`src/commands/mcp.js` 使用相对路径定位 MCP 服务器文件
```javascript
const mcpServerPath = path.resolve(
  __dirname,
  "../mcp/src/index.js"
);
```

**影响**：
- 在开发环境中工作正常
- 作为 npm 包安装后，路径结构会改变
- 相对路径可能无法正确解析到 MCP 服务器文件

### 2. 依赖管理问题 ⚠️

**问题**：`src/mcp` 目录有独立的 `package.json` 和 `node_modules`
- MCP 服务器依赖 `@modelcontextprotocol/sdk`
- 这些依赖需要被正确安装

**影响**：
- 如果 MCP 依赖未安装，服务器无法启动
- 需要确保依赖在包安装时被正确安装

### 3. 文件包含问题 ⚠️

**问题**：需要确保以下文件被包含在发布的包中：
- `src/mcp/` 目录及其所有文件
- `src/template/` 目录及其所有文件
- `src/commands/` 目录
- `src/utils/` 目录
- `bin/` 目录

## 解决方案

### 方案 1：使用 `import.meta.resolve()` 或 `require.resolve()` ✅ 推荐

使用 Node.js 的模块解析机制来定位包内文件：

```javascript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mcpServerPath = require.resolve('../mcp/src/index.js');
```

### 方案 2：使用 `__dirname` 和包根目录 ✅ 推荐

获取包的实际安装路径：

```javascript
import { fileURLToPath } from "node:url";
import path from "node:path";

// 获取包根目录（假设包结构不变）
function getPackageRoot() {
  // 从当前文件位置向上查找 package.json
  let currentDir = path.dirname(fileURLToPath(import.meta.url));
  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  // 如果找不到，使用相对路径（开发环境）
  return path.resolve(__dirname, '../..');
}
```

### 方案 3：将 MCP 依赖提升到主包 ⚠️ 需要重构

将 `@modelcontextprotocol/sdk` 移到主 `package.json` 的 `dependencies` 中。

## 推荐修复方案

### 修复 1：改进路径解析

修改 `src/commands/mcp.js` 中的路径解析逻辑：

```javascript
function getMCPConfig() {
  // 方法 1: 使用 import.meta.resolve (Node.js 20.6.0+)
  // const mcpServerPath = new URL('../mcp/src/index.js', import.meta.url).pathname;
  
  // 方法 2: 使用 require.resolve (兼容性更好)
  import { createRequire } from 'module';
  const require = createRequire(import.meta.url);
  const mcpServerPath = require.resolve('../mcp/src/index.js');
  
  // 方法 3: 使用包根目录查找
  const packageRoot = findPackageRoot();
  const mcpServerPath = path.join(packageRoot, 'src/mcp/src/index.js');
}
```

### 修复 2：更新 package.json

确保所有必要文件被包含：

```json
{
  "files": [
    "bin",
    "src",
    "package.json",
    "README.md"
  ]
}
```

### 修复 3：处理 MCP 依赖

**选项 A**：将 MCP 依赖提升到主包
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.17.5"
  }
}
```

**选项 B**：在 `postinstall` 脚本中安装 MCP 依赖
```json
{
  "scripts": {
    "postinstall": "cd src/mcp && npm install"
  }
}
```

## 测试建议

1. **本地测试**：
   ```bash
   npm pack
   npm install -g ./cm-cli-1.0.0.tgz
   cm mcp --config-only
   ```

2. **检查路径**：
   - 验证 MCP 服务器路径是否正确
   - 验证依赖是否正确安装

3. **功能测试**：
   - 测试 `cm create` 命令
   - 测试 `cm mcp` 命令
   - 测试 MCP 服务器启动

