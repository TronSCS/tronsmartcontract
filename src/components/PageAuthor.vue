<template>
    <div class="main-content">
        <p>Author</p>
        <p>KhanhND</p>
        <h4>Join our Discord</h4>
        <a href="https://discord.gg/A7UEhQE">https://discord.gg/A7UEhQE</a>
        <h4>Buy me a coffe ☕</h4>
        <VueButton @click="buyMeCoffe()">TTX5N2wxLeyWBSNE6UeaBjCFZbpa2FH6jr</VueButton>
        
    </div>
</template>
<script>
    export default {
        methods: {
            buyMeCoffe: async function() {
                if (window.tronWeb.eventServer == "https://api.trongrid.io") {
                    try {
                        let result = await window.tronWeb.trx.sendTrx("TTX5N2wxLeyWBSNE6UeaBjCFZbpa2FH6jr", 100000000);
                        if (result) {
                            this.$alert("Love", "Thank your cup, very sweet")
                        }
                        else {
                            this.$alert("Oops", "Have trouble with shipper TRX :(")
                        }
                    }
                    catch (e) {
                        this.$alert("Oops", "Have trouble with your wallet TRX :(. " + e)
                    }
                }
                else {
                    this.$alert("Oops", "You can't buy coffe using test TRX ;)")
                }
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
