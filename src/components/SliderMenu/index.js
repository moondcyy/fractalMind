import React from 'react';
import { Drawer } from 'antd';
import Menu from '../GlobalHeader/Menu';
import styles from './index.less';

const SiderMenuWrapper = (props) => {
  const { collapsed, onCollapse, logo } = props;
  return (
    <Drawer
      visible={!collapsed}
      placement="left"
      closable={false}
      onClose={() => onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <div className={styles.slide} >
        <div className={styles.logo}><img src={logo} alt="logo" /></div>
        <Menu {...props} mode="inline" />
      </div>
    </Drawer>
  );
};
export default SiderMenuWrapper;
