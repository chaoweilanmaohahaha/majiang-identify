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

### 2. 素材来源与处理脚本（`scripts/fetch-tiles.ps1`）
- 数牌/风牌/三元牌（34 张）：samoheen/mahjong-tiles 港式套装（Public Domain），源图为 1200×1680 高清 PNG。
- 花牌（8 张：春夏秋冬梅兰竹菊）：Cangjie6 的 SVG Oblique 麻将牌插图（Wikimedia Commons，CC BY-SA 4.0），经 Commons 缩略图服务渲染为 PNG，更具立体真实感。
- 脚本流程：`curl`（带重试，`-Proxy` 参数可配置）下载 42 张源图 → GDI+ HighQualityBicubic 缩放/居中到统一 200×280 画布 → 按项目命名存入 `src/static/mahjong/`。
- 命名映射集中在脚本 `$map`/`$flowerMap`；花牌映射：chun/xia/qiu/dong ← MJh1~4，mei/lan/zhu/ju ← MJh5/MJh6/MJh8/MJh7。
- 版权说明：`src/static/mahjong/ATTRIBUTION.md` 记录两组来源与许可；花牌（CC BY-SA 4.0）使用时需保留 Cangjie6 署名。
- 理由：GDI+ 手绘难以达到真实麻将牌质感；公共领域/CC BY-SA 素材合法且高清，脚本保证可重复获取与规范化。

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

- [GitHub raw 域名本机不可直连] → 脚本内置 `-Proxy` 参数（默认 http://127.0.0.1:6789）。
- [素材为公共领域简化风格，非摄影级] → 已是接近真实牌面的矢量风格港式套装；如需摄影级素材可另寻授权来源。
- [rpx 缩放下 PNG 边缘锯齿] → 200×280 原始尺寸大于显示尺寸，缩小时质量足够。

## Open Questions

（无——素材来源、覆盖范围、展示位置均已与用户确认）
