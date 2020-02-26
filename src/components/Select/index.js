/**
 * 统一封装Select单选基本组件
 */
import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

export default class BaseSelect extends Component {
  render() {
    const { data, ...props } = this.props;

    return (
      <Select allowClear {...props}>
        {data.map(
        item => (<Option key={item.value} title={item.text} value={item.value}>{item.text}</Option>)
        )}
      </Select>
    );
  }
}
