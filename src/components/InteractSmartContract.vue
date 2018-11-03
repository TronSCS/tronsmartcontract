<template>
  <div class="interact-smartcontract">
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
    props:{
        abi: Object,
        address:String
    },
    components: { EntryContract }
  }
</script>
<style type="text/css">
  .interact-smartcontract {
    display: block;
    margin: 0 auto;
    width: 90%;
  }


  #contract-content {
    background: #0003;
    padding: 20px;
    margin: 20px 0px;
    border-radius: 5px;
  }
</style>
