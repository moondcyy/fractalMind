import React from 'react';
import { stringify } from 'qs';
import { Spin } from 'antd';
import request from '../../../utils/request';
import { MemberCardList } from '../../../components/business';

class Follow extends React.PureComponent {
  state = {
    loading: false,
    data: {},
  };

  componentDidMount() {
    this.onFetch();
  }

  onChangePage = (current) => {
    this.onFetch({ current });
  };

  onFetch = (params) => {
    const { fetchUrl = '/web/leaguer/follow' } = this.props;

    request({
      that: this,
      url: `${fetchUrl}?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ data: res });
      },
    });
  };

  render() {
    const { loading, data } = this.state;

    return (
      <Spin spinning={loading}>
        <MemberCardList
          data={data}
          callback={() => this.onFetch()}
          onChangePage={current => this.onFetch({ current })}
        />
      </Spin>
    );
  }
}

export default Follow;
