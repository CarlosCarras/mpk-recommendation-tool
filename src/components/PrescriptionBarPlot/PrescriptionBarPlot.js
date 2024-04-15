import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "./PrescriptionBarPlot.css";

function PrescriptionBarPlot({ data, names}) {
    const width = 380;
    const height = 400;
    const svgRef = useRef(null);
    const colors = ['#FBA834', '#e94057', '#8a2387']
    // const colors = ['#ff5a5e', '#55c6cc', '#b8b8b8']

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };

        // Calculate chart inner dimensions
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Remove previous chart elements
        svg.selectAll("*").remove();

        // Create scales
        const xScale = d3
            .scaleBand()
            .domain(Object.keys(data))
            .range([margin.left, innerWidth + margin.left])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([70, 105])
            .range([innerHeight, 0])
            .nice();

        // Create color scale based on data keys
        const colorScale = d3
            .scaleOrdinal()
            .domain(Object.keys(data))
            .range(colors);

        // Create x-axis and y-axis
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale)
                        .tickValues([70, 80, 90, 100]);

        // Append x-axis
        svg
            .append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(xAxis)
            .selectAll("text")
            .style("fill", "white")
            .style("font-size", "14px")
            .style("font-weight", "700");

        // Append y-axis
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis)
            .selectAll("text")
            .style("fill", "white")
            .style("font-size", "14px")
            .style("font-weight", "700");

        // Append y-axis label
        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -innerHeight / 2 - 10)
            .attr("y", 12) 
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Likelihood of Success");

        // Create bars with different colors
        svg
            .selectAll(".bar")
            .data(Object.entries(data))
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", ([key]) => xScale(key))
            .attr("y", ([, value]) => yScale(value))
            .attr("width", xScale.bandwidth())
            .attr("height", ([, value]) => innerHeight - yScale(value))
            .attr("fill", ([key]) => colorScale(key))
            .each(function (d) {
                // Append text for score on top of each bar
                svg
                    .append("text")
                    .attr("x", xScale(d[0]) + xScale.bandwidth() / 2)
                    .attr("y", yScale(d[1]) - 10)
                    .attr("text-anchor", "middle")
                    .style("fill", "white")
                    .style("font-size", "12px")
                    .text(d[1].toPrecision(3));
            });
    }, [data]);

    return (
        <div className="prescription-barplot-container">
            <svg ref={svgRef} width={width} height={height} />
        </div>
    );
}

export default PrescriptionBarPlot;
