import React from 'react';
import { Form, Button, message, Row, Col } from 'antd';
import Logo from '../components/Logo';
import FormItem from '../../../components/FormItem';
import request from '../../../utils/request';
import CaptchaImg from '../components/CaptchaImg';

class ForgetPwd extends React.PureComponent {
  state = {
    loading: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        request({
          that: this,
          url: `/web/sendResetUrl?email=${values.email}&captcha=${values.captcha}`,
          onSuccess() {
            message.success('邮件发送成功，请前往邮箱进行查看');
          },
        });
      }
    });
  };

  render() {
    const { loading } = this.state;
    const { form } = this.props;
    const formProps = { form, cols: [0, 24] };

    return (
      <React.Fragment>
        <Logo title="找回密码" info="" to="/user/login" toText="返回登录" />
        <Form>
          <FormItem
            {...formProps}
            fieldName="email"
            inputProps={{ placeholder: '请填写邮箱' }}
            extraRules={{ type: 'email', message: '邮箱地址不正确' }}
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
          <Button loading={loading} type="primary" style={{ width: '100%', marginTop: 10 }} onClick={this.handleSubmit}>发送</Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default Form.create()(ForgetPwd);
