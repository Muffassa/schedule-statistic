import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Page A', uv: 4000 },
  { name: 'Page B', uv: 3000 },
  { name: 'Page C', uv: 2000 },
  { name: 'Page D', uv: 2780 },
  { name: 'Page E', uv: 1890 },
  { name: 'Page F', uv: 2390 },
  { name: 'Page G', uv: 3490 },
];
const SimpleBarChart = React.createClass({
  render() {
    console.log(this.props.data);
    return (
      <BarChart
        width={this.props.data.length * 100}
        height={300}
        data={this.props.data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis dataKey="workingTime" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="workingTime" fill="#82ca9d" />
      </BarChart>
    );
  },
});

export default SimpleBarChart;
