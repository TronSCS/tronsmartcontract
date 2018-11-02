<template>
    <div id="compose-smartcontract">
        <ComposeContent v-model="smartContractCode"></ComposeContent>
        <ComposeCompile :source="smartContractCode"></ComposeCompile>
    </div>
</template>
<script>
    import ComposeContent from './ComposeContent.vue'
    import ComposeCompile from './ComposeCompile.vue'

    export default {
        components: { ComposeContent, ComposeCompile },
        computed:{
          smartContractCode:{
            get(){
                return this.$store.state.smartContractCode
            },
            set(val){
                this.$store.commit("setSmartContractCode",val) 
            }
          }
        }
    }
</script>
