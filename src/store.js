import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alertbox: {
      show: false,
      content: "Default",
      title: ""
    }
  },
  mutations: {
    showAlert (state, payload) {
      state.alertbox.show=true;
      state.alertbox.content=payload.content;
      state.alertbox.title=payload.title;
    },
    closeAlert(state){
      state.alertbox.show=false;
    }
  },
  actions: {

  }
})