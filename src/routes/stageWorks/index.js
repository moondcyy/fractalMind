/*
* 阶段课程-作品列表
* */

import React from 'react';
import { stringify } from 'qs';
import request from '../../utils/request';
import { WorksCardList } from '../../components/business';
import { getUrlParams } from '../../utils/utils';
import AddWorksBtn from './AddWorksBtn';
import styles from './index.less';

class StageWorks extends React.PureComponent {
  state = {
    loading: false,
    params: getUrlParams(),
    data: {},
  };

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    const { params } = this.state;

    request({
      that: this,
      url: `/web/stage/products?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ data: res || {} });
      },
    });
  };

  render() {
    const { loading, data, params } = this.state;
    const { stageInfo = {} } = data;

    return (
      <div className={styles.container}>
        <div className={styles.title}>{stageInfo.eventTitle}（{stageInfo.stageTitle}）</div>
        <div className={styles.flex}>
          <div className={styles.title2}>作品（{data.rows?.length}）</div>
          <AddWorksBtn
            {...params}
            callback={() => { this.fetchList(); }}
          />
        </div>
        <WorksCardList
          data={data}
          loading={loading}
          isPagination={false}
          worksCardProps={{
            ...params,
            isRemove: true,
            callback: () => {
              this.fetchList();
            },
          }}
        />
      </div>
    );
  }
}

export default StageWorks;
