import React from 'react';
import styles from './CaptchaImg.less';
import { urlTimeStamp } from '../../../utils/utils';

export default class CaptchaImg extends React.PureComponent {
  state = {
    captchaImg: urlTimeStamp('/web/kaptcha'),
  };

  captchaReload = () => {
    this.setState({
      captchaImg: urlTimeStamp('/web/kaptcha'),
    });
  };

  render() {
    const { captchaImg } = this.state;

    return <img className={styles.captcha} src={captchaImg} alt="" onClick={this.captchaReload} />;
  }
}
