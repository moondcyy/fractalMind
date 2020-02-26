/*
* 全部作品
* */

import React from 'react';
import { stringify } from 'qs';
import request from '../../utils/request';
import { WorksCardList } from '../../components/business';

class AllWorks extends React.PureComponent {
  state = {
    data: {},
  };

  componentDidMount() {
    this.fetchList();
  }

  fetchList = (params) => {
    const { leaguerNo } = this.props;

    request({
      url: `/web/author/products?${stringify({ leaguerNo, ...params })}`,
      onSuccess: (res) => {
        this.setState({ data: res || {} });
      },
    });
  };

  render() {
    const { data } = this.state;

    return (
      <WorksCardList
        data={data}
        onChangePage={current => this.fetchList({ current })}
      />
    );
  }
}

export default AllWorks;
