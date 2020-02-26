import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, message } from 'antd';
import UserCenter from '../../userCenter';
import FormItem from '../../../components/FormItem';
import request from '../../../utils/request';

class EditPwd extends React.PureComponent {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  state = {
    loading: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const { newPassword, newPassword1, oldPassword } = values;
        if (newPassword === newPassword1) {
          request({
            that: this,
            url: '/web/leaguer/edit/pwd',
            method: 'POST',
            body: { oldPassword, newPassword },
            onSuccess() {
              message.success('密码修改成功');
            },
          });
        }
      }
    });
  };

  render() {
    const { loading } = this.state;
    const { form } = this.props;
    const formProps = { form, inputProps: { type: 'password' } };
    const btnStyle = this.context.isMobile ? { style: { width: '100%' } } : null;

    return (
      <UserCenter>
        <Form>
          <FormItem
            {...formProps}
            label="旧密码"
            fieldName="oldPassword"
          />
          <FormItem
            {...formProps}
            label="新密码"
            fieldName="newPassword"
          />
          <FormItem
            {...formProps}
            label="确认新密码"
            fieldName="newPassword1"
          />
          <FormItem
            readOnly
            isChildren
            label=" "
            colon={false}
          >
            <Button {...btnStyle} loading={loading} type="primary" onClick={this.handleSubmit}>提交</Button>
          </FormItem>
        </Form>
      </UserCenter>
    );
  }
}

export default Form.create()(EditPwd);
