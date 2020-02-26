// 三方登录组件
import React from 'react';
import { Link } from 'dva/router';
import { enquireScreen } from 'enquire-js';
import logo from '../../../assets/logo.png';
import request from '../../../utils/request';
import { getUrlParams } from '../../../utils/utils';


export default class SocialLogin extends React.Component {
  state = {
    uri: null,
  }
  componentDidMount() {
    const params = getUrlParams();
    let isMobile;
    enquireScreen(b => isMobile = b);
    // param 参数接收一个 goto 参数，用于后面授权成功后的重定向
    request({
      url: `/web/${params.platform}/qrcode/url?${params.goto && `param=${params.goto}`}`,
    }).then((res) => {
      if (res.success) {
        const { uri = '' } = res.data;
        if (isMobile) {
          parent.window.location.href = uri;
        } else {
          this.setState({
            uri,
          });
        }
      }
    });
  }
  render() {
    const { uri } = this.state;
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 30 }}><img src={logo} alt="奇异思维" /></div>
        <iframe
          title="wechart"
          frameBorder="0"
          scrolling="no"
          width="600px"
          height="500px"
          src={uri}
        />
        <p style={{ fontSize: 14 }}><Link to="/user/login">使用账户密码登录</Link></p>
      </div>
    );
  }
}
