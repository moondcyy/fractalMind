import React from 'react';
import { Spin } from 'antd';
import request from '../../utils/request';
import { getUrlParameter } from '../../utils/utils';
import styles from './index.less';

class Preview extends React.Component {
  state = {
    data: {},
    loading: false,
  };

  componentDidMount() {
    const _this = this;

    request({
      that: this,
      url: `/web/notice/detail/${getUrlParameter('id')}`,
      onSuccess(res) {
        _this.setState({ data: res.data });
      },
    });
  }

  render() {
    const { data, loading } = this.state;

    return (
      <Spin spinning={loading} wrapperClassName={styles.preview}>
        <div className={styles.header}>
          <h2 className={styles.title}>{data.title}</h2>
          <div className={styles.time}>{data.createdTime}</div>
        </div>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: data.content }} />
      </Spin>
    );
  }
}

export default Preview;
