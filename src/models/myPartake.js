import { fetchMyPartake } from '../services/userCenter';

export default {
  namespace: 'myPartake',

  state: {
    res: {},
  },

  effects: {
    *fetchMyPartake({ payload }, { call, put }) {
      const res = yield call(fetchMyPartake, payload);

      if (res.success) {
        yield put({
          type: 'setRes',
          payload: { res },
        });
      }
    },
  },

  reducers: {
    setRes(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
