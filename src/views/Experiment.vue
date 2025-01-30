<template>
  <div class="Research">
    <div style="margin:auto;">
      <!-- 質問画面 -->
      <v-overlay opacity="1" color="white" v-show="isShowQuestion" absolute style="padding: 16px; ">
        <v-sheet tile color="white" class="mx-auto">
          <h1 class="text-center black--text text-4xl font-bold">
            Q{{ section + 1 }}. {{ this.shuffledQuestions[this.section] }}
          </h1>
        </v-sheet>
        <v-btn class="d-flex mx-auto px-auto mt-10 my-5 x-large" height="60" width="100" color="primary" @click="
        changeOverlay();
      imageDisplay();
      getMouseTrajectory();
      ">
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
                  <img src="" style="width: 100%;"/>
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

export default {
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
        [
          { src: require("../assets/data/cheetah/1.jpg"), name: "cheetah1", type: "cheetah" },
          //{ src: require("../assets/data/cheetah/2.jpg"), name: "cheetah2", type: "cheetah" },
          //{ src: require("../assets/data/cheetah/3.jpg"), name: "cheetah3", type: "cheetah" },
          { src: require("../assets/data/cheetah/4.jpg"), name: "cheetah4", type: "cheetah" },
          { src: require("../assets/data/cheetah/5.jpg"), name: "cheetah5", type: "cheetah" },
          { src: require("../assets/data/cheetah/6.jpg"), name: "cheetah6", type: "cheetah" }
        ],
        // 消しゴム
        [
          { src: require("../assets/data/eraser/1.jpg"), name: "eraser1", type: "eraser" },
          //{ src: require("../assets/data/eraser/2.jpg"), name: "eraser2", type: "eraser" },
          //{ src: require("../assets/data/eraser/3.jpg"), name: "eraser3", type: "eraser" },
          { src: require("../assets/data/eraser/4.jpg"), name: "eraser4", type: "eraser" },
          { src: require("../assets/data/eraser/5.jpg"), name: "eraser5", type: "eraser" },
          { src: require("../assets/data/eraser/6.jpg"), name: "eraser6", type: "eraser" }
        ],
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
        [
          //{ src: require("../assets/data/mountain/1.jpg"), name: "mountain1", type: "mountain" },
          //{ src: require("../assets/data/mountain/2.jpg"), name: "mountain2", type: "mountain" },
          { src: require("../assets/data/mountain/3.jpg"), name: "mountain3", type: "mountain" },
          { src: require("../assets/data/mountain/4.jpg"), name: "mountain4", type: "mountain" },
          { src: require("../assets/data/mountain/5.jpg"), name: "mountain5", type: "mountain" },
          { src: require("../assets/data/mountain/6.jpg"), name: "mountain6", type: "mountain" }
        ],
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
        // アクション漫画
        [
          { src: require("../assets/data/manga_action/1.jpg"), name: "manga_action1", type: "manga_action" },
          { src: require("../assets/data/manga_action/2.jpg"), name: "manga_action2", type: "manga_action" },
          { src: require("../assets/data/manga_action/3.jpg"), name: "manga_action3", type: "manga_action" },
          { src: require("../assets/data/manga_action/4.jpg"), name: "manga_action4", type: "manga_action" }
        ],
        // 掃除機
        [
          { src: require("../assets/data/vacuum/1.jpg"), name: "vacuum1", type: "vacuum" },
          { src: require("../assets/data/vacuum/2.jpg"), name: "vacuum2", type: "vacuum" },
          { src: require("../assets/data/vacuum/3.jpg"), name: "vacuum3", type: "vacuum" },
          { src: require("../assets/data/vacuum/4.jpg"), name: "vacuum4", type: "vacuum" }
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
         eraser: "消しゴムを使います。どの消しゴムを使いますか？",
         button: "表示されるボタンの内、一番押してみたいボタンはどれですか？",
         door: "表示されるドアの内、一番重たそうなドアはどれですか？",
         lemon: "表示されるレモンの内、一番酸っぱそうなレモンはどれですか？",
         cheetah: "表示されるチーターの内、一番動物らしさを感じるのはどれですか？",
         fishing: "表示される釣り堀の内、一番魚が釣れそうな釣り堀はどれですか？",
         mountain: "山岳地帯の写真が表示されます。探索してみたい場所を選んでください",
         orange: "一番売れると思うオレンジの宣材写真を1つ選んでください",
         waterfall: "表示される滝の内、一番気に入った滝はどれですか？",
         vacuum: "表示される掃除機の内、 一番安そうな掃除機はどれですか？",
         manga: "表示される漫画の内、一番読みたいのはどれですか？",
         movie: "表示される映画のサムネイルの内、一番見たいと思うのはどれですか？",
        //milk: "表示される牛乳の内、一番背が伸びそうなのはどれですか？",
        //juice: "表示される野菜ジュースの内、一番おいしそうなのはどれですか？",

        dummy1: "写っている人数が一番多い写真を選んでください",
        dummy2: "3階建ての家を選んでください",
        dummy3: "一輪車を選んでください",
        dummy4: "映っている円が一番多い画像を選んでください",
        //dummy5: "夜の時間帯の写真を選んでください"

      },
      shuffledQuestions: [],
      selectStartTime: null,
      selectFinishTime: null,
      readQuestionStartTime: null,
      readQuestionFinishTime: null,
      section: 0,
      isShowChoices: true,
      isShowQuestion: true,
      wWidth: window.innerWidth,
      wHeight: window.innerHeight,
      TargetPosition: 0,
      isDelay: false,
      execDelayQuestionNums: [],
      delaySecond: 0,
      cond: 0,
      imageIDs: [],
      selectedPosition: null,
      mouseTrajectoryX: [],
      mouseTrajectoryY: [],
      imgHeight: [100, 100, 100, 100],
      interval1: null,
      interval2: null
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

    // 前半9問を pixel、後半9問を blur に分ける
    let pixelQuestions = nonDummyQuestions.slice(0, 9);
    let blurQuestions = nonDummyQuestions.slice(9, 18);

    // 割り当て結果を保存する配列
    let assignment = [];

    // 各グループのカウンタ
    let counts = {
        blur: { precd: 0, delay: 0, equal: 0 },
        pixel: { precd: 0, delay: 0, equal: 0 }
    };

    shuffleArray(dummyQuestions);
    // ダミー質問を割り当てる（2問をblur/equal、2問をpixel/equalに確実に割り当て）
    assignment.push({ question: dummyQuestions[0].name, group: 0, part: 4 });
    assignment.push({ question: dummyQuestions[1].name, group: 0, part: 4 });
    assignment.push({ question: dummyQuestions[2].name, group: 1, part: 4 });
    assignment.push({ question: dummyQuestions[3].name, group: 1, part: 4 });

    // 通常の質問を正確に割り当てる関数
// 割り当てる関数
    function allocateToGroup(questions, groupName) {
        questions.forEach(question => {
            if (counts[groupName].precd < 3) {
                assignment.push({ question: question.name, group: groupName === "blur" ? 0 : 1, part: 2, text: question.text });
                counts[groupName].precd++;
            } else if (counts[groupName].delay < 3) {
                assignment.push({ question: question.name, group: groupName === "blur" ? 0 : 1, part: 3, text: question.text });
                counts[groupName].delay++;
            } else if (counts[groupName].equal < 3) {
                assignment.push({ question: question.name, group: groupName === "blur" ? 0 : 1, part: 4, text: question.text });
                counts[groupName].equal++;
            }
        });
    }

  // pixel と blur に分配
  allocateToGroup(pixelQuestions, "pixel");
  allocateToGroup(blurQuestions, "blur");

  // ダミー質問を追加
  // assignment.push(...dummyQuestions);

  // 最終的にすべてシャッフルして出題順を決定
  shuffleArray(assignment);

  console.log("出題順:", assignment);

    // ------------------

    // 質問順をシャッフル
    this.shuffledChoices = _.shuffle(this.choices);
    for (let i = 0; i < this.shuffledChoices.length; i++) {
      this.shuffledQuestions.push(this.questions[this.shuffledChoices[i][0].type]);

    }
    // 選択肢をシャッフル
    for (let i = 0; i < this.choices.length; i++) {
      this.shuffledChoices[i] = _.shuffle(this.shuffledChoices[i]);
    }
    // 変化を起こす質問番号を5問ずつ(計10問)選ぶ
    let nums = [...Array(20).keys()];
    while (this.execDelayQuestionNums.length < 10) {
      let isDummy = false;
      let randIndex = Math.floor(Math.random() * nums.length);
      for (let i = 1; i < 16; i++) {
        if (this.shuffledQuestions[nums[randIndex]] === this.questions["dummy" + String(i)]) {
          isDummy = true;
        }
      }
      if (!isDummy) {
        this.execDelayQuestionNums.push(nums[randIndex]);
      }
      nums.splice(randIndex, 1);
    }


    this.execDelayQuestionNums = this.execDelayQuestionNums.sort(function (
      first,
      second
    ) {
      return first - second;
    });
    this.readQuestionStartTime = performance.now();
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
      this.isShowQuestion = !this.isShowQuestion;
      this.isShowChoices = !this.isShowChoices;
    },
    setImage(imageNumber) {
      let img = this.imageIDs[imageNumber];
      img.src = this.shuffledChoices[this.section][imageNumber].src;
    },
    imageDisplay() {
      // for (let i = 0; i < 4; i++) {
      //   this.imgHeight[i] = 15;
      // }
      // 選択時間の計測開始, 質問読み時間の計測終了
      this.readQuestionFinishTime = performance.now();
      this.selectStartTime = performance.now();

      // 画像表示開始のラグ設定
      const delaySeconds = [0, 10, 20, 30];
      this.delaySecond = delaySeconds[Math.floor(Math.random() * delaySeconds.length)];
      // 変化を起こす質問ならtrueに
      for (let i = 0; i < this.execDelayQuestionNums.length; i++) {
        if (this.section === this.execDelayQuestionNums[i]) {

          this.isDelay = true;
          //this.isDelay = false; // 撮影用に追加
          break;
        } else {
          this.isDelay = true;
          //this.isDelay = true; // 撮影用に追加
        }
      }
    

      // 選択肢を表示
      if (this.isDelay) {
        //this.cond = Math.floor(Math.random() * 2);
        this.cond = 0;
        // 変化を起こす場所選び
        this.TargetPosition = Math.floor(Math.random() * 4);

        for (let i = 0; i < this.shuffledChoices[0].length; i++) {
          this.delaySecond = delaySeconds[Math.floor(Math.random() * delaySeconds.length)];

          if (i === this.TargetPosition) {
            setTimeout(this.setImage, this.delaySecond, i);
          } else {
            setTimeout(this.setImage, this.delaySecond, i);
          }
        }
        if (this.cond === 0) {
          //console.log("1枚早い!");
          // 1枚だけ先行表示
          this.interval1 = setInterval(() => {
            for (let i = 0; i < 4; i++) {
              if (i !== this.TargetPosition) {
                blurValues.normal -= blurStep;
                normalImages.forEach(image => {
                image.style.filter = `blur(${blurValues.normal}px)`;
              });
                // blurValueが0以下になったらインターバルを停止
                if (blurValues.normal <= 0) {
                  clearInterval(normalInterval);
                }
              }
            }
          }, 400);
          this.interval2 = setInterval(() => {
            this.imgHeight[this.TargetPosition] -= 20;
            this.imgHeight.push(0);
            this.imgHeight.pop();
          }, 100);
        } else if (this.cond === 1) {
          //console.log("1枚遅い!");
          // 1枚だけ遅延表示
          this.interval1 = setInterval(() => {
            for (let i = 0; i < 4; i++) {
              if (i !== this.TargetPosition) {
                this.imgHeight[i] -= 20;
              }
            }
            this.imgHeight.push(0);
            this.imgHeight.pop();
          }, 100);
          this.interval2 = setInterval(() => {
            this.imgHeight[this.TargetPosition] -= 20;
            this.imgHeight.push(0);
            this.imgHeight.pop();
          }, 400);
        }
      } else {
        this.TargetPosition = null;// condが2,3のときはDBに何も書かない
        this.cond = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < this.shuffledChoices[0].length; i++) {
          this.delaySecond = delaySeconds[Math.floor(Math.random() * delaySeconds.length)];
          setTimeout(this.setImage, this.delaySecond, i);
        }
        if (this.cond === 2) {
          //console.log("全部遅い!");

          this.interval1 = setInterval(() => {
            for (let i = 0; i < 4; i++) {
              this.imgHeight[i] -= 20;
            }
            this.imgHeight.push(0);
            this.imgHeight.pop();
          }, 400);
        } else if (this.cond === 3) {
          //console.log("全部早い！");
          this.interval1 = setInterval(() => {
            for (let i = 0; i < 4; i++) {
              this.imgHeight[i] -= 20;
            }
            this.imgHeight.push(0);
            this.imgHeight.pop();
          }, 100);
        }
      }

      for (let i = 0; i < 4; i++) {
        this.imgHeight[i] = 100;
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
    toNext(n) {

      clearInterval(this.interval1);
      clearInterval(this.interval2);
      // 選択時間の計測終了
      this.selectFinishTime = performance.now();
      //this.imageIDs.forEach(img => (img.src = ""));

      this.selectedPosition = this.changeNumToPosition(n - 1);
      const noDelayPos = this.changeNumToPosition(this.TargetPosition);
      // 送信時にわかりやすくするため遅延実行の質問番号を1始まりにする
      const execDelay = this.execDelayQuestionNums.map(value => value + 1);
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
      // 男女に応じてたたくapi変える
      axios.post("https://kanaya.nkmr.io/Selection202408_female/five_delay_female_result_post.php", {
        uuid: this.$store.state.uuid,
        sex: this.$store.state.sex,
        age: this.$store.state.age,
        section: this.section + 1,
        readQuestionTime: this.readQuestionFinishTime - this.readQuestionStartTime,
        selectedTime: this.selectFinishTime - this.selectStartTime,
        selectedItem: this.shuffledChoices[this.section][n - 1].name,
        selectedPosition: this.selectedPosition,
        upperLeft: this.shuffledChoices[this.section][0].name,
        upperLeftHeight: this.imgHeight[0],
        upperRight: this.shuffledChoices[this.section][1].name,
        upperRightHeight: this.imgHeight[1],
        lowerLeft: this.shuffledChoices[this.section][2].name,
        lowerLeftHeight: this.imgHeight[2],
        lowerRight: this.shuffledChoices[this.section][3].name,
        lowerRightHeight: this.imgHeight[3],
        execDelayQuestionNums: execDelay.toString(),
        delayTime: this.delaySecond,
        cond: this.cond,
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

            for (let i = 0; i < 4; i++) {
              this.imgHeight[i] = 100;
            }

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

<style scoped>
img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
}
.blurred {
    filter: blur(15px); /* 初期状態でぼかしを設定 */
    transition: filter 0.5s linear; /* ぼかし解除のアニメーション */
    width: 100%; /* 枠内に画像をフィットさせる */
    border-radius: 5px; /* 画像自体の角も少し丸める */
    display: block; /* 画像のスペース確保 */
}
</style>
