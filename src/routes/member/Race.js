/*
* 参与竞赛
* */

import React from 'react';
import { stringify } from 'qs';
import { Pagination } from 'antd';
import request from '../../utils/request';
import NoData from '../../components/NoData';
import CourseItem from '../training/components/CourseItem';

class Race extends React.PureComponent {
  state = {};

  componentDidMount() {
    this.fetchList();
  }

  fetchList = (params) => {
    const { leaguerNo } = this.props;

    request({
      url: `/web/author/contests?${stringify({ leaguerNo, ...params })}`,
      onSuccess: (res) => {
        this.setState({ data: res || {} });
      },
    });
  };

  render() {
    const { data = {} } = this.state;
    const { rows = [], limit = 0, current = 0, total = 0 } = data;

    return (
      <React.Fragment>
        {rows.length > 0 ? (
          rows.map(item => <CourseItem info={item} />)
        ) : <NoData /> }
        <Pagination
          hideOnSinglePage
          style={{ float: 'right' }}
          pageSize={limit}
          current={current}
          total={+total}
          onChange={page => this.fetchList({ current: page })}
        />
      </React.Fragment>
    );
  }
}

export default Race;
