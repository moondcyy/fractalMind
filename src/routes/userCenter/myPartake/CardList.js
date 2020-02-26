import React from 'react';
import { Link } from 'dva/router';
import styles from './CardList.less';

function CardList(props) {
  const { list = [] } = props;

  return (
    <div className={styles.card}>
      {list.length > 0 ? list.map((item) => {
        const { eventImg, eventTitle, eventIntroduction, eventNo, enrollStatus } = item || {};

        return (
          <div className={styles.card_item} key={eventNo}>
            <span className={styles.status}>{enrollStatus}</span>
            <Link to={`/training/course/detail?courseId=${eventNo}`}>
              <img src={eventImg} alt="图片" className={styles.img} />
              <h3>{eventTitle}</h3>
              <p>{eventIntroduction}</p>
            </Link>
          </div>
        );
      }) : <div className="noData">暂无数据</div>}
    </div>
  );
}

export default CardList;
