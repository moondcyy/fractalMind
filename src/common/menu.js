
import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '首页',
    path: 'http://www.fractalmind.cn',
    target: '_top',
  }, {
    name: '关于我们',
    path: 'http://www.fractalmind.cn/col.jsp?id=105',
    target: '_top',
  }, {
    name: '竞赛',
    path: '/competition',
    // path: 'http://www.fractalmind.cn/col.jsp?id=116',
    // target: '_top',
  }, {
    name: '课程',
    path: '/training/course',
  }, {
    name: '作品',
    path: '/products/home',
  },
];

function formatter(authorityList, data, parentPath = '') {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }

    // const hasAuthority = item.authorityCode ? authorityList.indexOf(item.authorityCode) > -1 : true;

    const result = {
      ...item,
      path,
      // hideInMenu: !hasAuthority, // 没有权限则加隐藏menu
    };
    if (item.children) {
      // result.children = formatter(authorityList, item.children, `${parentPath}${item.path}`);
    }

    return result;
  });
}


export const getMenuData = (authorityList = []) => formatter(authorityList, menuData);
