import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Button, Select, message, Alert } from 'antd';
import UserCenter from '../../userCenter';
import FormItem from '../../../components/FormItem';
import provinceData from '../../../actions/province';
import request from '../../../utils/request';
import styles from './index.less';

@Form.create()
// @connect(({ user }) => {
//   const { currentUser } = user;
//   return { currentUser };
// })
@connect()
export default class Perfect extends React.Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  state = {
    currentUser: {},
    citys: null,
    loading: false,
  };
  componentDidMount() {
    this.queryFullInfo();
  }
  // componentDidMount() {}
  getCitys = (value) => {
    return value ? (provinceData.filter(item => (item.label.includes(value))))[0].children : [];
  };

  queryFullInfo = () => {
    request({
      url: '/web/leaguer/full',
    }).then((res) => {
      if (res.success) {
        this.setState({
          currentUser: res.data,
        });
      }
    });
  };

  // 获取省份中的城市信息，并重置表单中的城市数据
  changeProvince = (value) => {
    if (value) {
      const citys = this.getCitys(value);

      this.setState({ citys });
      this.props.form.setFieldsValue({ city: null });
    } else {
      this.setState({ citys: null });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { currentUser } = this.state;
    const { form, dispatch } = this.props;
    const { token } = currentUser;
    form.validateFields((err, values) => {
      if (!err) {
        request({
          that: this,
          url: '/web/leaguer/repair',
          method: 'POST',
          body: {
            ...values,
            token,
          },
          onSuccess() {
            message.success('信息更新成功');
            dispatch({
              type: 'user/fetchCurrentUser',
            });
          },
        });
      }
    });
  };

  renderTip = () => {
    const { search } = window.location;

    if (search !== '') {
      return <Alert style={{ marginBottom: 20 }} message="请完善个人信息" type="warning" showIcon />;
    }
  };

  render() {
    const { citys, loading, currentUser } = this.state;
    const { form = {} } = this.props;
    const btnStyle = this.context.isMobile ? { style: { width: '100%' } } : null;
    const formProps = { form, cols: [4, 6] };

    return (
      <UserCenter>
        {this.renderTip()}
        <Form className={styles.form}>
          <FormItem
            {...formProps}
            label="账号"
            fieldName="account"
            inputProps={{ disabled: !!currentUser.account }}
            initialValue={currentUser.account}
          />
          <FormItem
            {...formProps}
            label="姓名"
            fieldName="leaguerName"
            initialValue={currentUser.leaguerName}
          />
          <FormItem
            {...formProps}
            label="昵称"
            fieldName="nickname"
            inputProps={{ maxLength: 10 }}
            initialValue={currentUser.nickname}
          />
          <FormItem
            {...formProps}
            label="个性签名"
            fieldName="signature"
            required={false}
            initialValue={currentUser.signature}
            inputProps={{ maxLength: 25 }}
          />
          <FormItem
            {...formProps}
            label="身份证号"
            fieldName="leaguerIdcard"
            initialValue={currentUser.leaguerIdcard}
            extraRules={{ required: true, pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号!' }}
          />
          <FormItem
            {...formProps}
            label="手机号"
            fieldName="leaguerPhone"
            initialValue={currentUser.leaguerPhone}
            extraRules={{ required: true, pattern: /^((1[3-8][0-9])\d{8})$/, message: '请输入正确格式的手机号' }}
          />
          <FormItem
            {...formProps}
            label="单位/学校"
            fieldName="leaguerDuty"
            initialValue={currentUser.leaguerDuty}
          />
          <FormItem
            {...formProps}
            label="联系地址"
            fieldName="province"
            required={false}
            initialValue={currentUser.province}
          >
            <Select placeholder="请选择省份" onChange={this.changeProvince} allowClear>
              {provinceData.map(item => <Select.Option key={item.label}>{item.label}</Select.Option>)}
            </Select>
          </FormItem>
          <FormItem
            {...formProps}
            label=" "
            fieldName="city"
            colon={false}
            required={false}
            initialValue={currentUser.city}
          >
            <Select placeholder="请选择城市" allowClear>
              {
                (citys || this.getCitys(currentUser.province))
                  .map(item => <Select.Option key={item.label}>{item.label}</Select.Option>)
              }
            </Select>
          </FormItem>
          <FormItem
            {...formProps}
            label=" "
            colon={false}
            required={false}
            fieldName="leaguerAdress"
            inputProps={{ placeholder: '请填写具体地址' }}
            initialValue={currentUser.leaguerAdress}
          />
          <FormItem
            {...formProps}
            label="邮箱"
            fieldName="leaguerEmail"
            initialValue={currentUser.leaguerEmail}
            inputProps={{ disabled: !!currentUser.leaguerEmail }}
          />
          <FormItem
            {...formProps}
            label="QQ"
            fieldName="leaguerQq"
            required={false}
            initialValue={currentUser.leaguerQq}
          />
          <FormItem
            label="微信"
            cols={[4]}
            initialValue={currentUser.leaguerWechat}
          >
            {currentUser.leaguerWechat ? '已绑定' : <Link to="/user/login?platform=wechat&goto=/userCenter/perfect">去绑定</Link>}
          </FormItem>
          <br />
          <FormItem
            readOnly
            isChildren
            label=" "
            colon={false}
            cols={[4, 6]}
          >
            <Button {...btnStyle} loading={loading} type="primary" onClick={this.handleSubmit}>提交</Button>
          </FormItem>
        </Form>
      </UserCenter>
    );
  }
}
