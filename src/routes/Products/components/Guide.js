import React from 'react';

export default function Guide(props) {
  return (
    <div style={{ paddingTop: 20 }}>
      <h3 style={{ marginBottom: 15 }}>指南</h3>
      {/* eslint-disable */}
      <div dangerouslySetInnerHTML={{ __html: props.content || '暂无指南' }}></div>
    </div>
  );
}
