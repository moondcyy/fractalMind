// 用户中心的请求地
import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchMyPartake(params) {
  return request({
    url: `/web/leaguer/partake?${stringify(params)}`,
  });
}
