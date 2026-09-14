# 增加麻将牌 PNG 图片素材

## Why

当前界面牌面用 CSS 文字自绘，风格简化且无法还原真实麻将牌质感。本变更引入 42 种麻将牌的 PNG 图片素材（31 种可组合牌 + 11 种花牌），并改造界面全部牌面（选牌区、桌面区、听口展示）改用图片呈现，同时建立项目内专属素材目录与可重复执行的生成脚本。

## What Changes

- 新增素材目录 `src/static/mahjong/`，存放 42 张麻将牌 PNG（统一尺寸、白底牌面、花色配色）。
- 新增生成脚本 `scripts/generate-tiles.ps1`（基于 .NET System.Drawing），可一键重新生成全部素材。
- 核心模块新增 `tileImage(tile)` 映射：牌编码 0-41 → `/static/mahjong/<name>.png`。
- 改造 `src/pages/index/index.vue`：选牌区、桌面大牌、听口展示全部改用 `<image>` 展示 PNG；交互（选择/移除/清空/判定）与牌桌风格保持不变。

## Capabilities

### New Capabilities

- `tile-png-assets`: 麻将牌 PNG 素材（目录、命名规范、生成方式、编码映射）与界面图片化展示。

### Modified Capabilities

（无）

## Impact

- 新增 `src/static/mahjong/`（42 个 PNG）与 `scripts/generate-tiles.ps1`。
- 修改 `src/core/mahjong/tile.ts`（新增 `tileImage` 映射，不改变既有判定逻辑）。
- 修改 `src/pages/index/index.vue`（牌面渲染从文字改为图片）。
- 构建产物 `dist/build/mp-weixin/static/mahjong/` 由 uni-app 自动拷贝，无需额外配置。

## Non-goals（本次不做）

- 不改动胡牌/听牌判定算法与测试。
- 不引入真实摄影级麻将牌素材（由生成脚本产出简化版，后续可同名替换）。
- 不改动交互逻辑与页面布局结构。
