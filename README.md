```
 ██████╗ ███╗   ███╗     ██████╗ ██╗     ██╗
██╔════╝ ████╗ ████║    ██╔════╝ ██║     ██║
██║      ██╔████╔██║    ██║      ██║     ██║
██║      ██║╚██╔╝██║    ██║      ██║     ██║
╚██████╗ ██║ ╚═╝ ██║    ╚██████╗ ███████╗██║
 ╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚══════╝╚═╝
```

<p>
  <a href="https://www.npmjs.com/package/congmao-cli"><img src="https://img.shields.io/npm/v/congmao-cli.svg?style=flat&colorA=18181B&colorB=28CF8D" alt="Version"></a>
</p>

# CM CLI

> 丛茂科技项目脚手架工具，快速创建项目

## 📦 安装

### 全局安装

```bash
npm install -g congmao-cli
```

安装完成后，可以使用 `cm` 命令。

### 验证安装

```bash
cm --version
```

## 🚀 快速开始

### 创建项目

```bash
cm create
```

## 📖 命令说明

### `cm create`

创建新项目，支持交互式选择项目类型和配置。

**支持的项目类型：**

| 类型         | 模板      | 说明                   |
| ------------ | --------- | ---------------------- |
| 移动端       | Uni-app   | 适用于移动端应用开发   |
| 小程序       | Uni-app   | 适用于小程序开发       |
| 后台管理系统 | Vue2/Vue3 | 适用于后台管理系统开发 |

**示例：**

```bash
# 交互式创建项目
cm create

# 创建后的项目结构
my-project/
├── src/
├── package.json
└── ...
```

### `cm mcp`

启动 MCP (Model Context Protocol) 服务器，用于集成到 AI Agent 应用。

**选项：**

- `--config-only`: 仅显示配置信息

**使用示例：**

```bash
# 启动 MCP 服务器并显示配置信息
cm mcp
```

**MCP 服务器功能：**

1. **create-project** - 快速创建项目

   - 支持移动端、小程序、后台管理系统
   - 可配置 Vue 版本和 ESLint

2. **show-project-tree** - 查看项目结构树

   - 显示项目目录结构
   - 可配置最大深度和忽略模式

## 🔧 MCP 服务器集成

**配置示例：**

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

## 📝 许可证

MPL

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- GitHub: [aZeroDoubleSeven/cm-cli](https://github.com/aZeroDoubleSeven/cm-cli)
- Issues: [提交问题](https://github.com/aZeroDoubleSeven/cm-cli/issues)

---

**Made with ❤️ by 丛茂科技前端开发团队**
