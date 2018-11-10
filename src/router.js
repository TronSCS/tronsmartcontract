import Vue from 'vue'
import Router from 'vue-router'
import PageInteractSmartContract from './components/PageInteractSmartContract.vue'
import PageComposeSmartContract from './components/PageComposeSmartContract.vue'
import PageVerifySmartContract from './components/PageVerifySmartContract.vue'
import PageAccountInfor from './components/PageAccountInfor.vue'
import PageAuthor from './components/PageAuthor.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PageInteractSmartContract',
      component: PageInteractSmartContract,    
    },
    {
      path: '/interact/:Address',
      name: 'PageInteractSmartContractUrl',
      component: PageInteractSmartContract,
    },
    {
      path: '/compose/',
      name: 'PageComposeSmartContract',
      component: PageComposeSmartContract,
    },
    {
      path: '/composeit/:source',
      name: 'PageComposeItSmartContract',
      component: PageComposeSmartContract,
    },
    {
      path: '/verify',
      component: PageVerifySmartContract,
      name: 'PageVerifySmartContract'
    },
    {
      path: '/account',
      component: PageAccountInfor,
      name: 'PageAccountInfor'
    },
    {
      path: '/author',
      component: PageAuthor,
      name: 'PageAuthor'
    },
  ],
})