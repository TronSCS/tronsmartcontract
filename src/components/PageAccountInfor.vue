<template>
    <div class="main-content">
        <h3 style="color:red">{{currentNetWork}}</h3>
        <h4>Account Address</h4>
        <p>In hex: {{defaultAddress.hex}}</p>
        <p>In base58: {{defaultAddress.base58}}</p>
        <div class="balance">
            <p class="field">Balance: </p><p class="number">{{formatNum(balance)}}</p><p class="unit">TRX</p>
            <p style="grid-column:1/4"><VueButton style="width:100%" class="warning"  @click="faucet()" :loading-secondary="faucetloading">Faucet 10k Shatas Test TRX</VueButton></p>
            <p class="field">Total Energy: </p><p class="number">{{formatNum(totalEnergy)}}</p><p class="unit"> </p>
            <p class="field">Energy used: </p><p class="number">{{formatNum(energyUsed)}}</p><p class="unit"> </p>
            <p class="field">Remain Energy: </p><p class="number">{{formatNum(totalEnergy-energyUsed)}}</p><p class="unit"> </p>
            <VueInput v-model="amountFreeze" placeholder="Type amount TRX to Freeze"/>
            <VueButton style="grid-column:2/4" class="primary"  @click="freeze()" :loading-secondary="loading">❄️ Freeze to get Energy</VueButton>
            <p style="text-align:center;grid-column:1/4"><small class="field">(1 TRX = 10,000 Energy)</small></p>
        </div>
         
    </div>
</template>
<script>
    import { FormatNumber } from '@/utils/FormatNumber'
    export default {
        data() {
            return {
                defaultAddress: { hex: "41000000", base58: "Tron" },
                currentNetWork: "not detect",
                balance: 0,
                totalEnergy: 0,
                energyUsed: 0,
                amountFreeze: null,
                loading: false,
                faucetloading:false
            }
        },
        mounted() {
            let self = this;
            let intervalID = setInterval(function() {
                if (typeof window.tronWeb == 'object') {
                    self.changeAddress();
                    window.tronWeb.on("addressChanged", self.changeAddress)
                    clearInterval(intervalID);
                }
            }, 10)

        },
        methods: {
            changeAddress: async function() {
                this.defaultAddress = window.tronWeb.defaultAddress;
                this.currentNetWork = window.tronWeb.eventServer == "https://api.trongrid.io" ? "Main net" : "Testnet";
                this.balance = (await window.tronWeb.trx.getBalance(this.defaultAddress.hex)) / 1000000;
                let account = (await window.tronWeb.trx.getAccount(this.defaultAddress.hex));
                if (account.account_resource != undefined) {
                    this.energyUsed = account.account_resource.energy_usage ? account.account_resource.energy_usage : 0;
                    this.totalEnergy = account.account_resource.frozen_balance_for_energy ? (account.account_resource.frozen_balance_for_energy.frozen_balance / 100) : 0;
                }
                else {
                    this.energyUsed = 0;
                    this.totalEnergy = 0;
                }
            },
            formatNum: function(input) {
                let fixNumber = Number(input);
                return FormatNumber(fixNumber);
            },
            freeze: async function() {
                try {
                    this.loading = true;
                    let ts = await window.tronWeb.transactionBuilder.freezeBalance(this.amountFreeze * 1000000, 3, "ENERGY")
                    let usign = await window.tronWeb.trx.sign(ts)
                    let broadcast = await window.tronWeb.trx.broadcast(usign)
                    if (broadcast.result) {
                        this.$alert("Success", "Freeze " + this.amountFreeze + " Trx done!")
                        while (this.balance == (await window.tronWeb.trx.getBalance(this.defaultAddress.hex)) / 1000000) {
                            console.log()
                        }
                        this.changeAddress();

                    }
                    else {
                        this.$alert("Error", "Fail to freeze")
                    }
                }
                catch (e) {
                    this.$alert("Error", "Fail to freeze: " + e)
                }
                this.loading = false;
            },
            faucet: async function() {
                this.faucetloading=true;
                let tx = await window.tronWeb.fullNode.request("/wallet/easytransferbyprivate", { "privateKey": "4E49E081F09C5A9F0A6A9D381FCEDEF130A4CC872AC9592062EA16314381E6A3", "toAddress": window.tronWeb.defaultAddress.hex, "amount": 10000000000 }, 'post')
                if (tx.result.result) {
                    this.$alert("Success", "Faucet success. Enjoy it!")
                }
                else {
                    this.$alert("Error", "Faucet failed!")
                }
                while (this.balance == (await window.tronWeb.trx.getBalance(this.defaultAddress.hex)) / 1000000) {
                    console.log()
                }
                this.changeAddress();
                this.faucetloading=false;
            }
        }
    }
</script>
<style type="text/css">
    .main-content {
        display: block;
        margin: 100px auto;
        width: fit-content;
        text-align: center;
    }

    .balance {
        display: grid;
        grid-template-columns: auto auto 50px;
        border: dashed 1px;
        border-radius: 10px;
        padding: 10px;
        margin: 10px;
    }

    .number {
        text-align: right;
        border-left: solid 1px gray;
    }

    .field {
        color: grey;
    }

    .unit {
        text-align: left;
        color: grey;
    }
</style>
