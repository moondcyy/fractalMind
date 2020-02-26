import React, { Component } from 'react';
import { Button, Popover, Avatar, Icon } from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './Banner.less';
import showPropsConfirm from '../../../components/LoginTip';
import request from '../../../utils/request';

@connect()
export default class Banner extends Component {
  state = {
    userData: {},
    authorItemData: {},
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.info.leaguerNo !== nextProps.info.leaguerNo && !!nextProps.info.leaguerNo) {
      request({
        url: `/web/leaguer/info?leaguerNo=${nextProps.info.leaguerNo}`,
      }).then((res) => {
        if (res.success) {
          this.setState({
            userData: {
              ...res.data,
              isAttention: res.data.follow, // 是否关注
              isfollow: nextProps.info.follow, // 是否收藏
              islike: nextProps.info.likes,
            },
          });
        }
      });
    }
  }
  queryInfo = (leaguerNo) => {
    request({
      url: `/web/leaguer/info?leaguerNo=${leaguerNo}`,
    }).then((res) => {
      if (res.success) {
        this.setState({
          authorItemData: {
            ...res.data,
            isAttention: res.data.follow,
          },
        });
      }
    });
  }
  handleLike = (productId) => {
    const { handleLike } = this.props;
    if (!window.currentUser.token) {
      showPropsConfirm();
      return false;
    } else {
      request({
        url: '/web/product/likes',
        method: 'POST',
        body: {
          relationNo: productId,
        },
      }).then((res) => {
        if (res.success) {
          this.setState(({ userData }) => {
            userData.islike = res.data.relation;
            return userData;
          });
          if (handleLike) {
            handleLike(res.data.count);
          }
        }
      });
    }
  }
  handleCollection = (productId) => {
    const { collection } = this.props;
    if (!window.currentUser.token) {
      showPropsConfirm();
      return false;
    } else {
      request({
        url: '/web/product/follow',
        method: 'POST',
        body: {
          relationNo: productId,
        },
      }).then((res) => {
        if (res.success) {
          this.setState(({ userData }) => {
            userData.isfollow = res.data.relation;
            return userData;
          });
          if (collection) {
            collection(res.data.count);
          }
        }
      });
    }
  }
  // authorItem：多用户list的item 点关注时区分
  handleAttention = (leaguerNo, authorItem) => {
    request({
      url: '/web/leaguer/follow',
      method: 'POST',
      body: {
        relationNo: leaguerNo,
      },
    }).then((res) => {
      if (res.success) {
        this.setState(({ userData, authorItemData }) => {
          if (authorItem) {
            authorItemData.isAttention = res.data.relation;
            return authorItemData;
          }
          userData.isAttention = res.data.relation;
          return userData;
        });
      }
    });
  }
  handleMessage = (leaguerNo) => {
    this.props.dispatch(
      routerRedux.push(`/userCenter/siteMsgReply?sender=${leaguerNo}`)
    );
  }
  handleShowAuthor = (visible, leaguerNo) => {
    if (visible) {
      this.queryInfo(leaguerNo);
    }
  }
  render() {
    const {
      productId, productTitle, productIntroduction, author, authors = [], avatar, imgList = [{}],
    } = this.props.info;
    const {
      userData,
      authorItemData,
    } = this.state;

    const userPop = (data, authorItem) => {
      const {
        nickname,
        // eslint-disable-next-line
        avatar,
        signature,
        productCount,
        fansCount,
        leaguerNo,
        isAttention,
      } = data;

      return (
        <div className={styles.userPop}>
          <Link to={`/member?id=${leaguerNo}`}>
            <Avatar size={64} src={avatar} />
            <h3>{nickname}</h3>
          </Link>
          <p>{signature}</p>
          <div className={styles.userInfo}>
            <div className={styles.works}>
              <div className={styles.text}>作品</div>
              <div className={styles.count}>{productCount}</div>
            </div>
            <div className={styles.fans}>
              <div className={styles.text}>粉丝</div>
              <div className={styles.count}>{fansCount}</div>
            </div>
          </div>
          <Button type="primary" onClick={() => this.handleAttention(leaguerNo, authorItem)}>{ isAttention ? '取消关注' : '关注'}</Button>
          <Button style={{ marginLeft: 10 }} onClick={() => this.handleMessage(leaguerNo)}>私信</Button>
        </div>
      );
    };
    const moreUser = (
      <div>
        {authors.map(item => (
          <div key={item.leaguerNo} style={{ marginBottom: 15, cursor: 'pointer' }}>
            <Popover placement="right" content={userPop(authorItemData, 'authorItem')} onVisibleChange={visible => this.handleShowAuthor(visible, item.leaguerNo)}>
              <Avatar size="small" src={item.avatar} />
              <span className={styles.authorName}>{item.nickname}</span>
            </Popover>
          </div>
        ))}
      </div>
    );
    const imgUrl = imgList[0].imgUrl || 'https://zos.alipayobjects.com/cmsmng/cms/images/iwyqlngt/bce82590-c1b5-40ee-b3a6-c7f52df9bca3.png';
    return (
      <div className={styles.banner} id="banner" style={{ backgroundImage: `url(${imgUrl})` }}>
        {/* eslint-disable-next-line */}
        <div className={styles.mask}></div>
        <div className={styles.container}>
          <Link to="/products/home"><h1>{productTitle}</h1></Link>
          <p className={styles.description}>{productIntroduction}</p>
          <div className={styles.author}>
            <Popover placement="left" content={userPop(userData)}>
              {/* <img src={avatar} className={styles.avatar} alt="" /> */}
              <Avatar src={avatar} style={{ cursor: 'pointer' }} />
            </Popover>
            <span className={styles.authorName}>{author}</span>
            { authors.length > 0 && (
              <Popover placement="bottom" content={moreUser}>
                <Icon type="caret-down" style={{ padding: 5, cursor: 'pointer' }} />
              </Popover>
            )}
          </div>
          <Button type="primary" icon="star" className={styles.collection} onClick={() => this.handleCollection(productId)}>
            {userData.isfollow ? '取消收藏' : '收藏作品'}
          </Button>
          <Button type="primary" icon="like" onClick={() => this.handleLike(productId)}>{userData.islike ? '取消赞' : '点赞'}</Button>
        </div>
      </div>
    );
  }
}
