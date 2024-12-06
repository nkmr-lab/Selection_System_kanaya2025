<template>
  <div>
    <v-dialog v-model="isCardDisplay" persistent max-width="1200" style="user-select: none;">
      <v-card class="py-1 my-1 resize_card">
        <div v-if="resizeCount == -1">
          <v-card-title class="font-weight-bold">
            実験へのご協力ありがとうございます
          </v-card-title>
          <v-card-text style="font-size: 16px; color: black;">
            <ul>
              <li type="disc" class="mb-1">この実験では<span class="font-weight-black">フルスクリーン表示</span>にすることをお願いしています。</li>
              <li type="disc" class="mb-1"><span class="font-weight-black"
                  style="color: #43A047;">OKボタン</span>を押してフルスクリーンに変更してください。</li>
            </ul>
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn @click="toNext" color="green darken-1" variant="flat" height="60" width="100"
              class="m-0 mb-3 font-weight-bold" style="color: white;">OK</v-btn>
          </v-card-actions>
        </div>
        <div v-else-if="resizeCount == 0">
          <v-card-title class="font-weight-bold">
            実験前のサイズ調整にご協力お願いします（1/2）
          </v-card-title>
          <v-card-text style="font-size: 16px; color: black;">
            <ul>
              <li type="disc" class="mb-1">下のカード画像に合わせてクレジットカードを置き、<span
                  class="font-weight-bold">カードのサイズと一致するように画像サイズを調整</span>してください。</li>
              <li type="disc" class="mb-1">デビットカード、保険証、運転免許証、学生証、社員証、ICカード、ポイントカードなど<span
                  class="font-weight-bold">クレジットカードと同じ大きさのカード</span>を使用できます。</li>
              <li type="disc" class="">サイズ調整は<span class="font-weight-bold"
                  style="color:red;">画像右下の赤い部分</span>を操作して行い、調整が完了したら<span class="font-weight-black"
                  style="color: #43A047;">次へボタン</span>を押してください。
              </li>
            </ul>
          </v-card-text>
          <v-card-text>
            <div class="card_container">
              <div ref="card" class="card" :style="{ width: cardWidth + 'px' }" style="user-select: none;">
                <img :src="require('@/assets/card.png')" class="card_img" />
                <div class="resizer" @mousedown="initResize"></div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn @click="toNext" color="green darken-1" variant="flat" height="60" width="100"
              class="m-0 mb-3 font-weight-bold" style="color: white;">次へ</v-btn>
          </v-card-actions>
        </div>
        <div v-else-if="resizeCount == 1">
          <v-card-title class="font-weight-bold">
            実験前のサイズ調整にご協力お願いします（2/2）
          </v-card-title>
          <v-card-text style="font-size: 16px; color: black;">
            <ul>
              <li type="disc" class="mb-1"><span class="font-weight-black">もう一度同じように</span>サイズ調整を行ってください。</li>
              <li type="disc" class="mb-1">サイズ調整は<span class="font-weight-bold"
                  style="color:red;">画像右下の赤い部分</span>を操作して行い、調整が完了したら<span class="font-weight-black"
                  style="color: #43A047;">完了ボタン</span>を押してください。
              </li>
              <li type="disc" style="color: white;"></li>
            </ul>
          </v-card-text>
          <v-card-text>
            <div class="card_container">
              <div ref="card" class="card" :style="{ width: cardWidth + 'px' }" style="user-select: none;">
                <img :src="require('@/assets/card.png')" class="card_img" />
                <div class="resizer" @mousedown="initResize"></div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn @click="toNext" color="green darken-1" variant="flat" height="60" width="100"
              class="m-0 mb-3 font-weight-bold" style="color: white;">完了</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-if="$store.state.isReadyFullscreen" v-model="requestFullscreen" persistent max-width="400"
      style="user-select: none;">
      <v-card class="px-1 py-1">
        <v-card-title class="font-weight-bold">
          フルスクリーンに変更してください
        </v-card-title>
        <v-card-actions class="d-flex justify-end">
          <v-btn @click="goFullscreen" color="blue" variant="flat" class="m-1" style="color: white;">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ResizeData from '@/store/resizeData';

export default {
  name: 'Resize',
  data: () => ({
    cardWidth: 1000,
    cardMinWidth: 100,
    cardMaxWidth: 1000,
    isResizing: false,
    resizeCount: -1,
    isCardDisplay: true,
    requestFullscreen: true,
    resultWidth: [1000, 100],
    resizeHistory: [],
  }),
  mounted() {
    const element = document.querySelector('.resize_card');
    element.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('v-btn') || e.target.classList.contains('v-btn__content')) {
      } else {
        e.preventDefault();
      }
    });
  },
  computed: {
    pixelDensity() {
      if (this.resultWidth[0] == 1000 || this.resultWidth[1] == 100) {
        return null;
      }
      return ((this.resultWidth[0] + this.resultWidth[1]) / 2) / 85.60; // px/mm
    },
  },
  methods: {
    // フルスクリーンに変更
    async goFullscreen() {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      const displayData = {
        screen: { width: screen.width, height: screen.height },
        window: { outerWidth: window.outerWidth, outerHeight: window.outerHeight, innerWidth: window.innerWidth, innerHeight: window.innerHeight, devicePixelRatio: window.devicePixelRatio },
      };
      ResizeData.send('fullscreen', displayData);
      document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
          this.requestFullscreen = false;
        } else {
          this.requestFullscreen = true;
        }
      }, { passive: false });
    },
    initResize(e) {
      this.startX = e.clientX;
      this.startWidth = this.$refs.card.offsetWidth;
      window.addEventListener('mousemove', this.resize);
      window.addEventListener('mouseup', this.stopResize);
      this.isResizing = true;
      e.preventDefault();
    },
    resize(e) {
      const width = this.startWidth + (e.clientX - this.startX);
      this.cardWidth = width < this.cardMinWidth ? this.cardMinWidth : width > this.cardMaxWidth ? this.cardMaxWidth : width;
      const data = {
        width: this.cardWidth,
        timestamp: new Date().getTime(),
      };
      if (this.resizeHistory.length == 0 || this.resizeHistory[this.resizeHistory.length - 1].width != data.width) {
        this.resizeHistory.push(data);
      }
    },
    stopResize() {
      window.removeEventListener('mousemove', this.resize);
      window.removeEventListener('mouseup', this.stopResize);
      ResizeData.send('resize', this.resizeHistory);
      this.isResizing = false;
      this.resizeHistory = [];
    },
    async toNext() {
      if (this.resizeCount == -1) {
        await this.goFullscreen();
        this.$store.commit('setReadyFullscreen', { isReadyFullscreen: true });
        ResizeData.send('resize_start_1');
      } else if (this.resizeCount == 0) {
        this.resultWidth[0] = this.cardWidth;
        this.cardWidth = 100;
        ResizeData.send('resize_start_2');
      } else if (this.resizeCount == 1) {
        this.resultWidth[1] = this.cardWidth;
        this.$store.commit('setPixelDensity', { pixelDensity: this.pixelDensity });
        this.isCardDisplay = false;
      }
      this.resizeCount++;
    },
  },
  watch: {
    isResizing(val) {
      if (val) {
        document.body.style.cursor = 'nwse-resize';
      } else {
        document.body.style.cursor = 'auto';
      }
    },
  },
};
</script>

<style>
.card_container {
  width: 100%;
  height: 540px;
}

.card {
  aspect-ratio: 85.60 / 53.98 !important;
  overflow: auto;
  position: relative;
  /* resize: both; */
}

.resizer {
  content: '';
  border-bottom: 12px solid red;
  border-right: 12px solid red;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 64px;
  height: 64px;
  cursor: nwse-resize;
}

.card_img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>