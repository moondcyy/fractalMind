// import React from 'react';
// import { Spin } from 'antd';
import { routerRedux } from 'dva/router';
import request from '../../utils/request';
import store from '../../index.js';

export default function BookQuery(props) {

  const { query } = props.match.params;
  request({
    url: `/web/forward/${query}`,
  }).then((res) => {

    if (res.success) {
      const { relationType, relationCode } = res.data;
      if (relationType === 'TRAIN') {
        // 课程
        store.dispatch(routerRedux.push(`/training/course/detail?courseId=${relationCode}`));
      } else if (relationType === 'CONTEST') {
        // 竞赛
        store.dispatch(routerRedux.push(`/competition/detail?courseId=${relationCode}`));
      } else if (relationType === 'PRODUCT') {
        // 作品
        store.dispatch(routerRedux.push(`/products/productDetail?productId=${relationCode}`));
      } else if (relationType === 'QUESTION') {
        // 问卷
        window.location.href = `/web/question/view/${relationCode}`;
      } else if (relationType === 'LEAGUER') {
        // 会员
        store.dispatch(routerRedux.push(`/training/course/detail?courseId=${relationCode}`));
      }
    } else {
      store.dispatch(routerRedux.push('exception/404'));
    }
  });
  return null;
}
