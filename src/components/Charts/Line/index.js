// 折线图组件
import React from 'react';
import {
  Chart,
  Tooltip,
  Geom,
  Axis,
  Legend,
} from 'bizcharts';
import { DataView } from '@antv/data-set';


export default class Line extends React.Component {
  componentDidMount() {
    this.forceFitTime = setTimeout(() => {
      if (this.chart) {
        this.chart.forceFit();
      }
    }, 50);
  }
  componentWillUnmount() {
    clearTimeout(this.forceFitTime);
  }
  render() {
    const {
      height,
      padding,
      data,
      fields, // 展开字段集
      xKey,
      shape = 'line', // 默认折线图
      unit = '',
    } = this.props;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'fold',
      fields: fields, // 展开字段集
      key: 'fields_props', // key字段
      value: 'fields_value', // value字段
    });

    const cols = {
      [xKey]: {
        range: [0, 1],
      },
    };

    return (
      <Chart
        height={height}
        data={dv}
        scale={cols}
        padding={padding}
        onGetG2Instance={(chart) => {
          this.chart = chart;
        }}
        forceFit
      >
        <Legend />
        <Axis name={xKey} />
        <Axis name="fields_value" label={{ formatter: val => `${val}${unit}` }} />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom type="line" position={`${xKey}*fields_value`} size={2} color="fields_props" shape={shape} />
        <Geom type="point" position={`${xKey}*fields_value`} size={4} shape="circle" color="fields_props" style={{ stroke: '#fff', lineWidth: 1 }} />
      </Chart>
    );
  }
}
