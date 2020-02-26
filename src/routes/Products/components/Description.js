import React from 'react';

export default function Descirption(props) {
  return (
    <div style={{ paddingTop: 20 }}>
      <h3 style={{ marginBottom: 15 }} >描述</h3>
      {/* eslint-disable */}
      <div dangerouslySetInnerHTML={{ __html: props.productContent }}></div>
    </div>
  );
}
