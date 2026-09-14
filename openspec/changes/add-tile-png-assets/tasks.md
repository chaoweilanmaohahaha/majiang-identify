# 任务清单：麻将牌 PNG 图片素材

## 1. 素材生成

- [ ] 1.1 编写 `scripts/generate-tiles.ps1`（GDI+ 绘制 42 种牌面），执行生成并验证 `src/static/mahjong/` 下产出 42 张 PNG
- [ ] 1.2 目检抽查素材：数牌数字角标/花色中央字/风牌/花牌配色与白底圆角效果正确

## 2. 编码映射

- [ ] 2.1 在 `src/core/mahjong/tile.ts` 新增 `tileImage(tile)`（0-41 → `/static/mahjong/<name>.png`，越界抛错），补充 `tile.test.ts` 用例（42 个映射唯一、非法编码抛错），验证 `npm run test` 通过

## 3. 界面图片化

- [ ] 3.1 改造 `src/pages/index/index.vue` 桌面大牌为 `<image>` 展示，验证构建成功且图片路径正确
- [ ] 3.2 改造选牌区为 `<image>`（保留已选角标与禁用态），验证交互不受影响
- [ ] 3.3 改造听口展示为 `<image>`，删除文字绘制辅助函数与相关样式

## 4. 收尾验证

- [ ] 4.1 运行 `npm run type-check` 确认无类型错误
- [ ] 4.2 运行 `npm run build:mp-weixin`，确认 `dist/build/mp-weixin/static/mahjong/` 含 42 张 PNG 且页面可渲染，微信开发者工具中手工验证图片显示与交互
- [ ] 4.3 对照 spec.md 逐条复查，`npx openspec validate add-tile-png-assets --strict` 通过
