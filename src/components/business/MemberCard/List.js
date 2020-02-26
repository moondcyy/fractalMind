/*
* 会员卡列表
* API：{
*   data: {}, // 总数据源，包含 rows，limit 等字段
*   callback(res){}, // 操作关注的回调函数
*   onChangePage(current) {}, // 操作翻页的回调函数
* }
* */

import React from 'react';
import { Pagination } from 'antd';
import NoData from '../../NoData';
import MemberCard from './index';

class MemberCardList extends React.PureComponent {
  render() {
    const { data = {}, callback = () => {}, onChangePage = () => {} } = this.props;
    const { total = 0, current = 1, limit = 10, rows = [] } = data;

    return (
      <React.Fragment>
        {rows.length > 0 ? (
          rows.map(item => <MemberCard key={item.leaguerNo} data={item} callback={callback} />)
        ) : <NoData />}
        <Pagination
          hideOnSinglePage
          pageSize={+limit}
          current={+current}
          total={+total}
          onChange={onChangePage}
          style={{ float: 'right' }}
        />
      </React.Fragment>
    );
  }
}

export default MemberCardList;
