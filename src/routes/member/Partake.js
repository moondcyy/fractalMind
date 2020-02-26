/*
* 参与课程
* */

import React from 'react';
import { CourseCardList } from '../../components/business';

class Partake extends React.PureComponent {
  render() {
    const { leaguerNo } = this.props;

    return (
      <CourseCardList
        enroll={false}
        params={{ leaguerNo }}
        fetchUrl="/web/author/trains"
      />
    );
  }
}

export default Partake;
