/*
* 上传作品
* */

import React from 'react';
import { Button, Select } from 'antd';
import { stringify } from 'qs';
import request from '../../utils/request';
import ModalBox from '../../components/ModalBox';

const TITLE = '上传作品';

class AddWorksBtn extends React.PureComponent {
  state = {
    loading: false,
    productNo: null,
    selectData: [],
  };

  componentDidMount() {
    request({
      url: '/web/leaguer/products',
      onSuccess: (res) => {
        this.setState({ selectData: res.data || [] });
      },
    });
  }

  handleChange = (keys) => {
    this.setState({ productNo: keys });
  };

  handleOk = () => {
    const { productNo } = this.state;
    const { stageCode, callback = () => {} } = this.props;

    request({
      that: this,
      url: `/web/stage/submit?${stringify({ productNo, stageCode })}`,
      onSuccess: () => {
        this.modalRef.hide();
        callback();
      },
    });
  };

  render() {
    const { loading, productNo, selectData } = this.state;

    return (
      <React.Fragment>
        <Button type="primary" onClick={() => { this.modalRef.show(); }}>{TITLE}</Button>
        <ModalBox
          width={350}
          title={TITLE}
          confirmLoading={loading}
          handleOk={this.handleOk}
          ref={(r) => { this.modalRef = r; }}
          afterClose={() => this.handleChange(null)}
          okButtonProps={{ disabled: !productNo }}
        >
          <Select
            placeholder="请选择作品"
            style={{ width: '100%' }}
            onChange={this.handleChange}
          >
            {selectData.map(item => <Select.Option key={item.productNo}>{item.productTitle}</Select.Option>)}
          </Select>
        </ModalBox>
      </React.Fragment>
    );
  }
}

export default AddWorksBtn;
