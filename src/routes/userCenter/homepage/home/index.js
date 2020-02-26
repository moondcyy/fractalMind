import React from 'react';
import request from '../../../../utils/request';
import PageMenu from '../PageMenu';
import { WorksCardList } from '../../../../components/business';

class Home extends React.PureComponent {
  state = {
    data: {},
    loading: false,
  };

  componentDidMount() {
    this.fetchList();
  }

  fetchList = (current) => {
    let { fetchUrl = '/web/leaguer/my' } = this.props;
    // eslint-disable-next-line
    current ? (fetchUrl = `${fetchUrl}?current=${current}`) : null;

    request({
      that: this,
      url: fetchUrl,
      onSuccess: (res) => {
        this.setState({ data: res });
      },
    });
  };

  render() {
    const { loading, data } = this.state;

    return (
      <PageMenu>
        <WorksCardList
          data={data}
          loading={loading}
          worksCardProps={{
            isShare: true,
            isEdit: true,
            isApproval: true,
            isRelease: true,
            isOffline: true,
            callback: () => { this.fetchList(); },
          }}
          onChangePage={(current) => { this.fetchList(current); }}
        />
      </PageMenu>
    );
  }
}

export default Home;
