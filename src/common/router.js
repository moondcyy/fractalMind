import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

// 不配authorityCode， 默认有权限
export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    },
    '/searchResult': {
      component: dynamicWrapper(app, ['searchResult'], () => import('../routes/SearchResult')),
    },
    '/book/:query': {
      component: dynamicWrapper(app, ['global'], () => import('../routes/middlePage/BookQuery')),
    },
    '/middle': {
      component: dynamicWrapper(app, ['global'], () => import('../routes/middlePage')),
    },
    '/preview': {
      component: dynamicWrapper(app, [], () => import('../routes/preview')),
    },
    '/competition': {
      component: dynamicWrapper(app, [], () => import('../routes/Competition')),
    },
    '/competition/detail': {
      component: dynamicWrapper(app, [], () => import('../routes/Competition/CompetitionDetail')),
    },
    '/training/course': {
      component: dynamicWrapper(app, [], () => import('../routes/training/Course')),
    },
    '/training/course/detail': {
      component: dynamicWrapper(app, [], () => import('../routes/training/CourseDetail')),
    },
    '/products/home': {
      component: dynamicWrapper(app, [], () => import('../routes/Products/Home')),
    },
    '/products/productDetail': {
      component: dynamicWrapper(app, [], () => import('../routes/Products/ProductDetail')),
    },
    '/products/detailsAll': {
      component: dynamicWrapper(app, [], () => import('../routes/Products/DetailsAll')),
    },
    // 用户信息(查看别人的)
    '/member': {
      component: dynamicWrapper(app, [], () => import('../routes/member')),
    },
    // 报名详情
    '/enroll': {
      component: dynamicWrapper(app, [], () => import('../routes/enroll')),
    },
    // 阶段课程作品列表
    '/stageWorks': {
      component: dynamicWrapper(app, [], () => import('../routes/stageWorks')),
    },
    // 个人中心
    '/userCenter': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter')),
    },
    '/userCenter/perfect': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/userCenter/perfect')),
    },
    '/userCenter/editPwd': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/userCenter/editPwd')),
    },
    '/userCenter/myTrain': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/myTrain')),
    },
    '/userCenter/myContest': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/myContest')),
    },
    '/userCenter/myPartake': {
      component: dynamicWrapper(app, ['myPartake'], () => import('../routes/userCenter/myPartake')),
    },
    '/userCenter/infoCenter': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/infoCenter')),
    },
    '/userCenter/auth': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/auth')),
    },
    '/userCenter/homepage': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/homepage/home')),
    },
    '/userCenter/siteMsg': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/homepage/siteMsg')),
    },
    '/userCenter/siteMsgReply': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/homepage/msgReply')),
    },
    '/userCenter/collect': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/homepage/collect')),
    },
    '/userCenter/fans': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/fans')),
    },
    '/userCenter/draft': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/homepage/draft')),
    },
    '/userCenter/follow': {
      component: dynamicWrapper(app, [], () => import('../routes/userCenter/homepage/follow')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    // 登录
    '/user/login': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/user/login')),
    },
    '/user/wechat/auth': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/user/login/WechartAuth')),
    },
    '/user/ali/auth': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/user/login/AliAuth')),
    },
    '/user/qq/auth': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/user/login/QQAuth')),
    },
    // 注册
    '/user/register': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/user/register')),
    },
    // 重置密码-发送邮件
    '/user/forgetPwd': {
      component: dynamicWrapper(app, [], () => import('../routes/user/forgetPwd')),
    },
    // 重置密码-设置密码
    '/user/resetPwd': {
      component: dynamicWrapper(app, [], () => import('../routes/user/resetPwd')),
    },
    // 403无权限
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },

    // 用户注册不用
    // '/user/register': {
    //   component: dynamicWrapper(app, ['register'], () => import('../routes/user/Register')),
    // },
    // '/user/register-result': {
    //   component: dynamicWrapper(app, [], () => import('../routes/user/RegisterResult')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      // authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
