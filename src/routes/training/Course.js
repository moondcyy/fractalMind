import React, { Component, Fragment } from 'react';
// import { Link } from 'dva/router';
// import fetch from 'dva/fetch';
import { Pagination, message, Spin } from 'antd';
import CourseItem from './components/CourseItem';
import NoData from 'components/NoData';
import styles from './Course.less';
import request from '../../utils/request';

export default class Course extends Component {
  state = {
    active: '',
    loading: true,
    courseData: {},
  }
  componentDidMount() {
    this.queryCourseList({ current: 1 });
  }
  queryCourseList({ condition = '', current = 1, limit = 12 }) {
    this.setState({ loading: true });
    request({
      url: `/web/train/page?condition=${condition}&current=${current}&limit=${limit}`,
    }).then(res => {
      this.setState({
        courseData: res,
        loading: false,
      });
    });

  }
  handlePagination = (current) => {
    this.queryCourseList({ current });
  }
  handleChangeType = (e, type) => {
    // queryData
    this.setState({
      active: type,
    });
    this.queryCourseList({ condition: type, current: 1 });
  }
  renderCourseType() {
    const { courseData, active } = this.state;
    const { stage = [] } = courseData;

    const arr = [{ code: '', name: '全部' }];
    const courseTypeList = arr.concat(stage);
    return courseTypeList.map((item) => {
      let isActive = '';
      if (active === item.code) {
        isActive = 'active';
      }
      return (
        <span
          className={`${styles.type} ${styles[isActive]}`}
          key={item.code}
          data-type={item.code}
          onClick={e => this.handleChangeType(e, item.code)}
        >
          {item.name}{item.count && `(${item.count})`}
        </span>
      );
    });
  }
  render() {
    const { rows = [], total = 0, current = 1 } = this.state.courseData;
    const totalSize = parseInt(total, 10);

    return (
      <Fragment>
        <div className={styles.banner}><img src="http://16045180.s61i.faiusr.com/4/AD0I-KjTBxAEGAAgx9a70wUotLai-AMwgA843gI.png" alt="" /></div>
        <div className={styles.course}>
          <div className={styles.courseType}>
            <div className={styles.label} >课程类别</div>
            <div className={styles.typeContent}>{this.renderCourseType()}</div>
          </div>
          <Spin spinning={this.state.loading}>
            {
              rows.map(item => (
                <CourseItem key={item.id} info={item} />
              ))
            }
            { rows.length === 0 && <NoData /> }
          </Spin>
          { totalSize > 12 && (
            <Pagination
              showQuickJumper
              pageSize={12}
              total={parseInt(total, 10)}
              current={current}
              onChange={this.handlePagination}
              className={styles.pagination}
            />
          )}
        </div>
      </Fragment>
    );
  }
}
