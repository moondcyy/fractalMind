import React from 'react';
import { Link } from 'dva/router';
import { Modal, Pagination, Spin, message } from 'antd';
import UserCenter from '../../userCenter';
import request from '../../../utils/request';
import styles from './index.less';

class InfoCenter extends React.PureComponent {
  state = {
    loading: false,
    res: {},
  };

  componentDidMount() {
    this.onFetch();

    window.timer_infoCenter = setInterval(() => {
      this.onFetch();
    }, 20 * 1000);
  }

  componentWillUnmount() {
    if (window.timer_infoCenter) {
      clearInterval(window.timer_infoCenter);
    }
  }

  onRemove = (id) => {
    Modal.confirm({
      title: '确定删除该消息？',
      onOk() {
        // 删除操作
        request({
          url: `/web/notice/remove/${id}`,
          onSuccess: () => {
            message.success('删除成功');
            this.onFetch();
          },
        });
      },
    });
  };

  onFetch = (parm = '') => {
    const _this = this;
    request({
      url: `/web/notice/page${parm}`,
      onSuccess(res) {
        _this.setState({ res });
      },
    });
  };

  onChangePage = (current) => {
    this.onFetch(`?current=${current}`);
  };

  renderPagination = () => {
    const { rows = [], total = 0, current = 1, limit = 10 } = this.props.res || {};

    if (+total > rows.length) {
      return (
        <Pagination
          pageSize={limit}
          current={current}
          total={+total}
          onChange={this.onChangePage}
        />
      );
    }
  };

  render() {
    const { res, loading } = this.state;
    const { rows = [] } = res;

    return (
      <UserCenter>
        <Spin spinning={loading}>
          {rows.length > 0 ? rows.map(item => (
            <div key={item.id} className={styles.info_item}>
              <div className={styles.info_title}>
                <Link to={`/preview?id=${item.id}`} target="_blank">
                  {item.title}
                </Link>
              </div>
              <div className={styles.info_content}>{item.content}</div>
              <div className={styles.info_time}>
                {item.createdTime}
                <a className={styles.info_btn} onClick={() => this.onRemove(item.id)}>删除</a>
              </div>
            </div>
          )) : <div className="noData">暂无消息</div>}
          <div className={styles.page}>
            {this.renderPagination()}
          </div>
        </Spin>
      </UserCenter>
    );
  }
}

export default InfoCenter;
