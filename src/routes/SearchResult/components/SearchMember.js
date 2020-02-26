import React from 'react';
import { stringify } from 'qs';
import { Spin, Pagination } from 'antd';
import { connect } from 'dva';
import { MemberCard } from '../../../components/business';
import NoData from 'components/NoData';
import request from '../../../utils/request';
import { getUrlParameter } from '../../../utils/utils';

@connect(({searchResult}) => ({
  keyword: searchResult.keyword,
}))
export default class SearchMember extends React.PureComponent {
  state = {
    loading: false,
    data: {},
  };

  componentDidMount() {
    this.onFetch();
  }
  componentWillReceiveProps(nextProps) {
    // 监听路由 keyword 变化 重新查询
    if(this.props.keyword !== nextProps.keyword) {
      this.onFetch();
    }
  }
  onChangePage = (current) => {
    this.onFetch(current);
  };

  onFetch = (current=1) => {
    const keyword = getUrlParameter('keyword') || '';
    const params = {
      current,
      limit: 8,
      condition: decodeURI(keyword),
    };
    request({
      url: `/web/leaguer/search?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ data: res });
      },
    });
  };

  memberCb = () => {
    this.onFetch();
  };

  render() {
    const { loading, data } = this.state;
    const { total = 0, current = 1, limit = 10, rows = [] } = data;

    return (
      <>
        <Spin spinning={loading}>
        {rows.length > 0 ? (
          rows.map(item => <MemberCard key={item.leaguerNo} data={item} callback={this.memberCb} />)
        ) : <NoData />}
        </Spin>
        { total > 8 && (
          <Pagination
            style={{ float: 'right' }}
            pageSize={limit}
            current={current}
            total={total}
            onChange={this.onChangePage}
          />
        )}
      </>
    );
  }
}

