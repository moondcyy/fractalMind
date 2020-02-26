import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
class SignModal extends React.Component {
  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const { leaguerName = '', leaguerEmail = '', leaguerIdcard = '', leaguerPhone = '' } = window.currentUser || {};
    return (
      <Modal
        visible={visible}
        title="立即报名"
        okText="提交"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('realName', {
              initialValue: leaguerName,
              rules: [{ required: true, message: '请输入姓名!' }],
            })(
              <Input maxLength={12} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="身份证">
            {getFieldDecorator('idCard', {
              initialValue: leaguerIdcard,
              rules: [{ required: true, pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            {getFieldDecorator('phone', {
              initialValue: leaguerPhone,
              rules: [{ required: true, pattern: /^((1[3-8][0-9])\d{8})$/, message: '请输入正确格式的手机号' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: leaguerEmail,
              rules: [
                { required: true, type: 'email', message: '请输入正确的邮箱!' },
              ],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const SignModalForm = Form.create()(SignModal);
export default SignModalForm;
