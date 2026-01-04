/**
 * 验证创建项目的输入
 */
export function validateCreateProject(input) {
  const errors = [];

  if (!input.projectName) {
    errors.push("projectName 是必需的");
  } else if (!/^[a-z0-9-]+$/.test(input.projectName)) {
    errors.push("项目名称只能包含小写字母、数字和连字符");
  }

  if (!input.projectType) {
    errors.push("projectType 是必需的");
  } else if (!["mobile", "miniprogram", "admin"].includes(input.projectType)) {
    errors.push("projectType 必须是 mobile、miniprogram 或 admin");
  }

  if (input.projectType === "admin" && !input.vueVersion) {
    errors.push("后台管理系统需要指定 vueVersion");
  }

  if (input.vueVersion && !["Vue2", "Vue3"].includes(input.vueVersion)) {
    errors.push("vueVersion 必须是 Vue2 或 Vue3");
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return {
    projectName: input.projectName,
    projectType: input.projectType,
    vueVersion: input.vueVersion,
    needESLint: input.needESLint !== undefined ? input.needESLint : true,
    targetPath: input.targetPath || process.cwd(),
  };
}

/**
 * 验证查看项目结构树的输入
 */
export function validateShowProjectTree(input) {
  if (!input.projectPath) {
    throw new Error("projectPath 是必需的");
  }

  return {
    projectPath: input.projectPath,
    maxDepth: input.maxDepth || 3,
    ignorePatterns: input.ignorePatterns || ["node_modules", ".git", "dist", "build"],
  };
}

