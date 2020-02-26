import React from 'react';
import request from '../../../../utils/request';
import PageMenu from '../PageMenu';
import { WorksCardList } from '../../../../components/business';

class Test extends React.PureComponent {
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
      url: `/web/product/follow?current=${current}`,
      onSuccess: (res) => {
        this.setState({ data: res });
      },
    });
  };

  render() {
    const { loading, data } = this.state;

    return (
      <PageMenu selectedKeys="2">
        <WorksCardList
          data={data}
          loading={loading}
          worksCardProps={{
            callback: () => { this.fetchList(); },
          }}
          onChangePage={(current) => { this.fetchList(current); }}
        />
      </PageMenu>
    );
  }
}

export default Test;
