import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { WorksCardList } from '../../../components/business';
import { getUrlParameter } from '../../../utils/utils';
import request from '../../../utils/request';

@connect(({searchResult}) => ({
  keyword: searchResult.keyword,
}))
export default class SearchProducts extends PureComponent {
  state = {
    resultData: {},
    loading: false,
  }
  componentDidMount() {
    this.queryProduct();
  }
  componentWillReceiveProps(nextProps) {
    // 监听路由 keyword 变化 重新查询
    if(this.props.keyword !== nextProps.keyword) {
      this.queryProduct();
    }
  }
  onChangePage = (current) => {
    this.queryProduct(current);
  }
  queryProduct(current=1) {
    const keyword = getUrlParameter('keyword') || '';
    const params = {
      current,
      limit: 10,
      condition: decodeURI(keyword),
    };
    this.setState({
      loading: true,
    });
    request({
      url: `/web/product/page?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ resultData: res, loading: false });
      },
    });
  }
  render() {
    const { resultData, loading } = this.state;

    return (
      <WorksCardList
        loading={loading}
        data={resultData}
        onChangePage={this.onChangePage}
      />
    );
  }
}
