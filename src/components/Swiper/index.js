import React, { Component, Fragment } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class Swiper extends Component {
  state = {
    selectedImg: '/static/img/default_event.jpg',
    selectedIndex: 1, // 默认选择第一张图
    isPlayRadio: false, // 是否播放视频
    showPlayIcon: false,
    showCloseIcon: false,
    videoUrl: '',
    imgList: [{}],
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.imgList !== nextProps.imgList) {
      this.setState({
        selectedImg: nextProps.imgList[0].imgUrl || '/static/img/default_event.jpg',
        imgList: nextProps.imgList,
        videoUrl: nextProps.videoUrl,
        showPlayIcon: !!nextProps.videoUrl,
      });
    }
  }
  handleSelected = (item, index, videoUrl) => {
    this.setState({
      selectedImg: item,
      selectedIndex: index + 1,
      isPlayRadio: false,
      showPlayIcon: !!videoUrl, // 存在videoUrl 显示播放按钮
      showCloseIcon: false,
    });
  }
  handlePlayRadio = () => {
    this.setState({
      isPlayRadio: true,
      showPlayIcon: false,
      showCloseIcon: true,
    });
  }
  handleCloseRadio = () => {
    this.setState({
      isPlayRadio: false,
      showPlayIcon: true,
      showCloseIcon: false,
    });
  }
  renderImgList() {
    const { imgList, selectedIndex, videoUrl } = this.state;
    return imgList.map((item, index) => {
      let active = '';
      if (selectedIndex === index + 1) {
        active = 'active';
      }
      return (
        /* eslint-disable-next-line */
        <li key={item.imgUrl + index} onMouseEnter={() => this.handleSelected(item.imgUrl, index, videoUrl)} className={`${styles.slideItem} ${styles[active]}`}>
          <img src={item.imgUrl} alt="预览图片" />
        </li>
      );
    });
  }
  render() {
    const {
      selectedImg,
      showPlayIcon,
      isPlayRadio,
      showCloseIcon,
      videoUrl,
      imgList,
    } = this.state;
    const bgColor = this.props.isCourse ? '#283440' : '#fff';
    return (
      <Fragment>
        <div className={styles.container} style={{ backgroundColor: bgColor }}>
          <div className={styles.swiperBox} style={{ backgroundImage: `url(${selectedImg})` }}>
            {/* <img src={selectedImg} alt="" /> */}
            { showPlayIcon && (
              <Icon type="play-circle" onClick={this.handlePlayRadio} className={styles.playRadio} />
            )}
            { showCloseIcon && <Icon type="close-circle" onClick={this.handleCloseRadio} className={styles.closeRadio} />}
            { isPlayRadio && (
              <div className={styles.radioBox}>
                {/* eslint-disable */}
                <video
                  loop="loop"
                  controls="controls"
                  webkit-playsinline="webkit-playsinline"
                  playsInline="playsinline"
                  autoPlay={true}
                  src={videoUrl}
                  type="video/mp4"
                >
                  您的浏览器不支持播放视频
                </video>
              </div>
            )}
          </div>
          {imgList.length > 1 && (
            <ul className={styles.slideBox}>
              {this.renderImgList()}
            </ul>
          )}
        </div>
      </Fragment>
    );
  }
}
