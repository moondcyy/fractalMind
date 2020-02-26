/*
* 新增管理阶段
* */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, message } from 'antd';
import request from '../../../utils/request';
import Toast from '../../../components/Toast';
import ModalBox from '../../../components/ModalBox';

class CreateStageBtn extends React.PureComponent {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  state = {
    loading: false,
    stageTitle: '',
  };

  onAdd = () => {
    this.modalRef.show();
  };

  setStageTitle = (stageTitle = '') => {
    this.setState({ stageTitle: stageTitle.trim() });
  };

  handleOk = () => {
    const { isMobile } = this.context;
    const { stageTitle } = this.state;
    const { eventNo } = this.props;

    request({
      that: this,
      url: '/web/stage/add',
      method: 'POST',
      body: { eventNo, stageTitle },
      onSuccess: () => {
        const successText = '添加成功';
        // eslint-disable-next-line
        isMobile ? Toast.success(successText) : message.success(successText);
        this.modalRef.hide();
      },
    });
  };

  render() {
    const { loading, stageTitle } = this.state;

    return (
      <React.Fragment>
        <Button icon="plus" onClick={this.onAdd}>新增阶段</Button>
        <ModalBox
          width={350}
          title="新增管理阶段"
          confirmLoading={loading}
          handleOk={this.handleOk}
          ref={(r) => { this.modalRef = r; }}
          afterClose={() => this.setStageTitle()}
          okButtonProps={{ disabled: stageTitle === '' }}
        >
          <Input placeholder="请输入管理阶段名称" onChange={e => this.setStageTitle(e.target.value)} />
        </ModalBox>
      </React.Fragment>
    );
  }
}

export default CreateStageBtn;
