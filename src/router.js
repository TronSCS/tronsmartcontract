import Vue from 'vue'
import Router from 'vue-router'
import InteractSmartContract from './components/InteractSmartContract.vue'
import ComposeSmartContract from './components/ComposeSmartContract.vue'
import VerifySmartContract from './components/VerifySmartContract.vue'
import Author from './components/Author.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'InteractSmartContract',
      component: InteractSmartContract,    
    },
    {
      path: '/interact/:Address',
      name: 'InteractSmartContractUrl',
      component: InteractSmartContract,
    },
    {
      path: '/compose',
      name: 'ComposeSmartContract',
      component: ComposeSmartContract,
    },
    {
      path: '/verify',
      component: VerifySmartContract,
      name: 'VerifySmartContract'
    },
    {
      path: '/author',
      component: Author,
      name: 'Author'
    },
  ],
})