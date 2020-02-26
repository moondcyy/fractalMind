import React from 'react';
import { Layout, Menu } from 'antd';
import { MemberCard } from '../../components/business';
import AllWorks from './AllWorks';
import Partake from './Partake';
import Race from './Race';
import { getUrlParameter } from '../../utils/utils';
import request from '../../utils/request';
import styles from './index.less';

class Member extends React.PureComponent {
  state = {
    selectedKeys: '0',
    leaguerNo: getUrlParameter('id'),
    leaguerData: {},
  };

  componentDidMount() {
    this.fetchLeaguerInfo();
  }

  handleClick = (e) => {
    this.setState({
      selectedKeys: e.key,
    });
  };

  // 获取会员详情：头像、作品数、粉丝数等
  fetchLeaguerInfo = () => {
    const { leaguerNo } = this.state;

    request({
      url: `/web/leaguer/info?leaguerNo=${leaguerNo}`,
      onSuccess: (res) => {
        this.setState({ leaguerData: res.data || {} });
      },
    });
  };

  render() {
    const { selectedKeys, leaguerData, leaguerNo } = this.state;
    const components = [
      <AllWorks leaguerNo={leaguerNo} />,
      <Partake leaguerNo={leaguerNo} />,
      <Race leaguerNo={leaguerNo} />,
    ];

    return (
      <Layout className={styles.layout} >
        <Layout.Sider theme="light" width="280" style={{ backgroundColor: '#f7f7f7' }}>
          <MemberCard data={leaguerData} callback={() => this.fetchLeaguerInfo()} />
        </Layout.Sider>
        <Layout.Content>
          <Menu
            mode="horizontal"
            className={styles.menu}
            onClick={this.handleClick}
            selectedKeys={[selectedKeys]}
          >
            <Menu.Item key="0">全部作品</Menu.Item>
            <Menu.Item key="1">参与课程</Menu.Item>
            <Menu.Item key="2">参与竞赛</Menu.Item>
          </Menu>
          {components[selectedKeys]}
        </Layout.Content>
      </Layout>
    );
  }
}

export default Member;
