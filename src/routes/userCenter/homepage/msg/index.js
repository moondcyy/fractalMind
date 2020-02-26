/*
* 私信
* */

import React from 'react';
import { Spin, Pagination } from 'antd';
import { stringify } from 'qs';
import request from '../../../../utils/request';
import PageMenu from '../PageMenu';
import ItemMsg from './ItemMsg';

class Msg extends React.PureComponent {
  state = {
    data: {},
    loading: false,
  };

  componentDidMount() {
    this.fetchList();
  }

  fetchList = (params) => {
    request({
      that: this,
      url: `/web/notice/leaguer?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ data: res });
      },
    });
  };

  handlePagination = (current) => {
    this.fetchList({ current });
  };

  render() {
    const { loading, data } = this.state;
    const { rows = [], total = 0, current = 1, limit = 10 } = data;

    return (
      <PageMenu selectedKeys="2">
        <Spin spinning={loading}>
          {(rows && rows.length > 0) ? (
            rows.map(item => <ItemMsg key={item.sender} item={item} />)
          ) : <div className="noData">暂无数据</div>}
          <Pagination
            hideOnSinglePage
            style={{ float: 'right' }}
            pageSize={limit}
            current={current}
            total={+total}
            onChange={this.handlePagination}
          />
        </Spin>
      </PageMenu>
    );
  }
}

export default Msg;
