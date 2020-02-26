import React from 'react';
import { Link } from 'dva/router';
import { Button } from 'antd';

export default function Component(props) {
  const list = props.list.concat([]);
  const isShowMore = !props.showAll && list && list.length > 5;
  const showList = props.showAll ? list : list.splice(0, 5);
  return (
    <div>
      <h3 style={{ marginBottom: 15 }} >元件</h3>
      {
        showList.length > 0 ? showList.map(item => (
          <div key={item.componentsName} style={{ height: 30 }} className="clearFloat">
            <span>{item.componentsName}</span>
            <span style={{ margin: '0 40px' }}>x</span>
            <span>{item.componentsCount}</span>
          </div>
        )) : <div>暂无元件</div>
      }
      {isShowMore && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <Link to={`/products/detailsAll?type=component&productId=${props.productId}`}><Button type="primary" ghost>查看所有元件</Button></Link>
        </div>
      )}
    </div>
  );
}
