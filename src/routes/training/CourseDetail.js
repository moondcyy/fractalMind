import React, { Component, Fragment } from 'react';
import { Icon, Button, Tabs, message, Tooltip, Modal } from 'antd';
// import fetch from 'dva/fetch';
// import Slider from 'react-slick';
import Swiper from 'components/Swiper';
import styles from './CourseDetail.less';
import SignList from './components/SignList';
// import SignModalForm from './components/SignModal';
import showPropsConfirm from '../../components/LoginTip';
import Discusstion from '../Products/components/Discussion';
import { getUrlParameter } from '../../utils/utils';
import request from '../../utils/request';
import CheckStageBtn from '../../components/business/CourseCard/CheckStageBtn';

const TabPane = Tabs.TabPane;
export default class CourseDetail extends Component {
  state = {
    visible: false,
    detailData: {},
    relationData: {},
    ticketNo: '',
    signInfoContent: '',
  }
  componentDidMount() {
    this.queryDetail();
  }
  queryDetail = () => {
    const courseId = getUrlParameter('courseId');
    this.courseId = courseId;
    request({
      url: `/web/train/detail/${courseId}`,
    }).then((res) => {
      if (!res.success) { return };
      let ticketNo = '';
      const { ticketList } = res.data || {};
      if (ticketList && ticketList.length === 1) {
        ticketNo = ticketList[0].ticketNo;
      }
      this.setState({
        ticketNo,
        detailData: res.data || {},
        relationData: {
          isfollow: res.data.follow, // 是否收藏
          islike: res.data.likes, // 是否点赞
        },
      });
      if (res.data.eventContent) {
        const heiglight = document.getElementById('codeHeiglight').getElementsByTagName('pre');
        for (let i = 0; i < heiglight.length; i += 1) {
          /* eslint-disable */
          hljs.highlightBlock(heiglight[i]);
          hljs.lineNumbersBlock(heiglight[i]);
        }
      }
    });

    // request({
    //   url: `/web/train/detail/${courseId}`
    // }).then((res) => {
    //   if (!res.success) { return };
    //   this.setState({
    //
    //   });
    // });
  }
  handleLike = (eventNo) => {
    if (!window.currentUser.token) {
      showPropsConfirm();
      return ;
    } else {
      request({
        url: '/web/train/likes',
        method: 'POST',
        body: {
          relationNo: eventNo,
        },
      }).then((res) => {
        if (res.success) {
          this.setState(({ relationData, detailData}) => {
            relationData.islike = res.data.relation;
            detailData.likesQuantity = res.data.count;
            return {relationData, detailData};
          });
        }
      });
    }
  }
  handleCollection = (eventNo) => {
    if (!window.currentUser.token) {
      showPropsConfirm();
      return ;
    } else {
      request({
        url: '/web/train/follow',
        method: 'POST',
        body: {
          relationNo: eventNo,
        },
      }).then((res) => {
        if (res.success) {
          this.setState(({ relationData, detailData}) => {
            relationData.isfollow = res.data.relation;
            detailData.followQuantity = res.data.count;
            return {relationData, detailData};
          });
        }
      });
    }
  }

  // showModal = (content) => {
  //   if (!window.currentUser.token) {
  //     message.error('请登录后再报名');
  //   } else {
  //     this.setState({ visible: true });
  //   }
  // }
  handleSignUp = () => {
    if (!window.currentUser.token) {
      showPropsConfirm();
      return false;
    }
    const { ticketNo } = this.state;
    const eventNo = this.courseId;
    const thisObj = this;
    Modal.confirm({
      title: '您确认要进行报名操作？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        request({
          url: '/web/enroll/pre',
          method: 'POST',
          body: {
            ticketNo,
            eventNo,
          }
        }).then(res => {
          if (res.data) {
            if (res.data.show === 1) {
              this.setState({
                visible: true,
                signInfoContent: res.data.html
              });
            } else {
              message.success(res.message);
              thisObj.queryDetail();
              if(res.data.show === 2){
                window.location.href = res.data.payUrl;
              }
            }
          }
        });
      },
    });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleSubmit = () => {
    const { ticketNo } = this.state;
    const eventNo = this.courseId;
    request({
      url: '/web/enroll',
      method: 'POST',
      body: {
        ticketNo,
        eventNo,
      }
    }).then(res => {
      this.setState({
        visible: false,
      });
      this.queryDetail();
      message.success('报名成功');
      this.confirm(res);
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  // <div>{`您已成功报名课程，等待后台人员进行审核，可以到个人中心[ 我的参与 ]查看报名情况。`}</div>
  confirm(res) {
    Modal.info({
      title: '报名成功',
      content: <div>{res.data.msg}</div>,
      okText: '知道了',
      onOk: () => {
        if(res.data.show === 2){
          window.location.href = res.data.payUrl;
        }
      }
    });
  }
  renderTickets() {
    const { ticketList = [], ticketSignCode, ticketSign } = this.state.detailData;
    if (ticketSignCode === 0) {
      return (<p>{ticketSign}</p>);
    }
    if (ticketList.length === 1) {
      var test = ticketList[0].ticketPrice + " 元 ";
      if (ticketList[0].ticketDes != null && ticketList[0].ticketDes != "") {
        test += " 【"+ticketList[0].ticketDes+"】";
      }
      return (<p>{`${test}`}</p>);
    }
    // else dosomething
  }
  enrollButton() {
    const { enrollStatusCode, enrollStatus, btnName, paySign, eventNo } = this.state.detailData;
    if (paySign != 0){
      if (paySign === 1) {
        return (
          <Fragment>
            <Button type="primary" className={styles.btn} onClick={() => this.goPay(eventNo)}>{btnName}</Button>
            &nbsp;
            <CheckStageBtn eventNo={eventNo} />
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <Button type="primary" className={styles.btn} disabled>{btnName}</Button>
            &nbsp;
            <CheckStageBtn eventNo={eventNo} />
          </Fragment>
        );
      }
    }else{
      if (enrollStatusCode === 1 ){
        return (<Button type="primary" className={styles.btn} onClick={() => this.handleSignUp()}>立即报名</Button>);
      }else{
        return (
          <Fragment>
            <Button type="primary" disabled className={styles.btn}>立即报名</Button>
            <Tooltip placement="rightTop" title={enrollStatus}>
              <Icon type="exclamation-circle" theme="outlined" style={{ fontSize: 18, marginLeft: 20, color: '#1890ff' }} />
            </Tooltip>
          </Fragment>
        );
      }
    }
  }
  goPay = (eventNo) => {
    const { token } = window.currentUser || {};
    if (!token) {
      showPropsConfirm();
      return ;
    }
    window.location.href = `/admin/open/event/pay?eventNo=${eventNo}&token=${token}`;
  }
  render() {
    const { visible, detailData, signInfoContent, relationData } = this.state;
    const {
      imgList = [{}],
      additiveList = [],
      eventTitle,
      startDate,
      endDate,
      // enrollNum,
      eventIntroduction,
      eventStage,
      eventContent,
      enrollStatusCode,
      enrollStatus,
      keeperName,
      keeperContact,
      videoUrl,
      eventNo,
      readQuantity,
      followQuantity,
      likesQuantity,
    } = detailData;
    const settings = {
      dots: true,
      fade: true,
      autoplay: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <Fragment>
        <div className={styles.courseInfoBox}>
          <div className={styles.content}>
            <Swiper imgList={imgList} videoUrl={videoUrl} isCourse />

            <div className={styles.infoBox}>
              <h3 className={styles.title}>{eventTitle}</h3>
              <div className={styles.courseInfo}>
                <Icon type="project" theme="outlined" className={styles.icon} />
                <p>{eventIntroduction}</p>
              </div>
              <div className={styles.courseInfo}>
                <Icon type="clock-circle" theme="outlined" className={styles.icon} />
                <p>{startDate} ~ {endDate}</p>
              </div>
              <div className={styles.courseInfo}>
                <Icon type="bar-chart" theme="outlined" className={styles.icon} />
                <p>{eventStage}</p>
              </div>
              <div className={styles.courseInfo}>
                <Icon type="money-collect" theme="outlined" className={styles.icon} />
                { this.renderTickets() }
              </div>
              <div className={styles.courseInfo}>
                <Icon type="user" theme="outlined" className={styles.icon} />
                <p>{keeperName} &nbsp; {keeperContact}</p>
              </div>
              <div className={styles.quantityBox}>
                <Icon type="eye" className={styles.icon} /><span>{readQuantity || 0}</span>
                <Icon type="star" className={styles.icon} /><span>{followQuantity || 0}</span>
                <Icon type="like" className={styles.icon} /><span>{likesQuantity || 0}</span>
              </div>
              <Button type="primary" className={styles.btn} onClick={() => this.handleCollection(eventNo)}>
              {relationData.isfollow ? <Icon type="star" theme="filled" className={styles.icon} /> : <Icon type="star" className={styles.icon} />}
              </Button>
              <Button type="primary" className={styles.btn} onClick={() => this.handleLike(eventNo)}>{
                relationData.islike ? <Icon type="like" theme="filled" className={styles.icon} /> : <Icon type="like" className={styles.icon} />}
              </Button>
              { this.enrollButton()}

            </div>
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.content}>
            <Tabs style={{ width: '100%', overflow: 'visible' }}>
              <TabPane tab={this.props.type === "CONTEST" ? "竞赛介绍" : "课程介绍"} key="courseIntroduce">
                {/* eslint-disable-next-line */}
                { eventContent ? <div id="codeHeiglight" dangerouslySetInnerHTML={{ __html: eventContent }}></div> :
                <div className={styles.noComment}>暂无数据</div>
                }
              </TabPane>
              <TabPane tab="报名情况" key="signUp">
                {/* <div className={styles.signCount}><Icon type="user" theme="outlined" /><span>报名人数{enrollNum && `${enrollNum}`}</span></div> */}
                <SignList />
              </TabPane>
              {
                additiveList && additiveList.map(item => (
                  <TabPane tab={item.additiveTitle} key={item.id}>
                    <div dangerouslySetInnerHTML={{ __html: item.additiveContent }} style={{ overflow: 'hidden'}} />
                  </TabPane>
                ))
              }
              <TabPane tab="评论" key="comment">
                <Discusstion commentType="train" relationNo={this.courseId} />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <Modal
          title="报名信息"
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <div dangerouslySetInnerHTML={{ __html: signInfoContent }} />
        </Modal>
        {/* <SignModalForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSubmit}
        /> */}
      </Fragment>
    );
  }
}
