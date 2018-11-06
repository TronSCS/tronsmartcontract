<template>
    <div id="complie-command">
        <small>Solidity verison: </small>
        <VueSelect v-model="currentSolcVer">
          <VueSelectButton v-for="item in solcVersFormat" :key="item.ver" :value="item.src" :label="item.ver"/>
        </VueSelect>
        <VueButton :loading-secondary="loading" class="primary" icon-left="check_circle" @click="complie">Complie</VueButton>
        <small> and select contract </small>
        <VueSelect :disabled="!showDeploy" v-model="currentContractName" style="width: 200px;">
          <VueSelectButton v-for="(item,key) in contracts" :key="key" :value="key" :label="key"/>
        </VueSelect>
        <VueButton :disabled="!showDeploy" :loading-secondary="deploying" class="accent" icon-left="cloud_done" @click="showDeployBox()">Deploy it!</VueButton>
        <VueButton class="icon-button success" :icon-left="showResult?'expand_more':'expand_less'" @click="showResult=!showResult"></VueButton>
        <VueButton class="primary" @click="saveAs()">Save to File</VueButton>
        <div class="compile-result" :style="{color: (success?'green':'red'), display: (showResult?'block':'none')}" v-html="consoleResult">{{consoleResult}}</div>
        <VueModal
        v-if="deployBox.show"
        :title="deployBox.title"
        locked
        class="small"
        >
            <div>
                <p><small>Input contract name</small></p>
                <VueInput v-model="currentContractDeployName" placeholder="Contract name"></VueInput>
            </div>
            <div class="default-body">
                <p><small>Params for constructor</small></p>
                <VueInput v-for="(input,key) in currentContractDeployInputs" :key="key" v-model="currentContractDeployInputValues[key]" :placeholder="input.name +' - ' + input.type" />
            </div>

            <div slot="footer" class="actions">
                <VueButton class="primary" @click="deploy()">Deploy</VueButton>
                <VueButton class="danger" @click="deployBox.show=false">Close</VueButton>
            </div>
      </VueModal>
    </div>
</template>
<script>
    // eslint-disable-next-line 
    import browserSolc from 'browser-solc';
    import { FormatNumber } from '@/utils/FormatNumber'
    import { SaveToFile } from '@/utils/SaveToFile'

    const getCompiler = function(version) {
        return new Promise((resolve, reject) => {
            window.BrowserSolc.loadVersion(version, (compiler) => {
                if (compiler) {
                    resolve(compiler.compile)
                }
                else {
                    reject('it is an error')
                }
            })

        })
    }

    export default {
        data() {
            return {
                solcVers: [],
                currentSolcVer: "",
                compiler: {},
                loading: false,
                success: false,
                consoleResult: "",
                contracts: [],
                currentContractName: "",
                deploying: false,
                deployBox: {
                    show: false,
                    title: "Deploy contract"
                },
                currentContractDeployInputs: [],
                currentContractDeployInputValues: [],
                currentContractDeployName: "",
                showDeploy: false,
                showResult: true
            }
        },
        computed: {
            solcVersFormat: function() {
                let retValue = [];
                for (let key in this.solcVers) {
                    let item = { "ver": key, "src": this.solcVers[key] };
                    retValue.push(item);
                }
                return retValue;
            },
            currentContractDeployParameters: function() {
                let params = [];
                this.currentContractDeployInputs.forEach((item, key) => {
                    let currentInputValue = this.currentContractDeployInputValues[key] ? this.currentContractDeployInputValues[key] : "";
                    params.push(currentInputValue);
                })
                return params;
            }
        },
        props: {
            source: String,
        },
        mounted() {
            let self = this;
            let intervalID = setInterval(function() {
                if (typeof window.BrowserSolc == 'object') {
                    window.BrowserSolc.getVersions(
                        function(soljsonSources, soljsonRelease) {
                            self.solcVers = soljsonRelease;
                            self.currentSolcVer = self.solcVersFormat[0].src;
                        });
                    clearInterval(intervalID);
                }
            }, 10)
            // this.status = "Compile";
            // 
        },
        watch: {
            source: function(val) {
                let sourceVersion = val.match(/\^(.*?);/g)[0].substr(1).slice(0, -1);
                let findVersion = this.solcVersFormat.find(e => e.ver == sourceVersion);
                if (typeof findVersion == 'object')
                    this.currentSolcVer = findVersion.src;
            }
        },
        methods: {
            complie: async function() {
                this.showDeploy = false;
                this.loading = true;
                this.contracts = [];
                this.compiler = await getCompiler(this.currentSolcVer);
                let result = this.compiler(this.source, 1);
                console.log(result);
                this.loading = false;
                if (result.errors) {
                    this.success = false;
                    this.consoleResult = "";
                    result.errors.forEach(i => this.consoleResult += (i.indexOf("Error") > 0 ? "❌ " : "⚠️ ") + i)
                }
                else {
                    this.success = true;
                    this.consoleResult = "";
                    for (let contract in result.contracts) {
                        this.currentContractName = contract;
                        this.consoleResult += "👌" + contract + ":\n " + result.contracts[contract].interface + "\n"
                    }
                    this.contracts = result.contracts;
                    this.showDeploy = true;
                }
            },
            showDeployBox: function() {
                let constructorFunction = JSON.parse(this.contracts[this.currentContractName].interface).find(e => e.type == "constructor");
                if (typeof constructorFunction == 'object')
                    this.currentContractDeployInputs = constructorFunction.inputs;
                else
                    this.currentContractDeployInputs = [];
                this.currentContractDeployName = this.currentContractName.substring(1);
                this.deployBox.show = true;

            },
            deploy: async function() {
                try {
                    if (!window.tronWeb) throw 'You must install Tronlink to interact with contract';
                    if (!(window.tronWeb && window.tronWeb.ready)) throw 'You must login Tronlink to interact with contract';
                    this.deployBox.show = false;
                    this.success=true;
                    this.deploying = true;
                    this.consoleResult = "";
                    this.consoleResult += "Deploy " + this.currentContractDeployName + '\n';
                    let currentContractObject = this.contracts[this.currentContractName];
                    const unsigned = await window.tronWeb.transactionBuilder.createSmartContract({
                        abi: currentContractObject.interface,
                        bytecode: currentContractObject.bytecode,
                        parameters: this.currentContractDeployParameters,
                        name: this.currentContractDeployName
                    });
                    const signed = await window.tronWeb.trx.sign(unsigned);
                    const broadcastResult = await window.tronWeb.trx.sendRawTransaction(signed);
                    if (broadcastResult.result === true) {
                        let transactionInfo = {};
                        do {
                            transactionInfo = await window.tronWeb.trx.getTransactionInfo(signed.txID);
                            if (transactionInfo.id) {
                                if (transactionInfo.receipt.result=="SUCCESS") {
                                    this.success = true;
                                    this.consoleResult += (`SUCCESSFULLY deployed ${this.currentContractDeployName}. Cost: ${(transactionInfo.receipt.energy_fee?transactionInfo.receipt.energy_fee:0) / 1000000} TRX, ${FormatNumber(transactionInfo.receipt.energy_usage)} energy`) + '\n';
                                    let base58Adress = window.tronWeb.address.fromHex(signed.contract_address);
                                    this.consoleResult += (`Contract address: <a target='_blank' href='#/interact/${base58Adress}'>${base58Adress}</a>`) + '\n';
                                }
                                else if(transactionInfo.receipt.result=="OUT_OF_ENERGY"){
                                    this.success = false;
                                    this.consoleResult += (`FAILED deploying ${this.currentContractDeployName}. You lost: ${(transactionInfo.receipt.energy_fee?transactionInfo.receipt.energy_fee:0) / 1000000} TRX`) + '\n';
                                    this.consoleResult += (`Reason: ${window.tronWeb.toUtf8(transactionInfo.resMessage)}`)
                                }
                                else{
                                    this.success = false;
                                    this.consoleResult += (`FAILED deploying ${this.currentContractDeployName}`)
                                    this.consoleResult += (`Transaction Info: ${JSON.parse(transactionInfo)}`)
                                }
                            }
                        } while (!transactionInfo.id);
                    }
                    else {
                        this.success = false;
                        this.consoleResult += (`FAILED to broadcast ${this.currentContractName} deploy transaction`) + '\n';
                        // console.log(broadcastResult);
                        this.consoleResult += (broadcastResult.code) + '\n';
                        this.consoleResult += window.tronWeb.toUtf8(broadcastResult.message) + '\n';
                    }
                    this.deploying = false;
                }
                catch (e) {
                    this.success = false;
                    this.$alert("Warning", JSON.stringify(e));
                    this.consoleResult = "Deploy fail!"
                    this.deploying = false;
                }
            },
            saveAs: function() {
                SaveToFile(this.source, this.currentContractName.substring(1) + window.Date.now() + ".solc")
            }
        }
    }
</script>
<style>
    #complie-command>* {
        margin: 5px;
    }

    .compile-result {
        overflow-y: scroll;
        height: 100px;
        padding: 10px;
        background: #000;
        white-space: pre-wrap;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
        font-size: small;
    }

    #complie-command {
        display: block;
        position: fixed;
        bottom: 0px;
        width: 100%;
        background: rgb(12, 22, 27);
    }
</style>
