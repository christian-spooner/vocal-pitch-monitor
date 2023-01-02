import React, { useEffect, useState } from "react";
import noteFrequencyTable from "../utils/noteFrequencyTable";
import * as d3 from "d3";

// eslint-disable-next-line react/prop-types
const PitchGraph = ({ frequency, spacing, range }) => {
	const margin = { top: 20, right: 50, bottom: 30, left: 50 };
	var height_abs;
	if (spacing === "small") {
		height_abs = 1200;
	} else if (spacing === "medium") {
		height_abs = 1800;
	} else {
		height_abs = 2400;
	}
	const height = height_abs - margin.top - margin.bottom;
	const width = 1200 - margin.left - margin.right;

	let noteFrequencyTableRange;
	if (range === "low") {
		noteFrequencyTableRange = noteFrequencyTable.slice(0, 36);
	} else {
		noteFrequencyTableRange = noteFrequencyTable.slice(12, 48);
	}
	const minFreq = noteFrequencyTableRange[0][1];
	const maxFreq =
		noteFrequencyTableRange[noteFrequencyTableRange.length - 1][1];
	const minTime = -5;
	const noteFrequencyMap = new Map(noteFrequencyTableRange);
	const frequencies = Array.from(noteFrequencyMap.values());
	const [data, setData] = useState([]);

	const xScale = d3.scaleLinear().domain([minTime, 0]).range([0, width]);

	const yScale = d3.scaleLog().domain([minFreq, maxFreq]).range([height, 0]);

	const yScaleRight = d3
		.scaleLog()
		.domain([minFreq, maxFreq])
		.range([height, 0]);

	const line = d3
		.line()
		.x((d) => xScale(d[0]))
		.y((d) => yScale(d[1]))
		.curve(d3.curveMonotoneX);

	const updateData = () => {
		// Increment time values by 1
		let newData = data.map((d) => [d[0] - 0.1, d[1]]);

		// Add current value of frequency prop to data
		if (frequency > minFreq && frequency < maxFreq) {
			newData = [...newData, [0, frequency]];
		}

		// Discard data with time values lower than minTime
		newData = newData.filter((d) => d[0] >= minTime);

		setData(newData);
	};

	const drawGraph = () => {
		d3.select("g").remove(); // remove previous graphs

		const svg = d3
			.select(".graph")
			.attr("height", height + margin.top + margin.bottom)
			.attr("width", width + margin.left + margin.right);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// add horizontal lines across the chart that alternate in opacity for each tick of the y-axis
		g.selectAll(".horizontal-lines")
			.data(frequencies)
			.enter()
			.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", (frequency) => yScaleRight(frequency))
			.attr("y2", (frequency) => yScaleRight(frequency))
			.style("stroke", "#ccc")
			.style("opacity", (frequency, i) => (i % 2 === 0 ? 0.2 : 0.6));

		g.append("g")
			.attr("class", "x axis")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(xScale).tickSize(0).tickFormat(""));

		g.append("g")
			.attr("class", "y axis")
			.call(
				d3
					.axisLeft(yScale)
					.tickValues(frequencies)
					.tickFormat((d) => {
						for (
							let i = 0;
							i < noteFrequencyTableRange.length;
							i++
						) {
							if (noteFrequencyTableRange[i][1] === d) {
								return noteFrequencyTableRange[i][1];
							}
						}
					})
			);

		g.append("g")
			.attr("class", "y axis right")
			.attr("transform", `translate(${width}, 0)`)
			.call(
				d3
					.axisRight(yScaleRight)
					.tickValues(frequencies)
					.tickFormat((d) => {
						for (
							let i = 0;
							i < noteFrequencyTableRange.length;
							i++
						) {
							if (noteFrequencyTableRange[i][1] === d) {
								return noteFrequencyTableRange[i][0];
							}
						}
					})
			);

		g.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line)
			.attr("fill", "none")
			.attr("stroke", "green");
	};

	useEffect(() => {
		updateData();
		drawGraph();
	}, [frequency, spacing, range]);

	return <svg className="graph mx-auto"></svg>;
};

export default PitchGraph;
