import fs from "node:fs";
import path from "node:path";

/**
 * 根据模板类型获取 ESLint 配置
 */
function getESLintConfig(templateName) {
  const configs = {
    'Uni-app': {
      extends: [
        'plugin:vue/essential',
        'eslint:recommended'
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      env: {
        node: true,
        es6: true
      },
      rules: {
        'no-console': 'warn',
        'no-debugger': 'warn'
      }
    },
    'Vue2': {
      extends: [
        'plugin:vue/essential',
        'eslint:recommended'
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      env: {
        node: true,
        browser: true,
        es6: true
      },
      rules: {
        'no-console': 'warn',
        'no-debugger': 'warn',
        'vue/multi-word-component-names': 'off'
      }
    },
    'Vue3': {
      extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended'
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      env: {
        node: true,
        browser: true,
        es6: true
      },
      rules: {
        'no-console': 'warn',
        'no-debugger': 'warn',
        'vue/multi-word-component-names': 'off'
      }
    }
  };

  return configs[templateName] || configs['Vue3'];
}

/**
 * 获取 ESLint 依赖包
 */
function getESLintDependencies(templateName) {
  const baseDeps = {
    'eslint': '^8.57.0',
    'eslint-plugin-vue': templateName === 'Vue3' ? '^9.23.0' : '^9.0.0'
  };

  return baseDeps;
}

/**
 * 创建 ESLint 配置文件
 */
function createESLintConfigFile(targetDir, templateName) {
  const config = getESLintConfig(templateName);
  const configPath = path.join(targetDir, '.eslintrc.js');
  
  // 如果配置文件已存在，则不覆盖
  if (fs.existsSync(configPath)) {
    return;
  }
  
  // 格式化配置文件内容
  const extendsStr = config.extends.map(ext => `'${ext}'`).join(',\n    ');
  const envStr = Object.entries(config.env)
    .map(([key, value]) => `    ${key}: ${value}`)
    .join(',\n');
  const rulesStr = Object.entries(config.rules)
    .map(([key, value]) => `    '${key}': ${typeof value === 'string' ? `'${value}'` : JSON.stringify(value)}`)
    .join(',\n');

  const formattedContent = `module.exports = {
  extends: [
    ${extendsStr}
  ],
  parserOptions: {
    ecmaVersion: ${config.parserOptions.ecmaVersion},
    sourceType: '${config.parserOptions.sourceType}'
  },
  env: {
${envStr}
  },
  rules: {
${rulesStr}
  }
};
`;

  fs.writeFileSync(configPath, formattedContent, 'utf8');
}

/**
 * 更新 package.json，添加 ESLint 依赖和脚本
 */
function updatePackageJson(targetDir, templateName) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.warn('package.json 不存在，跳过 ESLint 配置');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = getESLintDependencies(templateName);

  // 添加 devDependencies（如果不存在）
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }
  
  // 只添加不存在的依赖
  Object.keys(deps).forEach(dep => {
    if (!packageJson.devDependencies[dep]) {
      packageJson.devDependencies[dep] = deps[dep];
    }
  });

  // 添加 scripts（如果不存在）
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  // 只添加不存在的脚本
  if (!packageJson.scripts['lint']) {
    packageJson.scripts['lint'] = 'eslint . --ext .js,.vue';
  }
  if (!packageJson.scripts['lint:fix']) {
    packageJson.scripts['lint:fix'] = 'eslint . --ext .js,.vue --fix';
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
}

/**
 * 创建 .eslintignore 文件
 */
function createESLintIgnore(targetDir) {
  const ignorePath = path.join(targetDir, '.eslintignore');
  
  // 如果文件已存在，则不覆盖
  if (fs.existsSync(ignorePath)) {
    return;
  }
  
  const ignoreContent = `node_modules/
dist/
build/
*.min.js
coverage/
`;

  fs.writeFileSync(ignorePath, ignoreContent, 'utf8');
}

/**
 * 设置 ESLint 配置
 */
export default async function setupESLint(targetDir, templateName) {
  try {
    // 创建 ESLint 配置文件
    createESLintConfigFile(targetDir, templateName);
    
    // 创建 .eslintignore 文件
    createESLintIgnore(targetDir);
    
    // 更新 package.json
    updatePackageJson(targetDir, templateName);
  } catch (error) {
    throw new Error(`配置 ESLint 失败: ${error.message}`);
  }
}

