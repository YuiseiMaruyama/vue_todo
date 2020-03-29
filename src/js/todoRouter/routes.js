import Todos from 'TodoRouterDir/containers/Todos';

const routes = [
  // パスが/のときにインポートしたページ（Todos）を表示
  {
    name: 'allTodos',
    path: '/',
    component: Todos,
  },
  // パスが/completedのときにTodosを表示
  {
    name: 'completedTodos',
    path: '/completed',
    component: Todos,
  },
  // パスが/incompleteのときにTodosを表示
  {
    name: 'incompleteTodos',
    path: '/incomplete',
    component: Todos,
  },
];

export default routes;
