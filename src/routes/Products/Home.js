import React, { Component, Fragment } from 'react';
import { Pagination, Tabs, Button, Icon, Spin } from 'antd';
import { stringify } from 'qs';
import request from '../../utils/request';
import { WorksCard } from '../../components/business';
import LoginLink from '../../components/LoginLink';
import styles from './Home.less';

export default class Home extends Component {
  state = {
    data: {},
    params: {},
    loading: false,
  };

  componentDidMount() {
    this.onFetch();
  }

  onChangeTabs = (key) => {
    const params = [{}, { productSpecial: 1 }, { hot: 1 }];

    this.onFetch(params[key]);
  };

  onFetch = (params = {}) => {
    this.setState({ params }, () => {
      request({
        that: this,
        url: `/web/product/page?${stringify(params)}`,
        onSuccess: (res) => {
          this.setState({ data: res });
        },
      });
    });
  };

  onChangePage = (current) => {
    const { params } = this.state;

    this.onFetch({ ...params, current });
  };

  render() {
    const { data, loading } = this.state;
    const { rows = [], total = 0, current = 1, limit = 10 } = data;

    return (
      <Fragment>
        <div className={styles.banner}>
          <img src="http://16045180.s61i.faiusr.com/4/AD0I-KjTBxAEGAAgx9a70wUotLai-AMwgA843gI.png" alt="" />
        </div>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="0" className={styles.tab} onChange={this.onChangeTabs}>
            <Tabs.TabPane tab="最新" key="0" />
            <Tabs.TabPane tab="精品" key="1" />
            <Tabs.TabPane tab="最热" key="2" />
          </Tabs>
        </div>
        <div className={styles.content}>
          <div className={styles.list}>
            <Spin spinning={loading}>
              {rows.map(item => <WorksCard data={item} key={item.productNo} />)}
              <Pagination
                hideOnSinglePage
                style={{ float: 'right' }}
                pageSize={limit}
                current={current}
                total={+total}
                onChange={this.onChangePage}
              />
            </Spin>
          </div>
          <div className={styles.line} />
          <div className={styles.portal}>
            <div className={styles.btn}>
              <LoginLink to="/web/product/view" isInside={false}>
                <Button type="primary">发布作品</Button>
              </LoginLink>
            </div>
            <div className={styles.link_box}>
              <div>
                <LoginLink to="/userCenter/siteMsg"><Icon type="mail" />&emsp;站内消息</LoginLink>
              </div>
              <div className={styles.icon}>
                <LoginLink to="/userCenter/collect"><Icon type="star" style={{ fontSize: '16px' }} />&emsp;我的收藏</LoginLink>
              </div>
              <div>
                <LoginLink to="/userCenter/draft"><Icon type="inbox" style={{ fontSize: '17px' }} />&emsp;我的草稿</LoginLink>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
