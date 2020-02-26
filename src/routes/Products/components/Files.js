import React from 'react';
import { Icon, Button } from 'antd';
import { Link } from 'dva/router';

export default function Files(props) {
  const list = props.fileList.concat([]);
  const isShowMore = !props.showAll && list.length > 5;
  const showList = props.showAll ? list : list.splice(0, 5);
  return (
    <div>
      <h3 style={{ marginBottom: 15 }} >文件</h3>
      {
        showList.length > 0 ? showList.map(item => (
          <div key={item.filePath} style={{ height: 30 }} className="clearFloat">
            <a>{item.fileName}</a>
            <a href={item.filePath} style={{ float: 'right', padding: '2px 8px', marginRight: '10%' }}><Icon type="download" /></a>
          </div>
        )) : <div>暂无文件</div>
      }
      {isShowMore && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <Link to={`/products/detailsAll?type=file&productId=${props.productId}`}><Button type="primary" ghost>查看所有文件</Button></Link>
        </div>
      )}
    </div>
  );
}
