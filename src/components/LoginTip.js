import { Modal } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const confirm = Modal.confirm;
export default function showPropsConfirm() {
  const redirectLogin = () => {
    const redirectUrl = encodeURIComponent(window.location.href);
    store.dispatch(routerRedux.push(`/user/login?goto=${redirectUrl}`));
  };
  confirm({
    title: '您还没有登录',
    content: '请登录后再进行该操作。',
    cancelText: '取消',
    okText: '登录',
    onOk() {
      redirectLogin();
    },
  });
}
