<template>
  <div class="main">
    <div id="contract-find">
      <VueInput v-model="address" placeholder="Type address of smartcontract"/>
      <VueButton class="primary" icon-left="search" @click="load()" :loading-secondary="loading">Show contract</VueButton>
    </div>
    <InteractSmartContract :abi="abi" :address="address"></InteractSmartContract>
  </div>
</template>

<script>
  import InteractSmartContract from './InteractSmartContract.vue'
  export default {
    name: 'PageInteractSmartContract',
    data: () => {
      return {
        address: "",
        abi: {},
        loading:false
      }
    },
    watch: {
      address: function(val) {
        this.$router.replace({ name: 'PageInteractSmartContractUrl', params: { Address: val } })
      }
    },
    components: { InteractSmartContract },
    mounted() {
      if (this.$route.params.Address) {
        this.address = this.$route.params.Address;
        
      }
    },
    methods: {
      load: async function() {
        this.loading=true;
        try {
          this.abi = {};
          if (!window.tronWeb) throw 'You must install Tronlink to interact with contract';
          if (!(window.tronWeb && window.tronWeb.ready)) throw 'You must login Tronlink to interact with contract';
          let smartcontract = await window.tronWeb.trx.getContract(this.address);
          this.abi = smartcontract.abi;
        }
        catch (e) {
          this.$alert("Warning", JSON.stringify(e))
        }
        this.loading=false;
      }
    }
  }
</script>
<style type="text/css">
  .main {
    display: block;
    margin: 0 auto;
    width: 90%;
  }

  #contract-find>* {
    display: block;
    margin: 10px auto;
    max-width: 310px;
  }

</style>
