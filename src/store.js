import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alertbox: {
      show: false,
      content: "Default",
      title: ""
    },
    smartContractCode: "Write solidity here ...",
    resultCompile: {
      success: true,
      consoleResult: ""
    },
    contracts: [],
    showDeploy:false
  },
  mutations: {
    showAlert(state, payload) {
      state.alertbox.show = true;
      state.alertbox.content = payload.content;
      state.alertbox.title = payload.title;
    },
    closeAlert(state) {
      state.alertbox.show = false;
    },
    setSmartContractCode(state, code) {
      state.smartContractCode = code;
    },
    setResultSuccess(state, result) {
      state.resultCompile.success = result
    },
    setResultContent(state, result) {
      state.resultCompile.consoleResult = result
    },
    setContracts(state, contracts) {
      state.contracts = contracts
    },
    setShowDeploy(state, showDeploy) {
      state.showDeploy = showDeploy
    },

  },
  actions: {

  }
})
