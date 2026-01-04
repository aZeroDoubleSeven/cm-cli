#! /usr/bin/env node

import { program } from "commander";
import create from "../src/commands/create.js";
import mcp from "../src/commands/mcp.js";
import { showLogo } from "../src/utils/logo.js";

showLogo();

program.name("cm-cli").version("1.0.0");

program.command("create").description("创建初始化项目").action(create);

program
  .command("mcp")
  .description("启动 MCP stdio 服务器并显示配置信息（用于集成MCP的AI Agent应用）")
  .option("--config-only", "仅显示配置信息，不启动服务器", false)
  .action(mcp);

program.parse();
