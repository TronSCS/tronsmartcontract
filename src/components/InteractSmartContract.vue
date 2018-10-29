<template>
  <div class="main">
    <div id="contract-find">
      <VueInput v-model="address" placeholder="Type address of smartcontract"/>
      <VueButton class="primary" icon-left="search" @click="load()" :loading-secondary="loading">Show contract</VueButton>
    </div>
    <div id="contract-content">
      <p>Run function with trx</p>
      <div v-for="entry in this.abi.entrys" v-if="entry.type=='Function' && entry.stateMutability=='Payable'">
         <EntryContract :entry="entry" :address="address"/>
      </div>
    </div>
    <div id="contract-content">
      <p>Run function will consume Trx or Energy</p>
      <div v-for="entry in this.abi.entrys" v-if="entry.type=='Function' && entry.stateMutability=='Nonpayable'">
         <EntryContract :entry="entry" :address="address"/>
      </div>
    </div>
    <div id="contract-content">
      <p>Run function no consume anything</p>
      <div v-for="entry in this.abi.entrys" v-if="entry.type=='Function' && (entry.stateMutability=='View' || entry.stateMutability=='Pure')">
         <EntryContract :entry="entry" :address="address"/>
      </div>
    </div>
    <div id="contract-content">
      <p>Events</p>
      <div v-for="entry in this.abi.entrys" v-if="entry.type=='Event'">
         <EntryContract :entry="entry" :address="address"/>
      </div>
    </div>
  </div>
</template>

<script>
  import EntryContract from './EntryContract.vue'
  export default {
    name: 'InteractSmartContract',
    data: () => {
      return {
        address: "",
        abi: {},
        loading:false
      }
    },
    watch: {
      address: function(val) {
        this.$router.replace({ name: 'InteractSmartContractUrl', params: { Address: val } })
      }
    },
    components: { EntryContract },
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

  #contract-content {
    background: #0003;
    padding: 20px;
    margin: 20px 0px;
    border-radius: 5px;
  }
</style>
