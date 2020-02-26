import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Menu, Radio } from 'antd';
import UserCenter from '../../userCenter';
import styles from './PageMenu.less';

class Homepage extends React.PureComponent {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  render() {
    const { isMobile } = this.context;
    const { selectedKeys = '0', children } = this.props;

    return (
      <UserCenter>
        {isMobile ? (
          <Radio.Group value={selectedKeys} style={{ marginBottom: 10 }}>
            <Radio.Button key="0" value="0"><Link to="/userCenter/homepage">我的主页</Link></Radio.Button>
            <Radio.Button key="1" value="1"><Link to="/userCenter/siteMsg">站内消息</Link></Radio.Button>
          </Radio.Group>
        ) : (
          <Menu
            className={styles.menu}
            selectedKeys={[selectedKeys]}
            mode="horizontal"
          >
            <Menu.Item key="0"><Link to="/userCenter/homepage">我的作品</Link></Menu.Item>
            <Menu.Item key="1"><Link to="/userCenter/siteMsg">站内消息</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/userCenter/collect">我的收藏</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/userCenter/draft">草稿箱</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/userCenter/follow">关注的人</Link></Menu.Item>
          </Menu>
        )}
        {children}
      </UserCenter>
    );
  }
}

export default Homepage;
