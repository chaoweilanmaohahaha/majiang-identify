# 增加首页入口与上传图片识别流程

## Why

当前小程序启动即进入人工选牌听牌页，入口单一；用户希望支持"拍照/相册上传麻将手牌图片"来判定听牌。本变更新增首页（标题 + 模式选择）并搭建上传图片识别流程。识别能力本身先以占位实现（识别结果由用户人工确认修正），为后续接入真实识别服务预留接口。

## What Changes

- 新增首页 `pages/home/home`（设为启动页）：显示"听牌神器"标题与下拉选择框（人工选择 / 上传图片），选择后跳转对应页面。
- 保留现有听牌判定页 `pages/index/index`（人工选择入口的目标页）。
- 新增上传识别页 `pages/upload/upload`：
  - 调用微信选图能力上传一张照片并预览。
  - 调用识别接口（当前为占位，返回空结果）。
  - 展示可人工确认/修正的牌列表（复用手牌选择交互），修正至 13 张后判定听牌并展示听口/未听牌。
- 将现有听牌判定页的选牌+判定+结果展示逻辑抽取为共享组件，供人工页与上传确认页复用。
- 新增核心模块识别占位接口 `recognizeHand(imagePath): Promise<TileId[]>`。

## Capabilities

### New Capabilities

- `home-entry`: 首页标题、模式选择与跳转行为。
- `image-upload-tingpai`: 上传图片 → 识别（占位）→ 人工确认修正 → 听牌判定的完整流程行为。

### Modified Capabilities

（无——现有 `tingpai-ui` 的交互行为不变，仅实现方式改为复用共享组件）

## Impact

- `src/pages.json`：新增 home、upload 页面，启动页改为 home。
- 新增 `src/pages/home/home.vue`、`src/pages/upload/upload.vue`。
- 新增共享组件（如 `src/components/TingpaiJudge.vue`），`src/pages/index/index.vue` 改为薄封装，行为不变。
- 新增 `src/core/mahjong/recognize.ts` 占位识别接口。
- 不改动核心判定算法与现有测试。

## Non-goals（本次不做）

- 真实的图像识别算法/第三方 OCR 接入（接口占位，后续 feature）。
- 多张图片上传、拍照裁剪优化。
- 副露/花牌输入。
