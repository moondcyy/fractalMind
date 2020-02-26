import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { enquireScreen } from 'enquire-js';
import { Layout, Icon, Modal, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, routerRedux, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import GlobalHeader from '../components/GlobalHeader';
import SliderMenu from '../components/SliderMenu';
import GlobalFooter from '../components/GlobalFooter';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.png';

const { Content, Header, Footer } = Layout;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

// 判断是否为移动端
let isMobile;
enquireScreen(b => isMobile = b);

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
    isMobile: PropTypes.bool,
  }
  state = {
    collapsed: true,
  }
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      isMobile,
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/fetchCurrentUser',
      /*
      * 当用户信息获取成功后，在基于 currentUser 对象的情况下，添加各个场景的判断。
      * 当 currentUser = false 时，表示未登录
      * */
      callback: (currentUser) => {
        const { pathname } = location;
        const PERFECT = '/userCenter/perfect';

        if (currentUser) {
          const { full } = currentUser;

          // 当 "账号、身份证、邮箱" 其中一个未完善时，且不在完善信息页面，展示提示信息
          if ((!full) && pathname !== PERFECT) {
            Modal.confirm({
              title: '您的基础信息未完善，是否前往完善？',
              okText: '前往',
              cancelText: '不去',
              onOk: () => {
                dispatch({
                  type: 'global/goto',
                  payload: PERFECT,
                });
              },
            });
          }
        } else {
          // 当用户未登录时，以下数组中的页面不允许直接访问，且重定向至登录页
          const noLogin = [
            PERFECT, // 完善信息页面
          ];
          if (noLogin.includes(pathname)) {
            dispatch({
              type: 'global/goto',
              payload: '/user/login',
            });
            message.error('请登录后进行操作');
          }
        }
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({
        collapsed: true,
      });
    }
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '奇异思维';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 奇异思维`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return '/products/home';
    }
    return redirect;
  };

  handleLogout = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'user/logout',
      });
    }
  }
  handleCollapse = (isCollapsed) => {
    this.setState({
      collapsed: isCollapsed,
    });
  }
  headerSearch = (value='') => {
    if (value.trim()) {
      // location.href= `/searchResult?keyword=${value}`;
      this.props.dispatch(routerRedux.replace(`/searchResult?keyword=${value}`));
    }
  }
  render() {
    const {
      currentUser, routerData, match, location,
    } = this.props;
    const { collapsed } = this.state;
    const authorityList = currentUser.authMenus || [];

    const bashRedirect = this.getBashRedirect();
    // 嵌套路由同级展示时将路由统一处理
    const nestedRoute = [
      '/competition/detail',
      '/training/course/detail',
      '/userCenter/perfect',
      '/userCenter/myPartake',
      '/userCenter/infoCenter',
      '/userCenter/editPwd',
      '/userCenter/auth',
      '/userCenter/homepage',
      '/userCenter/myTrain',
      '/userCenter/myContest',
      '/userCenter/fans',
      '/userCenter/siteMsg',
      '/userCenter/siteMsgReply',
      '/userCenter/collect',
      '/userCenter/draft',
      '/userCenter/follow',
    ];
    const layout = (
      <Layout>
        {isMobile && (
          <SliderMenu
            logo={logo}
            collapsed={collapsed}
            onCollapse={isCollapsed => this.handleCollapse(isCollapsed)}
            menuData={getMenuData(authorityList)}
            location={location}
          />
        )}
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <GlobalHeader
            logo={logo}
            mode="horizontal"
            isMobile={isMobile}
            currentUser={currentUser}
            menuData={getMenuData(authorityList)}
            location={location}
            headerSearch = {value => this.headerSearch(value)}
            onCollapse={isCollapsed => this.handleCollapse(isCollapsed)}
            onLogoutClick={this.handleLogout}
          />
        </Header>
        <Content style={{ height: '100%' }}>
          <Switch>
            {
              nestedRoute.map(path =>
                /* eslint-disable */
                <Route
                  exact={routerData[path].exact}
                  key={path}
                  path={path}
                  component={routerData[path].component}
                />
              )
            }

            {
              getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    redirectPath="/exception/403"
                  />
                )

              )
            }
            <Redirect exact from="/" to={bashRedirect} />
            <Route render={NotFound} />
          </Switch>
        </Content>
        <Footer style={{ padding: 0 }}>
          <GlobalFooter
            copyright={
              <Fragment>
                <Icon type="copyright" /> 杭州合学教育科技有限公司 浙ICP备17054794号
              </Fragment>
            }
          />
        </Footer>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
}))(BasicLayout);

