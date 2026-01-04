# MCP HTTP 服务器使用说明

## 概述

CM CLI 现在支持通过 HTTP 服务器方式启动 MCP 服务，只需要指定端口号即可，配置更简单。

## 使用方法

### 1. 查看配置信息（不启动服务器）

```bash
cm mcp --config-only
```

或者指定端口：

```bash
cm mcp --config-only --port 3001
```

### 2. 启动 HTTP 服务器

```bash
cm mcp
```

默认端口为 3000，也可以指定端口：

```bash
cm mcp --port 3001
```

### 3. 停止服务器

按 `Ctrl+C` 停止服务器

## 配置格式

### HTTP 方式（新）

```json
{
  "mcpServers": {
    "cm-cli": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

**优点**：
- 配置简单，只需要 URL
- 可以通过端口号访问
- 支持远程访问（如果配置了网络）

### 文件路径方式（旧）

```json
{
  "mcpServers": {
    "cm-cli": {
      "command": "node",
      "args": ["/path/to/mcp/src/index.js"]
    }
  }
}
```

## 服务器端点

启动 HTTP 服务器后，提供以下端点：

### 1. 健康检查

```
GET http://localhost:3000/health
```

返回：
```json
{
  "status": "ok",
  "service": "cm-cli-mcp"
}
```

### 2. MCP 协议端点

```
POST http://localhost:3000/mcp
```

支持 MCP 协议请求：
- `tools/list` - 列出可用工具
- `tools/call` - 调用工具

## 示例

### 启动服务器

```bash
$ cm mcp --port 3001

======================================================================
📋 CM CLI MCP HTTP 服务器配置信息
======================================================================

📝 Cursor MCP 配置 (mcpServers):

{
  "mcpServers": {
    "cm-cli": {
      "url": "http://localhost:3001/mcp"
    }
  }
}

📂 配置详情：

  服务器地址: http://localhost:3001/mcp
  端口号: 3001
  依赖状态: ✓ 已安装
  配置文件位置: %APPDATA%\Cursor\User\globalStorage\cursor.mcp\settings.json
======================================================================

🚀 正在启动 MCP HTTP 服务器 (端口: 3001)...
CM CLI MCP HTTP 服务器已启动
监听地址: http://localhost:3001
健康检查: http://localhost:3001/health
MCP 端点: http://localhost:3001/mcp
✅ MCP HTTP 服务器已启动
   服务地址: http://localhost:3001
   按 Ctrl+C 停止服务器
```

## 在 Cursor 中配置

1. 启动服务器：
   ```bash
   cm mcp --port 3000
   ```

2. 复制显示的配置到 Cursor 设置中

3. 重启 Cursor

## 端口冲突处理

如果端口被占用，会显示错误信息：

```
❌ 启动失败: 端口 3000 已被占用，请使用其他端口
💡 提示: 可以使用 --port 参数指定其他端口
```

解决方案：使用其他端口

```bash
cm mcp --port 3001
```

## 优势

1. **配置简单**：只需要 URL，不需要文件路径
2. **端口访问**：通过端口号即可访问服务
3. **远程支持**：可以配置为远程访问（需要网络配置）
4. **易于调试**：可以通过浏览器或 curl 测试端点

## 测试服务器

### 健康检查

```bash
curl http://localhost:3000/health
```

### 列出工具

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

### 调用工具

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "show-project-tree",
      "arguments": {
        "projectPath": ".",
        "maxDepth": 2
      }
    }
  }'
```

