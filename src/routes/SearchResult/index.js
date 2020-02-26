import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import SearchProducts from './components/SearchProducts';
import SearchCourse from './components/SearchCourse';
import Competition from './components/Competition';
import SearchMember from './components/SearchMember';
import styles from './index.less';

const TabPane = Tabs.TabPane;
export default class SearchResult extends PureComponent {
  state = {
    tabKey: 'product',
  }
  handleChangeTab = (key) => {
    this.setState({
      tabKey: key,
    });
  }
  render() {
    const { tabKey } = this.state;
    return (
      <div className="pageContainer">
        <Tabs
          activeKey={tabKey}
          animated={false}
          className={styles.tabs}
          onChange={this.handleChangeTab}
        >
          <TabPane tab="作品" key="product" >
            <SearchProducts />
          </TabPane>
          <TabPane tab="课程" key="course" >
            <SearchCourse />
          </TabPane>
          <TabPane tab="竞赛" key="competition" >
            <Competition />
          </TabPane>
          <TabPane tab="会员" key="member" >
            <SearchMember />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
