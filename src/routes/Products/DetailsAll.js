import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs, Spin } from 'antd';
import Banner from './components/Banner';
import Files from './components/Files';
import Logs from './components/Logs';
import Guide from './components/Guide';
import Component from './components/component';
import styles from './DetailsAll.less';
import { getUrlParameter } from '../../utils/utils';
import request from '../../utils/request';

const TabPane = Tabs.TabPane;
@connect()
export default class DetailsAll extends React.Component {
  state = {
    data: {},
    loading: true,
  }
  componentDidMount() {
    this.productId = getUrlParameter('productId');

    request({
      url: `/web/product/detail/${this.productId}`,
    }).then((res) => {
      if (res.success && res.data) {
        this.setState({
          data: res.data || {},
          loading: false,
        });
      }
    });
  }
  handleChange = (key) => {
    if (key === 'description' || key === 'discussion') {
      this.props.dispatch(
        routerRedux.replace(`/products/productDetail#${key}?productId=${this.productId}`)
      );
    }
  }
  render() {
    const type = getUrlParameter('type');
    const { loading, data } = this.state;
    const {
      fileCount = 0,
      componentCount = 0,
      logCount = 0,
      commentQuantity = 0,
      productFileResults = [],
      productComponentResults = [],
      productLogResults = [],
      productInstructionResult = {},
    } = data;
    return (
      <Fragment>
        <Banner info={{ ...data, productId: this.productId }} />
        <div className={styles.container}>
          <Spin spinning={loading} >
            <Tabs defaultActiveKey={type} animated={false} onChange={key => this.handleChange(key)}>
              <TabPane tab="描述" key="description" />
              <TabPane tab="指南" key="guid">
                <Guide content={productInstructionResult.instructionsContent} />
              </TabPane>
              <TabPane tab={`日志(${logCount})`} key="log">
                <Logs showAll logList={productLogResults} />
              </TabPane>
              <TabPane tab={`元件(${componentCount})`} key="component">
                <Component showAll list={productComponentResults} />
              </TabPane>
              <TabPane tab={`文件(${fileCount})`} key="file">
                <Files showAll fileList={productFileResults} />
              </TabPane>
              <TabPane tab={`评论(${commentQuantity})`} key="discussion" />
            </Tabs>
          </Spin>
        </div>
      </Fragment>
    );
  }
}
