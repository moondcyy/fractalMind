/*
* 新增管理阶段
* */

import React from 'react';
import { Link } from 'dva/router';
import { Button, List } from 'antd';
import request from '../../../utils/request';
import ModalBox from '../../../components/ModalBox';

class CheckStageBtn extends React.PureComponent {
  state = {
    loading: false,
    data: [],
  };

  onOpen = () => {
    this.modalRef.show();
    this.fetchList();
  };

  remove = (stageCode) => {
    request({
      that: this,
      url: `/web/stage/remove?stageCode=${stageCode}`,
      method: 'DELETE',
      onSuccess: () => {
        this.fetchList();
      },
    });
  };

  openQuestion = (stageCode) => {
    window.open(`/web/question/view?relationCode=${stageCode}`, 'preview');
  };

  fetchList = () => {
    const { eventNo } = this.props;

    request({
      that: this,
      url: `/web/stage/list?eventNo=${eventNo}`,
      onSuccess: (res) => {
        this.setState({ data: res.data || [] });
      },
    });
  };

  render() {
    const { loading, data } = this.state;
    const { token } = window.currentUser || {};
    return (
      <React.Fragment>
        <Button icon="solution" onClick={this.onOpen}>查看阶段</Button>
        <ModalBox
          width={500}
          title="查看管理阶段"
          handleOk={this.handleOk}
          ref={(r) => { this.modalRef = r; }}
          afterClose={() => this.setState({ data: [] })}
          footer={[]}
        >
          <List
            bordered
            size="small"
            loading={loading}
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  token === item.createdBy ? <a onClick={() => this.remove(item.stageCode)}>删除</a> : '',
                  <Link to={`/stageWorks?eventNo=${item.eventNo}&stageCode=${item.stageCode}`} target="_blank">查看作品</Link>,
                  <a onClick={() => this.openQuestion(item.stageCode)}>查看问卷</a>,
                ]}
              >
                {`${index + 1}、${item.stageTitle}`}
              </List.Item>
            )}
          />
        </ModalBox>
      </React.Fragment>
    );
  }
}

export default CheckStageBtn;
