/*
* 作品列表
* API: {
*   loading: false // loading 效果
*   data: {} // 数据源
*   worksCardProps: {}, // worksCard 组件的属性
*   onChangePage(current){}, // 翻页组件事件
*   isPagination: true, // 是否有翻页
* }
* */

import React from 'react';
import { Pagination, Spin } from 'antd';
import WorksCard from './index';
import NoData from '../../NoData';

class WorksCardList extends React.PureComponent {
  render() {
    const { data = {}, worksCardProps = {}, onChangePage = () => {}, loading = false, isPagination = true } = this.props;
    const { rows = [], limit = 0, current = 0, total = 0 } = data;

    return (
      <Spin spinning={loading}>
        {rows.length > 0 ? (
          rows.map(item => (
            <WorksCard
              data={item}
              key={item.productNo}
              {...worksCardProps}
            />
          ))
        ) : <NoData />}
        {isPagination && (
          <Pagination
            hideOnSinglePage
            style={{ float: 'right' }}
            pageSize={limit}
            current={current}
            total={+total}
            onChange={onChangePage}
          />
        )}
      </Spin>
    );
  }
}

export default WorksCardList;
