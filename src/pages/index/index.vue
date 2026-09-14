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
          <image
            v-if="slotTiles[slot - 1] !== null"
            class="tile-img"
            mode="aspectFit"
            :src="tileImage(slotTiles[slot - 1] as number)"
          />
        </view>
      </view>

      <view class="result-area">
        <view v-if="result" class="result">
          <text v-if="result.kind === 'tingpai'" class="result-ting">
            听牌，共听 {{ listeningTiles.length }} 张：
          </text>
          <text v-else class="result-noting">未听牌</text>
          <view v-if="result.kind === 'tingpai'" class="result-tiles">
            <view v-for="t in listeningTiles" :key="t" class="result-tile">
              <image class="tile-img" mode="aspectFit" :src="tileImage(t)" />
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
            <image
              class="pick-img"
              mode="aspectFit"
              :src="tileImage(group.start + i - 1)"
            />
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
import { getListeningTiles, tileImage } from "@/core/mahjong";

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

function canToggle(tile: number): boolean {
  return counts.value[tile] < 4 && total.value < 13;
}

function toggle(tile: number): void {
  if (!canToggle(tile)) return;
  counts.value[tile]++;
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

.tile-img {
  width: 100%;
  height: 100%;
}

.result-tile {
  width: 76rpx;
  height: 104rpx;
  margin: 8rpx 6rpx 0 0;
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
  border-radius: 8rpx;
  box-sizing: border-box;
  position: relative;
}

.pick-tile.disabled {
  opacity: 0.35;
}

.pick-tile.selected {
  background: #fff6dc;
  box-shadow: 0 0 0 3rpx #ffd76e;
}

.pick-img {
  width: 100%;
  height: 100%;
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
