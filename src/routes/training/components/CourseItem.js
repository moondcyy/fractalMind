import React from 'react';
import { Link } from 'dva/router';
import { Icon, Button } from 'antd';
import styles from './CourseItem.less';

export default function CourseItem(props) {

  const {
    eventTitle,
    eventStage,
    eventNo,
    eventIntroduction,
    startDate,
    endDate,
    ticketSignCode,
    ticketSign,
    ticketPrice={},
  } = props.info;

  return (
    <div className={styles.cousrseItemBox}>
      <div className={styles.courseBox}>
        <Link to={`/training/course/detail?courseId=${eventNo}`}>
          <h3 className={styles.title}>{eventTitle}</h3>
        </Link>
        <div className={styles.courseInfo}>
          <Icon type="bar-chart" theme="outlined" className={styles.icon} />
          <p>{eventStage}</p>
        </div>
        <div className={styles.courseInfo}>
          <Icon type="project" theme="outlined" className={styles.icon} />
          <p>{eventIntroduction}</p>
        </div>
        <div className={styles.courseInfo}>
          <Icon type="clock-circle" theme="outlined" className={styles.icon} />
          <p>{startDate} ~ {endDate}</p>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.price}>
          { ticketSignCode === 0 ? ticketSign : `￥ ${ticketPrice.ticketPrice}` }
        </div>
        <Link to={`/training/course/detail?courseId=${eventNo}`}>
          <Button type="primary" ghost>查看详情</Button>
        </Link>
      </div>
    </div>
  );
}
