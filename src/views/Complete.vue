<template>
  <div class="complete">
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto my-7" max-width="700" outlined>
          <h2 class="pt-5 text-center">ご協力ありがとうございました。</h2>
          <p class="pb-5 text-center">下のコードとユーザIDはYahoo!クラウドソーシング内で入力するため、お控えください</p>
          <v-divider class="mx-4"></v-divider>
          <div class="pl-10 pr-8 py-3">
            <div class="pt-5">
              <p class="text-center">{{ message }}</p>
              <strong>
                <h2 class="text-center pt-0">コード</h2>
              </strong>
            </div>
            <h2 class="text-center pt-3 pb-12">
              {{ Code }}
            </h2>
          </div>
          <div class="pl-10 pr-8 pb-3">
            <div class="pt-0">
              <strong>
                <h2 class="text-center pt-0">ユーザID</h2>
              </strong>
            </div>
            <h2 class="text-center pt-3 pb-12">
              {{ this.$store.state.uuid }}
              <v-btn class="ml-4" v-clipboard:copy="this.$store.state.uuid" v-clipboard:success="onCopy"
                v-clipboard:error="onError" color="primary">
                <strong>コピー</strong>
              </v-btn>
            </h2>
          </div>
          <div class="pl-10 pr-8 pb-3">
            <h2 class="text-center pt-0 pb-12 ml-4">
              <v-btn @click="exitFullscreen" color="green darken-1" variant="flat" height="60" width="200"
                class="m-0 mb-3 font-weight-bold" style="color: white;">フルスクリーンを終了</v-btn>
            </h2>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Complete",
  data() {
    return {
      // 男女に応じてCode書き換える
      Code: 'C',
      message: ''
    }
  },
  created() {
    if (this.$store.state.isReadyStart === false) {
      alert('エラーが発生しました。最初からやり直してください。')
      this.$router.replace(`/`)
    }
  },
  mounted() {
    this.$store.commit('setReadyFullscreen', { isReadyFullscreen: false });
  },
  methods: {
    onCopy: function (e) {
      this.message = '「' + e.text + '」をコピーしました'
    },
    onError: function () {
      this.message = 'Failed to copy texts'
    },
    exitFullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }
};
</script>
