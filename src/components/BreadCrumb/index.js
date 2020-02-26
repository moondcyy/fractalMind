import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb } from 'antd';
import { urlToList } from '../utils/pathTools';
import styles from './index.less';

function getBreadcrumb(breadcrumbNameMap, url) {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
}

export default class BreadCrumb extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  getBreadcrumbProps = () => {
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      routerLocation: this.props.location || this.context.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    };
  };
  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {isLinkable === true ?
            <Link to={url}>{currentBreadcrumb.name}</Link> : <span>{currentBreadcrumb.name}</span>
          }
        </Breadcrumb.Item>
      ) : null;
    });

    return [(
      <Breadcrumb.Item key="home">
        <Link to="/">首页</Link>
      </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);
  }

  render() {
    const { separator = '/' } = this.props;
    return (
      <Breadcrumb separator={separator} className={styles.breadcrumb}>
        {this.conversionBreadcrumbList()}
      </Breadcrumb>
    );
  }
}
