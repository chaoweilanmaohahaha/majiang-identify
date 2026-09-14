<template>
  <view class="home">
    <view class="title-wrap">
      <text class="title">听牌神器</text>
      <text class="subtitle">上海敲麻 · 听牌判定</text>
    </view>

    <view class="selector-card">
      <text class="selector-label">选择使用方式</text>
      <picker
        class="selector"
        mode="selector"
        :range="MODES"
        :value="modeIndex"
        @change="onModeChange"
      >
        <view class="selector-value">
          <text :class="{ placeholder: modeIndex === -1 }">
            {{ modeIndex === -1 ? "请选择" : MODES[modeIndex] }}
          </text>
          <text class="arrow">▾</text>
        </view>
      </picker>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const MODES = ["人工选择", "上传图片"];

const modeIndex = ref(-1);

function onModeChange(e: { detail: { value: number | string } }): void {
  const index = Number(e.detail.value);
  modeIndex.value = index;
  const target = index === 0 ? "/pages/index/index" : "/pages/upload/upload";
  uni.navigateTo({ url: target });
  setTimeout(() => {
    modeIndex.value = -1;
  }, 300);
}
</script>

<style>
.home {
  min-height: 100vh;
  background: #3a2f23;
  padding: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 140rpx 0 120rpx;
}

.title {
  font-size: 64rpx;
  font-weight: bold;
  color: #f3e3c3;
  letter-spacing: 12rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #c9b48a;
  margin-top: 20rpx;
  letter-spacing: 4rpx;
}

.selector-card {
  width: 100%;
  background: rgba(0, 0, 0, 0.22);
  border-radius: 16rpx;
  padding: 32rpx 28rpx;
}

.selector-label {
  font-size: 26rpx;
  color: #e8d5a8;
  margin-bottom: 20rpx;
}

.selector-value {
  height: 88rpx;
  background: #fdfaf3;
  border-radius: 12rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30rpx;
  color: #3a2f23;
}

.selector-value .placeholder {
  color: #b9ab8f;
}

.arrow {
  color: #b9ab8f;
  font-size: 28rpx;
}
</style>
