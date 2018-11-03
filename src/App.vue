<template>
  <div id="app">
    <vue-typed-js :loop="true" :strings="['Smart Contract', 'Free', 'Fast']" v-show="currentPage=='PageInteractSmartContract'||currentPage=='PageInteractSmartContractUrl'">
        <div id="main-title"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Tron.network_logo.svg"><p><span class="typing"></span></p></div>
    </vue-typed-js>
    <VueGroup id="navigator" v-model="currentPage" class="primary top-indicator inline small-indicator" indicator>
          <VueGroupButton class="round" value="PageInteractSmartContract" icon-left="visibility">Interact</VueGroupButton>
          <VueGroupButton class="round" value="PageComposeSmartContract" icon-left="code">Compose</VueGroupButton>
          <VueGroupButton class="round" value="PageVerifySmartContract" icon-left="verified_user">Verify</VueGroupButton>
          <VueGroupButton class="round" value="PageAccountInfor" icon-left="account_balance_wallet">Account Infor</VueGroupButton>
          <VueGroupButton class="round" value="PageAuthor" icon-left="help">About us</VueGroupButton>

    </VueGroup>
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
    mounted(){
      this.currentPage=this.$router.currentRoute.name;
      console.log(code);
      this.$store.state.smartContractCode=code;
    },
    computed: {
      alertbox() {
        return this.$store.state.alertbox
      }
    },
    watch:{
      currentPage:function(val){
        console.log(val);
        this.$router.push({name:val});
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
</style>
