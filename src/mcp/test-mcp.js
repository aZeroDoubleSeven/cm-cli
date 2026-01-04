#!/usr/bin/env node

/**
 * MCP 服务器测试脚本
 * 用于验证 MCP 服务器的功能
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 启动 MCP 服务器
const mcpServer = spawn("node", [resolve(__dirname, "src/index.js")], {
  stdio: ["pipe", "pipe", "pipe"],
});

// 发送测试请求
const testRequests = [
  // 测试列出工具
  {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {},
  },
  // 测试创建项目
  {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "create-project",
      arguments: {
        projectName: "test-project",
        projectType: "admin",
        vueVersion: "Vue2",
        needESLint: true,
      },
    },
  },
  // 测试查看项目结构树
  {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "show-project-tree",
      arguments: {
        projectPath: ".",
        maxDepth: 2,
      },
    },
  },
];

let requestIndex = 0;

mcpServer.stdout.on("data", (data) => {
  const response = data.toString();
  console.log("响应:", response);
  
  // 发送下一个请求
  if (requestIndex < testRequests.length - 1) {
    requestIndex++;
    setTimeout(() => {
      mcpServer.stdin.write(JSON.stringify(testRequests[requestIndex]) + "\n");
    }, 100);
  } else {
    mcpServer.kill();
  }
});

mcpServer.stderr.on("data", (data) => {
  console.error("错误:", data.toString());
});

mcpServer.on("close", (code) => {
  console.log(`MCP 服务器退出，代码: ${code}`);
  process.exit(code);
});

// 发送第一个请求
setTimeout(() => {
  mcpServer.stdin.write(JSON.stringify(testRequests[0]) + "\n");
}, 500);

