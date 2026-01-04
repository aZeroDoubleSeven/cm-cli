#!/usr/bin/env node

/**
 * HTTP 版本的 MCP 服务器
 * 通过 HTTP 端口提供服务
 */

import http from "node:http";
import packageJson from "../package.json" assert { type: "json" };
import { createProject, showProjectTree } from "./handlers.js";
import { validateCreateProject, validateShowProjectTree } from "./schemas.js";

/**
 * 获取可用工具列表
 */
function getToolsList() {
  return {
    tools: [
      {
        name: "create-project",
        description:
          "快速创建项目。支持创建移动端(Uni-app)、小程序(Uni-app)、后台管理系统(Vue2/Vue3)项目。可以自动配置ESLint。",
        inputSchema: {
          type: "object",
          properties: {
            projectName: {
              type: "string",
              description: "项目名称，只能包含小写字母、数字和连字符",
            },
            projectType: {
              type: "string",
              enum: ["mobile", "miniprogram", "admin"],
              description: "项目类型：mobile-移动端, miniprogram-小程序, admin-后台管理系统",
            },
            vueVersion: {
              type: "string",
              enum: ["Vue2", "Vue3"],
              description: "Vue版本（仅当projectType为admin时需要）",
            },
            needESLint: {
              type: "boolean",
              description: "是否配置ESLint，默认为true",
              default: true,
            },
            targetPath: {
              type: "string",
              description: "目标路径，默认为当前工作目录",
            },
          },
          required: ["projectName", "projectType"],
        },
      },
      {
        name: "show-project-tree",
        description:
          "查看项目结构树。可以显示指定项目的目录结构，支持自定义深度和忽略模式。",
        inputSchema: {
          type: "object",
          properties: {
            projectPath: {
              type: "string",
              description: "项目路径，可以是相对路径或绝对路径",
            },
            maxDepth: {
              type: "number",
              description: "最大深度，默认为3",
              default: 3,
            },
            ignorePatterns: {
              type: "array",
              items: {
                type: "string",
              },
              description: "忽略的目录模式，默认为['node_modules', '.git', 'dist', 'build']",
              default: ["node_modules", ".git", "dist", "build"],
            },
          },
          required: ["projectPath"],
        },
      },
    ],
  };
}

/**
 * 处理工具调用
 */
async function handleToolCall(name, args) {
  try {
    switch (name) {
      case "create-project": {
        const validatedInput = validateCreateProject(args);
        const result = await createProject(validatedInput);

        if (result.success) {
          return {
            content: [
              {
                type: "text",
                text: result.message || "项目创建成功！",
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `错误: ${result.error}`,
              },
            ],
            isError: true,
          };
        }
      }

      case "show-project-tree": {
        const validatedInput = validateShowProjectTree(args);
        const result = await showProjectTree(validatedInput);

        if (result.success) {
          return {
            content: [
              {
                type: "text",
                text: result.message || result.tree || "项目结构树",
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `错误: ${result.error}`,
              },
            ],
            isError: true,
          };
        }
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `未知的工具: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `工具执行失败: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * 查找可用端口
 */
export async function findAvailablePort(startPort = 3000, maxPort = 3100) {
  const net = await import("node:net");
  
  for (let port = startPort; port <= maxPort; port++) {
    const isAvailable = await new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once("close", () => resolve(true));
        server.close();
      });
      server.on("error", () => resolve(false));
    });
    
    if (isAvailable) {
      return port;
    }
  }
  
  // 如果指定范围内没有可用端口，让系统自动分配（端口0）
  return 0;
}

/**
 * 创建 HTTP 服务器
 */
export async function createHTTPServer(port = 0) {
  return new Promise((resolve, reject) => {
    const httpServer = http.createServer(async (req, res) => {
      // 设置 CORS 头
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", service: "cm-cli-mcp" }));
        return;
      }

      if (req.method === "POST" && req.url === "/mcp") {
        try {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const request = JSON.parse(body);
              let response;
              
              // 处理 MCP 协议请求
              if (request.method === "tools/list") {
                // 列出可用工具
                const result = getToolsList();
                response = {
                  jsonrpc: "2.0",
                  id: request.id,
                  result: result,
                };
              } else if (request.method === "tools/call") {
                // 调用工具
                const { name, arguments: args } = request.params || {};
                const result = await handleToolCall(name, args);
                response = {
                  jsonrpc: "2.0",
                  id: request.id,
                  result: result,
                };
              } else {
                response = {
                  jsonrpc: "2.0",
                  id: request.id,
                  error: {
                    code: -32601,
                    message: `Method not found: ${request.method}`,
                  },
                };
              }
              
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(response));
            } catch (error) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ 
                jsonrpc: "2.0",
                id: request?.id || null,
                error: { 
                  code: -32603, 
                  message: error.message 
                }
              }));
            }
          });
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error.message }));
        }
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
    });

    httpServer.listen(port, "0.0.0.0", () => {
      resolve(httpServer);
    });

    httpServer.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * 启动 HTTP 服务器
 */
export async function startHTTPServer(requestedPort = 0) {
  try {
    let port = requestedPort;
    
    // 如果端口为0或未指定，自动查找可用端口
    if (port === 0 || !port) {
      port = await findAvailablePort(3000, 3100);
      // 如果找不到可用端口，使用系统自动分配（端口0）
      if (port === 0) {
        port = 0; // 让系统自动分配
      }
    }
    
    const httpServer = await createHTTPServer(port);
    const address = httpServer.address();
    const actualPort = address.port;
    const url = `http://localhost:${actualPort}`;
    
    console.error(`CM CLI MCP HTTP 服务器已启动`);
    console.error(`监听地址: ${url}`);
    console.error(`健康检查: ${url}/health`);
    console.error(`MCP 端点: ${url}/mcp`);
    
    return { httpServer, url, port: actualPort };
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      // 如果指定端口被占用，尝试自动查找可用端口
      console.error(`端口 ${requestedPort} 已被占用，正在查找可用端口...`);
      const availablePort = await findAvailablePort(3000, 3100);
      if (availablePort === 0) {
        throw new Error(`无法找到可用端口（3000-3100 范围）`);
      }
      console.error(`找到可用端口: ${availablePort}`);
      return startHTTPServer(availablePort);
    }
    throw error;
  }
}

