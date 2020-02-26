import React from 'react';
import { connect } from 'dva';
import { Tabs, Spin, Pagination } from 'antd';
import CardList from './CardList';
import UserCenter from '../../userCenter';

class MyPartake extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'myPartake/fetchMyPartake',
    });
  }

  onChangePage = (current) => {
    this.props.dispatch({
      type: 'myPartake/fetchMyPartake',
      payload: { current },
    });
  };

  renderPagination = () => {
    const { total = 0, current = 1, limit = 10 } = this.props.res || {};

    return (
      <Pagination
        hideOnSinglePage
        pageSize={limit}
        current={current}
        total={+total}
        onChange={this.onChangePage}
        style={{ float: 'right' }}
      />
    );
  };

  render() {
    const { loading, res } = this.props;

    return (
      <UserCenter>
        <Spin spinning={loading}>
          <Tabs type="card">
            <Tabs.TabPane tab="课程" key={1}>
              <CardList
                list={res.rows || []}
              />
            </Tabs.TabPane>
          </Tabs>
        </Spin>
        {this.renderPagination()}
      </UserCenter>
    );
  }
}

function mapStateToProps(state) {
  const { res } = state.myPartake;
  return {
    loading: state.loading.models.myPartake,
    res,
  };
}

export default connect(mapStateToProps)(MyPartake);
