import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SimpleBarChart = ({ data }) => (
  <BarChart
    width={data.length * 100}
    height={300}
    data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <XAxis dataKey="name" />
    <YAxis dataKey="workload" />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend />
    <Bar dataKey="workload" fill="#82ca9d" />
    <Bar dataKey="зачет" fill="#82ca9d" />
    <Bar dataKey="практика" fill="#82ca9d" />
    <Bar dataKey="экзамен" fill="#82ca9d" />
    <Bar dataKey="лекция" fill="#82ca9d" />
    <Bar dataKey="undefined" fill="#82ca9d" />
  </BarChart>
);

export default SimpleBarChart;
