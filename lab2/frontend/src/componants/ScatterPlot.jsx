import { useEffect, useRef } from "react";
import * as d3 from "d3";

const colors = [
    "#1f77b4", // blue
    "#ff7f0e", // orange
    "#2ca02c", // green
    "#d62728", // red
    "#9467bd", // purple
    "#8c564b", // brown
    "#e377c2", // pink
    "#7f7f7f", // gray
    "#bcbd22", // olive
    "#17becf"  // teal
  ];

export default function ScatterPlot(props) {
    let ref = useRef(null);

    useEffect(() => {
        if (!props.xField) {
            return
        }

        let width = 120
        let height = 120

        if (props.xField != props.yField) {
            const XRange = [0, width];
            const YRange = [height, 0];

            let XScale = d3.scaleLinear()
                .domain([
                    d3.min(props.data, (d) => d[props.xField]),
                    d3.max(props.data, (d) => d[props.xField])
                ])
                .range(XRange);

            let YScale = d3.scaleLinear()
                .domain([
                    d3.min(props.data, (d) => d[props.yField]),
                    d3.max(props.data, (d) => d[props.yField])
                ])
                .range(YRange)

            const XAxis = d3.axisBottom(XScale)
            const YAxis = d3.axisLeft(YScale)

            const svg = d3.select(ref.current)
                .append("svg")
                .attr("width", width)
                .attr("height", height)

            svg.append("g")
                .selectAll("circle")
                .data(props.data)
                .join("circle")
                .attr("cx", (d) => XScale(d[props.xField]))
                .attr("cy", (d) => YScale(d[props.yField]))
                .attr("r", 1)
                .attr("fill", (d, i) => colors[props.labels[i]])
        } else {
            const svg = d3.select(ref.current)
                .append("svg")
                .attr("width", width)
                .attr("height", height)

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2) 
                .attr("text-anchor", "middle") 
                .attr("dominant-baseline", "middle") 
                .attr("font-size", "10px")
                .text(props.xField);
        }

        return () => {
            d3.select(ref.current).selectAll('*').remove();
        }

    })

    return (
        <div ref={ref} />
    )
}