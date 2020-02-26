import React from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import styles from './index.less';

smoothscroll.polyfill();
export default class Tab extends React.Component {
  state = {
    selectedkey: 'description',
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    // hack 写法，为了监听discussion hash
    if (location.hash && location.hash.indexOf('discussion') === 1) {
      setTimeout(() => {
        this.handleSelected('discussion');
      }, 1500);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  getOffsetTop = (key) => {
    const bannerEle = document.getElementById('banner');
    const topPostion = Number(window.getComputedStyle(bannerEle).height.split('px')[0]);
    return (document.getElementById(key).offsetTop) + topPostion + 10;
  }
  handleScroll = () => {
    window.requestAnimationFrame(() => {
      const offsetTop_file = this.getOffsetTop('file');
      const offsetTop_component = this.getOffsetTop('component');
      const offsetTop_log = this.getOffsetTop('log');
      const offsetTop_guide = this.getOffsetTop('guide');
      const offsetTop_discussion = this.getOffsetTop('discussion');
      const offsetTop = scrollY;

      let selected = 'description';
      if ((offsetTop > offsetTop_file) && (offsetTop < offsetTop_component)) {
        selected = 'file';
      } else if ((offsetTop > offsetTop_component) && (offsetTop < offsetTop_log)) {
        selected = 'component';
      } else if ((offsetTop > offsetTop_log) && (offsetTop < offsetTop_guide)) {
        selected = 'log';
      } else if ((offsetTop > offsetTop_guide) && (offsetTop < offsetTop_discussion)) {
        selected = 'guide';
      } else if (offsetTop >= offsetTop_discussion) {
        selected = 'discussion';
      }

      this.setState({
        selectedkey: selected,
      });
    });
  }
  handleSelected = (key, behavior = 'smooth') => {
    const topPosition = this.getOffsetTop(key) + 2;
    // window.scrollTo({
    //   top: topPosition,
    //   behavior: behavior,
    // });
    window.scroll({ top: topPosition, left: 0, behavior: behavior }); // fix 浏览器兼容
  }
  renderTabBarList() {
    const { selectedkey } = this.state;
    const { list } = this.props;
    return list.map((item) => {
      let active = '';
      if (selectedkey === item.key) {
        active = 'active';
      }
      return (
        <div key={item.key} id={`ss${item.key}`} onClick={() => this.handleSelected(item.key)} className={`${styles.tabBar} ${styles[active]}`}>
          {item.text}{item.count && <span>({item.count})</span>}
        </div>
      );
    });
  }
  render() {
    return (
      <div className={styles.tabBox}>
        {this.renderTabBarList()}
      </div>
    );
  }
}
