<template>
  <div class="Research">
    <div style="margin:auto;">
      <!-- 質問画面 -->
      <v-overlay opacity="1" color="white" v-show="isShowQuestion" absolute style="padding: 16px; width: 1280px; height: 720px; transform-origin: 0 0;"
      :style="{ transform: 'scale(' + (!this.$store.state.pixelDensity ? 1 : (240 * this.$store.state.pixelDensity) / 1280) + ')' }">
        <v-sheet tile color="white" class="mx-auto">
          <h1 class="text-center black--text text-4xl font-bold">
            Q{{ section + 1 }}. {{ this.shuffledQuestions[this.section] }}
          </h1>
        </v-sheet>
        <v-btn class="d-flex mx-auto px-auto mt-10 my-5 x-large" height="60" width="100" color="primary" @click="
        changeOverlay();
      imageDisplay();
      getMouseTrajectory();"
      style="transform-origin: center 0;"
      :style="{ transform: 'scale(' + (!this.$store.state.pixelDensity ? 1 : 1280 / (240 * this.$store.state.pixelDensity)) + ')' }"
      >
          選ぶ
        </v-btn>
      </v-overlay>
      <!--選択画面-->
      <div id="target">

        <v-overlay opacity="1" color="white" v-show="isShowChoices" absolute
          style="padding: 8px; width: 1280px; height: 720px; transform-origin: 0 0;"
          :style="{ transform: 'scale(' + (!this.$store.state.pixelDensity ? 1 : (240 * this.$store.state.pixelDensity) / 1280) + ')' }">
          <v-container fluid style="margin: 0; padding: 0;">
            <v-sheet tile color="white" class="mx-auto" style="margin: 0; padding: 0;">
              <h1 class="text-center black--text text-3xl font-bold">
                Q{{ section + 1 }}. {{ this.shuffledQuestions[this.section] }}
              </h1>
            </v-sheet>
            <v-row align="center" justify="center" style="margin: 0; padding: 0;">
              <v-col v-for="n in 4" :key="n" class="d-flex child-flex" cols="5" style="margin: 0; padding: 0;">
                <!--6枚→「n in 6」とcols="4"にする-->
                <v-card flat tile class="d-flex justify-center" color="white" @click="toNext(n);" :width="wWidth / 4"
                  style="margin: 20px; padding: 0;">
                  <!-- <canvas id="canvas" width="740" height="484"></canvas> -->
                   <canvas id="canvas" width="0" height="0"></canvas>
                  <div class="w-full h-full overflow-hidden">
                    <img src="" style="width: 100%;"/>
                  </div>
                  <!--<div :style="{ height: imgHeight[n - 1]  + '%' }"
                    style="position: absolute; bottom: -10px; left: -10px; width: calc(100% + 20px); display: center; align-items: center;justify-content: center; background: rgba(255,255,255,0.5);">
                  </div>-->
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-overlay>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['display_method'])
  },
  data() {
    return {
      choices: [
        // ボタン
        [
          { src: require("../assets/data/button/1.jpg"), name: "button1", type: "button" },
          //{ src: require("../assets/data/button/2.jpg"), name: "button2", type: "button" },
          { src: require("../assets/data/button/3.jpg"), name: "button3", type: "button" },
          { src: require("../assets/data/button/4.jpg"), name: "button4", type: "button" },
          { src: require("../assets/data/button/5.jpg"), name: "button5", type: "button" },
          //{ src: require("../assets/data/button/6.jpg"), name: "button6", type: "button" }
        ],
        // オーロラ
        [
          { src: require("../assets/data/aurora/1.jpg"), name: "aurora1", type: "aurora" },
          { src: require("../assets/data/aurora/2.jpg"), name: "aurora2", type: "aurora" },
          //{ src: require("../assets/data/aurora/3.jpg"), name: "aurora3", type: "aurora" },
          { src: require("../assets/data/aurora/4.jpg"), name: "aurora4", type: "aurora" },
          //{ src: require("../assets/data/aurora/5.jpg"), name: "aurora5", type: "aurora" },
          { src: require("../assets/data/aurora/6.jpg"), name: "aurora6", type: "aurora" }
        ],
        // ダイヤモンド
        [
          //{ src: require("../assets/data/diamond/1.jpg"), name: "diamond1", type: "diamond" },
          { src: require("../assets/data/diamond/2.jpg"), name: "diamond2", type: "diamond" },
          //{ src: require("../assets/data/diamond/3.jpg"), name: "diamond3", type: "diamond" },
          { src: require("../assets/data/diamond/4.jpg"), name: "diamond4", type: "diamond" },
          { src: require("../assets/data/diamond/5.jpg"), name: "diamond5", type: "diamond" },
          { src: require("../assets/data/diamond/6.jpg"), name: "diamond6", type: "diamond" }
        ],
        // ドア
        [
          { src: require("../assets/data/door/1.jpg"), name: "door1", type: "door" },
          { src: require("../assets/data/door/2.jpg"), name: "door2", type: "door" },
          //{ src: require("../assets/data/door/3.jpg"), name: "door3", type: "door" },
          { src: require("../assets/data/door/4.jpg"), name: "door4", type: "door" },
          //{ src: require("../assets/data/door/5.jpg"), name: "door5", type: "door" },
          { src: require("../assets/data/door/6.jpg"), name: "door6", type: "door" }
        ],
        // チーター
        // [
        //   { src: require("../assets/data/cheetah/1.jpg"), name: "cheetah1", type: "cheetah" },
        //   //{ src: require("../assets/data/cheetah/2.jpg"), name: "cheetah2", type: "cheetah" },
        //   //{ src: require("../assets/data/cheetah/3.jpg"), name: "cheetah3", type: "cheetah" },
        //   { src: require("../assets/data/cheetah/4.jpg"), name: "cheetah4", type: "cheetah" },
        //   { src: require("../assets/data/cheetah/5.jpg"), name: "cheetah5", type: "cheetah" },
        //   { src: require("../assets/data/cheetah/6.jpg"), name: "cheetah6", type: "cheetah" }
        // ],
        // 消しゴム
        // [
        //   { src: require("../assets/data/eraser/1.jpg"), name: "eraser1", type: "eraser" },
        //   //{ src: require("../assets/data/eraser/2.jpg"), name: "eraser2", type: "eraser" },
        //   //{ src: require("../assets/data/eraser/3.jpg"), name: "eraser3", type: "eraser" },
        //   { src: require("../assets/data/eraser/4.jpg"), name: "eraser4", type: "eraser" },
        //   { src: require("../assets/data/eraser/5.jpg"), name: "eraser5", type: "eraser" },
        //   { src: require("../assets/data/eraser/6.jpg"), name: "eraser6", type: "eraser" }
        // ],
        // 釣り堀
        [
          //{ src: require("../assets/data/fishing/1.jpg"), name: "fishing1", type: "fishing" },
          { src: require("../assets/data/fishing/2.jpg"), name: "fishing2", type: "fishing" },
          //{ src: require("../assets/data/fishing/3.jpg"), name: "fishing3", type: "fishing" },
          { src: require("../assets/data/fishing/4.jpg"), name: "fishing4", type: "fishing" },
          { src: require("../assets/data/fishing/5.jpg"), name: "fishing5", type: "fishing" },
          { src: require("../assets/data/fishing/6.jpg"), name: "fishing6", type: "fishing" }
        ],
        // 花
        [
          { src: require("../assets/data/flower/1.jpg"), name: "flower1", type: "flower" },
          { src: require("../assets/data/flower/2.jpg"), name: "flower2", type: "flower" },
          //{ src: require("../assets/data/flower/3.jpg"), name: "flower3", type: "flower" },
          //{ src: require("../assets/data/flower/4.jpg"), name: "flower4", type: "flower" },
          { src: require("../assets/data/flower/5.jpg"), name: "flower5", type: "flower" },
          { src: require("../assets/data/flower/6.jpg"), name: "flower6", type: "flower" }
        ],
        // レモン
        [
          //{ src: require("../assets/data/lemon/1.jpg"), name: "lemon1", type: "lemon" },
          //{ src: require("../assets/data/lemon/2.jpg"), name: "lemon2", type: "lemon" },
          { src: require("../assets/data/lemon/3.jpg"), name: "lemon3", type: "lemon" },
          { src: require("../assets/data/lemon/4.jpg"), name: "lemon4", type: "lemon" },
          { src: require("../assets/data/lemon/5.jpg"), name: "lemon5", type: "lemon" },
          { src: require("../assets/data/lemon/6.jpg"), name: "lemon6", type: "lemon" }
        ],
        // 辛料理
        [
          //{ src: require("../assets/data/spycy/1.jpg"), name: "spycy1", type: "spycy" },
          //{ src: require("../assets/data/spycy/2.jpg"), name: "spycy2", type: "spycy" },
          { src: require("../assets/data/spycy/3.jpg"), name: "spycy3", type: "spycy" },
          { src: require("../assets/data/spycy/4.jpg"), name: "spycy4", type: "spycy" },
          { src: require("../assets/data/spycy/5.jpg"), name: "spycy5", type: "spycy" },
          { src: require("../assets/data/spycy/6.jpg"), name: "spycy6", type: "spycy" }
        ],
        // 海
        [
          { src: require("../assets/data/swim/1.jpg"), name: "swim1", type: "swim" },
          //{ src: require("../assets/data/swim/2.jpg"), name: "swim2", type: "swim" },
          { src: require("../assets/data/swim/3.jpg"), name: "swim3", type: "swim" },
          { src: require("../assets/data/swim/4.jpg"), name: "swim4", type: "swim" },
          //{ src: require("../assets/data/swim/5.jpg"), name: "swim5", type: "swim" },
          { src: require("../assets/data/swim/6.jpg"), name: "swim6", type: "swim" }
        ],
        // 将棋
        [
          { src: require("../assets/data/wise/1.jpg"), name: "wise1", type: "wise" },
          { src: require("../assets/data/wise/2.jpg"), name: "wise2", type: "wise" },
          { src: require("../assets/data/wise/3.jpg"), name: "wise3", type: "wise" },
          { src: require("../assets/data/wise/4.jpg"), name: "wise4", type: "wise" },
          //{ src: require("../assets/data/wise/5.jpg"), name: "wise5", type: "wise" },
          //{ src: require("../assets/data/wise/6.jpg"), name: "wise6", type: "wise" }
        ],
        // 山
        // [
        //   //{ src: require("../assets/data/mountain/1.jpg"), name: "mountain1", type: "mountain" },
        //   //{ src: require("../assets/data/mountain/2.jpg"), name: "mountain2", type: "mountain" },
        //   { src: require("../assets/data/mountain/3.jpg"), name: "mountain3", type: "mountain" },
        //   { src: require("../assets/data/mountain/4.jpg"), name: "mountain4", type: "mountain" },
        //   { src: require("../assets/data/mountain/5.jpg"), name: "mountain5", type: "mountain" },
        //   { src: require("../assets/data/mountain/6.jpg"), name: "mountain6", type: "mountain" }
        // ],
        // オレンジ
        [
          //{ src: require("../assets/data/orange/1.jpg"), name: "orange1", type: "orange" },
          { src: require("../assets/data/orange/2.jpg"), name: "orange2", type: "orange" },
          { src: require("../assets/data/orange/3.jpg"), name: "orange3", type: "orange" },
          { src: require("../assets/data/orange/4.jpg"), name: "orange4", type: "orange" },
          //{ src: require("../assets/data/orange/5.jpg"), name: "orange5", type: "orange" },
          { src: require("../assets/data/orange/6.jpg"), name: "orange6", type: "orange" }
        ],
        // 滝
        [
          { src: require("../assets/data/waterfall/1.jpg"), name: "waterfall1", type: "waterfall" },
          { src: require("../assets/data/waterfall/2.jpg"), name: "waterfall2", type: "waterfall" },
          { src: require("../assets/data/waterfall/3.jpg"), name: "waterfall3", type: "waterfall" },
          //{ src: require("../assets/data/waterfall/4.jpg"), name: "waterfall4", type: "waterfall" },
          //{ src: require("../assets/data/waterfall/5.jpg"), name: "waterfall5", type: "waterfall" },
          { src: require("../assets/data/waterfall/6.jpg"), name: "waterfall6", type: "waterfall" }
        ],
        // 漫画
        [
          { src: require("../assets/data/manga/1.jpg"), name: "manga1", type: "manga" },
          { src: require("../assets/data/manga/2.jpg"), name: "manga2", type: "manga" },
          { src: require("../assets/data/manga/3.jpg"), name: "manga3", type: "manga" },
          { src: require("../assets/data/manga/4.jpg"), name: "manga4", type: "manga" }
        ],
        // 掃除機
        // [
        //   { src: require("../assets/data/vacuum/1.jpg"), name: "vacuum1", type: "vacuum" },
        //   { src: require("../assets/data/vacuum/2.jpg"), name: "vacuum2", type: "vacuum" },
        //   { src: require("../assets/data/vacuum/3.jpg"), name: "vacuum3", type: "vacuum" },
        //   { src: require("../assets/data/vacuum/4.jpg"), name: "vacuum4", type: "vacuum" }
        // ],
         // 映画
        [
          { src: require("../assets/data/movie/1.jpg"), name: "movie1", type: "movie" },
          { src: require("../assets/data/movie/2.jpg"), name: "movie2", type: "movie" },
          { src: require("../assets/data/movie/3.jpg"), name: "movie3", type: "movie" },
          { src: require("../assets/data/movie/4.jpg"), name: "movie4", type: "movie" }
        ],
        //ジャケ写
        [
          { src: require("../assets/data/music/1.jpg"), name: "music1", type: "music" },
          { src: require("../assets/data/music/2.jpg"), name: "music2", type: "music" },
          { src: require("../assets/data/music/3.jpg"), name: "music3", type: "music" },
          { src: require("../assets/data/music/4.jpg"), name: "music4", type: "music" }
        ],

        // ダミー質問1
        [
          { src: require("../assets/data/dummy1/1.jpg"), name: "dummy_people1", type: "dummy1" },
          { src: require("../assets/data/dummy1/2.jpg"), name: "dummy_people2", type: "dummy1" },
          { src: require("../assets/data/dummy1/3.jpg"), name: "dummy_people3", type: "dummy1" },
          { src: require("../assets/data/dummy1/4.jpg"), name: "dummy_people4", type: "dummy1" },
          //{ src: require("../assets/data/dummy1/5.jpg"), name: "dummy_people5", type: "dummy1"},
          //{ src: require("../assets/data/dummy1/6.jpg"), name: "dummy_people6", type: "dummy1"}
        ],
        // ダミー質問2
        [
          { src: require("../assets/data/dummy2/1.jpg"), name: "dummy_house1", type: "dummy2" },
          { src: require("../assets/data/dummy2/2.jpg"), name: "dummy_house2", type: "dummy2" },
          { src: require("../assets/data/dummy2/3.jpg"), name: "dummy_house3", type: "dummy2" },
          { src: require("../assets/data/dummy2/4.jpg"), name: "dummy_house4", type: "dummy2" },
          //{ src: require("../assets/data/dummy2/5.jpg"), name: "dummy_house5", type: "dummy2" },
          //{ src: require("../assets/data/dummy2/6.jpg"), name: "dummy_house6", type: "dummy2" }
        ],
        // ダミー質問3
        [
          { src: require("../assets/data/dummy3/1.jpg"), name: "dummy_cycle1", type: "dummy3" },
          { src: require("../assets/data/dummy3/2.jpg"), name: "dummy_cycle2", type: "dummy3" },
          { src: require("../assets/data/dummy3/3.jpg"), name: "dummy_cycle3", type: "dummy3" },
          { src: require("../assets/data/dummy3/4.jpg"), name: "dummy_cycle4", type: "dummy3" },
          //{ src: require("../assets/data/dummy3/5.jpg"), name: "dummy_cycle5", type: "dummy3" },
          //{ src: require("../assets/data/dummy3/6.jpg"), name: "dummy_cycle6", type: "dummy3" }
        ],
        // ダミー質問4
        [
          { src: require("../assets/data/dummy4/1.jpg"), name: "dummy_circle1", type: "dummy4" },
          { src: require("../assets/data/dummy4/2.jpg"), name: "dummy_circle2", type: "dummy4" },
          { src: require("../assets/data/dummy4/3.jpg"), name: "dummy_circle3", type: "dummy4" },
          { src: require("../assets/data/dummy4/4.jpg"), name: "dummy_circle4", type: "dummy4" },
          //{ src: require("../assets/data/dummy4/5.jpg"), name: "dummy_circle5", type: "dummy4" },
          //{ src: require("../assets/data/dummy4/6.jpg"), name: "dummy_circle6", type: "dummy4" },
        ],
        // ダミー質問5
        [
          { src: require("../assets/data/dummy5/1.jpg"), name: "dummy_view1", type: "dummy5" },
          { src: require("../assets/data/dummy5/2.jpg"), name: "dummy_view2", type: "dummy5" },
          { src: require("../assets/data/dummy5/3.jpg"), name: "dummy_view3", type: "dummy5" },
          { src: require("../assets/data/dummy5/4.jpg"), name: "dummy_view4", type: "dummy5" },
          //{ src: require("../assets/data/dummy5/5.jpg"), name: "dummy_view5", type: "dummy5" },
          //{ src: require("../assets/data/dummy5/6.jpg"), name: "dummy_view6", type: "dummy5" }
        ],


      ],
      shuffledChoices: [],
      questions: {

        swim: "一番行ってみたいと思う海の景色はどれですか？",
        flower: "自宅に飾りたいチューリップを1つ選んでください",
        wise: "表示される人物の内、将棋が強そうな人はどれですか？",
        diamond: "表示されるダイヤモンドの内、一番欲しいのはどれですか？",
        aurora: "表示されるオーロラの内、一番見てみたいのはどれですか？",
        spycy: "表示される食べ物の内、一番辛そうなのはどれですか？",
        //eraser: "消しゴムを使います。どの消しゴムを使いますか？",
        button: "表示されるボタンの内、一番押してみたいボタンはどれですか？",
        door: "表示されるドアの内、一番重たそうなドアはどれですか？",
        lemon: "表示されるレモンの内、一番酸っぱそうなレモンはどれですか？",
        //cheetah: "表示されるチーターの内、一番動物らしさを感じるのはどれですか？",
        fishing: "表示される釣り堀の内、一番魚が釣れそうな釣り堀はどれですか？",
        //mountain: "山岳地帯の写真が表示されます。探索してみたい場所を選んでください",
        orange: "一番売れると思うオレンジの宣材写真を1つ選んでください",
        waterfall: "表示される滝の内、一番気に入った滝はどれですか？",
        //vacuum: "表示される掃除機の内、 一番安そうな掃除機はどれですか？",
        manga: "表示される漫画の内、一番読みたいのはどれですか？",
        movie: "表示される映画のサムネイルの内、一番見たいと思うのはどれですか？",
        music: "表示される楽曲のジャケット写真の内、一番聞いてみたいのはどれですか？",
        //milk: "表示される牛乳の内、一番背が伸びそうなのはどれですか？",
        //juice: "表示される野菜ジュースの内、一番おいしそうなのはどれですか？",

        dummy1: "写っている人数が一番多い写真を選んでください",
        dummy2: "3階建ての家を選んでください",
        dummy3: "一輪車を選んでください",
        dummy4: "映っている円が一番多い画像を選んでください",
        dummy5: "夜の時間帯の写真を選んでください"

      },
      shuffledQuestions: [],
      shuffledChoices: [],
      selectStartTime: null,
      selectFinishTime: null,
      readQuestionStartTime: null,
      readQuestionFinishTime: null,
      section: 0,
      assignment: [],
      isShowChoices: true,
      isShowQuestion: true,
      wWidth: window.innerWidth,
      wHeight: window.innerHeight,
      TargetPosition: 0,
      isDelay: false,
      group: null,// blurかpixelか
      part: null, // 先行か遅延か等速か
      cond: null, // 等速の時の500msか2000msか
      imageIDs: [],
      images: [],
      selectedPosition: null,
      mouseTrajectoryX: [],
      mouseTrajectoryY: [],
      blurnormalInterval: null,
      blurchangeInterval: null,
      blureqInterval: null
    };
  },
  created() {
    if (this.$store.state.isReadyStart === false) {
      alert('エラーが発生しました。最初からやり直してください。')
      this.$router.replace(`/`)
    }

    // pre-load
    for (const xs of this.choices) {
      for (const x of xs) {
        const img = document.createElement("img");
        img.src = x.src;
      }
    }
    // ----------------------------
    function shuffleArray(array){
      for(let i= array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // 配列に変換してシャッフル
    let questionList = Object.entries(this.questions).map(([name, text]) => ({ name, text}));
    shuffleArray(questionList);

    // ダミー質問と通常質問を分ける
    let dummyQuestions = questionList.filter(q => q.name.startsWith("dummy"));
    let nonDummyQuestions = questionList.filter(q => !q.name.startsWith("dummy"));
    shuffleArray(nonDummyQuestions);
    let precd_question = nonDummyQuestions.slice(0, 5);
    let delay_question = nonDummyQuestions.slice(5, 10);
    let equal_question = nonDummyQuestions.slice(10, 15).concat(dummyQuestions);

    // console.log(precd_question);
    // console.log(delay_question);
    // console.log(equal_question);

    this.assignment = [
      ...precd_question.map(q => ({ question: q.name, group: this.display_method, part: 2, text: q.text})),
      ...delay_question.map(q => ({ question: q.name, group: this.display_method, part: 3, text: q.text})),
      ...equal_question.map(q => ({ question: q.name, group: this.display_method, part: 4, text: q.text})),
    ]

    // 通常の質問を正確に割り当てる関数
    // 割り当てる関数
    // console.log("display_method:",this.display_method);
    // display_method :0 → blur、display_method:1 → pixel

  // 最終的にすべてシャッフルして出題順を決定
  shuffleArray(this.assignment);
  // console.log(this.assignment);
    // ------------------

    // 質問順をシャッフル
    this.shuffledQuestions = [];
    this.shuffledChoices = [];
    for (let i = 0; i < this.assignment.length; i++) {
      this.shuffledQuestions.push(this.assignment[i].text);

      const questionType = this.assignment[i].question;
      const choicesForCurrentQuestion = _.shuffle(
        this.choices.find(choiceSet => choiceSet[0].type === questionType)
      );
      this.shuffledChoices.push(choicesForCurrentQuestion);
    }

  },
  mounted: function () {
    window.addEventListener("resize", this.handleResize);
    this.isShowQuestion = true;
    this.isShowChoices = false;
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  methods: {
  
    changeOverlay() {
      // 画面遷移
      this.isShowQuestion = !this.isShowQuestion;
      this.isShowChoices = !this.isShowChoices;
    },
    setImage(imageNumber) {
      // 画像選択肢の設定
      let img = this.imageIDs[imageNumber];
      img.src = this.shuffledChoices[this.section][imageNumber].src;
    },
    imageDisplay() {
      // 選択時間の計測開始, 質問読み時間の計測終了
      this.readQuestionFinishTime = performance.now();
      this.selectStartTime = performance.now();

      // 変化を起こす質問ならtrueに
      for (let i = 0; i < this.assignment.length; i++) {
        if (i === this.section) {
          const currentAssignment = this.assignment[i];
          const question = currentAssignment.text;  // 質問文
          this.group = currentAssignment.group;    // 0: blur, 1: pixel
          this.part = currentAssignment.part;      // 2: precd, 3: delay, 4: equal
          // console.log("method:",this.group,"speed:",this.part);
          
          // 条件に応じて関数を分岐
        if (this.group === 0 && this.part === 2) {
          this.handleBlurPrecd(question);
        } else if (this.group === 0 && this.part === 3) {
          this.handleBlurDelay(question);
        } else if (this.group === 0 && this.part === 4) {
          this.handleBlurEqual(question);
        } else if (this.group === 1 && this.part === 2) {
          this.handlePixelPrecd(question);
        } else if (this.group === 1 && this.part === 3) {
          this.handlePixelDelay(question);
        } else if (this.group === 1 && this.part === 4) {
          this.handlePixelEqual(question);
        }
      }};
    },
      //-------------------------------------------------

    // 各パターンに対応する関数（例）
    handleBlurPrecd(question) {
      // console.log("Blur + Precd 処理:", question);
      this.TargetPosition = Math.floor(Math.random() * 4);
      this.cond = null;
      // console.log("変化させる箇所：",this.TargetPosition);
      requestAnimationFrame(() => {
        for(let i=0; i<this.shuffledChoices[0].length; i++){
          this.setImage(i);
        }
        this.applyBlurEffect(500,125,this.shuffledChoices[this.section],this.TargetPosition);
      });
    },

    handleBlurDelay(question) {
      // console.log("Blur + Delay 処理:", question);
      this.TargetPosition = Math.floor(Math.random() * 4);
      this.cond = null;
      // console.log("変化させる箇所：",this.TargetPosition);
      requestAnimationFrame(() => {
        for(let i=0; i<this.shuffledChoices[0].length; i++){
          this.setImage(i);
        }
        this.applyBlurEffect(125,500,this.shuffledChoices[this.section],this.TargetPosition);
      });
    },

    handleBlurEqual(question) {
      // console.log("Blur + Equal 処理:", question);
      this.TargetPosition = null;
      this.cond = Math.floor(Math.random() * 2);
      requestAnimationFrame(() => {
        for(let i=0; i<this.shuffledChoices[0].length; i++){
          this.setImage(i);
        }
        if(this.cond == 0){
          // console.log("Blur + Equal 処理（2,000ms）:", question);
          this.applyBlurEffect(500,500,this.shuffledChoices[this.section],null);
        }else{
        // console.log("Blur + Equal 処理（500ms）:", question);
          this.applyBlurEffect(125,125,this.shuffledChoices[this.section],null);
        }
      }); 
    },

    handlePixelPrecd(question) {
    // console.log("Pixel + Precd 処理:", question);
    this.TargetPosition = Math.floor(Math.random() * 4);
    this.cond = null;
    // console.log("変化させる箇所：", this.TargetPosition);

    let imagesLoaded = 1;

    // **画像の描画が完了したらピクセル処理**
    for (let i = 0; i < this.shuffledChoices[0].length; i++) {
        const img = new Image();
        img.src = this.shuffledChoices[this.section][i].src;
        img.onload = () => {
            this.setImage(i); // 画像をセット
            setTimeout(() => {
              imagesLoaded++;
                if (imagesLoaded === 4) {
                    this.applyPixelEffect(500, 125, this.shuffledChoices[this.section], this.TargetPosition);
                }
            }, 10);  // **描画の遅延を調整**
        };
    }
    },

    handlePixelDelay(question) {
    // console.log("Pixel + Delay 処理:", question);
    this.TargetPosition = Math.floor(Math.random() * 4);
    this.cond = null;
    // console.log("変化させる箇所：", this.TargetPosition);
    
    let imagesLoaded = 1;
    for (let i = 0; i < this.shuffledChoices[0].length; i++) {
        const img = new Image();
        img.src = this.shuffledChoices[this.section][i].src;
        img.onload = () => {
            this.setImage(i); // 画像をセット
            setTimeout(() => {
              imagesLoaded++;
                if (imagesLoaded === 4) {
                  this.applyPixelEffect(125,500,this.shuffledChoices[this.section], this.TargetPosition);
                }
            }, 10);  // **描画の遅延を調整**
        };
    }
    },

    handlePixelEqual(question) {
      // console.log("Pixel + Equal 処理:", question);
      this.TargetPosition = null;

      let imagesLoaded = 0;

      this.cond = Math.floor(Math.random() * 2);
      // **画像の描画が完了したらピクセル処理**
    for (let i = 0; i < this.shuffledChoices[0].length; i++) {
        const img = new Image();
        img.src = this.shuffledChoices[this.section][i].src;

        img.onload = () => {
            this.setImage(i); // 画像をセット

            setTimeout(() => {
                //this.insertPixelated(i, 500, images);
                imagesLoaded++;

                if (imagesLoaded === 4) {
                    if(this.cond == 0){
                      // console.log("Pixel + Equal 処理（2,000ms）:", question);
                      this.applyPixelEffect(500,500,this.shuffledChoices[this.section],null);
                    }else{
                      // console.log("Pixel + Equal 処理（500ms）:", question);
                      this.applyPixelEffect(125,125,this.shuffledChoices[this.section],null);
                    }
                }
            }, 10);  // **描画の遅延を調整**
        };
      }
    },

    changeNumToPosition(num) {
      let position = "";
      switch (num) {
        case 0:
          position = "upperLeft";
          break;
        case 1:
          position = "upperRight";
          break;
        case 2:
          position = "lowerLeft";
          break;
        case 3:
          position = "lowerRight";
          break;
        default:
          position = "";
      }
      return position;
    },

    changeNumToMethods(num){
      let image_methods = "";
      switch (num){
      case 0:
        image_methods = "blur";
        break;
      case 1:
        image_methods = "pixel";
        break;
      default:
       image_methods = "";
      } 
      return image_methods;
    },

    changeNumToSpeed(num){
    let image_speed = "";
      switch (num){
      case 2:
        image_speed = "先行";
        break;
      case 3:
        image_speed = "遅延";
        break;
      case 4:
        image_speed = "等速";
        break;
      default:
       image_speed = "";
      } 
      return image_speed;
    },

    changeNumToCondition(num){
    let cond_speed = "";
      switch (num){
      case 0:
        cond_speed = "2000ms";
        break;
      case 1:
        cond_speed = "500ms";
        break;
      default:
       cond_speed = "";
      } 
      return cond_speed;
    },


  

    // ここから画像処理の関数　先にblur
    applyBlurEffect(speed1, speed2, ImageObjects, position = null) {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // 四方のぼかしを隠すための白い四角形を描画
    ctx.fillStyle = "red";
    
    // 画像要素を取得
    const images = ImageObjects.map(obj => {
    const imgElements = document.querySelectorAll(`img[src="${obj.src}"]`);

    return imgElements.length > 0 ?imgElements[0] : null;
   }).filter(img => img !== null);

    if (images.length === 0) {
        // console.error("画像が取得できませんでした");
        return;
    }
    document.querySelectorAll("img").forEach(image => {
        image.style.filter = "none";
    });

    // **既存の処理を完全に停止**
    if (this.blurnormalInterval) {
        clearInterval(this.blurnormalInterval);
        this.blurnormalInterval = null;
    }
    if (this.blurchangeInterval) {
        clearInterval(this.blurchangeInterval);
        this.blurchangeInterval = null;
    }
    if (this.blureqinterval) {
        clearInterval(this.blureqinterval);
        this.blureqinterval = null;
    }

    // 初期化
    let blurValues = { fast: 20, normal: 20 };
    const blurStep = 5;
    
    //選択画面に遷移した時からblurをかけておく
    images.forEach(image => {
      if(image){
        image.style.filter = "blur(20px)";
      }
    });

    if (position !== null) {
        // 特定の位置の画像だけ高速処理する場合
        const changeImage = images[position];

        if (!changeImage) {
            // console.error("指定された position に対応する画像が見つかりません");
            return;
        }

        const normalImages = images.filter((_, index) => index !== position);

        requestAnimationFrame(() => {

          // 通常の画像のぼかしを減少させるインターバル
          this.blurnormalInterval = setInterval(() => {
              blurValues.normal = Math.max(0, blurValues.normal - blurStep);
              normalImages.forEach(image => {
                  if (image) {
                      image.style.filter = `blur(${blurValues.normal}px)`;
                  }
              });

              if (blurValues.normal <= 0) {
                  clearInterval(this.blurnormalInterval);
                  this.blurnormalInterval = null;
              }
          }, speed1);

          // 高速でぼかしを減少させるインターバル
          this.blurchangeInterval = setInterval(() => {
              blurValues.fast = Math.max(0, blurValues.fast - blurStep);
              if (changeImage) {
                  changeImage.style.filter = `blur(${blurValues.fast}px)`;
              }

              if (blurValues.fast <= 0) {
                  clearInterval(this.blurchangeInterval);
                  this.blurchangeInterval = null;
              }
          }, speed2);
        });
    } else {
        // すべての画像を同じ速度で処理する場合
        this.blureqinterval = setInterval(() => {
            blurValues.normal = Math.max(0, blurValues.normal - blurStep);
            images.forEach(image => {
                if (image) {
                    image.style.filter = `blur(${blurValues.normal}px)`;
                }
            });

            if (blurValues.normal <= 0) {
                clearInterval(this.blureqinterval);
                this.blureqInterval = null;
            }
        }, speed1);
    }},

    // ここからpixel処理～～
    applyPixelEffect(speed1, speed2, ImageObjects, position = null) {
   // 画像要素を取得 (applyBlurEffect() と統一)
   this.images = ImageObjects.map(obj => {
      //  const imgElements = document.querySelectorAll(`img[src="${obj.src}"]`);
      const imgElements = Array.from(document.querySelectorAll('img')).filter(img => img.src.endsWith(obj.src));
       return imgElements.length > 0 ? imgElements[0] : null;
   }).filter(img => img !== null);

   if (this.images.length === 0) {
      //  console.error("❌ applyPixelEffect: 画像が取得できませんでした");
       return;
   }

    // **4枚すべてに最初にピクセル処理を適用**
    this.images.forEach((image, index) => {
        this.insertPixelated(index, 500, this.images);
    });

    let mosaicValues = { fast: 500, normal: 500 };
    const mosaicStep = mosaicValues.normal / 5; // 5ステップで解除

    if (position !== null) {
        // **特定の1枚を高速解除、それ以外を通常解除**
        //const fastImage = images[position];
        // const normalImages = images.filter((_, idx) => idx !== position);
        var normalImages = this.images.map((_, index) => index).filter(index => index !== position); 

        this.pixelnormalInterval = setInterval(() => {
            mosaicValues.normal = Math.max(0, mosaicValues.normal - mosaicStep);
            normalImages.forEach((idx) => {
                this.insertPixelated(idx, mosaicValues.normal, this.images);
            });

            if (mosaicValues.normal <= 0) {
                clearInterval(this.pixelnormalInterval);
                this.pixelnormalInterval = null;
            }
        }, speed1);

        if(position >= 0 && position < this.images.length){
          this.pixelchangeInterval = setInterval(() => {
              mosaicValues.fast = Math.max(0, mosaicValues.fast - mosaicStep);
              this.insertPixelated(position, mosaicValues.fast, this.images);

              if (mosaicValues.fast <= 0) {
                  clearInterval(this.pixelchangeInterval);
                  this.pixelchangeInterval = null;
              }
          }, speed2);
       }
    } else {
        // **すべての画像のピクセル処理を同時に解除**
        this.pixeleqinterval = setInterval(() => {
            mosaicValues.normal = Math.max(0, mosaicValues.normal - mosaicStep);
            this.images.forEach((image, index) => {
                this.insertPixelated(index, mosaicValues.normal, this.images);
            });

            if (mosaicValues.normal <= 0) {
                clearInterval(this.pixeleqinterval);
                this.pixeleqinterval = null;
            }
        }, speed1);
    }
    },

/**
 * 指定した画像にモザイク処理を適用する
 * @param {number} index - 画像のインデックス
 * @param {number} mosaicValue - モザイクの強さ
 * @param {Array} images - 画像要素の配列
 */
 insertPixelated(index, mosaicValue, images) {
    const sourceImage = images[index];


    if (!sourceImage) return;

    // **すでにピクセル化された canvas が存在する場合は削除**
    const existingCanvas = sourceImage.parentElement.querySelector('canvas.pixelated');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // **モザイク解除レベルの決定**
    const blocksize = Math.max(1, Math.floor(mosaicValue / 10));

    // **ピクセル化処理**
    const pixelated = this.toPixelated(sourceImage, blocksize);

    // **元の画像を visibility: hidden にし、レイアウトを維持**
    sourceImage.style.visibility = 'hidden';

    // **`canvas` を `sourceImage` の親要素に追加**
    sourceImage.parentElement.appendChild(pixelated);
},

/**
 * 画像をピクセル化する処理
 * @param {HTMLElement} imageElement - 画像要素
 * @param {number} blockSize - ブロックサイズ (デフォルト: 4)
 * @returns {HTMLCanvasElement} - ピクセル化された画像
 */
 toPixelated(imageElement, blockSize = 4) {
    if (!imageElement) return;

    // **表示されている画像サイズを取得**
    const displayWidth = imageElement.offsetWidth;
    const displayHeight = imageElement.offsetHeight;

    // **ピクセル化のための縮小サイズを計算**
    const pixelatedWidth = Math.max(1, Math.floor(displayWidth / blockSize));
    const pixelatedHeight = Math.max(1, Math.floor(displayHeight / blockSize));

    // **キャンバスを作成**
    const canvasElement = document.createElement('canvas');
    canvasElement.classList.add("pixelated");
    canvasElement.width = displayWidth;
    canvasElement.height = displayHeight;

    const ctx = canvasElement.getContext('2d');

    // **縮小してモザイク化**
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = pixelatedWidth;
    tempCanvas.height = pixelatedHeight;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.drawImage(imageElement, 0, 0, pixelatedWidth, pixelatedHeight);

    // **拡大して元のサイズに戻す**
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, pixelatedWidth, pixelatedHeight, 0, 0, displayWidth, displayHeight);

    // **キャンバスを元の画像の上に正確に配置**
    Object.assign(canvasElement.style, {
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        imageRendering: 'pixelated',
        position: "absolute",
        top: `${imageElement.offsetTop}px`,
        left: `${imageElement.offsetLeft}px`,
        zIndex: "10",
    });

    return canvasElement;
},



    // ここまでが画像処理の関数
    toNext(n) {
      // **blur & pixel の処理をストップ**
    clearInterval(this.blurnormalInterval);
    clearInterval(this.blurchangeInterval);
    clearInterval(this.blureqInterval);
    clearInterval(this.pixelnormalInterval);
    clearInterval(this.pixelchangeInterval);
    clearInterval(this.pixeleqinterval);

    // **ピクセル処理のために追加された canvas(pixelated) のみ削除**
    document.querySelectorAll("canvas.pixelated").forEach(canvas => canvas.remove());

    // **画像の表示をリセット（ピクセル処理で非表示にした画像を元に戻す）**
    document.querySelectorAll("img").forEach(image => {
        image.style.visibility = 'visible'; // もし非表示になっていたら元に戻す
        image.style.filter = 'none'; // ぼかしやモザイクを解除
    });

      // 選択時間の計測終了
      this.selectFinishTime = performance.now();
      this.imageIDs.forEach(img => (img.src = ""));

      this.selectedPosition = this.changeNumToPosition(n - 1);
      const noDelayPos = this.changeNumToPosition(this.TargetPosition);
      const image_method = this.changeNumToMethods(this.assignment[this.section].group);
      const image_speed = this.changeNumToSpeed(this.assignment[this.section].part);
      const cond_speed = this.changeNumToCondition(this.cond);

      let posX = 0;
      let posY = 0;
      if (this.mouseTrajectoryX[this.mouseTrajectoryX.length - 1] === undefined) {
        posX = this.wWidth / 2;
        posY = this.wHeight / 2;
        this.mouseTrajectoryX = [posX];
        this.mouseTrajectoryY = [posY];
      } else {
        posX = this.mouseTrajectoryX[this.mouseTrajectoryX.length - 1];
        posY = this.mouseTrajectoryY[this.mouseTrajectoryY.length - 1];
      }

      // if(this.cond === null){
      //    //condがnull（先行・遅延のとき）のときはDBに何も書きこまない
      //    this.cond = -1;
      //  }
    


      // 男女に応じてたたくapi変える
      axios.post("https://kanaya.nkmr.io/Selection_System_2025_female/five_delay_female_result_post.php", {
        uuid: this.$store.state.uuid,
        sex: this.$store.state.sex,
        age: this.$store.state.age,
        section: this.section + 1,
        readQuestionTime: this.readQuestionFinishTime - this.readQuestionStartTime,
        selectedTime: this.selectFinishTime - this.selectStartTime,
        selectedItem: this.shuffledChoices[this.section][n - 1].name,
        selectedPosition: this.selectedPosition,
        upperLeft: this.shuffledChoices[this.section][0].name,
        upperRight: this.shuffledChoices[this.section][1].name,
        lowerLeft: this.shuffledChoices[this.section][2].name,
        lowerRight: this.shuffledChoices[this.section][3].name,
        method: image_method,
        speed: image_speed,
        cond: cond_speed,
        TargetPosition: noDelayPos,
        width: this.wWidth,
        height: this.wHeight,
        selectedX: posX,
        selectedY: posY,
        mouseTrajectoryX: this.mouseTrajectoryX.toString(),
        mouseTrajectoryY: this.mouseTrajectoryY.toString()
      })
        .then(response => {
          if (this.section < this.choices.length - 1) {
            this.isShowQuestion = !this.isShowQuestion;
            this.isShowChoices = !this.isShowChoices;
            this.section++;
          } else {
            this.$router.replace(`/complete`);
          }
        })
        .catch(error => {
          if (this.section < this.choices.length - 1) {
            this.isShowQuestion = !this.isShowQuestion;
            this.isShowChoices = !this.isShowChoices;
            this.section++;

          } else {
            this.$router.replace(`/complete`);
          }
          console.log("err:", error);
        });
      // 質問読み時間の計測開始
      this.readQuestionStartTime = performance.now();
    },
    handleResize() {
      this.wWidth = window.innerWidth;
      this.wHeight = window.innerHeight;
    },
    getMouseTrajectory() {
      if (this.section !== 0) {
        this.mouseTrajectoryX = [];
        this.mouseTrajectoryY = [];
      }
      document.getElementById("target").addEventListener("pointermove", event => {
        for (const eve of event.getCoalescedEvents()) {
          this.mouseTrajectoryX.push(eve.clientX);
          this.mouseTrajectoryY.push(eve.clientY);
        }
      })
    }
  },
  updated: function () {
    this.imageIDs = document.querySelectorAll("img");
  }
};
</script>
