<template>
    <div class="verify-contract">
        <div id="contract-find">
          <VueInput class="input-address" v-model="address" placeholder="Type address of smartcontract"/>
          <VueButton class="primary" icon-left="search" @click="load()" :loading-secondary="loading">Load contract data</VueButton>
        </div>
        <div class="verify-content">
            <p><small>Constructor When Created</small></p>
            <VueInput v-for="(input,key) in currentContractDeployInputs" :key="key" v-model="currentContractDeployInputValues[key]" :placeholder="input.name +' - ' + input.type" />
         </div>
         <div class="verify-content">
            <p><small>Source code</small></p>
            <monaco-editor
                id="source-field"
                v-model="sourceCode"
                language="sol"
                theme="vs-dark"
                :options="options">
            </monaco-editor>
        </div>
        <div class="verify-content">
            <p><small>Solidity compile info</small></p>
            <VueInput  class="compile-info" v-model="contractName" placeholder="Contract's name deployed"/>
            <VueSelect style="width:400px" class="compile-info" v-model="currentSolcVer" id="sol-ver-select" placeholder="Solidity version">
              <VueSelectButton v-for="(item,key) in solcVers" :key="key" :value="item" :label="item"/>
            </VueSelect>
            <VueSwitch class="compile-info" v-model="opmize">
              <small>Optimization</small>
            </VueSwitch>
            <span class="slot"><small>| Runs(Optimizer):</small></span> 
            <VueInput class="compile-info" v-model="optimizerRuns" placeholder="Runs (Optimizer)" style="min-width:80px"/>
        </div>
        <div class="verify-content">
            <VueInput class="input-info" style="width:50%" v-model="info.logo" placeholder="Url of logo"/>
            <VueInput class="input-info" style="width:50%" v-model="info.dapp" placeholder="Url of DApp"/>
        </div>

        <VueButton id="verified-btn" class="warning" icon-left="verified_user" @click="verify()" :loading-secondary="verifing">Verify!</VueButton>
    </div>
</template>
<script>
    import MonacoEditor from 'vue-monaco'
    import axios from 'axios'
    export default {
        data() {
            return {
                address: "",
                loading: false,
                sourceCode: "hi",
                options: { automaticLayout: true },
                currentContractDeployInputs: [],
                currentContractDeployInputValues: [],
                solcVers: [],
                currentSolcVer: "",
                opmize: true,
                verifing: false,
                contractName: "",
                optimizerRuns: 0,
                info: {
                    logo: "",
                    dapp: ""
                }
            }
        },
        computed: {
            currentContractDeployParameters: function() {
                let params = [];
                if (this.currentContractDeployInputs != undefined && this.currentContractDeployInputs != []) {
                    this.currentContractDeployInputs.forEach((item, key) => {
                        let currentInputValue = this.currentContractDeployInputValues[key] ? this.currentContractDeployInputValues[key] : "";
                        params.push(currentInputValue);
                    })
                }
                return params;
            }
        },

        watch: {
            sourceCode: function(val) {
                let sourceVersion = val.match(/\^(.*?);/g)[0].substr(1).slice(0, -1);
                this.currentSolcVer = this.solcVers.find(e => e.indexOf(sourceVersion + "+") > -1);
            }
        },
        components: { MonacoEditor },
        mounted() {
            this.$loadScript("https://ethereum.github.io/solc-bin/bin/list.js")
                .then(() => {
                    this.solcVers = window.soljsonSources.map(x => x = x.substring(8, x.length - 3));
                })
                .catch(() => {
                    this.solcVers = []
                });
        },
        methods: {
            load: async function() {
                this.loading = true;
                try {
                    let contractInstance = await window.tronWeb.trx.getContract(this.address);
                    let constructorFunction;
                    try { constructorFunction = contractInstance.abi.entrys.find(e => e.type.toLowerCase() == "constructor") }
                    catch (e) { console.log(e) }
                    if (typeof constructorFunction == 'object')
                        this.currentContractDeployInputs = constructorFunction.inputs;
                    else
                        this.currentContractDeployInputs = [];
                }
                catch (e) {
                    this.$alert("Error", e.toString())
                }
                this.loading = false;
            },
            verify: async function() {
                console.log(this.fields)
                let isMainNet = window.tronWeb.eventServer == "https://api.trongrid.io";
                this.verifing = true;
                try {
                    let result = await axios.post('https://tronscsbackend.herokuapp.com/verify', { mainNet: isMainNet, source: this.sourceCode, address: this.address, contractName: this.contractName, parameters: this.currentContractDeployParameters, sol: this.currentSolcVer, opmize: this.opmize, optimizerRuns: this.optimizerRuns, info: this.info });
                    if (result.data.result == "SUCCESS")
                        this.$alert("Success", "Contract verified!")
                    else
                        this.$alert("Failed", "Contract verify failed: " + JSON.stringify(result.data.error))
                }
                catch (e) {
                    this.$alert("Failed", "Contract verify failed: " + JSON.stringify(e))
                }
                this.verifing = false;
            }
        }
    }
</script>
<style type="text/css">
    .verify-contract {
        display: block;
        margin: 10px 100px;
        /*width: fit-content;*/
        text-align: center;
    }

    .vv-msg {
        font-size: 10px;
        color: red;
    }

    #source-field {
        width: 100%;
        margin: 10px auto;
        height: 200px;
        text-align: left;

    }

    .verify-content {
        background: #0003;
        padding: 5px 0px;
        margin: 5px 0px;
        border-radius: 5px;
    }

    .input-address {
        text-align: center;
    }

    .input-info,
    .compile-info {
        padding: 5px;
    }

    #verified-btn {
        width: 100%;
    }
</style>
