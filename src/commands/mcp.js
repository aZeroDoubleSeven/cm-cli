import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 查找包根目录（包含 package.json 的目录）
 */
function findPackageRoot() {
  let currentDir = __dirname;
  const root = path.parse(currentDir).root;
  
  while (currentDir !== root) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  // 如果找不到，使用相对路径（开发环境）
  return path.resolve(__dirname, "../..");
}

/**
 * 获取 MCP 服务器配置信息
 */
function getMCPConfig() {
  // 获取包根目录
  const packageRoot = findPackageRoot();
  
  // 获取 MCP 服务器的绝对路径（用于 stdio 传输）
  // 优先尝试包内的路径，如果不存在则尝试相对路径（开发环境）
  const mcpServerPathInPackage = path.join(packageRoot, "src/mcp/src/index.js");
  const mcpServerPathRelative = path.resolve(__dirname, "../mcp/src/index.js");
  
  const mcpServerPath = fs.existsSync(mcpServerPathInPackage) 
    ? mcpServerPathInPackage 
    : mcpServerPathRelative;
  
  // Cursor 使用 stdio 传输，需要 command + args 配置
  const config = {
    mcpServers: {
      "cm-cli": {
        command: "node",
        args: [mcpServerPath],
      },
    },
  };

  // 检查依赖（尝试多个可能的位置）
  const possibleDepsPaths = [
    path.join(packageRoot, "src/mcp/node_modules/@modelcontextprotocol/sdk"),
    path.join(packageRoot, "node_modules/@modelcontextprotocol/sdk"),
    path.resolve(__dirname, "../mcp/node_modules/@modelcontextprotocol/sdk"),
  ];
  
  const depsInstalled = possibleDepsPaths.some(depPath => fs.existsSync(depPath));

  return {
    config,
    mcpServerPath,
    pathExists: fs.existsSync(mcpServerPath),
    depsInstalled,
  };
}

/**
 * 打印 MCP 配置信息
 */
function printConfig() {
  const { config } = getMCPConfig();

  console.log(chalk.yellow.bold("Cursor MCP 配置 (mcpServers) - stdio 传输:\n"));
  console.log(chalk.white(JSON.stringify(config, null, 2)));
  console.log("\n");
}

/**
 * 启动 MCP 服务器
 */
async function startMCPServer() {
  const { mcpServerPath, pathExists, depsInstalled } = getMCPConfig();

  if (!pathExists) {
    console.error(chalk.red(`❌ MCP 服务器文件不存在: ${mcpServerPath}`));
    process.exit(1);
  }

  if (!depsInstalled) {
    console.error(chalk.red("❌ 依赖未安装，请先运行: cd src/mcp && pnpm install"));
    process.exit(1);
  }

  try {
    // 启动 stdio 服务器（用于 Cursor）
    console.log(chalk.green("🚀 正在启动 MCP stdio 服务器..."));
    
    const { spawn } = await import("child_process");
    const stdioProcess = spawn("node", [mcpServerPath], {
      stdio: "inherit",
      cwd: path.dirname(mcpServerPath),
    });

    stdioProcess.on("error", (error) => {
      console.error(chalk.red(`❌ 启动失败: ${error.message}`));
      process.exit(1);
    });

    console.log(chalk.green(`✅ MCP stdio 服务器已启动!`));

    // 处理退出信号
    process.on("SIGINT", () => {
      console.log(chalk.yellow("\n\n正在停止 MCP 服务器..."));
      stdioProcess.kill();
      console.log(chalk.green("✅ 服务器已停止"));
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      stdioProcess.kill();
      process.exit(0);
    });

    stdioProcess.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        console.error(chalk.red(`❌ 服务器异常退出，代码: ${code}`));
      }
      process.exit(code || 0);
    });
  } catch (error) {
    console.error(chalk.red(`❌ 启动失败: ${error.message}`));
    process.exit(1);
  }
}

/**
 * MCP 命令主函数
 */
export default async function mcp(options = {}) {
  // 先打印配置信息
  printConfig();

  // 如果只是查看配置，不启动服务器
  if (options.configOnly) {
    console.log(chalk.gray("💡 提示: 使用 'cm mcp' 可以启动 MCP stdio 服务器"));
    return;
  }

  // 然后启动服务器
  await startMCPServer();
}

