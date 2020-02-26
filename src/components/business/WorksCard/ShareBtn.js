/*
* 分享按钮
* */

import React from 'react';
import { message } from 'antd';
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
    const { productNo } = this.props;

    request({
      that: this,
      url: '/web/notice/invitation/product',
      method: 'POST',
      body: {
        leaguerNo,
        relationNo: productNo,
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
        <a onClick={this.onShare}>分享</a>
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
          <div className={styles.share_tip}>将该作品分享给会员</div>
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
