// 上传文件公共组件，beforeUpload 返回 false 后，手动上传文件，采用FormData提交
import React from 'react';
import PropTypes from 'prop-types';
import { Upload, Button, Icon, message } from 'antd';

export default class UploadFile extends React.Component {
  state = {
    fileList: [],
  }
  componentWillReceiveProps(nextProps) {
    // this.props.errorData !== ''?
    if (this.props.errorData !== nextProps.errorData) {
      this.setState(({ fileList }) => {
        fileList.forEach((file) => {
          if (file.name === nextProps.errorData) {
            file.status = 'error';
          }
        });
        return {
          fileList: [...fileList],
        };
      });
    }
  }
  onRemove = (file) => {
    this.setState(({ fileList }) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      this.props.getFileList(newFileList);
      return {
        fileList: newFileList,
      };
    });
  }
  beforeUpload = (file) => {
    const { accept = [], limit = 1 } = this.props;
    // 校验文件类型
    const isAccept = accept.some((item) => {
      if (file.name.indexOf(item) > -1) {
        return true;
      }
      return false;
    });
    if (!isAccept) {
      const fileType = accept.join(',');
      message.error(`请上传文件类型为${fileType}文件`);
      return false;
    }
    // 限制上传10个文件
    if (this.state.fileList.length === limit) {
      // message.error(`每批次最多上传${limit}个文件`);
      return false;
    }
    this.setState(({ fileList }) => {
      this.props.getFileList([...fileList, file]);
      return {
        fileList: [...fileList, file],
      };
    });
    return false; // 手动提交，return false
  }

  render() {
    const { text = 'upload' } = this.props;
    const props = {
      beforeUpload: this.beforeUpload,
      onRemove: this.onRemove,
    };
    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button>
          <Icon type="upload" /> {text}
        </Button>
      </Upload>
    );
  }
}

UploadFile.prototypes = {
  text: PropTypes.string, // 上传按钮文案
  accept: PropTypes.array, // 上传文件类型
  limit: PropTypes.number, // 上传文件个数限制，默认1个
  getFileList: PropTypes.func, // 父组件获取fileList
  errorData: PropTypes.string, // 错误回显数据，比如上传失败的文件名
};

/*
** 使用例子
 <UploadFile
  text="上传Excel"
  accept={['.xlsx', '.csv']}
  limit={5}
  getFileList={(filesList) => { this.getFileList(filesList); }}
  errorData={errorData}
/>
*/
