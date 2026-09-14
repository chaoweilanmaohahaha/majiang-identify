# 任务清单：麻将牌 PNG 图片素材

## 1. 素材生成

- [x] 1.1 编写 `scripts/fetch-tiles.ps1`（从公共领域素材源 samoheen/mahjong-tiles 下载并规范化 42 种牌面至 200×280），执行并验证 `src/static/mahjong/` 下产出 42 张 PNG
- [x] 1.2 程序化抽查素材（尺寸统一、各类牌颜色正确），并请用户目检观感

## 2. 编码映射

- [x] 2.1 在 `src/core/mahjong/tile.ts` 新增 `tileImage(tile)`（0-41 → `/static/mahjong/<name>.png`，越界抛错），补充 `tile.test.ts` 用例（42 个映射唯一、非法编码抛错），验证 `npm run test` 通过

## 3. 界面图片化

- [x] 3.1 改造 `src/pages/index/index.vue` 桌面大牌为 `<image>` 展示，验证构建成功且图片路径正确
- [x] 3.2 改造选牌区为 `<image>`（保留已选角标与禁用态），验证交互不受影响
- [x] 3.3 改造听口展示为 `<image>`，删除文字绘制辅助函数与相关样式

## 4. 收尾验证

- [x] 4.1 运行 `npm run type-check` 确认无类型错误
- [x] 4.2 运行 `npm run build:mp-weixin`，确认 `dist/build/mp-weixin/static/mahjong/` 含 42 张 PNG 且页面可渲染，微信开发者工具中手工验证图片显示与交互
- [x] 4.3 对照 spec.md 逐条复查，`npx openspec validate add-tile-png-assets --strict` 通过
