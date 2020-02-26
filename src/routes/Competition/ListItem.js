import React from 'react';
import { Link } from 'dva/router';
import { Icon, Button } from 'antd';
import styles from './ListItem.less';

export default function ListItem(props) {
  const { info, hasSignUp, hidePrice } = props;
  const {
    eventTitle,
    eventStage,
    eventNo,
    eventIntroduction,
    startDate,
    endDate,
    imgUrl,
    ticketSignCode,
    ticketSign,
    ticketPrice={},
  } = info;
  const courseBoxClass = imgUrl ? styles.hasImg : styles.courseBox;

  return (
    <div className={styles.cousrseItemBox}>
      {imgUrl && (
        <div className={styles.leftImg}>
          <img src={imgUrl} alt="" />
        </div>
      )}
      <div className={courseBoxClass}>
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
        { !hidePrice && (
          <div className={styles.price}>{
            ticketSignCode === 0 ? ticketSign : ticketPrice
          }</div>
        )}
        <Link to={`/training/course/detail?courseId=${eventNo}`}>
          <Button type="primary" ghost>查看详情</Button>
        </Link>
        { hasSignUp && <Button type="primary" className={styles.signUpBtn}>立即报名</Button> }
      </div>
    </div>
  );
}
