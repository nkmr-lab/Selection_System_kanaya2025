import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sex: null,
    age: null,
    uuid: null,
    isReadyFullscreen: false,
    pixelDensity: null,
    isReadyStart: false,
  },
  getters: {
  },
  mutations: {
    setGender(state, val) {
      state.sex = val.sex;
    },
    setAge(state, val) {
      state.age = val.age;
    },
    setUUID(state, val) {
      state.uuid = val.uuid;
    },
    setReadyFullscreen(state, val) {
      state.isReadyFullscreen = val.isReadyFullscreen;
    },
    setPixelDensity(state, val) {
      state.pixelDensity = val.pixelDensity;
    },
    setReadyStart(state, val) {
      state.isReadyStart = val.isReadyStart;
    },
  },
  actions: {
  },
  modules: {
  }
})
