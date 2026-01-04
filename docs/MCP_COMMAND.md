# MCP 命令使用说明

## 命令概述

`cm mcp` 命令用于启动 CM CLI MCP 服务器并显示配置信息。

## 使用方法

### 1. 仅查看配置信息

```bash
cm mcp --config-only
```

这会显示：
- Cursor MCP 配置 (mcpServers) - 可以直接复制到 Cursor 设置中
- MCP 服务器路径
- 路径和依赖状态
- 配置文件位置

### 2. 启动 MCP 服务器

```bash
cm mcp
```

这会：
1. 先显示配置信息
2. 然后启动 MCP 服务器
3. 服务器会持续运行，直到按 `Ctrl+C` 停止

## 输出示例

### 配置信息输出

```
======================================================================
📋 CM CLI MCP 服务器配置信息
======================================================================

📝 Cursor MCP 配置 (mcpServers):

{
  "mcpServers": {
    "cm-cli": {
      "command": "node",
      "args": [
        "D:\\files\\test\\cli\\cm-cli\\src\\mcp\\src\\index.js"
      ]
    }
  }
}

📂 配置详情：

  MCP 服务器路径: D:\files\test\cli\cm-cli\src\mcp\src\index.js
  路径状态: ✓ 存在
  依赖状态: ✓ 已安装
  配置文件位置: %APPDATA%\Cursor\User\globalStorage\cursor.mcp\settings.json
======================================================================
```

## 在 Cursor 中配置

1. 运行 `cm mcp --config-only` 获取配置
2. 复制显示的 JSON 配置
3. 在 Cursor 设置中添加 MCP 服务器配置
4. 重启 Cursor

详细配置步骤请查看：`src/mcp/CURSOR_SETUP.md`

## 故障排除

### 问题 1: 依赖未安装

如果看到 "依赖状态: ✗ 未安装"，请运行：

```bash
cd src/mcp
pnpm install
```

### 问题 2: 路径不存在

如果看到 "路径状态: ✗ 不存在"，请检查：
- MCP 服务器文件是否存在
- 项目结构是否完整

### 问题 3: 服务器启动失败

如果服务器启动失败，请检查：
- Node.js 版本是否 >= 18
- 依赖是否正确安装
- 查看错误信息进行排查

## 相关命令

- `cm create` - 创建新项目
- `cm mcp --config-only` - 仅查看配置
- `cm mcp` - 启动 MCP 服务器

