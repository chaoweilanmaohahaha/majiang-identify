# 设计：首页入口与上传图片识别流程

## Context

现有启动页 `pages/index/index`（人工选牌听牌页，约 360 行单文件页面）。核心模块已有 `getListeningTiles`/`tileImage`。识别采用占位方案（用户确认），首页新增为启动页。动机见 proposal.md。

## Goals / Non-Goals

**Goals:**
- 首页（标题 + 下拉选择 + 跳转）。
- 上传识别页完整流程（选图 → 占位识别 → 人工修正 → 判定）。
- 人工页与上传确认页复用同一套选牌/判定交互。

**Non-Goals:**
- 真实识别算法/OCR 接入；副露/花牌；多图上传。

## Decisions

### 1. 页面结构与路由（`src/pages.json`）
- `pages` 数组第一项改为 `pages/home/home`（启动页）；保留 `pages/index/index`；新增 `pages/upload/upload`。
- home：标题"听牌神器" + `<picker mode="selector">`（range：人工选择/上传图片），`@change` 后 `uni.navigateTo` 到对应页；选择后重置选择框显示占位文案（避免二次进入残留状态）。
- 理由：用户明确要求"下拉选择框"；uni-app 内置 picker 组件在 mp-weixin 原生支持。

### 2. 共享组件抽取（`src/components/TingpaiJudge.vue`）
- 将现有 index 页的选牌区（31 种分组选择、角标、余量）、桌面 13 位展示、判定按钮、结果区整体迁移为组件；页面级状态（counts/result/listeningTiles）随之内聚到组件。
- `src/pages/index/index.vue` 改为薄封装（`<TingpaiJudge />`），行为与现状完全一致。
- 上传页复用同一组件完成"人工确认修正 + 判定"。
- 理由：两个入口共享完全相同的交互与判定逻辑，避免复制 300+ 行；组件无外部依赖，纯 props-free 自包含。
- 备选：复制一份到上传页 —— 违反 DRY，后续双处维护，不采用。

### 3. 识别占位接口（`src/core/mahjong/recognize.ts`）
```ts
export function recognizeHand(imagePath: string): Promise<TileId[]> {
  void imagePath;
  return Promise.resolve([]);
}
```
- 异步 Promise 形态与未来真实实现（OCR/模型服务）一致；当前返回空列表，调用方据此进入人工确认。
- 附带简单单测（resolve 空数组），保证接口存在性与形态。

### 4. 上传识别页（`src/pages/upload/upload.vue`）
- 顶部：上传按钮（`uni.chooseImage`，count=1，sourceType 相册+相机）+ 图片预览（`image` 组件）+ 重新选择。
- 选图成功后调用 `recognizeHand(tempFilePath)`（当前空结果），随后展示 `<TingpaiJudge />` 供用户修正与判定。
- 未选图时仅显示上传入口与提示文案；组件区域在选图后展示（或始终展示但提示先上传——采用选图后展示，聚焦流程）。
- 理由：`uni.chooseImage` 在 mp-weixin 稳定兼容；`chooseMedia` 为较新 API，兼容性考虑选前者。

### 5. 组件引方式
- 显式 `import TingpaiJudge from "@/components/TingpaiJudge.vue"`（不依赖 easycom 约定，行为可控）。

## Risks / Trade-offs

- [组件抽取回归风险] → 抽取后人工页行为应与现状一致，通过构建 + 开发者工具人工回归验证。
- [占位识别让上传流程显得"空转"] → 流程本身即需求（为真实识别预留），确认环节 UI 完整可用。
- [首页 picker 状态残留] → 选择跳转后重置，二次进入无残留。

## Open Questions

（无——识别方式、页面结构、确认流程均已与用户确认）
