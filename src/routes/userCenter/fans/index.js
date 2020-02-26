import React from 'react';
import { Tabs } from 'antd';
import UserCenter from '../../userCenter';
import Follow from './Follow';

class Fans extends React.PureComponent {
  render() {
    return (
      <UserCenter>
        <Tabs type="card">
          <Tabs.TabPane tab="粉丝" key={2}>
            <Follow fetchUrl="/web/leaguer/fans" />
          </Tabs.TabPane>
        </Tabs>
      </UserCenter>
    );
  }
}

export default Fans;
