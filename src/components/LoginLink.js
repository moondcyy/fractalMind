/*
* 根据登录状态进行跳转的组件
* API：{
*   to: ''，// 跳转地址
*   isInside: 是否站内跳转
* }
* */

import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
export default class LoginLink extends React.PureComponent {
  render() {
    const { currentUser = {}, className, to = '', isInside = true, children } = this.props;
    const { token } = currentUser;
    const gotoLogin = `/user/login?goto=${window.location.href}`;

    if (token) {
      return <a className={className} href={to} target="_blank" rel="noopener noreferrer">{children}</a>;
    }

    return <Link to={isInside ? to : gotoLogin} className={className}>{children}</Link>;
  }
}
