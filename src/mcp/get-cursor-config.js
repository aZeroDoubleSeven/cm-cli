#!/usr/bin/env node

/**
 * 生成 Cursor MCP 配置脚本
 * 运行此脚本可以获取当前项目的 MCP 配置
 */

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取 MCP 服务器的绝对路径
const mcpServerPath = resolve(__dirname, "src/index.js");

// 生成配置
const config = {
  mcpServers: {
    "cm-cli": {
      command: "node",
      args: [mcpServerPath],
    },
  },
};

console.log("\n=== Cursor MCP 配置 ===\n");
console.log("请将以下配置添加到 Cursor 的 MCP 设置中：\n");
console.log(JSON.stringify(config, null, 2));
console.log("\n=== 配置路径信息 ===\n");
console.log(`MCP 服务器路径: ${mcpServerPath}`);
console.log(`\n验证路径是否存在: ${fs.existsSync(mcpServerPath) ? "✓ 存在" : "✗ 不存在"}`);

// 检查依赖是否已安装
const nodeModulesPath = resolve(__dirname, "node_modules", "@modelcontextprotocol", "sdk");
const depsInstalled = fs.existsSync(nodeModulesPath);
console.log(`\n依赖是否已安装: ${depsInstalled ? "✓ 已安装" : "✗ 未安装"}`);

if (!depsInstalled) {
  console.log("\n⚠️  警告: 依赖未安装，请先运行: pnpm install");
}

// 根据操作系统显示配置文件位置
const os = process.platform;
let configPath = "";

if (os === "win32") {
  configPath = "%APPDATA%\\Cursor\\User\\globalStorage\\cursor.mcp\\settings.json";
} else if (os === "darwin") {
  configPath = "~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/settings.json";
} else {
  configPath = "~/.config/Cursor/User/globalStorage/cursor.mcp/settings.json";
}

console.log(`\n配置文件位置: ${configPath}`);
console.log("\n详细配置说明请查看: src/mcp/CURSOR_SETUP.md\n");

