import React, { useEffect, useState } from 'react';
import noteFrequencyTable from '../utils/noteFrequencyTable';
import * as d3 from 'd3';

// eslint-disable-next-line react/prop-types
const PitchGraph = ({ frequency }) => {
    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    const height = 3600 - margin.top - margin.bottom;
    const width = 1200 - margin.left - margin.right;
    const noteFrequencyMap = new Map(noteFrequencyTable);
    const frequencies = Array.from(noteFrequencyMap.values());
    const [data, setData] = useState([]);

    const xScale = d3.scaleLinear()
        .domain([-4, 0])
        .range([0, width]);

    const yScale = d3.scaleLog()
        .domain([32.70, 987.77])
        .range([height, 0]);

    const yScaleRight = d3.scaleLog()
        .domain([32.70, 987.77])
        .range([height, 0]);
    
    const line = d3.line()
        .x((d) => xScale(d[0]))
        .y((d) => yScale(d[1]))
        .curve(d3.curveMonotoneX);

    const updateData = () => {
        // Increment time values by 1
        let newData = data.map((d) => [d[0] - 0.1, d[1]]);
        
        // Add current value of frequency prop to data
        if (frequency < 400 && frequency > 10) {
            newData = [...newData, [0, frequency]]
        } 

        // Discard data with time values lower than -4
        newData = newData.filter((d) => d[0] >= -4);
        
        setData(newData);
    }

    const drawGraph = () => {
        d3.select('g').remove(); // remove previous graphs

        const svg = d3.select('.graph')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // add horizontal lines across the chart that alternate in opacity for each tick of the y-axis
        g.selectAll('.horizontal-lines')
            .data(frequencies)
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', frequency => yScaleRight(frequency))
            .attr('y2', frequency => yScaleRight(frequency))
            .style('stroke', '#ccc')
            .style('opacity', (frequency, i) => i % 2 === 0 ? 0.2 : 0.6);

        g.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

            
        g.append('g')
            .attr('class', 'y axis')
            .call(
                d3.axisLeft(yScale)
                .tickValues(frequencies)
                .tickFormat((d) => {
                    for (let i = 0; i < noteFrequencyTable.length; i++) {
                        if (noteFrequencyTable[i][1] === d) {
                            return noteFrequencyTable[i][1];
                        }
                    }
                })
            );
                
        g.append('g')
            .attr('class', 'y axis right')
            .attr('transform', `translate(${width}, 0)`)
            .call(
                d3.axisRight(yScaleRight)
                    .tickValues(frequencies)
                    .tickFormat((d) => {
                        for (let i = 0; i < noteFrequencyTable.length; i++) {
                            if (noteFrequencyTable[i][1] === d) {
                                return noteFrequencyTable[i][0];
                            }
                        }
                    })
            );
                
        g.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', 'green');
    }

    useEffect(() => {
        updateData();
        drawGraph();
    }, [frequency]);

    return (
        <svg className="graph mx-auto"></svg>
    );
}

export default PitchGraph;

