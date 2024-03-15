import { useEffect, useRef } from "react";
import * as d3 from "d3";

let data = [{'i': 0, 'value': 128},
    {'i': 1, 'value': 108},
    {'i': 2, 'value': 97},
    {'i': 3, 'value': 90},
    {'i': 4, 'value': 85},
    {'i': 5, 'value': 79},
    {'i': 6, 'value': 77},
    {'i': 7, 'value': 73},
    {'i': 8, 'value': 71},
    {'i': 9, 'value': 69}]

export default function KCluster(props) {
    let ref = useRef(null);

    useEffect(() => {

        const width = 400;
        const height = 300;

        const margin = { top: 50, right: 50, bottom: 50, left: 60 };

        //set domain and range for the plot
        const XDomain = data.map((d, i) => i + 1);
        const XRange = [margin.left, width - margin.right];
        const YDomain = [0, d3.max(data, (d) => d.value)];
        const YRange = [height - margin.bottom, margin.top];

        //create the axis
        const XScale = d3.scaleBand(XDomain, XRange).padding(0.1);
        const YScale = d3.scaleLinear(YDomain, YRange);
        const XAxis = d3.axisBottom(XScale);
        const YAxis = d3.axisLeft(YScale);

        //create the svg
        const svg = d3.select(ref.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        //draw the axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(XAxis)

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(YAxis);

        //draw the bars
        svg.append("g")
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => XScale(i + 1))
            .attr('y', (d) => YScale(d.value))
            .attr('height', (d) => YScale(0) - YScale(d.value))
            .attr('width', XScale.bandwidth())
            .attr("fill", (d) => ((d.i==props.kValue)?"orange": "#69b3a2"))
            .on('click', (event, d) => {
                props.handleKValue(d.i)
            });

        //draw the cumulative line
        const line = d3.line()
            .x((d, i) => XScale(i + 1) + XScale.bandwidth() / 2)
            .y(d => YScale(d.value));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'green')
            .attr('stroke-width', 2)
            .attr('d', line);

        //graph labeling
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2 - 50)
            .attr("y", height - 15)
            .text("Number of clusters")
            .style("font-size", "13px");

        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2 - 50)
            .attr("y", 20)
            .text("Inertia (i/10,000)")
            .style("font-size", "13px");

        svg.append("text")
            .attr("class", "chart-title")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", 20)
            .text("K-Means Error Plot");


        return () => {
            d3.select(ref.current).selectAll('*').remove();
        }
    })

    return (
        <div ref={ref} />
    )
}