import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import store from '../index';

message.config({ maxCount: 1 });

function showError(data) {
  if (data.code === 700) {
    if (data.message === '请登录后进行操作') {
      message.error(data.message || '系统异常');
      const redirectUrl = encodeURIComponent(window.location.href);
      store.dispatch(routerRedux.push(`/user/login?goto=${redirectUrl}`));
      // store.dispatch(routerRedux.push('/training/course'));
    }
  } else {
    message.error(data.message || '系统异常');
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;

  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 * isError：true 时可自定义错误
 */
export default function request({ url, method = 'GET', headers, body, onStart, onSuccess, onError, that }) {
  // const defaultOptions = {
  //   credentials: 'include', // 请求凭证，会发送类似 cookie 等信息
  // };
  const newOptions = { credentials: 'include', method, body, headers };
  const methodArr = ['POST', 'PUT'];
  if (methodArr.indexOf(method) > -1) {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  // eslint-disable-next-line
  onStart && onStart();
  // eslint-disable-next-line
  that && that.setState({ loading: true }); // 如果有 that 对象，则处理 loading 数据

  // 添加时间戳，解决 ie 下同一个 GET 请求不发送的问题
  if (method === 'GET' && url) {
    const urlArr = url.split('?');
    const t = `t=${new Date().getTime()}`; // 时间戳
    if (urlArr.length > 1) {
      if (urlArr[1].length > 0) {
        url = `${url}&${t}`;
      } else {
        url = `${url}${t}`;
      }
    } else {
      url = `${url}?${t}`;
    }
  }

  // adminservice 作为前后端公共参数使用，前后端根据这个参数来匹配到同一个服务器上，消除跨域问题
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .then((data) => {
      // 只要存在一个，就表示是组件的请求方式
      if (onStart || onSuccess || onError) {
        // eslint-disable-next-line
        that && that.setState({ loading: false });
        if (data.success) return onSuccess && onSuccess(data);
        showError(data);
        return onError && onError(data);
      }
      // 都不存在，适合 services 的请求方式
      if (data && !data.success) {
        showError(data);
      }
      return data;
    })
    .catch((error) => {
      if ('stack' in error && 'message' in error) {
        message.error(error.message || `请求错误: ${url}`);
      }

      return error;
    });
}
