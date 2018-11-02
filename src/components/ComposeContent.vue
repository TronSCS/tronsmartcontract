<template>
    <monaco-editor
    class="editor"
    v-model="sourceCode"
    language="sol"
    theme="vs-dark"
    :options="options"
    @change="updateCode">
  </monaco-editor>
</template>
<script>
    import MonacoEditor from 'vue-monaco'
    export default {
        data() {
            return {
                sourceCode:this.value,
                options:{automaticLayout: true}
            }
        },
        components: { MonacoEditor },
        props: {
            value: String,
        },
        methods: {
           updateCode:function(val,e){
               this.$emit('input', val)
           }
        }
    }
</script>
<style>
.editor {
  width: 99%;
  margin: 10px auto;
  height: 800px;
}
</style>