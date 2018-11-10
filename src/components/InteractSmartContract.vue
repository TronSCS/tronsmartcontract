<template>
  <div class="interact-smartcontract">
    <div class="contract-overview">
      <p><small>Contract name </small>{{contractName}}</p>
      <p><small>Creator </small><a target='_blank' :href='tronExplorerLink'>{{creator}}</a></p>
    </div>
    <div class="contract-content">
      <p>Run function with trx</p>
      <div v-for="entry in this.abi.entrys" v-if="entry.type=='Function' && entry.stateMutability=='Payable'" :key="entry.name">
         <EntryContract :entry="entry" :address="address"/>
      </div>
    </div>
    <div class="contract-content">
      <p>Run function will consume Trx or Energy</p>
      <div v-for="entry in this.abi.entrys" :key="entry.name" v-if="entry.type=='Function' && entry.stateMutability=='Nonpayable'">
         <EntryContract :entry="entry" :address="address"/>
      </div>
    </div>
    <div class="contract-content">
      <p>Run function no consume anything</p>
      <div v-for="entry in this.abi.entrys" :key="entry.name" v-if="entry.type=='Function' && (entry.stateMutability=='View' || entry.stateMutability=='Pure')">
         <EntryContract :entry="entry" :address="address"/>
      </div>
    </div>
    <div class="contract-content">
      <p>Events</p>
      <div v-for="entry in this.abi.entrys" :key="entry.name" v-if="entry.type=='Event'">
         <EntryContract :entry="entry" :address="address"/>
      </div>
    </div>
  </div>
</template>

<script>
  import EntryContract from './EntryContract.vue'
  import { getTronExplorer } from '@/utils/Tron'
  export default {
    name: 'InteractSmartContract',
    props: {
      contract: Object,
    },
    computed: {
      abi: function() { return this.contract.abi },
      address: function() { return this.contract.contract_address },
      contractName: function() { return this.contract.name },
      creator: function() { return window.tronWeb.address.fromHex(this.contract.origin_address) },
      tronExplorerLink: function() {
        return getTronExplorer() + "/address/" + this.creator
      },
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

  .contract-overview {
    background: #1005;
    padding: 20px;
    margin: 20px 0px;
    border-radius: 5px;
  }

  .contract-overview small {
    color: grey;
  }

  .contract-content {
    background: #0003;
    padding: 20px;
    margin: 20px 0px;
    border-radius: 5px;
  }
</style>
