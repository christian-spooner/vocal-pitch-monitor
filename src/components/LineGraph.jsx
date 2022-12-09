import React, { useRef } from "react";
import * as d3 from "d3";

const LineGraph = (props) => {
  const { frequency } = props;
  const svgRef = useRef();

  // Set the dimensions of the graph
  const width = 400;
  const height = 400; 
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

  // Set the maximum frequency to be displayed on the y-axis
  const maxFrequency = 800;

  // Set the x and y scales
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // Set the x and y axes
  const xAxis = d3.axisBottom().scale(x);
  const yAxis = d3.axisLeft().scale(y);

  // Set the frequency line
  const valueline = d3
    .line()
    .x((d) => x(d.time))
    .y((d) => y(d.frequency));

  // Set the frequency data
  let data = [{ time: 0, frequency: frequency }];

  // Create the SVG element
  const svg = d3.create("svg");
  // Set the dimensions of the SVG
  svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain([0, 1]);
  y.domain([0, maxFrequency]);

  // Add the valueline path.
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

  // Add the X Axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis);

  return (
    <div className="pitch-monitor-graph">
      <svg ref={svgRef} />
    </div>
  );
};

export default LineGraph;
