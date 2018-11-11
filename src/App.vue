<template>
  <div id="app">
    <vue-typed-js :loop="true" :strings="['Smart Contract', 'Free', 'Fast']" v-show="currentPage=='PageInteractSmartContract'||currentPage=='PageInteractSmartContractUrl'">
        <div id="main-title"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Tron.network_logo.svg"><p><span class="typing"></span></p></div>
    </vue-typed-js>
    <div id="nav">
      <a href="#" class="item" :class="{ isActive: (currentPage=='PageInteractSmartContract')}" target="_blank"><VueIcon icon="visibility" class="small"/>Interact</a>
      <a href="#/compose" class="item" :class="{ isActive: (currentPage=='PageComposeSmartContract')}" target="_blank"><VueIcon icon="code" class="small"/>Compose</a>
      <a href="#/verify" class="item" :class="{ isActive: (currentPage=='PageVerifySmartContract')}" target="_blank"><VueIcon icon="verified_user" class="small"/>Verify</a>
      <a href="#/account" class="item" :class="{ isActive: (currentPage=='PageAccountInfor')}" target="_blank"><VueIcon icon="account_balance_wallet" class="small"/>Account Info</a>
      <a href="#/about" class="item" :class="{ isActive: (currentPage=='PageAuthor')}" target="_blank"><VueIcon icon="help" class="small"/>About me</a>
    </div>
     <div class="content">
      <router-view/>
    </div>
    <div id="footer" v-show="currentPage!='PageComposeSmartContract'">
    Made with <span style="color: #e25555;">&#9829;</span> by <a href="#/author">KhanhND69</a>
    </div>
    <VueModal
        v-if="alertbox.show"
        :title="alertbox.title"
        locked
        class="small"
      >
        <div class="default-body">{{this.alertbox.content}}</div>

        <div slot="footer" class="actions">
          <VueButton class="danger" @click="closeAlert()">Close</VueButton>
        </div>
      </VueModal>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import code from '!raw-loader!./assets/DemoContract.sol'

  export default {
    data() {
      return {
        currentPage: ""
      }
    },
    mounted() {
      this.currentPage = this.$router.currentRoute.name;
      this.$store.state.smartContractCode = code;
    },
    computed: {
      alertbox() {
        return this.$store.state.alertbox
      }
    },
    methods: {
      ...mapMutations(['closeAlert'])
    }
  }
</script>
<style type="text/css">
  #app {
    height: 100%;
  }

  #navigator {
    display: block;
    margin: 0 10px auto;
  }

  #main-title {
    margin: 0 auto;
    text-align: center;
  }

  .shell {
    text-align: center;
  }

  #footer {
    text-align: center;
  }
  #nav {
    border-top-left-radius: 17px;
        border-bottom-left-radius: 17px;
            border-top-right-radius: 17px;
    border-bottom-right-radius: 17px;
    padding: 5px;
    margin: 0px auto;
    background: #ffffff1c;
    width: fit-content;
}
.item {
    margin: 10px;
    color:white;
}
#nav>a>div {
    margin: auto 10px;
    height: 20px;
}
.isActive{
  color:#42ae6b;
}
</style>
