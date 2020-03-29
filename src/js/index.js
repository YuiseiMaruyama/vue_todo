import Vue from 'vue';
// vue-router とは、ブラウザの再読み込みせずにルーティング（URLの切り替え）を行うパッケージ
import VueRouter from 'vue-router';

import routes from 'TodoRouterDir/routes'; // todoRouterフォルダの「routes.js」でルーティングの定義がされている配列を呼び出す
// import routes from 'TodoVuexDir/routes';
// import store from 'TodoVuexDir/store';
// import routes from 'VuexSample/routes';
// import store from 'VuexSample/store';

import '../scss/global.scss';

// import myApp from './first';
// import myApp from 'TodoDir';
import myApp from 'TodoRouterDir';
// import myApp from 'TodoVuexDir';
// import myApp from 'VuexSample';

// ルーティング用のインスタンスを作成
// インスタンスの生成時に渡してる引数はオブジェクトでインポートしてきたルートの設定が書かれている配列とモード
Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: 'history',
});

new Vue({
  el: '#app',
  router,
  // store,
  render: h => h(myApp),
  // render: h => h(myApp), は↓の書き方を短くしたもの
  // render: function (createElement) {
  //   return createElement(myApp)
  // }
});
