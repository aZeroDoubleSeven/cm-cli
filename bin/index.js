#! /usr/bin/env node

import boxen from "boxen";
import chalk from "chalk";

import { program } from "commander";
import init from "../src/commands/init.js";

// 注册一个命令 init
// const argv = require('node:process').argv;
console.log(
  boxen(
    `\ ${chalk.green("欢迎使用avo-cli.")}`,
    {
      padding: 1,
      margin: 1,
      align: "center",
      borderColor: "yellow",
      borderStyle: "round",
    }
  )
);

program.name("avocado-cli").version("1.0.0");

program.command("init").description("初始化项目").action(init);

program.parse();
