# 任务清单：首页入口与上传图片识别流程

## 1. 共享组件抽取

- [x] 1.1 新建 `src/components/TingpaiJudge.vue`（迁移现有选牌区/桌面/判定/结果全部逻辑），验证组件编译通过
- [x] 1.2 `src/pages/index/index.vue` 改为薄封装使用组件，验证 `npm run build:mp-weixin` 成功且人工页行为与现状一致（开发者工具回归）

## 2. 首页

- [x] 2.1 新建 `src/pages/home/home.vue`（"听牌神器"标题 + picker 下拉选择框），`src/pages.json` 增加 home 页并设为启动页，验证启动进入首页
- [x] 2.2 实现选择跳转：人工选择 → `pages/index/index`；上传图片 → `pages/upload/upload`；选择后重置选择框，验证两条跳转路径正确

## 3. 识别占位接口

- [x] 3.1 新建 `src/core/mahjong/recognize.ts`（`recognizeHand(imagePath): Promise<TileId[]>`，占位返回空列表）并补充单测，验证 `npm run test` 通过

## 4. 上传识别页

- [x] 4.1 新建 `src/pages/upload/upload.vue`：上传入口（chooseImage 单图）+ 图片预览 + 重新选择，验证选图与预览正常
- [x] 4.2 选图后调用 `recognizeHand` 并展示 `TingpaiJudge` 组件（人工修正至 13 张后判定），验证完整流程：上传 → 确认修正 → 判定 → 听口/未听牌展示

## 5. 收尾验证

- [x] 5.1 运行 `npm run type-check` 与 `npm run test` 确认无错误
- [x] 5.2 运行 `npm run build:mp-weixin`，微信开发者工具中手工验证：启动进首页 → 两种模式跳转 → 上传流程完整走通
- [x] 5.3 对照 spec.md 逐条复查，`npx openspec validate add-home-and-image-upload --strict` 通过
