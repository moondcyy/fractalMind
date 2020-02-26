import React, { Fragment } from 'react';
import { Row, Col, Icon, Input } from 'antd';
import Menu from './Menu';
import styles from './index.less';
import UserCenter from './UserCenter';

export default props => (
  <Row className={styles.header}>

    { !props.isMobile ? (
      <Fragment>
        <Col span={4} className={styles.logo}>
          <img src={props.logo} alt="logo" className={styles.logo} />
        </Col>
        <Col span={8}>
          <Menu {...props} />
        </Col>
      </Fragment>
    ) : (
      <Icon className={styles.icon} onClick={() => props.onCollapse(false)} type="menu-unfold" theme="outlined" />
    )
    }
    <Input.Search
        placeholder="搜索"
        onSearch={value => props.headerSearch(value)}
        style={{ width: 200 }}
    />
    <div className={styles.headerRight}>
      <UserCenter {...props} />
    </div>
  </Row>
);
