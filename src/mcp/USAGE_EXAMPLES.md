# create-project 工具使用示例

## 工具说明

`create-project` 是 CM CLI MCP 服务器提供的工具，用于快速创建项目。

## 支持的项目类型

1. **移动端 (mobile)**: 使用 Uni-app 模板
2. **小程序 (miniprogram)**: 使用 Uni-app 模板
3. **后台管理系统 (admin)**: 使用 Vue2 或 Vue3 模板

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `projectName` | string | ✅ | 项目名称，只能包含小写字母、数字和连字符 |
| `projectType` | string | ✅ | 项目类型：`mobile`、`miniprogram`、`admin` |
| `vueVersion` | string | ⚠️ | Vue 版本：`Vue2` 或 `Vue3`（仅当 `projectType` 为 `admin` 时必需） |
| `needESLint` | boolean | ❌ | 是否配置 ESLint，默认为 `true` |
| `targetPath` | string | ❌ | 目标路径，默认为当前工作目录 |

## 使用示例

### 示例 1: 创建 Vue2 后台管理系统

```json
{
  "projectName": "my-admin-app",
  "projectType": "admin",
  "vueVersion": "Vue2",
  "needESLint": true
}
```

**在 Cursor 中使用**:
```
请使用 create-project 工具创建一个名为 "my-admin-app" 的后台管理系统项目，
使用 Vue2，并配置 ESLint。
```

### 示例 2: 创建 Vue3 后台管理系统（不配置 ESLint）

```json
{
  "projectName": "my-vue3-app",
  "projectType": "admin",
  "vueVersion": "Vue3",
  "needESLint": false
}
```

**在 Cursor 中使用**:
```
请创建一个名为 "my-vue3-app" 的 Vue3 后台管理系统项目，不配置 ESLint。
```

### 示例 3: 创建移动端项目

```json
{
  "projectName": "my-mobile-app",
  "projectType": "mobile",
  "needESLint": true
}
```

**在 Cursor 中使用**:
```
请创建一个名为 "my-mobile-app" 的移动端项目。
```

### 示例 4: 创建小程序项目

```json
{
  "projectName": "my-miniprogram",
  "projectType": "miniprogram",
  "needESLint": false
}
```

**在 Cursor 中使用**:
```
请创建一个名为 "my-miniprogram" 的小程序项目，不配置 ESLint。
```

### 示例 5: 指定目标路径

```json
{
  "projectName": "my-project",
  "projectType": "admin",
  "vueVersion": "Vue2",
  "targetPath": "/path/to/projects"
}
```

## 返回结果

成功创建项目后，会返回：

```json
{
  "success": true,
  "message": "项目创建成功！\n\ncd my-project\npnpm install\npnpm run lint\npnpm run dev",
  "projectPath": "/absolute/path/to/my-project",
  "templateName": "Vue2",
  "startCommands": "cd my-project\npnpm install\npnpm run lint\npnpm run dev"
}
```

## 错误处理

### 错误 1: 项目名称格式不正确

```json
{
  "success": false,
  "error": "项目名称只能包含小写字母、数字和连字符"
}
```

**解决方案**: 确保项目名称只包含小写字母、数字和连字符（如：`my-project-123`）

### 错误 2: 后台管理系统缺少 Vue 版本

```json
{
  "success": false,
  "error": "后台管理系统需要指定Vue版本"
}
```

**解决方案**: 当 `projectType` 为 `admin` 时，必须提供 `vueVersion` 参数

### 错误 3: 目录已存在

```json
{
  "success": false,
  "error": "目录已存在: /path/to/project"
}
```

**解决方案**: 选择不同的项目名称或删除已存在的目录

### 错误 4: 模板不存在

```json
{
  "success": false,
  "error": "模板不存在: /path/to/template"
}
```

**解决方案**: 检查模板目录是否存在，或联系管理员

## 常见问题

### Q: 项目名称可以使用大写字母吗？
A: 不可以。项目名称只能包含小写字母、数字和连字符。

### Q: 可以在已存在的目录中创建项目吗？
A: 不可以。目标目录必须不存在，否则会返回错误。

### Q: ESLint 配置是必需的吗？
A: 不是。可以通过设置 `needESLint: false` 来跳过 ESLint 配置。

### Q: 创建的项目在哪里？
A: 默认在当前工作目录下创建。可以通过 `targetPath` 参数指定其他路径。

## 下一步

项目创建成功后，按照返回的启动命令操作：

1. 进入项目目录：`cd project-name`
2. 安装依赖：`pnpm install`
3. （如果配置了 ESLint）运行代码检查：`pnpm run lint`
4. 启动开发服务器：`pnpm run dev` 或 `pnpm run dev:h5`

