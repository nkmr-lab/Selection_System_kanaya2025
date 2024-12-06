<template>
  <v-app class="app">
    <div class="window" :style="{ width: view_width + 'px', height: (view_height + bar_height) + 'px' }">
      <Toolbar :style="{ height: bar_height + 'px' }" />
      <v-main class="main" :style="{ height: view_height + 'px' }">
        <router-view class="viewport" />
      </v-main>
    </div>
    <Resize />
  </v-app>
</template>

<script>
import Toolbar from '@/components/Toolbar.vue';
import Resize from '@/components/Resize.vue';
import ResizeData from '@/store/resizeData.js';

export default {
  name: 'App',
  components: {
    Toolbar,
    Resize
  },
  data: () => ({
    bar_height: 96,
  }),
  computed: {
    density() {
      return this.$store.state.pixelDensity;
    },
    view_width() {
      if (!this.density) {
        return 1280;
      }
      // 24cmに合わせる
      let w = 240 * this.density;
      return w;
    },
    view_height() {
      return this.view_width * 9 / 16;
    }
  },
  methods: {
    getUUID() {
      // 生成する文字列の長さ
      const l = 16;
      // 生成する文字列に含める文字セット
      const c = "abcdefghijklmnopqrstuvwxyz0123456789";
      const cl = c.length;
      let r = "";
      for (let i = 0; i < l; i++) {
        r += c[Math.floor(Math.random() * cl)];
      }
      this.$store.commit('setUUID', { uuid: r });
    }
  },
  created() {
    this.getUUID();
    ResizeData.setUUID(this.$store.state.uuid);
    const displayData = {
      screen: { width: screen.width, height: screen.height },
      window: { outerWidth: window.outerWidth, outerHeight: window.outerHeight, innerWidth: window.innerWidth, innerHeight: window.innerHeight, devicePixelRatio: window.devicePixelRatio},
    };
    ResizeData.send('login', displayData);
  }
};

// ズームさせない
document.addEventListener("mousewheel", (e) => {
  if (e.ctrlKey || e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// ページ離脱時に警告を出す
window.addEventListener('beforeunload', (event) => {
  event.preventDefault();
}, { passive: false });
</script>

<style>
html {
  overflow: hidden !important;
}

.app {
  width: 100vw;
  height: 100vh;
  background-color: black !important;
}

.window {
  position: fixed;
  inset: 0;
  margin: auto;
  background-color: white;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid gray;
}

.main {
  width: 100%;
  overflow: hidden;
}

.viewport {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>