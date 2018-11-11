<template>
    <div id="compose-smartcontract">
        <ComposeContent v-model="smartContractCode"></ComposeContent>
        <ComposeCompile :source="smartContractCode"></ComposeCompile>
    </div>
</template>
<script>
    import ComposeContent from './ComposeContent.vue'
    import ComposeCompile from './ComposeCompile.vue'
    import axios from 'axios'
    
    export default {
        components: { ComposeContent, ComposeCompile },
        computed: {
            smartContractCode: {
                get() {
                    return this.$store.state.smartContractCode
                },
                set(val) {
                    this.$store.commit("setSmartContractCode", val)
                }
            }
        },
        async mounted() {
            console.log(this.$route.params.Source);
            if (this.$route.params.Source) {
                console.log(this.$route.params.Source);
                let val= (await axios.get(`https://raw.githubusercontent.com/TronSCS/tronsmartcontractspace.sharecode/master/${this.$route.params.Source}.sol`)).data;
                this.$store.commit("setSmartContractCode", val);
            }
        },
    }
</script>
