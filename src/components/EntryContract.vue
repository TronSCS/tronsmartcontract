<template>
    <div class="contract-entry">
        <p><small>{{entry.type}}</small> {{entry.name}}</p>
        <template v-if="entry.type!='Event'">
            <VueInput v-for="input in entry.inputs" :key="input.name"  :placeholder="input.name +' - ' + input.type" v-model="submitValues[input.name]"/>
            <template v-if="entry.stateMutability=='Payable'">
                <VueInput placeholder="Trx (sun) to Send" v-model="callValue"/>
                <VueButton :loading-secondary="loading" class="success" icon-left="send" @click="Send">Send</VueButton>
            </template>
            <template v-else-if="entry.stateMutability=='Nonpayable'">
                <VueButton :loading-secondary="loading" class="success" icon-left="send" @click="Send">Send</VueButton>
            </template>
            <template v-else>
                <VueButton :loading-secondary="loading" class="success" icon-left="send" @click="Call">Call</VueButton>
            </template>
        </template>
        <template v-if="entry.type=='Event'">
            <VueButton :loading-secondary="loading" class="success" icon-left="send" @click="ShowEvent(entry.name)">Show Event</VueButton>
        </template>
<div class="contract-result" :class="{event:(entry.type=='Event')}" v-html="result">{{result}}</div>
</div>

</template>
<script>
import {getTronExplorer} from '@/utils/Tron'
    export default {
        name: 'EntryContract',
        props: {
            entry: Object,
            address: String
        },
        data: () => {
            return {
                callValue: "",
                submitValues: {},
                contract: {},
                result: "",
                loading: false,
            }
        },
        computed: {
            submitValueFormat: function() {
                let submitValueFormat = [];
                for (let i in this.submitValues) {
                    submitValueFormat.push(this.submitValues[i]);
                }
                return submitValueFormat;
            }
        },
        mounted: function() {
            this.contract = window.tronWeb.contract([this.entry], this.address);

        },
        methods: {
            Call: async function() {
                this.loading = true;
                try {
                    let retValue = await this.contract[this.entry.name](...this.submitValueFormat).call();
                    this.result = retValue.toNumber == undefined ? JSON.stringify(retValue) : retValue.toString();
                }
                catch (e) {
                    this.$alert("Error", e)
                }
                this.loading = false;
            },
            Send: async function() {
                this.loading = true;
                try {
                    let retValue = await this.contract[this.entry.name](...this.submitValueFormat).send({ callValue: this.callValue });
                    this.result = retValue.toNumber == undefined ? JSON.stringify(retValue) : retValue.toString();
                }
                catch (e) {
                    this.$alert("Error", e)
                }
                this.loading = false;
            },
            ShowEvent: async function(eventName) {
                this.loading = true;
                let result = await window.tronWeb.getEventResult(this.address, 0, eventName);
                result = result.filter((thing, index, self) => self.findIndex(t => t.transaction === thing.transaction && t.timestamp === thing.timestamp) === index)
                this.result = "<div class='event-grid'>";

                result.forEach(i => {
                    let { timestamp, transaction, result } = i;
                    let date = new Date(timestamp)
                    this.result += "<div>⚡" + (date.toLocaleString() + "</div><div><a target='_blank' href='" + getTronExplorer()+ "/transaction/" + transaction + "'>" + transaction.substr(0, 15) + "...</a></div><div>Result: " + JSON.stringify(result) + '</div>');
                })
                this.result += "</div>"
                this.loading = false;
            }
        }
    }
</script>
<style type="text/css">
    .contract-entry {
        padding: 10px 5px;
        border-bottom: 0.5px grey dotted;
    }

    .contract-result {
        padding: 10px;
        background: #6969693b;
        color: gray;
        white-space: pre-wrap;
        overflow-y: scroll;

    }


    .contract-entry small {
        color: grey;
    }

    .contract-entry .vue-ui-button {
        margin: 10px;
    }
    .event-grid{
        font-size:11px;
        display: grid;
        grid-template-columns: 150px 120px auto;
    }
</style>
