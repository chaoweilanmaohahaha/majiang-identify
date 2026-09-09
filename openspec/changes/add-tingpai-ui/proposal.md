# 增加听牌判定前端界面

## Why

项目已有上海敲麻的听牌判定核心模块（`src/core/mahjong`），但小程序目前只有脚手架默认页，用户无法实际使用。本变更开发第一个前端界面：用户输入 13 张手牌，界面判断是否听牌并展示听口，未听牌时给出提示，让核心算法在真实场景中可用。

## What Changes

- 改造 `src/pages/index/index.vue` 为听牌判定页（启动页）：
  - 手牌选择器：31 种可组合牌（27 数牌 + 4 风牌）按种类分组点选，每种最多 4 张，暗牌总数限 13 张；红中/发财/白板按敲麻规则属花牌，不提供选择。
  - 判定区：输入满 13 张后可触发判定，调用 `getListeningTiles`；听牌则展示听口（具体听哪些牌），未听牌则展示未听牌提示。
  - 牌面用 CSS 自绘（白色牌面 + 文字 + 麻将风格样式），无图片素材依赖。
- 界面整体采用麻将牌桌风格（绿色呢绒桌面、深色边框、居中牌墙等）。
- 纯前端，无后端/接口变更。

## Capabilities

### New Capabilities

- `tingpai-ui`: 听牌判定界面的交互与展示行为（手牌输入、判定触发、听口/未听牌展示、牌桌风格视觉）。

### Modified Capabilities

（无）

## Impact

- 修改 `src/pages/index/index.vue`；可能新增页面内组件或样式文件（`src/pages/index/` 下）。
- 依赖已归档的 `shanghai-qiaoma-hu-recognition` 能力（`getListeningTiles`、`tileName` 等）。
- 不改动 `src/core/mahjong/` 算法代码；若界面需要小工具函数，可复用 `@/core/mahjong`。
- 无新增依赖。

## Non-goals（本次不做）

- 副露（吃/碰/杠）与花牌输入。
- 胡牌判定 UI、番数展示。
- 敲的状态管理或对局流程。
