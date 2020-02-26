import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Icon, Upload } from 'antd';
import { urlTimeStamp } from '../../../utils/utils';
import request from '../../../utils/request';
import ModalBox from '../../ModalBox';
import styles from './index.less';

class PictureUploadWithCropper extends React.PureComponent {
  state = {
    loading: false,
    cropperImg: '',
    crop: { // 剪裁框的显示数据
      x: 0,
      y: 0,
      aspect: 1,
    },
    pxCrop: {}, // 剪裁后获取到的位置像素数据
  };

  onChange = (info) => {
    const { file } = info;

    // 上传完成后
    if (file.status === 'done') {
      const { response } = file;

      if (response.success) {
        this.setState({ cropperImg: response.data }, () => {
          this.modalRef.show();
        });
      }
    }
  };

  handleOk = () => {
    const { pxCrop } = this.state;

    request({
      that: this,
      url: '/web/leaguer/avatar/cut',
      method: 'POST',
      body: pxCrop,
      onSuccess: (res) => {
        const { callback = () => {} } = this.props;
        callback(res.data);
        this.modalRef.hide();
      },
    });
  };

  handleCancel = () => {
    this.setState({
      cropperImg: '',
      crop: {
        x: 0,
        y: 0,
        aspect: 1,
      },
    });
  };

  render() {
    const { cropperImg, crop, loading } = this.state;
    const { img = '' } = this.props;

    return (
      <div className={styles.container}>
        <img src={urlTimeStamp(img)} alt="" className={styles.img} />
        <div className={styles.mark_icon}>
          <Icon type="edit" theme="outlined" className={styles.icon} />
          <Upload
            name="file"
            accept="image/png,image/jpg,image/jpeg"
            listType="picture-card"
            className={styles.upload}
            showUploadList={false}
            action="/web/leaguer/avatar"
            data={{ t: new Date().getTime() }}
            onChange={this.onChange}
          >
            &nbsp;
          </Upload>
        </div>
        <ModalBox
          title="头像剪裁"
          ref={(r) => { this.modalRef = r; }}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <ReactCrop
            crop={crop}
            src={cropperImg}
            onChange={(cropData, pixelCrop) => {
              this.setState({ crop: cropData, pxCrop: pixelCrop });
            }}
          />
        </ModalBox>
      </div>
    );
  }
}

export default PictureUploadWithCropper;
