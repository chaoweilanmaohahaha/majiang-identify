## Purpose

提供 42 种麻将牌的 PNG 图片素材与编码映射，供界面以图片形式展示牌面，素材可重复生成并集中在项目专属目录中管理。

## ADDED Requirements

### Requirement: PNG 素材文件
项目 SHALL 在 `src/static/mahjong/` 目录存放 42 张麻将牌 PNG：31 种可组合牌（万 1-9、条 1-9、筒 1-9、东南西北）与 11 种花牌（红中、发财、白板、春夏秋冬梅兰竹菊）。图片 SHALL 为统一尺寸（200×280）的竖版牌面，风格贴近真实麻将牌（真实港式牌面矢量风格），素材来源为公共领域素材集（samoheen/mahjong-tiles 港式套装），可合法内置到项目。

#### Scenario: 素材完整
- **WHEN** 检查素材目录
- **THEN** 存在 42 张 PNG，覆盖全部 42 种牌

#### Scenario: 命名规范
- **WHEN** 查看文件名
- **THEN** 命名符合 `<牌种>_<标识>.png`（如 wan_1、tiao_9、tong_5、feng_dong、zhong、fa、bai、chun、mei 等），与编码映射一一对应

### Requirement: 编码到图片的映射
核心模块 SHALL 提供 `tileImage(tile)`：牌编码 0-41 映射到对应 PNG 的静态资源路径 `/static/mahjong/<name>.png`；编码在 0-41 之外 SHALL 抛错。

#### Scenario: 全部编码可映射
- **WHEN** 依次调用 tileImage(0..41)
- **THEN** 返回 42 个互不相同的合法资源路径

#### Scenario: 非法编码
- **WHEN** 调用 tileImage(42) 或负数
- **THEN** 抛出错误

### Requirement: 界面图片化展示
听牌判定界面 SHALL 在选牌区、桌面区、听口展示区使用 PNG 图片展示牌面，交互行为（选择、移除、清空、判定、结果展示）与牌桌风格视觉保持不变。

#### Scenario: 选牌区图片
- **WHEN** 进入页面查看选牌区
- **THEN** 每个牌位显示对应 PNG 图片与已选数量角标

#### Scenario: 桌面区图片
- **WHEN** 已选牌在桌面区展示
- **THEN** 以图片形式显示，点击仍可移除

#### Scenario: 听口图片
- **WHEN** 判定听牌
- **THEN** 听口以图片形式展示

### Requirement: 素材获取脚本
项目 SHALL 提供 `scripts/fetch-tiles.ps1`，可从素材源重新下载并规范化全部 42 张 PNG 到 `src/static/mahjong/`（支持通过 `-Proxy` 参数配置下载代理）。

#### Scenario: 重复获取
- **WHEN** 执行获取脚本
- **THEN** 42 张 PNG 被（重新）生成，路径与命名不变
