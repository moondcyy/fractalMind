/*
* 作品 Card 模板
* API: {
*   data: {}, // 数据源
*   callback: (handleType, res) => {}, // 操作的回调函数
*       handleType: delete（删除）、offline（下架）、publish（发布）、remove（删除）
*   isRelease = false, // 是否显示私有状态
*   isApproval = false, // 是否显示审批状态
*   isPublish = false, // 操作：发布
*   isOffline = false, // 操作：下线
*   isDelete = false, // 操作：删除
*   isEdit = false, // 操作：编辑
*   isRemove = false, // 操作：移除，如从阶段课程列表中移除
*     stageCode = '', 移除作品时需要该字段
*   isShare = false, // 操作分享
* }
* */

import React from 'react';
import { Link } from 'dva/router';
import { Icon, Divider, Modal, message } from 'antd';
import request from '../../../utils/request';
import ShareBtn from './ShareBtn';
import BlankLink from '../../../components/BlankLink';
import styles from './index.less';

class WorksCard extends React.PureComponent {
  onDelete = (productNo) => {
    const { callback = () => {} } = this.props;

    Modal.confirm({
      title: '确定删除该项？',
      onOk() {
        // 删除操作
        request({
          url: `/web/product/remove/${productNo}`,
          method: 'DELETE',
          onSuccess: (res) => {
            message.success('删除成功');
            callback('delete', res);
          },
        });
      },
    });
  };

  onOffline = (productNo) => {
    const { callback = () => {} } = this.props;

    Modal.confirm({
      title: '是否下架该作品？',
      onOk() {
        // 删除操作
        request({
          url: `/web/product/offline?productNo=${productNo}`,
          onSuccess: (res) => {
            message.success('下架成功');
            callback('offline', res);
          },
        });
      },
    });
  };

  onPublish = (productNo) => {
    const { callback = () => {} } = this.props;

    Modal.confirm({
      title: '确定申请发布该作品？',
      onOk() {
        // 删除操作
        request({
          url: `/web/product/release?productNo=${productNo}`,
          onSuccess: (res) => {
            message.success('发布成功');
            callback('publish', res);
          },
        });
      },
    });
  };

  onRemove = (productNo) => {
    const { callback = () => {}, stageCode = '' } = this.props;

    Modal.confirm({
      title: '确定移除该项？',
      onOk() {
        // 删除操作
        request({
          url: `/web/stage/products?stageCode=${stageCode}&productNo=${productNo}`,
          method: 'DELETE',
          onSuccess: (res) => {
            message.success('移除成功');
            callback('remove', res);
          },
        });
      },
    });
  };

  render() {
    const {
      isRelease = false, // 是否显示私有状态
      isApproval = false, // 是否显示审批状态
      isPublish = false, // 操作：发布
      isOffline = false, // 操作：下线
      isDelete = false, // 操作：删除
      isEdit = false, // 操作：编辑
      isRemove = false, // 操作：移除
      isShare = false, // 操作：分享
      data = {}, // 源数据
    } = this.props;

    return (
      <div className={styles.item} key={data.productNo}>
        <div className={styles.left}>
          <Link to={`/products/productDetail?productId=${data.productNo}`}>
            <img src={data.imgSrc} alt="" />
          </Link>
          {isApproval && data.approveStatus && <span className={styles.approval}>{data.approveStatus}</span>}
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <Link to={`/products/productDetail?productId=${data.productNo}`}>
              {data.productSpecial === 1 ? <span className={styles.label_j_btn} title="精品">精</span> : null}
              {data.roof === 1 ? <span className={styles.label_d_btn} title="置顶">顶</span> : null}
              <span className={styles.header_title}>
                {isRelease ? <span className={styles.release}>{data.releaseStatus}&nbsp;&nbsp;</span> : null}
                {data.productTitle}
              </span>
            </Link>
            <span className={styles.header_time}>{data.createdTime}</span>
          </div>
          <div className={styles.content}>{data.productIntroduction}</div>
          <div className={styles.data}>
            <img src={data.avatar} alt="" />
            <span className={styles.data_name}>{data.createdName}</span>
            <span className={styles.data_icon}>
              <Icon theme="filled" type="eye" /> {data.readQuantity || 0}
            </span>
            <span className={styles.data_icon}>
              <Icon theme="filled" type="star" /> {data.followQuantity || 0}
            </span>
            <span className={styles.data_icon}>
              <Icon theme="filled" type="like" /> {data.likesQuantity || 0}
            </span>
          </div>
          <Divider className={styles.divider} />
          <div className={styles.label}>
            <div className={styles.label_title}>标签</div>
            <div className={styles.label_btns}>
              {data.productKeyword && data.productKeyword.map((item1, index) => <span key={index} className={styles.label_btn}>{item1}</span>)}
            </div>
            <div className={styles.label_handle}>
              {isShare && <ShareBtn productNo={data.productNo} />}
              {isPublish && <a onClick={() => this.onPublish(data.productNo)}>申请发布</a>}
              {isOffline && <a onClick={() => this.onOffline(data.productNo)}>下架</a>}
              {isEdit && <BlankLink href={`/web/product/view?productNo=${data.productNo}`}>编辑</BlankLink>}
              {isDelete && <a onClick={() => this.onDelete(data.productNo)}>删除</a>}
              {isRemove && <a onClick={() => this.onRemove(data.productNo)}>移除</a>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WorksCard;
