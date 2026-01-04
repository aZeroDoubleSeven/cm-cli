import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import copyDir from "../../utils/copy.js";
import renderTemplates from "../../utils/render.js";
import setupESLint from "../../utils/eslint.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 根据模板类型获取启动命令
 */
function getStartCommand(templateName, needESLint) {
  const commands = {
    'Uni-app': {
      install: 'pnpm install',
      lint: needESLint ? 'pnpm run lint' : null,
      dev: 'pnpm run dev:h5'
    },
    'Vue2': {
      install: 'pnpm install',
      lint: needESLint ? 'pnpm run lint' : null,
      dev: 'pnpm run dev'
    },
    'Vue3': {
      install: 'pnpm install',
      lint: needESLint ? 'pnpm run lint' : null,
      dev: 'pnpm run dev'
    }
  };

  return commands[templateName] || commands['Vue2'];
}

/**
 * 快速创建项目
 */
export async function createProject(input) {
  try {
    const {
      projectName,
      projectType,
      vueVersion,
      needESLint = true,
      targetPath = process.cwd(),
    } = input;

    // 验证项目名称
    if (!/^[a-z0-9-]+$/.test(projectName)) {
      return {
        success: false,
        error: "项目名称只能包含小写字母、数字和连字符",
      };
    }

    // 确定模板名称
    let templateName;
    if (projectType === 'mobile' || projectType === 'miniprogram') {
      templateName = 'Uni-app';
    } else if (projectType === 'admin') {
      if (!vueVersion) {
        return {
          success: false,
          error: "后台管理系统需要指定Vue版本",
        };
      }
      templateName = vueVersion;
    } else {
      return {
        success: false,
        error: `不支持的项目类型: ${projectType}`,
      };
    }

    // 检查目标目录
    const targetDir = path.resolve(targetPath, projectName);
    if (fs.existsSync(targetDir)) {
      return {
        success: false,
        error: `目录已存在: ${targetDir}`,
      };
    }

    // 获取模板目录
    const templateDir = path.resolve(
      __dirname,
      `../../template/${templateName}`
    );

    if (!fs.existsSync(templateDir)) {
      return {
        success: false,
        error: `模板不存在: ${templateDir}`,
      };
    }

    // 复制模板
    copyDir(templateDir, targetDir);

    // 渲染模板
    renderTemplates(targetDir, { projectName, needESLint });

    // 配置 ESLint
    if (needESLint) {
      await setupESLint(targetDir, templateName);
    }

    // 获取启动命令
    const startCmd = getStartCommand(templateName, needESLint);
    let installCmd = `cd ${projectName}\n${startCmd.install}`;
    
    if (startCmd.lint) {
      installCmd += `\n${startCmd.lint}`;
    }
    
    installCmd += `\n${startCmd.dev}`;

    return {
      success: true,
      message: `项目创建成功！\n\n${installCmd}`,
      projectPath: targetDir,
      templateName,
      startCommands: installCmd,
    };
  } catch (error) {
    return {
      success: false,
      error: `创建项目失败: ${error.message}`,
    };
  }
}

/**
 * 生成项目结构树
 */
function generateTree(dir, prefix = "", maxDepth = 3, currentDepth = 0, ignorePatterns = []) {
  if (currentDepth >= maxDepth) {
    return "";
  }

  const items = fs.readdirSync(dir).filter(item => {
    // 忽略隐藏文件和指定模式
    if (item.startsWith('.')) return false;
    return !ignorePatterns.some(pattern => item.includes(pattern));
  });

  let tree = "";
  items.forEach((item, index) => {
    const itemPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const stat = fs.statSync(itemPath);

    const connector = isLast ? "└── " : "├── ";
    tree += prefix + connector + item + "\n";

    if (stat.isDirectory() && currentDepth < maxDepth - 1) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      tree += generateTree(itemPath, nextPrefix, maxDepth, currentDepth + 1, ignorePatterns);
    }
  });

  return tree;
}

/**
 * 显示项目结构树
 */
export async function showProjectTree(input) {
  try {
    const {
      projectPath,
      maxDepth = 3,
      ignorePatterns = ["node_modules", ".git", "dist", "build"],
    } = input;

    const resolvedPath = path.isAbsolute(projectPath)
      ? projectPath
      : path.resolve(process.cwd(), projectPath);

    if (!fs.existsSync(resolvedPath)) {
      return {
        success: false,
        error: `路径不存在: ${resolvedPath}`,
      };
    }

    if (!fs.statSync(resolvedPath).isDirectory()) {
      return {
        success: false,
        error: `路径不是目录: ${resolvedPath}`,
      };
    }

    const tree = generateTree(resolvedPath, "", maxDepth, 0, ignorePatterns);
    const projectName = path.basename(resolvedPath);

    return {
      success: true,
      message: `${projectName}\n${tree}`,
      tree,
      projectPath: resolvedPath,
    };
  } catch (error) {
    return {
      success: false,
      error: `生成项目结构树失败: ${error.message}`,
    };
  }
}

