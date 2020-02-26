/*
* 竞赛
* api: {
*   enroll: 是否已报名
*   fetchUrl: 请求接口
*   params: {}, 入参对象
* }
* */

import React from 'react';
import { Link } from 'dva/router';
import { stringify } from 'qs';
import { Spin, Pagination, Icon, Button, Modal } from 'antd';
import request from '../../../utils/request';
import NoData from '../../NoData';
import styles from './index.less';
import { message } from 'antd/lib/index';

class ContestCardList extends React.PureComponent {
  state = {
    loading: false,
    data: {},
  };

  componentDidMount() {
    this.onFetch({
      current: 1,
    });
  }

  onChangePage = (current) => {
    this.onFetch({
      current,
    });
  };

  onFetch = (obj) => {
    const { fetchUrl = '/web/leaguer/contest', params = {} } = this.props;

    request({
      that: this,
      url: `${fetchUrl}?${stringify({ ...obj, ...params })}`,
      onSuccess: (res) => {
        this.setState({ data: res });
      },
    });
  };

  goPay = (eventNo) => {
    const { token } = window.currentUser || {};
    window.open(`/admin/open/event/pay?eventNo=${eventNo}&token=${token}`);
  }
  goRevoke = (eventNo) => {
    const thisObj = this;
    Modal.confirm({
      title: '您确认要撤销报名操作？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        request({
          that: this,
          url: `/web/leaguer/revoke?eventNo=${eventNo}`,
          onSuccess: () => {
            message.success('撤销报名成功');
            // 刷新
            thisObj.onFetch();
          },
        });
      },
    });
  };
  render() {
    const { loading, data } = this.state;
    const {
      isApproval = false,
      enroll = true,
      isMyCreate = false,
      isShareBtn = false,
      isCreateBtn = false,
      isCheckBtn = false,
      isSignUpBtn = false,
      isRelease = false,
    } = this.props;
    const { total = 0, current = 1, limit = 10, rows = [] } = data;


    return (
      <Spin spinning={loading}>
        {rows.length > 0 ? (
          rows.map((item) => {
            const msgArr = [
              ['bar-chart', item.eventStage],
              ['project', item.eventIntroduction],
              ['clock-circle', item.startDate ? `${item.startDate} ~ ${item.endDate}` : ''],
              ['user', item.realName ? `${item.realName} ${item.phone}` : ''],
            ];

            return (
              <React.Fragment key={item.eventNo}>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.title}>{item.eventTitle}</div>
                    {msgArr.map(item2 => (
                      <div className={styles.msg} key={item2[0]}>
                        <div className={styles.icon}>
                          <Icon type={item2[0]} />
                        </div>
                        <div className={styles.content}>{item2[1]}</div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.right}>
                    {isMyCreate ? (
                      <div className={styles.my_create}>
                        {/* <div className={styles.btn_check}>
                          <Link to={`/web/product/view?productNo=${item.eventNo}`}>
                            <Button type="primary" ghost>编辑</Button>
                          </Link>
                        </div> */}
                        <div className={styles.btn_check}>
                          <Link to={`/training/course/detail?courseId=${item.eventNo}`}>
                            <Button type="primary" ghost>查看详情</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <React.Fragment>
                        <div className={styles.price}>{item.ticketSignCode === 1 ? (
                          `￥ ${item.ticketPrice.ticketPrice}`) : item.ticketSign }
                        </div>
                        <div className={styles.btn_check}>
                          <Link to={`/training/course/detail?courseId=${item.eventNo}`}>
                            <Button type="primary" ghost>查看详情</Button>
                          </Link>
                        </div>
                        {enroll ? (
                          <div className={styles.btn_enroll}>
                            {item.paySign > 0 ? (
                              <Button type="primary" ghost onClick={() => this.goPay(item.eventNo)}>{item.btnName}</Button>
                            ) : (item.btnName ? <Button disabled>{item.btnName}</Button> : null)}
                            {item.enrollStatusCode !== 30 ? (
                              <Button type="primary" ghost onClick={() => this.goRevoke(item.eventNo)}>撤销报名</Button>
                            ) : null }
                          </div>
                        ) : null}
                      </React.Fragment>
                    )}
                  </div>
                </div>
                {(isShareBtn || isCheckBtn || isSignUpBtn || isCreateBtn || isApproval || isRelease) && (
                  <div className={`${styles.item_btns} clear`}>
                    {isApproval && <span className={styles.approval}>{item.enrollStatus}</span>}
                    {isRelease && <span className={styles.approval}>{item.releaseStatus}</span>}
                  </div>
                )}
              </React.Fragment>
            );
          })
        ) : <NoData /> }
        <Pagination
          hideOnSinglePage
          pageSize={+limit}
          current={+current}
          total={+total}
          onChange={this.onChangePage}
          style={{ float: 'right' }}
        />
      </Spin>
    );
  }
}

export default ContestCardList;
