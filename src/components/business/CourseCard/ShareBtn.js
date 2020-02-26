/*
* 分享按钮
* */

import React from 'react';
import { Button, message } from 'antd';
import ModalBox from '../../../components/ModalBox';
import SelectSearch from '../../../components/SelectSearch';
import request from '../../../utils/request';
import styles from './index.less';

const TITLE = '分享';

class ShareBtn extends React.PureComponent {
  state = {
    loading: false,
    leaguerNo: [],
  };

  onShare = () => {
    this.modalRef.show();
  };

  onSelect = (keys) => {
    this.setState({ leaguerNo: keys });
  };

  handleOk = () => {
    const { leaguerNo } = this.state;
    const { eventNo } = this.props;

    request({
      that: this,
      url: '/web/notice/invitation/train',
      method: 'POST',
      body: {
        leaguerNo,
        relationNo: eventNo,
      },
      onSuccess: () => {
        message.success('分享成功');
        this.modalRef.hide();
      },
    });
  };

  render() {
    const { loading, leaguerNo } = this.state;

    return (
      <React.Fragment>
        <Button icon="share-alt" onClick={this.onShare}>分享</Button>
        <ModalBox
          width={350}
          title={TITLE}
          okText={TITLE}
          confirmLoading={loading}
          ref={(r) => { this.modalRef = r; }}
          afterClose={() => this.onSelect([])}
          handleOk={this.handleOk}
          okButtonProps={{
            disabled: leaguerNo.length === 0,
          }}
        >
          <div className={styles.share_tip}>将该课程分享给会员</div>
          <SelectSearch
            mode="multiple"
            url="/web/leaguer/search?limit=100&condition="
            fields={['leaguerNo', 'nickname']}
            callback={this.onSelect}
            placeholder="请搜索会员名称，可多选"
          />
        </ModalBox>
      </React.Fragment>
    );
  }
}

export default ShareBtn;
