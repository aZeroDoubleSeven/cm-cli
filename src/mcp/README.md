# CM CLI MCP 服务器

CM CLI 的 Model Context Protocol (MCP) 服务器，为 AI 助手提供快速创建项目和查看项目结构的能力。

## 功能

### 1. 快速创建项目 (`create-project`)

支持创建以下类型的项目：
- **移动端** (mobile): 使用 Uni-app 模板
- **小程序** (miniprogram): 使用 Uni-app 模板
- **后台管理系统** (admin): 使用 Vue2 或 Vue3 模板

#### 参数

- `projectName` (必需): 项目名称，只能包含小写字母、数字和连字符
- `projectType` (必需): 项目类型，可选值：`mobile`、`miniprogram`、`admin`
- `vueVersion` (可选): Vue 版本，当 `projectType` 为 `admin` 时必需，可选值：`Vue2`、`Vue3`
- `needESLint` (可选): 是否配置 ESLint，默认为 `true`
- `targetPath` (可选): 目标路径，默认为当前工作目录

#### 示例

```json
{
  "projectName": "my-admin-project",
  "projectType": "admin",
  "vueVersion": "Vue2",
  "needESLint": true
}
```

### 2. 查看项目结构树 (`show-project-tree`)

显示指定项目的目录结构树。

#### 参数

- `projectPath` (必需): 项目路径，可以是相对路径或绝对路径
- `maxDepth` (可选): 最大深度，默认为 `3`
- `ignorePatterns` (可选): 忽略的目录模式，默认为 `["node_modules", ".git", "dist", "build"]`

#### 示例

```json
{
  "projectPath": "./my-project",
  "maxDepth": 2,
  "ignorePatterns": ["node_modules", ".git"]
}
```

## 使用方法

### 安装依赖（首次使用必需）

```bash
cd src/mcp
pnpm install
```

### 作为 MCP 服务器运行

```bash
cd src/mcp
node src/index.js
```

### 在 Cursor 中配置

**详细配置指南请查看 [CURSOR_SETUP.md](./CURSOR_SETUP.md)**

快速配置步骤：

1. 打开 Cursor 设置（`Ctrl+,` 或 `Cmd+,`）
2. 搜索 "MCP" 或 "Model Context Protocol"
3. 添加以下配置（替换为你的实际路径）：

```json
{
  "mcpServers": {
    "cm-cli": {
      "command": "node",
      "args": [
        "/absolute/path/to/cm-cli/src/mcp/src/index.js"
      ]
    }
  }
}
```

4. 重启 Cursor

### 在 Claude Desktop 中配置

在 Claude Desktop 的配置文件中添加：

```json
{
  "mcpServers": {
    "cm-cli": {
      "command": "node",
      "args": ["/path/to/cm-cli/src/mcp/src/index.js"]
    }
  }
}
```

## 测试

运行测试脚本：

```bash
cd src/mcp
node test-mcp.js
```

## 使用示例

详细的使用示例请查看 [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)

## 项目结构

```
src/mcp/
├── src/
│   ├── index.js      # MCP 服务器主文件
│   ├── handlers.js   # 工具处理逻辑
│   └── schemas.js    # 输入验证
├── package.json
├── README.md
└── test-mcp.js      # 测试脚本
```

