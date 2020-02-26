import React from 'react';
import { routerRedux } from 'dva/router';
import { Form, Button, message } from 'antd';
import Logo from '../components/Logo';
import FormItem from '../../../components/FormItem';
import { getUrlParameter } from '../../../utils/utils';
import request from '../../../utils/request';
import store from '../../../index';

class ResetPwd extends React.PureComponent {
  state = {
    loading: false,
    token: getUrlParameter('token'),
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { token } = this.state;
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { newPwd, newPwd1 } = values;
        if (newPwd === newPwd1) {
          request({
            that: this,
            url: '/web/leaguer/reset/pwd',
            method: 'POST',
            body: {
              token,
              password: newPwd,
            },
            onSuccess() {
              message.success('密码重置成功');
              store.dispatch(routerRedux.push('/user/login'));
            },
          });
        } else {
          message.error('确认密码错误');
        }
      }
    });
  };

  render() {
    const { loading } = this.state;
    const { form } = this.props;
    const formProps = { form, cols: [0, 24] };

    return (
      <React.Fragment>
        <Logo title="重置密码" info="" to="/user/login" toText="返回登录" />
        <Form>
          <FormItem
            {...formProps}
            fieldName="newPwd"
            inputProps={{ placeholder: '新的密码', type: 'password' }}
          />
          <FormItem
            {...formProps}
            fieldName="newPwd1"
            inputProps={{ placeholder: '确认密码', type: 'password' }}
          />
          <Button loading={loading} type="primary" style={{ width: '100%', marginTop: 10 }} onClick={this.handleSubmit}>确定</Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default Form.create()(ResetPwd);
