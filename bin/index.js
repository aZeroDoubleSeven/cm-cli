#! /usr/bin/env node

import { program } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import create from "../src/commands/create.js";
import mcp from "../src/commands/mcp.js";
import { showLogo } from "../src/utils/logo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, "../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

showLogo();

program.name("cm-cli").version(packageJson.version);

program.command("create").description("创建初始化项目").action(create);

program
  .command("mcp")
  .description("启动 MCP stdio 服务器并显示配置信息（用于集成MCP的AI Agent应用）")
  .option("--config-only", "仅显示配置信息，不启动服务器", false)
  .action(mcp);

program.parse();
