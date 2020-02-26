/*
* SelectSearch: 带搜索功能的下拉框组件，可多选
* API: {
*   url：请求地址，必须携带入参。如：/xxx/xxx.json?keywords=
*   initialValue：初始值，默认 = [{ key: xxx, label: xxx }]
*   placeholder：提示文案
*   fields：[key, label]
*   callback：选择后回调，function(arr/obj)，单选时返回
*   this.refs.reset()：重置组件
*   isData: 是否返回选项的所有数据，默认 false
*   customOption(fun(record)): 自定义 option 内容
* }
* */

import React from 'react';
import debounce from 'lodash/debounce';
import { Select, Spin } from 'antd';
import request from '../../utils/request';

export default class SelectSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: [],
      data: [],
      loading: false,
    };

    this.onFetch = debounce(this.onFetch.bind(this), 600);
  }

  // 重置组件
  reset = () => {
    this.setState({
      value: [],
      data: [],
    });
  };

  // 自定义异步功能
  onFetch(value) {
    const { url } = this.props;
    this.setState({ data: [] }, () => {
      if (value && value.trim().length > 0) {
        request({
          that: this,
          url: `${url}${value}`,
          onSuccess: (res) => {
            const { rows, data } = res;
            const dataList = (rows || data || []);
            this.setState({ data: dataList });
          },
        });
      }
    });
  }

  // 选择后触发，提供 callback 回调
  handleChange = (value) => {
    const { callback = () => {}} = this.props;

    this.setState({ value: value }, () => {
      callback(value);
    });
  };

  // 多个组件同时使用时，在输入值后进行切换会报错，需要在失去焦点时进行数据重置
  onBlur = () => {
    this.setState({ data: [] });
  };

  render() {
    const { loading, value, data } = this.state;
    const { fields, isData = false, customOption } = this.props;

    return (
      <Select
        {...this.props}
        showSearch
        // labelInValue // 最后返回的数据类型为 [{key, value},...]
        value={value}
        notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
        filterOption={false}
        onSearch={this.onFetch}
        onChange={this.handleChange}
        onBlur={this.onBlur}
        style={{ width: '100%' }}
      >
        {data.map(item => (
          <Select.Option
            key={isData ? JSON.stringify(item) : item[fields[0]]}
          >
            {(customOption && customOption(item)) || item[fields[1]]}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
