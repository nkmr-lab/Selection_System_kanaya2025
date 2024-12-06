<template>
  <div class="home">
    <v-row style="margin-top: 4px; margin-bottom: 256px;">
      <v-col cols="12">
        <v-card class="mx-auto my-7" max-width="800" outlined>
          <v-card-title class="py-5 pl-4">【PC限定】4つの選択肢の中から1つを選ぶ実験</v-card-title>
          <v-divider class="mx-4"></v-divider>
          <div class="pl-10 pr-8 py-3">
            <div class="pt-5">
              <ul class="ulClass">
                <li class="liClass ml-n5 pr-12">
                  <strong>※各行の説明を読んだら右のチェックボックスを押してください。全て読んでチェックしないと次へ進むことができません。</strong>
                </li>
              </ul>
            </div>
            <div class="pt-5">
              <strong><u>
                  <h3 class="pb-3">実験手順</h3>
                </u></strong>
              <ol>
                <v-col cols="12">
                  <v-row justify="end" align="center" class="mb-n3 mt-n5">
                    <v-col>
                      <li class="">1.　性別・年齢を選択して下のボタンを押すと実験が開始します。</li>
                    </v-col>
                    <v-checkbox v-model="check" class="" label="" value="checked1"></v-checkbox>
                  </v-row>
                  <v-row justify="end" align="center" class="my-n3">
                    <v-col>
                      <li class="">2.　先に質問文が表示されます。読み終えたら「選ぶ」を押してください。</li>
                    </v-col>
                    <v-checkbox v-model="check" class="" label="" value="checked2"></v-checkbox>
                  </v-row>
                  <v-row justify="end" align="center" class="my-n3">
                    <v-col>
                      <li class="">3.　4つの選択肢が表示されます。ここで、質問に対する答えを1つ選んでクリックしてください。</li>
                    </v-col>
                    <v-checkbox v-model="check" class="" label="" value="checked3"></v-checkbox>
                  </v-row>
                </v-col>
              </ol>
              <v-col cols="12">
                <v-row justify="end" align="center" class="my-n3">
                  <v-col>
                    手順2、3を<strong>20回</strong>繰り返していただきます。
                  </v-col>
                  <v-checkbox v-model="check" class="" label="" value="checked5"></v-checkbox>
                </v-row>
              </v-col>
            </div>
            <div class="pt-8">
              <strong><u>
                  <h3 class="pb-3">注意</h3>
                </u></strong>
              <ul>
                <v-col cols="12">
                  <v-row justify="end" align="center" class="mb-n3 mt-n5">
                    <v-col>
                      <li>ブラウザは<strong>Google Chrome、Safari、Firefox</strong>のどれかを使用してください。</li>
                    </v-col>
                    <v-checkbox v-model="check" class="" label="" value="checked11"></v-checkbox>
                  </v-row>
                  <v-row justify="end" align="center" class="mb-n3 mt-n5">
                    <v-col>
                      <li>ブラウザの戻るボタン、再読み込みボタンは<strong>押さないように</strong>ご注意ください。</li>
                    </v-col>
                    <v-checkbox v-model="check" class="" label="" value="checked6"></v-checkbox>
                  </v-row>
                  <v-row justify="end" align="center" class="mb-n3 mt-n5">
                    <v-col>
                      <li>悩みすぎずに<strong>直感で</strong>選択するようにしてください。</li>
                    </v-col>
                    <v-checkbox v-model="check" class="" label="" value="checked8"></v-checkbox>
                  </v-row>
                  <v-row justify="end" align="center" class="mb-n3 mt-n5">
                    <v-col>
                      <li>システムが不正と検知した場合、そのためのコードが発行され、報酬が支払われない場合がございます。</li>
                    </v-col>
                    <v-checkbox v-model="check" class="" label="" value="checked9"></v-checkbox>
                  </v-row>
                </v-col>
              </ul>
            </div>
            <div class="pt-7">
              <strong><u>
                  <h3 class="pb-3">問い合わせ先</h3>
                </u></strong>
              <ul class="pt-3" style="list-style-type: none">
                <li>氏名：金谷一輝、所属：明治大学</li>
                <li class="py-2">メール：ev220577@meiji.ac.jp</li>
              </ul>
            </div>
          </div>
          <div class="text-center py-4">
            <v-col cols="12">
              <v-row justify="space-around">
                <v-col class="d-flex" cols="4" sm="4">
                  <v-select v-model="sex" :items="sexes" label="性別" outlined></v-select>
                </v-col>
                <v-col class="d-flex" cols="4" sm="4">
                  <v-select v-model="age" :items="ages" label="年齢" outlined></v-select>
                </v-col>
                <v-col class="d-flex" cols="4" sm="4">
                  <v-btn x-large color="primary" @click="startResearch"><strong>実験を開始する</strong></v-btn>
                </v-col>
              </v-row>
            </v-col>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      userAgent: null,
      mobile: null,
      uuid: null,
      check: [],
      rnd: null,
      ages: [
        "10代",
        "20代",
        "30代",
        "40代",
        "50代",
        "60代以上",
      ],
      sexes: [
        "男性",
        "女性"
      ],
      sex: null,
      age: null
    }
  },
  created() {
    this.userAgent = window.navigator.userAgent.toLowerCase();
    this.rnd = Math.floor(Math.random() * Math.floor(5))
    if (localStorage.getItem("fbMode2") == null) {
      localStorage.setItem('fbMode2', this.rnd)
    } else if (localStorage.getItem("fbMode2") != null) {
      this.rnd = localStorage.getItem("fbMode2")
    }
    let ua = navigator.userAgent
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
      this.mobile = true
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      this.mobile = true
    } else {
      this.mobile = false
    }
  },
  methods: {
    startResearch() {
      // this.getUUID()
      if (this.check.length === 8) {
        if (this.userAgent.indexOf('msie') !== -1 || this.userAgent.indexOf("trident") !== -1) {
          alert('ご使用のブラウザはInternet Explorerです');
        }
        else if (this.userAgent.indexOf('edge') != -1 || this.userAgent.indexOf("edga") !== -1 || this.userAgent.indexOf("edgios") !== -1) {
          alert('ご使用のブラウザはEdgeです');
        }
        else {
          if (this.mobile) {
            alert('この実験はPC限定になっています。')
          }
          else if (this.sex === null || this.age === null) {
            if (this.sex === null && this.age === null) {
              alert('性別、年齢が未回答です')
            }
            else if (this.sex == null) {
              alert('性別が未回答です')
            }
            else {
              alert('年齢が未回答です')
            }
          }
          else {
            this.$store.commit('setReadyStart', { isReadyStart: true });
            this.$router.replace(`/experiment`);
          }
        }
      }
      else {
        alert('すべての説明を読みチェックボックスにチェックを入れてください。');
      }
    },
  },
  watch: {
    age(val) {
      if (val) {
        this.$store.commit('setAge', { age: val });
      }
    },
    sex(val) {
      if (val) {
        this.$store.commit('setGender', { sex: val });
      }
    }
  }
};
</script>

<style scoped>
img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.example {
  border: 1px #000 solid;
}

.ulClass {
  list-style-type: none;
}

.liClass {
  padding-left: 1em;
  text-indent: -1em;
}
</style>