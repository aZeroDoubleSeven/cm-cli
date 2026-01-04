#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import packageJson from "../package.json" assert { type: "json" };
import { createProject, showProjectTree } from "./handlers.js";
import { validateCreateProject, validateShowProjectTree } from "./schemas.js";

/**
 * CM CLI 的 MCP 服务器
 * 为 AI 助手提供快速创建项目和查看项目结构的能力
 */
const server = new Server(
  {
    name: packageJson.name,
    version: packageJson.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 快速创建项目工具
 * 支持创建 Uni-app、Vue2、Vue3 项目
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
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
});

/**
 * 处理工具调用请求
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "create-project": {
        // 验证输入
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
        // 验证输入
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
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CM CLI MCP 服务器已启动");
}

main().catch(console.error);
