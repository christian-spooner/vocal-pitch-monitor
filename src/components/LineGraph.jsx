import React from 'react';
import * as d3 from 'd3';

const LineGraph = (props) => {
  // Initialize variables to store data and dimensions of graph
  const data = props.frequency;
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

  // Set range and domain of graph using d3's scaleLinear()
  const x = d3
    .scaleLinear()
    .rangeRound([margin.left, width - margin.right])
    .domain([0, data.length - 1]);

  const y = d3
    .scaleLinear()
    .rangeRound([height - margin.bottom, margin.top])
    .domain([0, d3.max(data)]);

  // Create line generator using d3's line() method
  const line = d3
    .line()
    .x((d, i) => x(i))
    .y(d => y(d));

  // Create x and y axes using d3's axisBottom() and axisLeft() methods
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Draw line graph on selected element using data and line generator
  d3.select('.line-graph')
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line);

  // Append x and y axes to graph
  d3.select('.line-graph')
    .append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  d3.select('.line-graph')
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis);

  return (
    <svg className="line-graph" width={width} height={height} />
  );
};

export default LineGraph;