import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fullScreen: true,
    songer: [],
    nowIndex: -1,
    loop: 1
  },
  mutations: {
    changeSonger (state, songList) {
      state.songer = songList
    },
    changeLoop (state) {
      if (state.loop === 3) {
        state.loop = 1
      } else {
        state.loop++
      }
    },
    changeFullScreen (state, bool) {
      state.fullScreen = bool
    },
    changeNowIndex (state, index) {
      state.nowIndex = index
    },
    nextSong (state) {
      if (state.nowIndex === state.songer.length - 1) {
        state.nowIndex = 0
      } else {
        state.nowIndex++
      }
    },
    prevSong (state) {
      if (state.nowIndex === 0) {
        state.nowIndex = state.songer.length - 1
      } else {
        state.nowIndex--
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
