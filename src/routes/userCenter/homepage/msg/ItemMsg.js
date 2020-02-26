import React from 'react';
import { Link } from 'dva/router';
import { Modal, message } from 'antd';
import request from '../../../../utils/request';
import styles from './index.less';

class ItemMsg extends React.PureComponent {
  remove = (noticeId) => {
    const { callback = () => {} } = this.props;

    Modal.confirm({
      title: '确定删除该项？',
      onOk() {
        // 删除操作
        request({
          url: `/web/notice/remove/${noticeId}`,
          onSuccess() {
            message.success('删除成功');
            callback();
          },
        });
      },
    });
  };

  render() {
    const { item, isReply = false } = this.props;
    const to = `/userCenter/siteMsgReply?sender=${item.sender}`;

    return (
      <div className={styles.item} key={item.noticeId}>
        <div className={styles.left}>
          <img src={item.imgSrc} alt="" />
        </div>
        <div className={styles.right}>
          <div className={styles.name}>{item.senderName}</div>
          <p className={`${isReply ? styles.msg : styles.msg_over}`}>{item.content}</p>
          <p className={styles.time}>
            {item.sendTime}
            {!isReply ? (<Link to={to} className={styles.total_msg}>共 {item.noticeCount} 条消息</Link>) : null}
            {!isReply ? (<Link to={to} className={styles.btn_reply}>回复</Link>) : null}
            {isReply ? (<a onClick={() => this.remove(item.noticeId)} className={styles.btn_reply}>删除</a>) : null}
          </p>
        </div>
      </div>
    );
  }
}

export default ItemMsg;
