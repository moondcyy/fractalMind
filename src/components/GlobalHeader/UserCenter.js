import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Menu, Icon, Dropdown } from 'antd';
import { urlTimeStamp } from '../../utils/utils';
import styles from './UserCenter.less';

export default class UserCenter extends PureComponent {
  render() {
    const { currentUser, onLogoutClick } = this.props;
    const { avatar } = currentUser;

    const loginOutMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onLogoutClick}>
        <Menu.Item>
          <Icon type="user" /><Link style={{ display: 'inline' }} to="/userCenter/homepage">个人中心</Link>
        </Menu.Item>
        <Menu.Item>
          <Icon type="solution" /><Link style={{ display: 'inline' }} to="/userCenter/perfect">完善信息</Link>
        </Menu.Item>
        <Menu.Item>
          <Icon type="key" /><Link style={{ display: 'inline' }} to="/userCenter/editPwd">修改密码</Link>
        </Menu.Item>
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );

    if (!currentUser.token) {
      return (
        <div className={styles.user}>
          <Link to="/user/login">登录</Link> / <Link to="/user/register">注册</Link>
        </div>
      );
    }

    return (
      <div className={styles.user}>
        <Dropdown overlay={loginOutMenu} trigger={['click', 'hover']}>
          <div className={styles.userName}>
            {avatar ? <img src={urlTimeStamp(avatar)} alt="" /> : (currentUser.nickname || currentUser.leaguerEmail)}
            <span>{ currentUser.nickname }</span>
          </div>
        </Dropdown>
      </div>
    );
  }
}
