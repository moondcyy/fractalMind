import React from 'react';
import { Link } from 'dva/router';
import { Icon, Input, Button, message } from 'antd';
import request from '../../../../utils/request';
import PageMenu from '../PageMenu';
import { getUrlParameter } from '../../../../utils/utils';
import ItemMsg from '../msg/ItemMsg';
import styles from './index.less';

class MsgReply extends React.PureComponent {
  state = {
    num: 250,
    sender: getUrlParameter('sender'),
    senderInfo: {},
    dataList: [],
    inputValue: '',
  };

  componentDidMount() {
    const { sender } = this.state;
    this.fetchList();

    request({
      url: `/web/leaguer/info?leaguerNo=${sender}`,
      onSuccess: (res) => {
        this.setState({ senderInfo: res.data || {} });
      },
    });
  }

  onChange = (e) => {
    e.preventDefault();
    const { value } = e.target;

    this.setState({
      num: 250 - value.length,
      inputValue: value,
    });
  };

  onSubmit = () => {
    const { sender, inputValue } = this.state;

    request({
      url: '/web/notice/send',
      method: 'POST',
      body: {
        content: inputValue,
        receiver: sender,
      },
      onSuccess: () => {
        message.success('回复成功');
        this.setState({ inputValue: '' }, () => {
          this.fetchList();
        });
      },
    });
  };

  callbackRemove = () => {
    this.fetchList();
  };

  fetchList = () => {
    const { sender } = this.state;

    request({
      url: `/web/notice/leaguer/${sender}`,
      onSuccess: (res) => {
        this.setState({ dataList: res.data || [] });
      },
    });
  };

  gotoBack = () => {
    window.history.back();
  };

  render() {
    const { num, dataList, inputValue, senderInfo } = this.state;
    const disabled = (inputValue.length > 0);

    return (
      <PageMenu selectedKeys="1">
        <div className={styles.container}>
          <div className={`${styles.reply_box} clearFloat`}>
            <div>与 {senderInfo.nickname} 的私信（共 {dataList.length} 条）
              <a className={styles.back} onClick={this.gotoBack}><Icon type="left" />返回</a>
            </div>
            <div className={styles.textArea}>
              <Input.TextArea
                value={inputValue}
                placeholder="请输入内容，最多250个字符"
                style={{ height: 126, marginTop: 10 }}
                maxLength={250}
                onChange={this.onChange}
              />
              <span className={styles.num}>{num}</span>
            </div>
            <Button disabled={!disabled} type="primary" className={styles.submit} onClick={this.onSubmit}>发送</Button>
          </div>
          {dataList.map(item => <ItemMsg key={item.noticeId} item={item} isReply callback={this.callbackRemove} />)}
        </div>
      </PageMenu>
    );
  }
}

export default MsgReply;
