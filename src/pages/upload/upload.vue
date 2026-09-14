<template>
  <view class="page">
    <view class="upload-card">
      <view class="upload-btn" @tap="chooseImage">上传麻将手牌照片</view>
      <text class="upload-tip">支持从相册选择或拍摄一张手牌照片</text>
      <image
        v-if="imagePath"
        class="preview"
        mode="aspectFit"
        :src="imagePath"
      />
      <text v-if="imagePath" class="recognize-tip">
        识别功能即将上线，请先在下方人工确认/修正手牌后判定
      </text>
    </view>

    <TingpaiJudge v-if="imagePath" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TingpaiJudge from "@/components/TingpaiJudge.vue";
import { recognizeHand } from "@/core/mahjong";

const imagePath = ref("");

function chooseImage(): void {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      const path = res.tempFilePaths[0];
      if (!path) return;
      imagePath.value = path;
      recognizeHand(path)
        .then(() => {
          // 占位识别当前返回空列表，由用户在下方组件中人工修正
        })
        .catch((e) => {
          console.error("识别失败", e);
          uni.showToast({ title: "识别失败，请人工修正", icon: "none" });
        });
    },
    fail: () => {
      // 用户取消选择，不处理
    },
  });
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

.upload-card {
  background: rgba(0, 0, 0, 0.22);
  border-radius: 16rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(180deg, #e8a83c 0%, #c9821f 100%);
  color: #fff8ea;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-tip {
  font-size: 24rpx;
  color: #c9b48a;
  margin-top: 16rpx;
}

.preview {
  width: 100%;
  height: 400rpx;
  margin-top: 24rpx;
  border-radius: 12rpx;
  background: #fdfaf3;
}

.recognize-tip {
  font-size: 24rpx;
  color: #ffd76e;
  margin-top: 16rpx;
}
</style>
