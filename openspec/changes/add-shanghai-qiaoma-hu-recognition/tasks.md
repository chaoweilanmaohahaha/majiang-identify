# 任务清单：上海敲麻胡牌识别

## 1. 环境准备

- [x] 1.1 安装 vitest devDependency（`npm.cmd install -D vitest@^1.6`）并在 package.json 增加 `"test": "vitest run"`，验证 `npm run test` 可运行
- [x] 1.2 创建 `src/core/mahjong/` 目录结构，验证空模块可通过 `npm run type-check`

## 2. 牌与输入结构

- [x] 2.1 实现 `tile.ts`（0-41 编码、常量、花色/数字/风牌/花牌判定（红中发财白板按花牌处理）、`tileName`），验证 `tile.test.ts` 通过
- [x] 2.2 实现 `types.ts`（`TileId`、`Meld`、`HandInput`、`HuType`、输入校验错误类型），验证类型可被测试文件 import 且 type-check 通过
- [x] 2.3 实现输入校验函数（非法编码、同种牌超四张、折算张数与暗牌模 3 约束），验证非法输入用例测试通过

## 3. 核心判定

- [x] 3.1 实现 `decompose.ts` 回溯分解算法（副露折算固定面子 + 暗牌计数递归），验证分解测试通过
- [x] 3.2 实现 `judge.ts` 的 `isWinningHand`，验证 spec 中胡牌判定全部场景（含副露、杠、花牌不影响）测试通过
- [x] 3.3 实现 `judge.ts` 的 `getWinTypes`（门清平胡/碰碰胡/清一色/混一色，按类型独立搜索分解，可叠加），验证类型识别全部场景测试通过
- [x] 3.4 实现 `listen.ts` 的 `getListeningTiles`（31 种数牌/风牌补牌逐一验证、升序、不含花牌含红中发财白板），验证听牌判定全部场景测试通过
- [x] 3.5 实现 `index.ts` 统一导出，验证 import 路径与 type-check 通过

## 4. 收尾验证

- [x] 4.1 运行 `npm run test` 确认全部测试通过
- [x] 4.2 运行 `npm run type-check` 确认无类型错误
- [x] 4.3 运行 `npm run build:mp-weixin` 确认构建成功且产物中不包含测试文件
- [x] 4.4 对照 spec.md 逐条复查行为一致，验证 openspec change 校验通过（`npx openspec validate add-shanghai-qiaoma-hu-recognition`）
