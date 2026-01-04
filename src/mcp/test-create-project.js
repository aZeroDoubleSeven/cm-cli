#!/usr/bin/env node

/**
 * 测试 create-project 工具
 * 直接调用 handlers 创建项目
 */

import { createProject } from "./src/handlers.js";
import { validateCreateProject } from "./src/schemas.js";

async function testCreateProject() {
  const input = {
    projectName: "my-admin-app",
    projectType: "admin",
    vueVersion: "Vue2",
    needESLint: true,
  };

  console.log("🚀 开始创建项目...");
  console.log("参数:", JSON.stringify(input, null, 2));
  console.log("");

  try {
    // 验证输入
    const validatedInput = validateCreateProject(input);
    
    // 创建项目
    const result = await createProject(validatedInput);

    if (result.success) {
      console.log("✅", result.message);
      console.log("");
      console.log("📁 项目路径:", result.projectPath);
      console.log("📦 模板类型:", result.templateName);
      console.log("");
      console.log("📝 下一步操作:");
      console.log(result.startCommands);
    } else {
      console.error("❌ 创建失败:", result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ 错误:", error.message);
    process.exit(1);
  }
}

testCreateProject();

