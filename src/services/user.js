import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchLogin(params) {
  return request({
    url: '/web/leaguer/login',
    method: 'POST',
    body: params,
  });
}

export async function fetchCurrentUser(params) {
  return request({
    url: `/web/leaguer?${stringify(params)}`,
  });
}

export async function fetchLogout() {
  return request({
    url: '/web/leaguer/logout',
  });
}

