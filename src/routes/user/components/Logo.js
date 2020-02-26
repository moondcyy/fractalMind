import React from 'react';
import { Link } from 'dva/router';
import logo from '../../../assets/logo.png';
import styles from './Logo.less';

export default function (props) {
  const { title = '登录', info = '还没有账户？', to = '/user/register', toText = '注册' } = props;

  return (
    <React.Fragment>
      <Link to="/"><img src={logo} className={styles.logo} alt="奇异思维" /></Link>
      <div className={styles.title}>
        <span>{title}</span>
        <span className={styles.float_right}>{info}<Link to={to}>{toText}</Link></span>
      </div>
    </React.Fragment>
  );
}
