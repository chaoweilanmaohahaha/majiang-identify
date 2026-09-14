# 设计：麻将牌 PNG 图片素材

## Context

听牌判定界面目前用 CSS 文字绘制牌面（`src/pages/index/index.vue` 中 `.tile` 相关样式与 `tileRank/tileSuitChar/tileText` 等辅助函数）。核心模块 `src/core/mahjong/tile.ts` 已有 0-41 编码（0-26 数牌、27-30 风牌、31-33 中发白、34-41 季节花）。uni-app 静态资源放 `src/static/`，构建时自动拷贝进 `dist/build/mp-weixin/static/`。动机见 proposal.md。

## Goals / Non-Goals

**Goals:**
- 42 张统一风格 PNG + 专属目录 + 编码映射 + 界面图片化。

**Non-Goals:**
- 不改判定逻辑、不改交互与布局结构、不引入真实摄影素材。

## Decisions

### 1. 素材目录与命名（`src/static/mahjong/`）
- `wan_1..wan_9`、`tiao_1..tiao_9`、`tong_1..tong_9`、`feng_dong/nan/xi/bei`、`zhong/fa/bai`、`chun/xia/qiu/dong`、`mei/lan/zhu/ju`，共 42 个 `.png`。
- 理由：语义化命名便于人工核对；编码映射集中在 `tileImage` 一处。

### 2. 生成脚本（`scripts/generate-tiles.ps1`，PowerShell + System.Drawing/GDI+）
- 运行：`powershell -ExecutionPolicy Bypass -File scripts/generate-tiles.ps1`（本机 PowerShell 策略限制，必须带 Bypass）。
- 画布 140×188px，透明背景 + 白底圆角牌身（GraphicsPath 圆角路径 + 渐变填充 + 深米色描边）。
- 数牌：左上角数字 + 右下角旋转 180° 数字（Arial Bold 26px），中央花色大字（Microsoft YaHei Bold 60px）；配色：万 #C0392B、条 #1E8449、筒 #2471A3。
- 风牌：中央单字（YaHei Bold 72px，#2C3E50）。
- 红中：红色"中"；发财：绿色"發"；白板：中央蓝色圆角方框（无文字）。
- 季节花（春夏秋冬）红字；花朵花（梅兰竹菊）蓝字（YaHei Bold 76px）。
- 理由：无第三方依赖、可重复生成；后续换真实素材时同名替换即可。

### 3. 编码映射（`src/core/mahjong/tile.ts` 新增 `tileImage`）
- 0-8 → wan_1..9；9-17 → tiao_1..9；18-26 → tong_1..9；27-30 → feng_dong/nan/xi/bei；31-33 → zhong/fa/bai；34-41 → chun/xia/qiu/dong/mei/lan/zhu/ju。
- 返回 `/static/mahjong/<name>.png`（uni-app 微信小程序绝对路径）；越界抛 RangeError。
- 理由：与现有 `tileName` 并列，属于牌的基础元数据，放核心模块便于复用。

### 4. 界面改造（`src/pages/index/index.vue`）
- 桌面大牌/听口中牌/选牌区小牌均改为 `<image :src="tileImage(t)" />`，用 CSS 类控制尺寸（大 96×128rpx、中 76×104rpx、小 76×96rpx），保留圆角溢出裁剪与选中/禁用样式。
- 删除文字绘制辅助函数与相关样式（tile-corner/tile-center 等）；选牌区角标 xN 保留。
- 理由：全部位置统一图片，符合用户确认；CSS 仅保留布局与状态样式。

### 5. 兼容性
- `<image>` 在 mp-weixin 原生支持；透明 PNG 圆角直接显示，无需额外 mask。
- 42 张 PNG 合计预计 <100KB，无包体积压力。

## Risks / Trade-offs

- [GDI+ 字体在无中文环境机器不可用] → 本机为中文 Windows（msyh.ttc 存在）；脚本加字体回退（YaHei → SimSun）。
- [生成素材观感简朴] → 明确为可替换占位风格；后续直接同名替换 PNG 即可。
- [rpx 缩放下 PNG 边缘锯齿] → 140×188 原始尺寸大于显示尺寸，缩小时质量足够。

## Open Questions

（无——素材来源、覆盖范围、展示位置均已与用户确认）
