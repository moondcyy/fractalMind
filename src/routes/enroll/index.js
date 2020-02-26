/*
* 报名详情
* */

import React from 'react';
import { stringify } from 'qs';
import request from '../../utils/request';
import { getUrlParameter } from '../../utils/utils';
import List from './List';
import styles from './index.less';

class Enroll extends React.PureComponent {
  state = {
    status: 0,
    eventNo: getUrlParameter('eventNo'),
    paidData: {},
    nopaidData: {},
  };

  componentDidMount() {
    this.fetchPaid();
    this.fetchNoPaid();
  }

  onChange = (key) => {
    this.setState({ status: key });
  };

  fetchPaid = (params = {}) => {
    const { eventNo } = this.state;

    request({
      url: `/web/enroll/paid/${eventNo}?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ paidData: res });
      },
    });
  };

  fetchNoPaid = (params = {}) => {
    const { eventNo } = this.state;

    request({
      url: `/web/enroll/nopaid/${eventNo}?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ nopaidData: res });
      },
    });
  };

  render() {
    const { status, paidData, nopaidData } = this.state;
    const tabsArr = [`已交费（${paidData.rows?.length}）`, `未交费（${nopaidData.rows?.length}）`];
    const components = [
      <List data={paidData} fetch={this.fetchPaid} />,
      <List data={nopaidData} fetch={this.fetchNoPaid} />,
    ];

    return (
      <div className={styles.container}>
        <div className={styles.title}>{paidData.eventTitle}(报名情况）</div>
        <div className={styles.tabs}>
          {tabsArr.map((item, index) => (
            <span
              key={item}
              onClick={() => this.onChange(index)}
              className={(index === status) ? styles.tab_active : ''}
            >
              {item}
            </span>
          ))}
        </div>
        {components[status]}
      </div>
    );
  }
}

export default Enroll;
