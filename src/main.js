import Vue from 'nativescript-vue';

import HelloWorld from './components/HelloWorld';


import './styles.scss';

// Uncomment the following to see NativeScript-Vue output logs
Vue.config.silent = false;

import './RadListView'


new Vue({
  components: {
    HelloWorld
  },
  template: `
    <Frame>
      <HelloWorld />
    </Frame>
  `
}).$start({
  getRootView(vm) {
    return vm.$el.nativeView
  }
});
