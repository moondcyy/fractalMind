import { routerRedux } from 'dva/router';

export default {
  namespace: 'global',

  state: {},

  effects: {
    *goto({ payload }, { put }) {
      yield put(routerRedux.push(payload));
    },

  },

  reducers: {},

  subscriptions: {
    // setup({ history }) {},
  },
};
