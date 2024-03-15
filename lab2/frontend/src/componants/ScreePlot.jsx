import { useEffect, useRef } from "react";
import * as d3 from "d3";

const data2 = [0.275892, 0.192864, 0.124404, 0.111903, 0.090065, 0.080618, 0.077269, 0.046986];
const data = [{'i': 0, 'value': 0.275892}, {'i': 1, 'value': 0.192864}, {'i': 2, 'value': 0.124404}, {'i': 3, 'value': 0.111903}, {'i': 4, 'value': 0.090065}, {'i': 5, 'value': 0.080618}, {'i': 6, 'value': 0.077269}, {'i': 7, 'value': 0.046986}];
const calculateCumulative = (data) => {
    let cumulative = 0;
    return data.map((d, i) => cumulative += d.value)
}
const cumulative = calculateCumulative(data)

export default function ScreePlot(props) {
    let ref = useRef(null);

    useEffect(() => {
        const width = 400;
        const height = 300;

        const margin = { top: 50, right: 50, bottom: 50, left: 60 };

        //set domain and range for the plot
        const XDomain = data.map((d, i) => d.i + 1);
        const XRange = [margin.left, width - margin.right];
        const YDomain = [0, 1];
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
            .attr("fill", (d) => ((d.i==props.eigenindex - 1) ?"orange": "#69b3a2"))
            .on('click', (event, d) => {
                props.handleEigenIndex(d.i + 1)
            });

        //draw the cumulative line
        const line = d3.line()
            .x((d, i) => XScale(i + 1) + XScale.bandwidth() / 2)
            .y(d => YScale(d));

        svg.append('path')
            .datum(cumulative)
            .attr('fill', 'none')
            .attr('stroke', 'green')
            .attr('stroke-width', 2)
            .attr('d', line);

        //graph labeling
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2 - 70)
            .attr("y", height - 15)
            .text("Eigenvalues for PCA")
            .style("font-size", "13px");

        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2 - 50)
            .attr("y", 20)
            .text("Variance Explained")
            .style("font-size", "13px");

        svg.append("text")
            .attr("class", "chart-title")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", 20)
            .text("Scree Plot");

        return () => {
            d3.select(ref.current).selectAll('*').remove();
        }
    })

    return (
        <div ref={ref} />
    )
}