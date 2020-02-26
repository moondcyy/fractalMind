import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Layout, Radio, Row, Col } from 'antd';
import LoginLink from '../../components/LoginLink';
import { urlTimeStamp } from '../../utils/utils';
import PictureUploadWithCropper from '../../components/business/PictureUploadWithCropper';
import styles from './index.less';

class userCenter extends React.PureComponent {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  state = {
    menuData: {
      homepage: '我的主页',
      myTrain: '我的课程',
      myContest: '我的竞赛',
      infoCenter: '我的通知',
      auth: '报名认证',
    },
  };

  changeMobileMenu = (e) => {
    e.preventDefault();
    this.props.dispatch(routerRedux.push(`/userCenter/${e.target.value}`));
  };

  renderMenu = (currentUser) => {
    const { menuData } = this.state;
    const { pathname } = window.location;
    const { fansCount = 0, productCount = 0 } = window.currentUser || {};

    return (
      <React.Fragment>
        <div className={styles.information}>
          <PictureUploadWithCropper
            img={currentUser.avatar}
            callback={() => {
              const { dispatch } = this.props;

              dispatch({
                type: 'user/fetchCurrentUser',
              });
            }}
          />
          <div className={styles.userName}>{currentUser.nickname}</div>
          <div className={styles.introduce}>{currentUser.signature || '暂无'}</div>
          <Row className={styles.data_box}>
            <div className={styles.data_divider} />
            <Col span={12}>
              <p className={styles.title}>作品</p>
              <p className={styles.title_num}>{productCount}</p>
              <LoginLink to="/web/product/view" isInside={false}>
                <div className={styles.btn_primary}>发布作品</div>
              </LoginLink>
            </Col>
            <Col span={12}>
              <Link to="/userCenter/fans">
                <p className={styles.title}>粉丝</p>
                <p className={styles.title_num}>{fansCount}</p>
              </Link>
              <Link to="/userCenter/draft">
                <div className={styles.btn}>草稿箱</div>
              </Link>
            </Col>
          </Row>
        </div>
        <div className={styles.menu}>
          {Object.keys(menuData).map((key) => {
            return (
              <div key={key} className={`${styles.menu_item} ${pathname.includes(key) ? styles.menu_active : ''}`}>
                <Link to={`/userCenter/${key}`}>{menuData[key]}</Link>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  };

  renderMobileMenu = (currentUser) => {
    const { menuData } = this.state;
    const menuMobileActive = location.pathname.split('/')[2] || 'perfect';

    return (
      <React.Fragment>
        <div className={styles.header}>
          <div className={styles.left}>
            <img src={urlTimeStamp(currentUser.avatar)} alt="" />
          </div>
          <div className={styles.left}>
            <h2>{currentUser.nickname ? `Hello，${currentUser.nickname}` : null}</h2>
            <p>{currentUser.signature}</p>
          </div>
        </div>
        <div className={styles.menu_mobile}>
          <Radio.Group value={menuMobileActive} onChange={this.changeMobileMenu.bind(this)}>
            {Object.keys(menuData).map(key => (
              <Radio.Button key={key} value={key}>{menuData[key]}</Radio.Button>
            ))}
          </Radio.Group>
        </div>
      </React.Fragment>
    );
  };

  renderSider = () => {
    const { currentUser } = this.props;
    const { isMobile } = this.context;

    if (isMobile) {
      return this.renderMobileMenu(currentUser);
    } else {
      return (
        <Layout.Sider theme="light" width="280" style={{ backgroundColor: '#f7f7f7' }}>
          {this.renderMenu(currentUser)}
        </Layout.Sider>
      );
    }
  };

  render() {
    const { isMobile } = this.context;
    const lcStyle = !isMobile ? { style: { marginLeft: 20 } } : null;

    return (
      <React.Fragment>
        <Layout className={styles.layout} >
          {this.renderSider()}
          <Layout.Content {...lcStyle}>
            {this.props.children}
          </Layout.Content>
        </Layout>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { currentUser } = state.user;
  return { currentUser };
}

export default connect(mapStateToProps)(userCenter);
