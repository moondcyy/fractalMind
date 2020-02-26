/*
* 跳转中间页,如有此业务,请在这里进行修改
* */

import { stringify } from 'qs';
import React from 'react';
import { routerRedux } from 'dva/router';
import store from '../../index.js';
import { getUrlParams } from '../../utils/utils';

class MiddlePage extends React.PureComponent {
  state = {
    urlParams: getUrlParams(),
    to: {
      reset: '/user/resetPwd',
      auth: '/userCenter/auth',
      preview: '/training/course/detail',
      product: '/products/productDetail',
    },
  };

  componentDidMount() {
    const { urlParams, to } = this.state;
    const url = to[urlParams.type];
    if (urlParams.type === 'product') {
      urlParams.productId = urlParams.productNo;
      delete urlParams.productNo;
    }
    delete urlParams.type; // 删除 type 属性
    const params = stringify(urlParams);

    setTimeout(() => {
      if (url) {
        store.dispatch(routerRedux.push(`${url}?${params}`));
      }
    });
  }

  render() {
    return null;
  }
}

export default MiddlePage;
