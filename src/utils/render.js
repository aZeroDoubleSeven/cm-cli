import fs from "node:fs";
import path from "node:path";
import ejs from "ejs";

export default function renderTemplates(dir, data) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      renderTemplates(fullPath, data);
    } else if (file.endsWith(".ejs")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const result = ejs.render(content, data);

      const targetPath = fullPath.replace(/\.ejs$/, "");
      fs.writeFileSync(targetPath, result);
      fs.unlinkSync(fullPath);
    }
  }
}
