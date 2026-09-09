# AGENTS.md

## 项目目标
识别不同种类麻将的胡牌情况（判断某副牌是否构成胡牌，以及胡牌类型）。

## 技术栈
- 微信小程序，基于 uni-app（Vue3 + Vite + TypeScript）。
- 官方模板 `dcloudio/uni-preset-vue`（vite-ts 分支），编译工具链 `@dcloudio/uni-*` + Vite 5。
- 路径别名 `@/` 指向 `src/`（见 `tsconfig.json`）。

## 常用命令
- 开发（微信小程序，watch 模式）：`npm run dev:mp-weixin`
- 构建微信小程序：`npm run build:mp-weixin`
- 类型检查：`npm run type-check`
- 其他平台脚本见 `package.json`（`build:h5`、`build:mp-alipay` 等）。

## 关键目录与文件
- `src/pages.json` — 页面路由与导航栏配置（数组第一项为启动页）。
- `src/manifest.json` — 应用配置；`mp-weixin.appid` 目前为空，发布前需填写。
- `src/main.ts` — 入口（`createSSRApp`）。
- `src/App.vue` — 应用生命周期（onLaunch/onShow/onHide）。
- `src/pages/**/*.vue` — 页面。
- `src/uni.scss` — 全局 SCSS 变量（uni-app 内置样式变量，无需手动 import）。
- `vite.config.ts`、`tsconfig.json` — 构建/TS 配置。

## 运行与调试要点
- 构建产物在 `dist/build/mp-weixin`，用微信开发者工具导入该目录即可运行。
- 首次构建较慢（terser 压缩 + 冷启动），可能超过 300s，属正常现象。

## 环境注意事项
- PowerShell 执行策略禁止运行 `npm.ps1`/`npx.ps1`，须用 `npm.cmd` / `npx.cmd`。
- 本机无法访问 github.com（`degit` 会失败）；npm 官方源与 gitee.com 可访问。
