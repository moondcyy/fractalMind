import React from 'react';
import PageMenu from '../PageMenu';
import Follow from '../../fans/Follow';

class Fans extends React.PureComponent {
  render() {
    return (
      <PageMenu selectedKeys="4">
        <Follow />
      </PageMenu>
    );
  }
}

export default Fans;
