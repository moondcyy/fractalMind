import React from 'react';
import { Form, Button, Row, Col, message, Divider } from 'antd';
import { Link } from 'dva/router';
import FormItem from '../../../components/FormItem';
import request from '../../../utils/request';
import store from '../../../index';
import Logo from '../components/Logo';
import CaptchaImg from '../components/CaptchaImg';
import styles from './index.less';

class Register extends React.PureComponent {
  state = {
    loading: false,
    step: false,
    email: null,
    captcha: null,
  };

  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { step } = this.state;
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { email, captcha, password, password1, authCode } = values;
        if (!step) {
          // 获取邮箱验证码
          this.checkEmail(email, captcha);
        } else if (password === password1) {
          request({
            that: this,
            url: '/web/leaguer/register',
            method: 'POST',
            body: { email, authCode, password },
            onSuccess: () => {
              message.success('注册成功');
              store.dispatch({
                type: 'user/login',
                payload: {
                  account: email,
                  password,
                  captcha: this.state.captcha,
                },
              });
            },
          });
        } else {
          message.error('确认密码不正确');
        }
      }
    });
  };

  // 验证邮箱
  checkEmail = (email, captcha) => {
    request({
      url: `/web/leaguer/validate?email=${email}`,
      onSuccess: () => {
        this.sendAuthCode(email, captcha);
        this.setState({ captcha });
      },
    });
  };

  // 获取验证码
  sendAuthCode = (email, captcha) => {
    request({
      that: this,
      url: `/web/sendAuthCode?email=${email}&captcha=${captcha}`,
      onSuccess: () => {
        this.setState({ step: true, email });
        message.success(`请查看 ${email} 的邮箱`);
      },
    });
  };

  // 返回上一步
  back = () => {
    this.setState({ step: false });
  };

  render() {
    const { loading, step, email } = this.state;
    const { form } = this.props;
    const formProps = { form, cols: [0, 24] };

    return (
      <div className={styles.loginBox} >
        <Logo
          title="注册"
          info="已经有账号？"
          to="/user/login"
          toText="登录"
        />
        <Form>
          {
            !step ? (
              <React.Fragment>
                <FormItem
                  {...formProps}
                  fieldName="email"
                  inputProps={{ placeholder: '请输入邮箱' }}
                  extraRules={{ type: 'email', message: '邮箱地址不正确' }}
                />
                <Row>
                  <Col span={15}>
                    <FormItem
                      {...formProps}
                      fieldName="captcha"
                      inputProps={{ placeholder: '请输入图片验证码' }}
                    />
                  </Col>
                  <Col span={1} />
                  <Col span={8}>
                    <CaptchaImg />
                  </Col>
                </Row>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FormItem
                  {...formProps}
                  fieldName="email"
                  initialValue={email}
                  inputProps={{ disabled: true }}
                />
                <FormItem
                  {...formProps}
                  fieldName="password"
                  inputProps={{ placeholder: '密码', type: 'password' }}
                />
                <FormItem
                  {...formProps}
                  fieldName="password1"
                  inputProps={{ placeholder: '确认密码', type: 'password' }}
                />
                <FormItem
                  {...formProps}
                  fieldName="authCode"
                  inputProps={{ placeholder: '注册验证码' }}
                />
              </React.Fragment>
            )
          }
          {step ? <Button style={{ width: '45%', marginTop: 10 }} onClick={this.back}>上一步</Button> : null}
          <Button
            loading={loading}
            type="primary"
            style={{ width: step ? '45%' : '100%', marginTop: 10, float: step ? 'right' : 'none' }}
            onClick={this.handleSubmit}
          >
            {!step ? '下一步' : '注册'}
          </Button>
        </Form>

        <Divider />
        <Link to="/user/login?platform=wechat">
          <span className={styles.wechart} />
          微信
        </Link>
        <Divider type="vertical" />
        <Link to="/user/login?platform=qq">
          <span className={styles.qq} />
          QQ
        </Link>
        <Divider type="vertical" />
        <Link to="/user/login?platform=ali">
          <span className={styles.ali} />
          支付宝
        </Link>
      </div>
    );
  }
}

export default Form.create()(Register);
