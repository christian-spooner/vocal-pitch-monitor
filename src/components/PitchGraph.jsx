import React, { useEffect, useState } from 'react';
import noteFrequencyTable from '../utils/noteFrequencyTable';
import * as d3 from 'd3';

const PitchGraph = ({ frequency }) => {
    const margin = { top: 20, right: 40, bottom: 30, left: 40 };
    const height = 800 - margin.top - margin.bottom;
    const width = 800 - margin.left - margin.right;
    const noteFrequencyMap = new Map(noteFrequencyTable);
    const frequencies = Array.from(noteFrequencyMap.values());
    const [data, setData] = useState([]);

    const xScale = d3.scaleLinear()
        .domain([-4, 0])
        .range([0, width]);

    const yScale = d3.scaleLog()
        .domain([10, 1000])
        .range([height, 0]);
    
    /* const yScaleRight = d3.scaleLog()
        .domain([d3.min(frequencies), d3.max(frequencies)])
        .range([height, 0]); */

    /* // create a custom formatter that maps each frequency to its corresponding pitch
    const pitchFormatter = d3.format(freq => {
        for (let i = 0; i < noteFrequencyTable.length; i++) {
            if (noteFrequencyTable[i][1] === freq) {
                return noteFrequencyTable[i][0];
            }
        }
    }); */
    
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
                                return noteFrequencyTable[i][0];
                            }
                        }
                    })
            );

        /* g.append('g')
            .attr('class', 'y axis right')
            .attr('transform', `translate(${width}, 0)`)
            .call(d3.axisRight(yScaleRight)
                .tickValues(frequencies)); */

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

