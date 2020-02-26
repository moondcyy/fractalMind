// 报名认证

import React from 'react';
import { connect } from 'dva';
import { Form, Spin, Row, Col, Input, Button, Alert } from 'antd';
import request from '../../../utils/request';
import { getUrlParameter } from '../../../utils/utils';
import UserCenter from '../../userCenter';
import styles from './index.less';

class Auth extends React.PureComponent {
  state = {
    loading: false,
    token: getUrlParameter('token'),
    success: false,
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({ token: e.target.value });
  };

  onAuth = (e) => {
    e.preventDefault();

    this.onFetch();
  };

  onFetch = () => {
    const { token } = this.state;

    request({
      that: this,
      url: '/web/enroll/auth',
      method: 'POST',
      body: { token },
      onSuccess: () => {
        this.setState({ success: true });
      },
    });
  };

  onBack = (e) => {
    e.preventDefault();
    this.setState({
      success: false,
      token: null,
    });
  };

  renderContent = () => {
    const { loading, token, success } = this.state;

    return (
      <Spin spinning={loading} wrapperClassName={styles.auth}>
        {
          success ? (
            <React.Fragment>
              <Alert
                message="报名认证成功"
                description={<a onClick={this.onBack}>返回继续认证</a>}
                type="success"
                showIcon
              />
            </React.Fragment>
          ) : (
            <Row>
              <Col span={17}>
                <Input placeholder="请输入认证码" onChange={this.onChange} defaultValue={token} />
              </Col>
              <Col span={1} />
              <Col span={5}>
                <Button disabled={!token} type="primary" onClick={this.onAuth}>报名认证</Button>
              </Col>
            </Row>
          )
        }
      </Spin>
    );
  };

  render() {
    const { currentUser } = this.props;

    if (currentUser.leaguerEmail) {
      return (
        <UserCenter>
          {this.renderContent()}
        </UserCenter>
      );
    }

    return this.renderContent();
  }
}

// 监听属性，建立组件和数据的映射关系
function mapStateToProps(state) {
  const { currentUser } = state.user;
  return { currentUser };
}

export default connect(mapStateToProps)(Form.create()(Auth));
