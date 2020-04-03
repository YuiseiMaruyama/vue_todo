import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    todos: [],
    todoFilter: '',
    targetTodo: {
      id: null,
      title: '',
      detail: '',
      completed: '',
    },
    errorMessage: '',
    emptyMessage: '',
  },
  getters: {
    completedTodos: (state) => state.todos.filter((todo) => todo.completed),
    incompleteTodos: (state) => state.todos.filter((todo) => !todo.completed),
    completedTodosLength: (state, getters) => getters.completedTodos.length,
    incompleteTodosLength: (state, getters) => getters.incompleteTodos.length,
  },
  mutations: {
    setTodoFilter(state, routeName) {
      state.todoFilter = routeName;
    },
    setEmptyMessage(state, routeName) {
      if (routeName === 'completedTodos') {
        const emptyMessage = '完了済みのやることリストはありません。';
        state.emptyMessage = emptyMessage;
      } else if (routeName === 'incompleteTodos') {
        const emptyMessage = '未完了のやることリストはありません。';
        state.emptyMessage = emptyMessage;
      } else {
        const emptyMessage = 'やることリストには何も登録されていません。';
        state.emptyMessage = emptyMessage;
      }
    },
    initTargetTodo(state) {
      state.targetTodo = {
        id: null,
        title: '',
        detail: '',
        completed: false,
      };
    },
    hideError(state) {
      state.errorMessage = '';
    },
    showError(state, payload) {
      if (payload) {
        const errorMessage = payload.data;
        state.errorMessage = errorMessage;
      } else {
        state.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
      }
    },
    updateTargetTodo(state, { name, value }) {
      state.targetTodo[name] = value;
    },
    getTodos(state, payload) {
      state.todos = payload.reverse();
    },
    addTodo(state, payload) {
      state.todos.unshift(payload);
    },
    showEditor(state, payload) {
      state.targetTodo = Object.assign({}, payload);
    },
    editTodo(state, payload) {
      state.todos = state.todos.map((todoItem) => {
        if (todoItem.id === payload.id) return payload;
        return todoItem;
      });
    },
    // deleteTodo(state, todos) {
    //   state.todos = todos; // ここでstateのtodosにaxiosから返ってきたtodosを置き換える
    // },
  },
  // 同期的なmutationsと違い、非同期処理(今回ならaxiosを利用したHTTP通信)を含むことができる
  actions: {
    setTodoFilter({ commit }, routeName) {
      commit('setTodoFilter', routeName);
    },
    setEmptyMessage({ commit }, routeName) {
      commit('setEmptyMessage', routeName);
    },
    updateTargetTodo({ commit }, { name, value }) {
      commit('updateTargetTodo', { name, value });
    },
    getTodos({ commit }) {
      axios.get('http://localhost:3000/api/todos/').then(({ data }) => {
        commit('getTodos', data.todos);
      }).catch((err) => {
        commit('showError', err.response);
      });
    },
    addTodo({ commit, state }) {
      if (!state.targetTodo.title || !state.targetTodo.detail) {
        commit({
          type: 'showError',
          data: 'タイトルと内容はどちらも必須項目です。',
        });
        return;
      }
      commit('hideError'); // 上記エラーを隠す
      const postTodo = Object.assign({}, {
        title: state.targetTodo.title,
        detail: state.targetTodo.detail,
      });
      axios.post('http://localhost:3000/api/todos/', postTodo).then(({ data }) => {
        commit('addTodo', data);
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    changeCompleted({ commit }, { todo }) {
      const targetTodo = Object.assign({}, todo);
      axios.patch(`http://localhost:3000/api/todos/${targetTodo.id}`, {
        completed: !targetTodo.completed,
      }).then(({ data }) => {
        commit('editTodo', data);
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    showEditor({ commit }, { todo }) {
      commit('showEditor', todo);
    },
    editTodo({ commit, state }) {
      const targetTodo = state.todos.find(todo => todo.id === state.targetTodo.id);
      if (
        targetTodo.title === state.targetTodo.title
        && targetTodo.detail === state.targetTodo.detail
      ) {
        commit('initTargetTodo');
        return;
      }
      axios.patch(`http://localhost:3000/api/todos/${state.targetTodo.id}`, {
        title: state.targetTodo.title,
        detail: state.targetTodo.detail,
      }).then(({ data }) => {
        commit('editTodo', data);
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    deleteTodo({ commit }, { todo }) {
      // Promiseを使用する理由はactionsの非同期関数(処理の完了を待たず、処理が完了した時点でコールバック関数が呼び出される)は処理の順序を制御できないという問題がある
      // 今回の課題ではdeleteTodoでtodosのリストから指定されたtodoのidが削除されてからgetTodoが実行される流れだが、
      // Promiseを使わないとdeleteTodoの処理が終わる前にgetTodoの処理を行うためエラーになる
      return new Promise((resolve) => {
        axios.delete(`http://localhost:3000/api/todos/${todo.id}`).then(({ data }) => {
          // 処理
          // axiosから返ってきた配列を逆にしてstateのtodo配列に入れる処理はgetTodo()と同じ処理である
          // commit('getTodo',todos);
          commit('hideError'); // API用のサーバーを止めて「削除」ボタンをクリックしたときからAPI用のサーバーを立ち上げた時にエラーを消すため 
          // commit('getTodo',data.todos);
          resolve();
        });
      }).catch((err) => {
        // 処理
        commit('showError', err.response);
      });
      // 必要があれば処理
    },
  },
});

export default store;
