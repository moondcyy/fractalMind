import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';
import styles from './index.less';

const icon = {
  error: 'frown',
  success: 'smile',
  info: 'meh',
};

function toast(props) {
  const { type, content, timer = 3 } = props;

  // 生成 html 代码
  const renderContent = () => {
    return (
      <div id="toast_mark" className={styles.toast_mark}>
        <div className={styles.toast_container}>
          <Icon type={icon[type]} theme="outlined" style={{ fontSize: 30 }} />
          <p className={styles.msg}>{content}</p>
        </div>
      </div>
    );
  };

  const div = document.createElement('div');
  document.body.appendChild(div);

  ReactDOM.render(renderContent(), div);

  setTimeout(() => {
    document.body.removeChild(div);
  }, timer * 1000);
}

export default {
  success(content, timer) {
    return toast({ type: 'success', content, timer });
  },
  error(content, timer) {
    return toast({ type: 'error', content, timer });
  },
  info(content, timer) {
    return toast({ type: 'info', content, timer });
  },
};
