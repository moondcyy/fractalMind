import { routerRedux } from 'dva/router';
import { fetchLogin, fetchCurrentUser, fetchLogout } from '../services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {}, // 当前用户数据信息
  },
  effects: {
    *login({ payload }, { call, put }) {
      const res = yield call(fetchLogin, payload);

      if (res && res.success) {
        /* eslint-disable */
        const urlParams = new URL(window.location.href);
        let redirect = urlParams.searchParams.get('goto');
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/products/home'));
      }
    },

    *fetchCurrentUser({ payload, callback }, { call, put }) {
      const res = yield call(fetchCurrentUser, payload);

      if (res && res.success) {
        yield put({
          type: 'setCurrentUser',
          payload: {
            currentUser: res.data,
          },
        });
        window.currentUser = res.data;
        callback && callback(res.data);
      } else {
        yield put({
          type: 'setCurrentUser',
          payload: {
            currentUser: {},
          },
        });
        window.currentUser = {};
        callback && callback(false);
      }
    },

    *logout(_, { call, put }) {
      yield put({
        type: 'setCurrentUser',
        payload: {
          currentUser: {},
        },
      });
      window.currentUser = {};
      yield put(routerRedux.push('/training/course'));
      yield call(fetchLogout);
    },
  },

  reducers: {
    setCurrentUser(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

