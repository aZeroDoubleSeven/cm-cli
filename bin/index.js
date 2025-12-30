#! /usr/bin/env node

import { program } from "commander";
import create from "../src/commands/create.js";
import { showLogo } from "../src/utils/logo.js";

showLogo();

program.name("cm-cli").version("1.0.0");

program.command("create").description("创建初始化项目").action(create);

program.parse();
