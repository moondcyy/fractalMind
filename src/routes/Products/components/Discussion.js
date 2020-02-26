import React, { Component, Fragment } from 'react';
import { stringify } from 'qs';
import { Input, Button, List, Avatar, Icon } from 'antd';
import request from '../../../utils/request';
import showPropsConfirm from '../../../components/LoginTip';

const { TextArea } = Input;

export default class Discusstion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageId: '',
      isDisable: true,
      data: {},
      commentContent: '',
      replyConent: '',
    };
    this.relationNo = props.relationNo;
    this.commentType = props.commentType;
    this.commentRef = React.createRef();
    this.replayRef = React.createRef();
  }
  componentDidMount() {
    this.queryComment();
  }
  queryComment(current = 1, limit = 5) {
    const params = {
      current,
      limit,
      relationNo: this.relationNo,
    };
    request({
      url: `/web/comment/${this.commentType}/list?${stringify(params)}`,
    }).then((res) => {
      if (res.success) {
        this.setState({
          data: res || {},
          commentContent: '',
          replyConent: '',
        });
      }
    });
  }
  handleIsLike = (commentId) => {
    if (!window.currentUser.token) {
      showPropsConfirm();
      return;
    }
    request({
      url: '/web/comment/likes',
      method: 'POST',
      body: {
        relationNo: commentId,
      },
    }).then((res) => {
      if (res.success) {
        this.setState(({ data }) => {
          data.rows.forEach((item) => {
            if (item.commentId === commentId) {
              item.likesQuantity = res.data.count;
            }
          });
          return { data };
        });
      }
    });
  }

  handleShowMessage = (id) => {
    this.setState({
      showMessageId: id,
    });
  }
  closesMessageBox = () => {
    this.setState({
      showMessageId: '',
    });
  }
  handleChange = (e) => {
    const content = e.target.value.trim();
    this.setState({
      isDisable: !content,
      replyConent: content,
    });

  }
  handleComment = (e) => {
    const content = e.target.value.trim();
    if (content !== '') {
      this.setState({
        commentContent: content,
      });
    }
  }
  handleDelete = (commentId) => {
    const { current = 1, limit = 5 } = this.state.data;
    request({
      url: `/web/comment/${this.commentType}/remove?commentId=${commentId}`,
      method: 'DELETE',
    }).then((res) => {
      if (res.success) {
        this.queryComment(current, limit);
      }
    });
  }
  submitComment = (type, toCommentId = '', toLeaguerNo = '') => {

    if (!window.currentUser.token) {
      showPropsConfirm();
      return;
    }
    const { commentContent, replyConent, data } = this.state;
    const { current = 1, limit = 5 } = data;

    request({
      url: `/web/comment/${this.commentType}/add`,
      method: 'POST',
      body: {
        toCommentId,
        toLeaguerNo,
        content: type === 'comment' ? commentContent : replyConent,
        relationNo: this.relationNo,
      },
    }).then((res) => {
      if (res.success) {
        this.commentRef.current.textAreaRef.value = '';
        if (this.replayRef.current) {
          this.replayRef.current.textAreaRef.value = '';
        }
        this.queryComment(current, limit);
      }
    });
  }
  handlePagenation = (pageNo) => {
    this.queryComment(pageNo);
  }
  render() {
    const IsLickIcon = ({ type, likesQuantity, commentId }) => {
      return (
        <span onClick={() => this.handleIsLike(commentId)}>
          <Icon type={type} style={{ marginRight: 8 }} />
          {likesQuantity}
        </span>
      );
    };
    const MessageIcon = ({ type, text, commentId }) => {
      let handle = 'handleShowMessage';
      if (type === 'delete') {
        handle = 'handleDelete';
      }
      return (
        <span onClick={() => this[handle](commentId)}>
          <Icon type={type} style={{ marginRight: 8 }} />
          {text}
        </span>
      );
    };
    const actionList = (item) => {
      const list = [
        <IsLickIcon type="like-o" commentId={item.commentId} likesQuantity={item.likesQuantity} />,
      ];
      if (item.operate === 1) {
        list.push(<MessageIcon type="delete" commentId={item.commentId} text="删除" />);
      } else {
        list.push(<MessageIcon type="message" commentId={item.commentId} text="回复" />);
      }
      return list;
    };
    const { data, showMessageId, isDisable } = this.state;
    const { current = 1, limit = 5, total = 0, rows = [] } = data;

    return (
      <div style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 20 }}>全部评论 &#09;({total})</h3>
        <div className="discusstion">
          <TextArea ref={this.commentRef} rows={4} placeholder="说点什么" onBlur={this.handleComment} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '15px 0' }}>
            <Button onClick={() => this.submitComment('comment')} style={{ flex: '0 0 80px' }} type="primary">评论</Button>
          </div>
          { rows.length > 0 ? (
            <List
              itemLayout="vertical"
              size="large"
              split={false}
              pagination={{
                onChange: (page) => {
                  this.handlePagenation(page);
                },
                total,
                current,
                pageSize: limit,
              }}
              dataSource={rows}
              renderItem={item => (
                <Fragment>
                  <List.Item
                    key={item.commentId}
                    actions={
                      actionList(item)
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={
                        <div>
                          {item.leaguerName}
                          <span style={{ marginLeft: 30, fontSize: 12, color: '#999' }}>{item.createdTime}</span>
                        </div>
                      }
                      description={
                        item.toCommentId && (
                        <div style={{ borderLeft: '2px solid #dedede', paddingLeft: 10 }}>
                          <div style={{ fontWeight: 'bold' }}>{item.leaguerName} 回复 {item.toLeaguerName}</div>
                          <div>{item.toCommentContent}</div>
                        </div>
                      )}
                    />
                    {item.content}
                  </List.Item>
                  {showMessageId === item.commentId && (
                    <div>
                      <TextArea ref={this.replayRef} onChange={this.handleChange} />
                      <div style={{ textAlign: 'right', padding: '10px 10px 0 0' }}>
                        <span onClick={this.closesMessageBox} style={{ padding: 5, marginRight: 10, cursor: 'pointer' }}>关闭</span>
                        <Button type="primary" size="small" onClick={() => this.submitComment('reply', item.commentId, item.leaguerNo)} disabled={isDisable}>回复</Button>
                      </div>
                    </div>
                  )}
                </Fragment>
              )}
            />) : <div style={{ height: 100, lineHeight: '100px', textAlign: 'center', fontSize: '24px', color: '#ccc' }}>暂无相关评论哦～</div>
          }
        </div>
      </div>
    );
  }
}
