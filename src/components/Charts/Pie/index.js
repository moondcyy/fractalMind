import React from 'react';
import {
  Chart,
  Tooltip,
  Geom,
  Axis,
  Coord,
  Label,
  Legend,
} from 'bizcharts';
import { DataView } from '@antv/data-set';


export default class Pie extends React.Component {
  render() {
    const {
      data,
      containHeight = 300, // 图表容器高
      hasLegend = true, // 是否展示legend
      radius = 1, // 图表展示比例
      legendPosition = 'bottom', // legend 相对图表位置
      padding = [0, 0, 0, 0], // 图表在容器间距
      legendY = -30, // legend 提示偏移位置Y轴距离
      legendX = 0, // legend 提示偏移位置X轴距离
      style, // 自定义样式
    } = this.props;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'text',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: (val) => {
          val = `${(val * 100).toFixed(2)}%`;
          return val;
        },
      },
    };

    return (
      <div style={style} >
        <Chart height={containHeight} data={dv} scale={cols} padding={padding} forceFit>
          <Coord type="theta" radius={radius} />
          <Axis name="percent" />
          { hasLegend && <Legend position={legendPosition} offsetY={legendY} offsetX={legendX} />}
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="text"
            tooltip={['text*percent', (item, percent) => {
              percent = `${(percent * 100)}%`;
              return {
                name: item,
                value: percent,
              };
            }]}
            style={{ lineWidth: 1, stroke: '#fff' }}
          >
            <Label
              content="percent"
              offset={-40}
              textStyle={{
                rotate: 0,
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}
