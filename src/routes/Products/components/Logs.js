import React from 'react';
import { Link } from 'dva/router';
import { Button, Avatar, Collapse } from 'antd';

const { Panel } = Collapse;

export default function Logs(props) {
  const list = props.logList.concat([]);
  const isShowMore = !props.showAll && list && list.length > 5;
  const showList = props.showAll ? list : list.splice(0, 5);

  return (
    <div>
      <h3 style={{ marginBottom: 15 }} >日志</h3>
      { showList.length <= 0 ? <div>暂时没有可以浏览的日志</div> : (
        <Collapse defaultActiveKey={['0']} >
          {
          showList.map((item, index) => (
            /* eslint-disable */
            <Panel header={item.logTitle} key={index}>
              <Avatar src={item.avatar} />
              <span style={{ margin: '0 10px' }}>{item.author}</span>
              <span style={{ color: '#999', fontSize: '12px' }}>{item.logDate}</span>
              {/* eslint-disable */}
              <p style={{ margin: '10px 0'}} dangerouslySetInnerHTML={{ __html: item.logContent }}></p>
            </Panel>
          ))
        }
        </Collapse>
      )}

      {isShowMore && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <Link to={`/products/detailsAll?type=log&productId=${props.productId}`}><Button type="primary" ghost>查看所有日志</Button></Link>
        </div>
      )}
    </div>
  );
}
