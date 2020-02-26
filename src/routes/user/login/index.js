import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Button, Row, Col, Divider } from 'antd';
import { enquireScreen } from 'enquire-js';
import FormItem from '../../../components/FormItem';
import Logo from '../components/Logo';
import CaptchaImg from '../components/CaptchaImg';
import SocialLogin from './SocialLogin';
import styles from './index.less';


class Login extends React.PureComponent {
  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/login',
          payload: values,
        });
      }
    });
  };

  socialEnble() {
    const t = new Date().getTime();
    let isMobile;
    enquireScreen(b => isMobile = b);
    if (isMobile) {
      return (
        <div>
          <Divider />
          <Link to={`/user/login?platform=qq&t=${t}`}>
            <span className={styles.qq} />
            QQ
          </Link>
        </div>);
    } else {
      return (
        <div>
          <Divider />
          <Link to={`/user/login?platform=qq&t=${t}`}>
            <span className={styles.qq} />
            QQ
          </Link>
          <Divider type="vertical" />
          <Link to={`/user/login?platform=wechat&t=${t}`}>
            <span className={styles.wechart} />
            微信
          </Link>
          <Divider type="vertical" />
          <Link to={`/user/login?platform=ali&t=${t}`}>
            <span className={styles.ali} />
            支付宝
          </Link>
        </div>
      );
    }
  }
  render() {
    const { form, loading } = this.props;
    const formProps = { form, cols: [0, 24] };
    const isSocial = location.search.includes('platform');
    return (
      <div>
        {
          isSocial && (<SocialLogin />)
        }
        {
          !isSocial && (
          <div className={styles.loginBox} >
            <Logo />
            <Form>
              <FormItem
                {...formProps}
                fieldName="account"
                inputProps={{ placeholder: '请输入账号' }}
              />
              <FormItem
                {...formProps}
                fieldName="password"
                inputProps={{ placeholder: '请输入密码', type: 'password' }}
              />
              <Row>
                <Col span={15}>
                  <FormItem
                    {...formProps}
                    fieldName="captcha"
                    inputProps={{ placeholder: '请输入验证码' }}
                  />
                </Col>
                <Col span={1} />
                <Col span={8}>
                  <CaptchaImg />
                </Col>
              </Row>
              <div className={styles.clear_float}><Link className={styles.float_right} to="/user/forgetPwd">忘记密码?</Link></div>
              <Button loading={loading} type="primary" style={{ width: '100%', marginTop: 10 }} onClick={this.handleSubmit}>登录</Button>

              { this.socialEnble() }
            </Form>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { loading: state.loading.models.user };
}

export default connect(mapStateToProps)(Form.create()(Login));
