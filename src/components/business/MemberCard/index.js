/*
* 会员 Card 模板组件
* API: {
*   data: {}, // 数据源，
*   callback: (res) => {}, // 关注 or 取关 后的回调函数
* }
* */

import React from 'react';
import { Link } from 'dva/router';
import { Row, Col, Divider, Button, Modal, message } from 'antd';
import request from '../../../utils/request';
import styles from './index.less';

class MemberCard extends React.PureComponent {
  onFollow = (item, bool) => {
    const { callback = () => {} } = this.props;
    const { nickname, leaguerNo } = item;
    const title = bool ? `确定取消对 "${nickname}" 的关注？` : `确定关注 "${nickname}" ？`;

    Modal.confirm({
      title,
      onOk() {
        request({
          url: '/web/leaguer/follow',
          method: 'POST',
          body: {
            relationNo: leaguerNo,
          },
          onSuccess: (res) => {
            const msg = bool ? `已取消对 "${nickname}" 的关注` : `已关注 ${nickname}!!!`;
            message.success(msg);
            callback(res);
          },
        });
      },
    });
  };

  render() {
    const { data = {} } = this.props;

    return (
      <div className={styles.item}>
        <div className={styles.top}>
          <Link to={`/member?id=${data.leaguerNo}`}>
            <img src={data.avatar} alt="head" className={styles.img} />
            <div className={styles.name}>{data.nickname}</div>
          </Link>
          <div className={styles.info}>{data.signature}</div>
          <Row className={styles.data_box}>
            <div className={styles.data_divider} />
            <Col span={12}>
              <p className={styles.title}>作品</p>
              <p className={styles.title_num}>{data.productCount}</p>
            </Col>
            <Col span={12}>
              <p className={styles.title}>粉丝</p>
              <p className={styles.title_num}>{data.fansCount}</p>
            </Col>
          </Row>
        </div>
        <Divider className={styles.divider} />
        <Row className={styles.btn_box}>
          <Col span={12}>
            {data.follow ?
              <Button onClick={() => this.onFollow(data, true)}>已关注</Button> :
              <Button type="primary" onClick={() => this.onFollow(data, false)}>未关注</Button>}
          </Col>
          <Col span={12}>
            <Link to={`/userCenter/siteMsgReply?sender=${data.leaguerNo}`}>
              <Button>私信</Button>
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MemberCard;
