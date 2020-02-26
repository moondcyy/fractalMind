import React from 'react';
import { Tabs, Button } from 'antd';
import UserCenter from '../../userCenter';
import LoginLink from '../../../components/LoginLink';
import { CourseCardList } from '../../../components/business';

class MyTrain extends React.PureComponent {
  render() {
    return (
      <UserCenter>
        <Tabs
          type="card"
          tabBarExtraContent={
            <LoginLink to="/web/train/view" isInside={false}>
              <Button type="primary">发布课程</Button>
            </LoginLink>
          }
        >
          <Tabs.TabPane tab="我参与的" key={0}>
            <CourseCardList isCheckBtn isApproval />
          </Tabs.TabPane>
          <Tabs.TabPane tab="我关注的" key={1}>
            <CourseCardList
              fetchUrl="/web/train/follow"
              enroll={false}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="我创建的" key={2}>
            <CourseCardList
              fetchUrl="/web/leaguer/found/course"
              enroll={false}
              isRelease
              isSignUpBtn
              isShareBtn
              isCreateBtn
              isCheckBtn
              isEditBtn
            />
          </Tabs.TabPane>
        </Tabs>
      </UserCenter>
    );
  }
}

export default MyTrain;
