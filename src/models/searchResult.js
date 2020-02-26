
export default {
  namespace: 'searchResult',
  state: {
    keyword: '',
  },
  reducers: {
    saveKey(state, { payload: keyword }) {
      return {
        ...state,
        keyword,
      }
    },
  },
  effects: {

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({pathname, search}) => {
        if (pathname === '/searchResult') {
          const keyword = search.split('=')[1];
          dispatch({
            type: 'saveKey',
            payload: keyword
          })
        }
      });
    },
  },
}
