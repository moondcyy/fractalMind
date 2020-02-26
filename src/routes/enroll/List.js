/*
* 是否交费的会员列表
* API: {
*   fetchUrl: 接口
*   params: 入参
* }
* */

import React from 'react';
import { MemberCardList } from '../../components/business';

class Already extends React.PureComponent {
  render() {
    const { data, fetch } = this.props;

    return (
      <MemberCardList
        data={data}
        callback={() => fetch()}
        onChangePage={current => fetch({ current })}
      />
    );
  }
}

export default Already;
