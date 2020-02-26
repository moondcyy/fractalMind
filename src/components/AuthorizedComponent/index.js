import React from 'react';
import { connect } from 'dva';

@connect(({ user }) => ({
  authFunctionList: user.currentUser.authFunctionList,
}))
export default class AuthorizedComponent extends React.Component {
  render() {
    const { authorityCode, authFunctionList, notNull } = this.props;
    const hasAuthority = authFunctionList && authFunctionList.indexOf(authorityCode) > -1;
    if (hasAuthority) {
      return this.props.children;
    } else {
      if (notNull) {
        return <div>暂无权限</div>;
      }
      return null;
    }
    // return (hasAuthority ? this.props.children : '暂无权限');
  }
}
