<template>
  <view class="page">
    <view class="header">
      <text class="header-title">听牌判定</text>
      <text class="header-count">已选 {{ total }} / 13 张</text>
    </view>

    <view class="table">
      <view class="hand-slots">
        <view
          v-for="slot in 13"
          :key="slot"
          class="slot"
          @tap="removeBySlot(slot - 1)"
        >
          <view
            v-if="slotTiles[slot - 1] !== null"
            class="tile big"
            :class="tileColorClass(slotTiles[slot - 1] as number)"
          >
            <template v-if="isWindTile(slotTiles[slot - 1] as number)">
              <text class="tile-center wind">{{ tileText(slotTiles[slot - 1] as number) }}</text>
            </template>
            <template v-else>
              <text class="tile-corner tl">{{ tileRank(slotTiles[slot - 1] as number) }}</text>
              <text class="tile-center">{{ tileSuitChar(slotTiles[slot - 1] as number) }}</text>
              <text class="tile-corner br">{{ tileRank(slotTiles[slot - 1] as number) }}</text>
            </template>
          </view>
        </view>
      </view>

      <view class="result-area">
        <view v-if="result" class="result">
          <text v-if="result.kind === 'tingpai'" class="result-ting">
            听牌，共听 {{ listeningTiles.length }} 张：
          </text>
          <text v-else class="result-noting">未听牌</text>
          <view v-if="result.kind === 'tingpai'" class="result-tiles">
            <view
              v-for="t in listeningTiles"
              :key="t"
              class="tile mid"
              :class="tileColorClass(t)"
            >
              <template v-if="isWindTile(t)">
                <text class="tile-center wind">{{ tileText(t) }}</text>
              </template>
              <template v-else>
                <text class="tile-corner tl">{{ tileRank(t) }}</text>
                <text class="tile-center">{{ tileSuitChar(t) }}</text>
                <text class="tile-corner br">{{ tileRank(t) }}</text>
              </template>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="picker">
      <view v-for="group in GROUPS" :key="group.label" class="group">
        <view class="group-label">{{ group.label }}</view>
        <view class="group-tiles">
          <view
            v-for="i in group.count"
            :key="group.start + i - 1"
            class="pick-tile"
            :class="{
              disabled: !canToggle(group.start + i - 1),
              selected: counts[group.start + i - 1] > 0,
            }"
            @tap="toggle(group.start + i - 1)"
          >
            <text class="pick-text" :class="tileColorClass(group.start + i - 1)">
              {{ group.start + i - 1 <= 26 ? tileRank(group.start + i - 1) : tileText(group.start + i - 1) }}
            </text>
            <text v-if="counts[group.start + i - 1] > 0" class="pick-badge">
              x{{ counts[group.start + i - 1] }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="actions">
      <view class="btn clear" @tap="clearAll">清空</view>
      <view class="btn judge" :class="{ disabled: total !== 13 }" @tap="judge">
        听牌判定
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getListeningTiles } from "@/core/mahjong";

interface TileGroup {
  label: string;
  start: number;
  count: number;
}

const GROUPS: TileGroup[] = [
  { label: "万", start: 0, count: 9 },
  { label: "条", start: 9, count: 9 },
  { label: "筒", start: 18, count: 9 },
  { label: "风", start: 27, count: 4 },
];

type Result =
  | { kind: "tingpai" }
  | { kind: "noting" };

const counts = ref<number[]>(Array(31).fill(0));
const result = ref<Result | null>(null);
const listeningTiles = ref<number[]>([]);

const total = computed(() => counts.value.reduce((a, b) => a + b, 0));

const slotTiles = computed(() => {
  const arr: (number | null)[] = [];
  for (let t = 0; t < 31; t++) {
    for (let k = 0; k < counts.value[t]; k++) {
      arr.push(t);
    }
  }
  while (arr.length < 13) {
    arr.push(null);
  }
  return arr;
});

function tileRank(tile: number): string {
  return String((tile % 9) + 1);
}

function tileSuitChar(tile: number): string {
  if (tile < 9) return "万";
  if (tile < 18) return "条";
  return "筒";
}

function tileText(tile: number): string {
  return "东南西北"[tile - 27];
}

function isWindTile(tile: number): boolean {
  return tile >= 27;
}

function tileColorClass(tile: number): string {
  if (tile < 9) return "suit-wan";
  if (tile < 18) return "suit-tiao";
  if (tile < 27) return "suit-tong";
  return "suit-feng";
}

function canToggle(tile: number): boolean {
  const c = counts.value[tile];
  return c > 0 || (c < 4 && total.value < 13);
}

function toggle(tile: number): void {
  if (!canToggle(tile)) return;
  if (counts.value[tile] > 0) {
    counts.value[tile]--;
  } else {
    counts.value[tile]++;
  }
  resetResult();
}

function removeBySlot(index: number): void {
  const tile = slotTiles.value[index];
  if (tile === null) return;
  counts.value[tile]--;
  resetResult();
}

function clearAll(): void {
  counts.value = Array(31).fill(0);
  resetResult();
}

function resetResult(): void {
  result.value = null;
  listeningTiles.value = [];
}

function judge(): void {
  if (total.value !== 13) return;
  const concealed: number[] = [];
  for (let t = 0; t < 31; t++) {
    for (let k = 0; k < counts.value[t]; k++) {
      concealed.push(t);
    }
  }
  try {
    const tiles = getListeningTiles({ concealed, melds: [], flowers: [] });
    if (tiles.length > 0) {
      result.value = { kind: "tingpai" };
      listeningTiles.value = tiles;
    } else {
      result.value = { kind: "noting" };
      listeningTiles.value = [];
    }
  } catch (e) {
    console.error("听牌判定失败", e);
    result.value = { kind: "noting" };
    listeningTiles.value = [];
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  background: #3a2f23;
  padding: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 8rpx 8rpx 20rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #f3e3c3;
  letter-spacing: 4rpx;
}

.header-count {
  font-size: 28rpx;
  color: #c9b48a;
}

.table {
  background: linear-gradient(180deg, #1d7a45 0%, #16603a 100%);
  border: 6rpx solid #2b2318;
  border-radius: 20rpx;
  box-shadow: inset 0 0 40rpx rgba(0, 0, 0, 0.35);
  padding: 28rpx 20rpx;
  margin-bottom: 24rpx;
}

.hand-slots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.slot {
  width: 96rpx;
  height: 128rpx;
  margin: 6rpx;
  border-radius: 8rpx;
  border: 2rpx dashed rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
}

.tile {
  width: 100%;
  height: 100%;
  background: #fdfaf3;
  border-radius: 8rpx;
  border: 2rpx solid #b9ab8f;
  box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.35);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.tile.mid {
  width: 76rpx;
  height: 104rpx;
  margin: 8rpx 6rpx 0 0;
}

.tile-corner {
  position: absolute;
  font-size: 22rpx;
  font-weight: bold;
}

.tile.mid .tile-corner {
  font-size: 18rpx;
}

.tile-corner.tl {
  top: 6rpx;
  left: 8rpx;
}

.tile-corner.br {
  bottom: 6rpx;
  right: 8rpx;
}

.tile-center {
  font-size: 44rpx;
  font-weight: bold;
}

.tile.mid .tile-center {
  font-size: 34rpx;
}

.tile-center.wind {
  font-size: 36rpx;
}

.tile.mid .tile-center.wind {
  font-size: 30rpx;
}

.suit-wan .tile-center,
.suit-wan .tile-corner {
  color: #c0392b;
}

.suit-tiao .tile-center,
.suit-tiao .tile-corner {
  color: #1e8449;
}

.suit-tong .tile-center,
.suit-tong .tile-corner {
  color: #2471a3;
}

.suit-feng .tile-center {
  color: #2c3e50;
}

.result-area {
  min-height: 150rpx;
  padding-top: 20rpx;
}

.result {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-ting {
  font-size: 30rpx;
  font-weight: bold;
  color: #ffd76e;
  margin-bottom: 12rpx;
}

.result-noting {
  font-size: 30rpx;
  font-weight: bold;
  color: #b8c7b4;
  padding: 24rpx 0;
}

.result-tiles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.picker {
  background: rgba(0, 0, 0, 0.22);
  border-radius: 16rpx;
  padding: 16rpx 12rpx;
}

.group {
  margin-bottom: 8rpx;
}

.group-label {
  font-size: 26rpx;
  color: #e8d5a8;
  padding: 8rpx 6rpx 6rpx;
}

.group-tiles {
  display: flex;
  flex-wrap: wrap;
}

.pick-tile {
  width: 76rpx;
  height: 96rpx;
  margin: 4rpx;
  background: #fdfaf3;
  border-radius: 8rpx;
  border: 2rpx solid #b9ab8f;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pick-tile.disabled {
  opacity: 0.35;
}

.pick-tile.selected {
  border-color: #ffd76e;
  background: #fff6dc;
}

.pick-text {
  font-size: 30rpx;
  font-weight: bold;
}

.pick-badge {
  position: absolute;
  right: -8rpx;
  top: -10rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 6rpx;
  border-radius: 16rpx;
  background: #c0392b;
  color: #ffffff;
  font-size: 20rpx;
  line-height: 32rpx;
  text-align: center;
}

.actions {
  display: flex;
  padding: 24rpx 0 40rpx;
}

.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 4rpx;
}

.btn.clear {
  background: #6d5a3f;
  color: #e8d5a8;
  margin-right: 24rpx;
}

.btn.judge {
  background: linear-gradient(180deg, #e8a83c 0%, #c9821f 100%);
  color: #fff8ea;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.3);
}

.btn.judge.disabled {
  opacity: 0.4;
}
</style>
