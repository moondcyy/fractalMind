// 支付宝授权登录中间页
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Alert } from 'antd';
import { Link, routerRedux } from 'dva/router';
import request from '../../../utils/request';
import { getUrlParams } from '../../../utils/utils';

@connect()
export default class QQAuth extends React.Component {
  state = {
    isAuth: null,
    count: 3,
    goto: false,
    errorMessage: '',
  }
  componentDidMount() {
    const { code, state } = getUrlParams();
    request({
      url: `/web/qq/auth?code=${code}&state=${state}`,
    }).then((res) => {
      this.setState({
        isAuth: res.success,
      });
      if (res.success) {
        this.setState({
          goto: res.data.param,
        });
        this.countDown();
      } else {
        this.setState({ errorMessage: res.message });
      }
    });
  }
  componentDidUpdate() {
    if (this.state.count === 0) {
      const { goto } = this.state;

      clearInterval(this.time);
      this.time = null;
      if (parent.window) {
        parent.window.location.href = '/products/home';
      } else {
        this.props.dispatch(routerRedux.push(goto || '/products/home'));
      }
    }
  }
  componentWillUnmount() {
    clearInterval(this.time);
  }

  countDown() {
    this.time = setInterval(() => {
      this.setState(state => ({
        count: state.count - 1,
      }));
    }, 1000);
  }
  render() {
    const { isAuth, count, goto, errorMessage } = this.state;
    return (
      <div>
        { isAuth && <Alert message="授权成功" type="success" description={`${count}后自动跳转到${goto ? '完善信息页' : '作品首页'}`} showIcon /> }
        { isAuth === false && (
          <Fragment>
            <Alert message={`授权失败: ${errorMessage}`} type="error" showIcon />
            <p style={{ fontSize: 14 }}>
              <Link to="/user/login?platform=qq">重新扫码</Link>
            </p>
          </Fragment>
        )}
      </div>
    );
  }
}
