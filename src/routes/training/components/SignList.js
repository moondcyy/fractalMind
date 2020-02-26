import React, { Component, Fragment } from 'react';
import fetch from 'dva/fetch';
import { Pagination, Row, Col, Spin, message } from 'antd';
import styles from './SignList.less';
import { getUrlParameter } from '../../../utils/utils';

export default class SignList extends Component {
  state = {
    loading: true,
    resultData: {},
  }
  componentDidMount() {
    this.querySignData({ current: 1 });
  }
  querySignData({ current = 1, limit = 10 }) {
    const courseId = getUrlParameter('courseId');
    this.setState({ loading: true });
    fetch(`/web/enroll/page/${courseId}?current=${current}&limit=${limit}`, {
      credentials: 'include',
    })
      .then((response) => {
        try {
          return response.json();
        } catch (e) {
          console.log(e);
        }
      }).then((res) => {
        if (res.success) {
          this.setState({
            resultData: res,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
          message.error(res.message || '系统异常，请稍后再试');
        }
      }).catch((ex) => {
        message.error(ex || '系统错误，请稍后重试');
      });
  }
  handlePagination = (current) => {
    this.querySignData({ current });
  }
  render() {
    const { current = 1, rows = [], enroll = '', total = 0 } = this.state.resultData;
    const totalSize = parseInt(total, 10);
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 5,
      style: { marginBottom: 24 },
    };
    return (
      <Fragment>
        <Spin spinning={this.state.loading}>
          {enroll ? (
            <Row gutter={24}>
              {
                rows.length > 0 ? rows.map((item, index) => (
                  <Col {...topColResponsiveProps} key={index} >
                    <div className={styles.item}>
                      {/* eslint-disable-next-line */}
                      <div className={styles.avator} style={{ backgroundImage: `url(${item.avatar})`}}></div>
                      <div className={styles.name}>{item.nickname}</div>
                      <div className={styles.introduce}>{item.signature}</div>
                      <Row className={styles.row}>
                        <Col span={12} className={styles.line}>
                          <div>作品</div>
                          <div>{item.productCount}</div>
                        </Col>
                        <Col span={12}>
                          <div>粉丝</div>
                          <div>{item.fansCount}</div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                )) : <Col style={{ height: 200, lineHeight: '200px', textAlign: 'center' }}>暂无报名</Col>
              }
            </Row>) : <div style={{ height: 200, lineHeight: '200px', textAlign: 'center' }}><h2 className={styles.orange}>提示：报名后才能查看报名情况！</h2></div>
          }
        </Spin>
        { totalSize > 10 && (
          <Pagination
            showQuickJumper
            pageSize={10}
            total={totalSize}
            current={current}
            onChange={this.handlePagination}
            className={styles.pagination}
          />
        )}
      </Fragment>
    );
  }
}
