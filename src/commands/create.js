import {
  intro,
  outro,
  text,
  select,
  confirm,
  spinner,
  cancel,
  isCancel,
} from '@clack/prompts';
import gradient from 'gradient-string';
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";
import { fileURLToPath } from "node:url";

import copyDir from "../utils/copy.js";
import renderTemplates from "../utils/render.js";
import setupESLint from "../utils/eslint.js";

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

export default async function create() {
  // 显示欢迎信息
  intro(gradient(['#00FFFF', '#00CED1', '#00BFFF', '#00FF7F'])('欢迎使用丛茂科技 CM CLI ! 🚀'));

  // 1. 选择项目类型
  const projectType = await select({
    message: '请选择项目类型：',
    options: [
      { value: 'mobile', label: '移动端', hint: '适用于移动端应用开发' },
      { value: 'miniprogram', label: '小程序', hint: '适用于小程序开发' },
      { value: 'admin', label: '后台管理系统', hint: '适用于后台管理系统开发' },
    ],
  });

  if (isCancel(projectType)) {
    cancel('操作已取消');
    process.exit(0);
  }

  // 2. 根据项目类型选择具体模板
  let templateName;

  if (projectType === 'mobile' || projectType === 'miniprogram') {
    // 移动端和小程序使用 Uni-app
    templateName = 'Uni-app';
  } else if (projectType === 'admin') {
    // 后台管理系统选择 Vue 版本
    const vueVersion = await select({
      message: '请选择 Vue 版本：',
      options: [
        { value: 'Vue2', label: 'Vue 2', hint: '稳定版本' },
        { value: 'Vue3', label: 'Vue 3', hint: '最新版本' },
      ],
    });

    if (isCancel(vueVersion)) {
      cancel('操作已取消');
      process.exit(0);
    }

    templateName = vueVersion;
  }

  // 3. 获取项目名称
  const projectName = await text({
    message: '请输入项目名称：',
    placeholder: projectType === 'admin' ? 'admin-project' : 'uni-app-project',
    validate: (value) => {
      if (!value) return '项目名称不能为空';
      if (!/^[a-z0-9-]+$/.test(value)) {
        return '只能包含小写字母、数字和连字符';
      }
    },
  });

  if (isCancel(projectName)) {
    cancel('操作已取消');
    process.exit(0);
  }

  // 4. 询问是否配置 ESLint
  const needESLint = await confirm({
    message: '是否配置 ESLint？',
    initialValue: true,
  });

  if (isCancel(needESLint)) {
    cancel('操作已取消');
    process.exit(0);
  }

  // 5. 检查目录是否存在
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    cancel(chalk.red('❌ 目录已存在'));
    process.exit(1);
  }

  // 6. 创建项目
  const s = spinner();
  s.start('正在创建项目...');

  try {
    const templateDir = path.resolve(
      __dirname,
      `../template/${templateName}`
    );

    if (!fs.existsSync(templateDir)) {
      s.stop('❌ 模板不存在');
      cancel(`模板目录不存在: ${templateDir}`);
      process.exit(1);
    }

    copyDir(templateDir, targetDir);
    renderTemplates(targetDir, { projectName, needESLint });

    // 如果选择配置 ESLint，则进行配置
    if (needESLint) {
      s.message('正在配置 ESLint...');
      await setupESLint(targetDir, templateName);
    }

    s.stop('✅ 项目创建成功！');

    // 7. 显示成功信息
    const startCmd = getStartCommand(templateName, needESLint);
    let installCmd = `  cd ${projectName}\n  ${startCmd.install}\n`;
    
    if (startCmd.lint) {
      installCmd += `  ${startCmd.lint}\n`;
    }
    
    installCmd += `  ${startCmd.dev}\n`;
    
    outro(chalk.green(`\n🎉 项目创建成功！\n\n${installCmd}`));
  } catch (error) {
    s.stop('❌ 创建失败');
    cancel(`创建项目时出错: ${error.message}`);
    process.exit(1);
  }
}
