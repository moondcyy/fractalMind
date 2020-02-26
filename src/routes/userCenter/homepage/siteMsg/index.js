/*
* 站内消息：参加报名等功能
* */

import React from 'react';
import { Spin, Pagination } from 'antd';
import { stringify } from 'qs';
import request from '../../../../utils/request';
import NoData from '../../../../components/NoData';
import PageMenu from '../PageMenu';
import Item from './Item';

class SiteMsg extends React.PureComponent {
  state = {
    loading: false,
    data: {},
  };

  componentDidMount() {
    this.fetchList();
  }

  onChangePage = (current) => {
    this.fetchList({ current });
  };

  fetchList = (params) => {
    request({
      that: this,
      url: `/web/notice/leaguer?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ data: res || {} });
      },
    });
  };

  render() {
    const { loading, data } = this.state;
    const { rows = [], limit = 0, current = 0, total = 0 } = data;

    return (
      <PageMenu selectedKeys="1">
        <Spin spinning={loading}>
          {rows.length > 0 ? (
            rows.map(item => <Item key={item.noticeId} data={item} callback={() => this.fetchList()} />)
          ) : <NoData />}
          <Pagination
            hideOnSinglePage
            style={{ float: 'right' }}
            pageSize={limit}
            current={current}
            total={+total}
            onChange={this.onChangePage}
          />
        </Spin>
      </PageMenu>
    );
  }
}

export default SiteMsg;
