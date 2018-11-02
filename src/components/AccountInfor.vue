<template>
    <div class="main-content">
        <h3>{{currentNetWork}}</h3>
        <h4>Account Address</h4>
        <p>In hex: {{defaultAddress.hex}}</p>
        <p>In base58: {{defaultAddress.base58}}</p>
        <p>Balance: {{formatNum(balance)}} TRX</p>
        <p>Total Energy: {{formatNum(totalEnergy)}} </p>
        <p>Energy used: {{formatNum(energyUsed)}} </p>
        <p>Remain Energy: {{formatNum(totalEnergy-energyUsed)}} </p>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                defaultAddress: { hex: "41000000", base58: "Tron" },
                currentNetWork:"not detect",
                balance:0,
                totalEnergy:0,
                energyUsed:0,
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
            changeAddress: async function(){
                this.defaultAddress = window.tronWeb.defaultAddress;
                this.currentNetWork=window.tronWeb.eventServer == "https://api.trongrid.io"?"Main net": "Testnet";
                this.balance=(await window.tronWeb.trx.getBalance(this.defaultAddress.hex))/1000000;
                let account=(await window.tronWeb.trx.getAccount(tronWeb.defaultAddress.hex));
                this.energyUsed= account.account_resource.energy_usage
                this.totalEnergy=account.account_resource.frozen_balance_for_energy.frozen_balance
            },
            formatNum:function(input){
                return input.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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
</style>
