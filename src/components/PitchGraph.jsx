import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const PitchGraph = ({ frequency }) => {
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const height = 800 - margin.top - margin.bottom;
    const width = 800 - margin.left - margin.right;
    const [data, setData] = useState([]);

    const xScale = d3.scaleLinear()
        .domain([-4, 0])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 800])
        .range([height, 0]);

    const line = d3.line()
        .x((d) => xScale(d[0]))
        .y((d) => yScale(d[1]))
        .curve(d3.curveMonotoneX);

    const updateData = () => {
        // Increment time values by 1
        let newData = data.map((d) => [d[0] - 0.1, d[1]]);
        
        // Add current value of frequency prop to data
        newData = [...newData, [0, frequency]]

        // Discard data with time values lower than -4
        newData = newData.filter((d) => d[0] >= -4);
        
        setData(newData);
    }

    const drawGraph = () => {
        const svg = d3.select('.graph')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        g.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(yScale));

        g.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line)
            .attr('stroke', 'green');
    }

    useEffect(() => {
        updateData();
        console.log(data);
        //drawGraph();
        console.log(frequency)
    }, [frequency]);

    return (
        <div className="graph-container">
            <svg className="graph"></svg>
        </div>
    );
}

export default PitchGraph;

