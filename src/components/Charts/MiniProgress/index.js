import React from 'react';

import styles from './index.less';

const MiniProgress = ({ color = 'rgb(19, 194, 194)', width, strokeWidth, percent }) => (
  <div className={styles.miniProgress}>
    <div className={styles.progressWrap} style={{ width: width || '100%' }}>
      <div
        className={styles.progress}
        style={{
          backgroundColor: color || null,
          width: percent ? `${percent}%` : null,
          height: strokeWidth || null,
        }}
      />
    </div>
  </div>
);

export default MiniProgress;
