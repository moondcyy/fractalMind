import React, { Fragment } from 'react';
import { Icon, Tag, Divider, Spin } from 'antd';
import { connect } from 'dva';
import Banner from './components/Banner';
import styles from './ProductDetail.less';
import Swiper from '../../components/Swiper';
import Tab from '../../components/Tabs';
import Descirption from './components/Description';
import Files from './components/Files';
import Logs from './components/Logs';
import Guide from './components/Guide';
import Component from './components/component';
import Discusstion from './components/Discussion';
import request from '../../utils/request';
import { getUrlParameter } from '../../utils/utils';


let ticking = false;
@connect()
export default class ProductDetail extends React.Component {
  state = {
    isFixed: '',
    data: {},
    likesQuantity: '',
    followQuantity: '',
    loading: true,
  }
  componentDidMount() {
    // window.scrollTo({
    //   top: 0,
    // });
    window.scrollTo(0, 0); // fix 浏览器兼容问题
    const productId = getUrlParameter('productId');
    request({
      url: `/web/product/detail/${productId}`,
    }).then((res) => {
      if (res.success && res.data) {
        this.setState({
          data: res.data || {},
          likesQuantity: res.data.likesQuantity,
          followQuantity: res.data.followQuantity,
          loading: false,
        });
        const heiglight = document.getElementById('codeHeilight').getElementsByTagName('pre');
        for (let i = 0; i < heiglight.length; i += 1) {
          /* eslint-disable */
          hljs.highlightBlock(heiglight[i]);
          hljs.lineNumbersBlock(heiglight[i]);
        }
      }
    });
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {

    const top = window.scrollY;
    const bannerEle = document.getElementById('banner');
    const topPostion = Number(window.getComputedStyle(bannerEle).height.split('px')[0]) + 65; // banner 区高度 + 头顶部菜单高度
    if (!ticking && top > topPostion) {
      window.requestAnimationFrame(() => {
        this.setState({
          isFixed: 'isFixed',
        });
      });
      ticking = true;
    }
    if (ticking && top < topPostion) {
      window.requestAnimationFrame(() => {
        this.setState({
          isFixed: '',
        });
      });
      ticking = false;
    }
  }
  handleLike = (data) => {
    this.setState({
      likesQuantity: data,
    });
  }
  handleCollection = (data) => {
    this.setState({
      followQuantity: data,
    });
  }

  render() {
    const { isFixed, data, likesQuantity, followQuantity, loading } = this.state;
    const {
      readQuantity,
      productContent,
      fileCount = '',
      componentCount = '',
      logCount = '',
      commentQuantity = '',
      imgList = [{}],
      videoUrl='',
      productFileResults = [],
      productComponentResults = [],
      productLogResults = [],
      productInstructionResult = {},
      productKeyword,
    } = data;

    const tabBarList = [
      { text: '描述', key: 'description' },
      { text: '指南', key: 'guide' },
      { text: '日志', key: 'log', count: logCount },
      { text: '元件', key: 'component', count: componentCount },
      { text: '文件', key: 'file', count: fileCount },
      { text: '评论', key: 'discussion', count: commentQuantity },
    ];
    const productId = getUrlParameter('productId');
    return (
      <Fragment>
        <Banner
          handleLike={data => this.handleLike(data)}
          collection={data => this.handleCollection(data)}
          info={{ ...data, productId: productId }}
        />
        <Spin spinning={loading}>
          <div className={`${styles.tabContainer} clearFloat`}>
            <div className={styles.containerLeft}>
              <div className={styles.iconBox}>
                <Icon type="eye" className={styles.icon} /><span>{readQuantity || 0}</span>
                <Icon type="star" className={styles.icon} /><span>{followQuantity || 0}</span>
                <Icon type="like" className={styles.icon} /><span>{likesQuantity || 0}</span>
              </div>
            </div>
            <div className={styles.containerRight}>
              <div className={styles[isFixed]}>
                <Tab list={tabBarList} />
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.left}>
              <Swiper imgList={imgList} videoUrl={videoUrl} />

              <div className={styles.tags}>
                <div className={styles.tagTitle}>标签</div>
                {
                  productKeyword && productKeyword.map(item => (item && <Tag key={item}>{item}</Tag>))
                }
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.content} id="codeHeilight">
                <div id="description" style={{ maxWidth: 750 }}>
                  <Descirption productContent={productContent} />
                </div>
                <div id="guide" style={{ maxWidth: 750 }}>
                  <Divider />
                  <Guide content={productInstructionResult.instructionsContent} />
                </div>
                <div id="log">
                  <Divider />
                  <Logs logList={productLogResults} productId={productId} />
                </div>
                <div id="component">
                  <Divider />
                  <Component list={productComponentResults} productId={productId} />
                </div>
                <div id="file">
                  <Divider />
                  <Files fileList={productFileResults} productId={productId} />
                </div>
                <div id="discussion">
                  <Discusstion commentType="product" relationNo={productId} />
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Fragment>
    );
  }
}
