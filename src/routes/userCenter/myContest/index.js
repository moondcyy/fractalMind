import React from 'react';
import { Tabs } from 'antd';
import UserCenter from '..';
import { ContestCardList } from '../../../components/business';

class MyContest extends React.PureComponent {
  render() {
    return (
      <UserCenter>
        <Tabs
          type="card"
        >
          <Tabs.TabPane tab="我参与的" key={0}>
            <ContestCardList isCheckBtn isApproval />
          </Tabs.TabPane>
          <Tabs.TabPane tab="我关注的" key={1}>
            <ContestCardList
              fetchUrl="/web/contest/follow"
              enroll={false}
            />
          </Tabs.TabPane>
        </Tabs>
      </UserCenter>
    );
  }
}

export default MyContest;
