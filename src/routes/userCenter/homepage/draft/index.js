import React from 'react';
import request from '../../../../utils/request';
import PageMenu from '../PageMenu';
import { WorksCardList } from '../../../../components/business';

class Draft extends React.PureComponent {
  state = {
    data: {},
    loading: false,
  };

  componentDidMount() {
    this.fetchList();
  }

  fetchList = (current = 1) => {
    request({
      that: this,
      url: `/web/leaguer/draft?current=${current}`,
      onSuccess: (res) => {
        this.setState({ data: res });
      },
    });
  };

  render() {
    const { loading, data } = this.state;

    return (
      <PageMenu selectedKeys="3">
        <WorksCardList
          data={data}
          loading={loading}
          worksCardProps={{
            isShare: true,
            isDelete: true,
            isPublish: true,
            isEdit: true,
            callback: () => { this.fetchList(); },
          }}
          onChangePage={(current) => { this.fetchList(current); }}
        />
      </PageMenu>
    );
  }
}

export default Draft;
