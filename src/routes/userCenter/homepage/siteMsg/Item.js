/*
* 站内私信模块
* API: {
*   callback: 删除按钮的回调
* }
* */

import React from 'react';
import { Link } from 'dva/router';
import { Button, Modal, message } from 'antd';
import request from '../../../../utils/request';
import styles from './Item.less';

class Item extends React.PureComponent {
  remove = (noticeId) => {
    const { callback = () => {} } = this.props;

    Modal.confirm({
      title: '确定删除该项？',
      onOk() {
        // 删除操作
        request({
          url: `/web/notice/remove/${noticeId}`,
          onSuccess: (res) => {
            message.success('删除成功');
            callback(res);
          },
        });
      },
    });
  };

  handleBtns = (noticeId, btnFun) => {
    request({
      url: `/web/notice/handle/invitation?noticeId=${noticeId}&outParam=${btnFun}`,
      onSuccess: (res) => {
        const { relationNo = '', relationType = '' } = res.data || {};
        const { callback = () => {} } = this.props;

        if (relationType === 'TRAIN') {
          window.open(`/training/course/detail?courseId=${relationNo}`);
        } else if (relationType === 'PRODUCT') {
          window.open(`/products/productDetail?productId=${relationNo}`);
        }
        callback();
      },
    });
  };

  render() {
    const { data = {} } = this.props;
    const to = `/userCenter/siteMsgReply?sender=${data.sender}`;
    const { btns = [] } = data;

    return (
      <div className={styles.item}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={data.imgSrc} alt="" />
          </div>
          <div className={styles.content}>
            <div className={styles.name}>{data.senderName}</div>
            <div className={styles.text}>{data.content}</div>
          </div>
          <div className={styles.btns}>
            <div className={styles.float_right}>
              {btns.map(item => (
                <Button
                  key={item.btnFun}
                  onClick={() => this.handleBtns(data.noticeId, item.btnFun)}
                  type={item.btnStyle === '1' ? 'primary' : '-'}
                >
                  {item.btnName}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          {data.sendTime}
          <Link to={to} className={styles.total_msg}>
            共 {data.noticeCount} 条消息
          </Link>
          <div className={styles.float_right}>
            <Link to={to}>回复</Link>
            <a onClick={() => this.remove(data.noticeId)} className={styles.btn_del}>删除</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
