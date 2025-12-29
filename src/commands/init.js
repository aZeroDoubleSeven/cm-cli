import inquirer from "inquirer";
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";
import { fileURLToPath } from "node:url";

import copyDir from "../utils/copy.js";
import renderTemplates from "../utils/render.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function init() {
  const answers = await inquirer.prompt([
    {
      name: "projectName",
      message: "项目名称",
      default: "uni-app-project",
    },
    {
      name: "vueVersion",
      type: "list",
      message: "选择项目类型",
      choices: ["Uni-app", "Vue2", "Vue3"],
    },
  ]);

  const targetDir = path.resolve(process.cwd(), answers.projectName);

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red("❌ 目录已存在"));
    return;
  }

  const templateDir = path.resolve(
    __dirname,
    `../template/${answers.vueVersion}`
  );

  copyDir(templateDir, targetDir);
  renderTemplates(targetDir, answers);

  console.log(chalk.green("\n🎉 项目创建成功！"));
  console.log(`\n  cd ${answers.projectName}`);
  console.log("  pnpm install");
  console.log("  pnpm run dev:h5\n");
}
