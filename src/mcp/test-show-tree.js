#!/usr/bin/env node

/**
 * 测试 show-project-tree 工具
 * 直接调用 handlers 显示项目结构树
 */

import { showProjectTree } from "./src/handlers.js";
import { validateShowProjectTree } from "./src/schemas.js";

async function testShowProjectTree() {
  // 测试不同的项目路径
  const testCases = [
    {
      name: "查看当前项目结构（深度2）",
      input: {
        projectPath: ".",
        maxDepth: 2,
      },
    },
    {
      name: "查看模板目录结构（深度3）",
      input: {
        projectPath: "../template/Vue2",
        maxDepth: 3,
        ignorePatterns: ["node_modules", ".git", "dist", "build", "docs"],
      },
    },
    {
      name: "查看 MCP 源码目录结构",
      input: {
        projectPath: "./src",
        maxDepth: 2,
      },
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📁 ${testCase.name}`);
    console.log("=".repeat(60));
    console.log("参数:", JSON.stringify(testCase.input, null, 2));
    console.log("");

    try {
      // 验证输入
      const validatedInput = validateShowProjectTree(testCase.input);

      // 显示项目结构树
      const result = await showProjectTree(validatedInput);

      if (result.success) {
        console.log(result.message || result.tree);
        console.log("");
        console.log("📁 项目路径:", result.projectPath);
      } else {
        console.error("❌ 错误:", result.error);
      }
    } catch (error) {
      console.error("❌ 错误:", error.message);
    }
  }
}

testShowProjectTree();

