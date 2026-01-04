# 在 Cursor 中使用 CM CLI MCP 服务器

本指南将帮助你在 Cursor 中配置和使用 CM CLI MCP 服务器。

## 🚀 快速开始

1. **安装依赖（首次使用必需）**
   ```bash
   cd src/mcp
   pnpm install
   ```
   这会安装 MCP SDK 等必要的依赖包。

2. **获取配置信息**
   ```bash
   pnpm run get-config
   ```
   这会显示你需要的配置信息。

2. **在 Cursor 中配置**
   - 打开设置 (`Ctrl+,` 或 `Cmd+,`)
   - 搜索 "MCP"
   - 添加显示的配置

3. **重启 Cursor**

4. **开始使用**
   在 Cursor 的 AI 聊天中，你可以说：
   - "请创建一个 Vue2 后台管理系统项目"
   - "请查看当前项目的结构树"

## 前置要求

1. 确保已安装 Node.js (v18 或更高版本)
2. 确保已安装 pnpm：`npm install -g pnpm`
3. **重要**: 首次使用前必须安装项目依赖：
   ```bash
   cd src/mcp
   pnpm install
   ```
   如果遇到依赖问题，可以使用 `pnpm install --force` 强制重新安装。

## 配置步骤

### 方法 1: 通过 Cursor 设置配置（推荐）

1. **打开 Cursor 设置**
   - 按 `Ctrl+,` (Windows/Linux) 或 `Cmd+,` (Mac) 打开设置
   - 或者点击左下角齿轮图标 → Settings

2. **找到 MCP 设置**
   - 在设置搜索框中输入 "MCP" 或 "Model Context Protocol"
   - 找到 MCP 服务器配置选项

3. **添加 MCP 服务器配置**
   
   运行以下命令获取配置：
   ```bash
   cm mcp --config-only
   ```
   
   或者手动添加以下内容（JSON 格式）：

   ```json
   {
     "mcpServers": {
       "cm-cli": {
         "command": "node",
         "args": [
           "/path/to/cm-cli/src/mcp/src/index.js"
         ]
       }
     }
   }
   ```

   **重要**: 
   - Cursor 使用 **stdio 传输**，必须使用 `command` + `args` 格式
   - 请将路径替换为你的实际项目路径
   - 不需要指定端口，stdio 传输不依赖端口

### 方法 2: 通过配置文件

1. **找到 Cursor 配置文件位置**
   - Windows: `%APPDATA%\Cursor\User\globalStorage\cursor.mcp\settings.json`
   - macOS: `~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/settings.json`
   - Linux: `~/.config/Cursor/User/globalStorage/cursor.mcp/settings.json`

2. **编辑配置文件**

   如果文件不存在，创建它。添加以下内容：

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

3. **重启 Cursor**

   保存配置文件后，重启 Cursor 使配置生效。

## 验证配置

配置完成后，你可以通过以下方式验证：

1. **在 Cursor 中询问 AI**
   - 打开 Cursor 的 AI 聊天面板
   - 输入：`请使用 create-project 工具创建一个 Vue2 项目`
   - 如果配置正确，AI 应该能够调用 MCP 工具

2. **查看可用工具**
   - 询问 AI：`列出可用的 MCP 工具`
   - 应该能看到 `create-project` 和 `show-project-tree` 两个工具

## 使用示例

### 示例 1: 创建项目

在 Cursor 的 AI 聊天中，你可以这样请求：

```
请使用 create-project 工具创建一个名为 "my-admin-app" 的后台管理系统项目，
使用 Vue2，并配置 ESLint。
```

AI 会自动调用 MCP 工具并创建项目。

### 示例 2: 查看项目结构

```
请使用 show-project-tree 工具查看当前项目的结构树，最大深度为 2。
```

### 示例 3: 创建移动端项目

```
请创建一个名为 "my-mobile-app" 的移动端项目（Uni-app），不配置 ESLint。
```

## 路径配置说明

### Windows 路径示例
```json
{
  "args": [
    "D:\\files\\test\\cli\\cm-cli\\src\\mcp\\src\\index.js"
  ]
}
```

### macOS/Linux 路径示例
```json
{
  "args": [
    "/Users/username/projects/cm-cli/src/mcp/src/index.js"
  ]
}
```

### 使用相对路径（如果可能）

某些情况下，Cursor 可能支持相对路径，但建议使用绝对路径以确保可靠性。

## 故障排除

### 问题 1: MCP 服务器无法启动

**解决方案**:
1. 检查 Node.js 是否正确安装：`node --version`
2. 检查路径是否正确（使用绝对路径）
3. 检查依赖是否已安装：`cd src/mcp && pnpm install`

### 问题 2: AI 无法识别工具

**解决方案**:
1. 重启 Cursor
2. 检查配置文件格式是否正确（JSON 格式）
3. 查看 Cursor 的开发者工具（如果有）查看错误信息

### 问题 3: 工具执行失败

**解决方案**:
1. 确保项目路径存在且可访问
2. 检查文件权限
3. 查看控制台错误信息

## 高级配置

### 使用环境变量

如果需要设置环境变量，可以在配置中添加：

```json
{
  "mcpServers": {
    "cm-cli": {
      "command": "node",
      "args": [
        "/path/to/cm-cli/src/mcp/src/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 使用 npm/pnpm 脚本

如果你想通过 npm 脚本运行，可以创建一个启动脚本：

在 `src/mcp/package.json` 中添加：

```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```

然后在 Cursor 配置中使用：

```json
{
  "mcpServers": {
    "cm-cli": {
      "command": "pnpm",
      "args": ["--dir", "/path/to/cm-cli/src/mcp", "start"]
    }
  }
}
```

## 测试 MCP 服务器

在配置之前，你可以先手动测试 MCP 服务器是否正常工作：

```bash
cd src/mcp
node src/index.js
```

如果服务器正常启动，你应该看到类似 "CM CLI MCP 服务器已启动" 的消息。

## 更多信息

- 查看 [README.md](./README.md) 了解工具详细说明
- 查看 [test-mcp.js](./test-mcp.js) 了解如何测试

