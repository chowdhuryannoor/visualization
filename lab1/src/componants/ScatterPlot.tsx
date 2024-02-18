import { useEffect, useRef } from "react";
import { attribute, chart } from "../utils/attribute";
import * as d3 from "d3";

interface scatterProps {
    data: d3.DSVRowArray<string>;
    scat_x: attribute;
    scat_y: attribute;
    width: number;
    height: number;
}

export default function ScatterPlot({
    data,
    scat_x,
    scat_y,
    width,
    height,
}: scatterProps) {
    let ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        //function for finding the min and max values
        const xField = scat_x.x;
        const yField = scat_y.x;
        const xValue = (d: any) => parseInt(d[xField]);
        const yValue = (d: any) => parseInt(d[yField]);

        const margin = { top: 50, right: 50, bottom: 50, left: 70 };
        const XRange = [margin.left, width - margin.right];
        const YRange = [height - margin.bottom, margin.top];

        const XScale = d3
            .scaleLinear()
            .domain([d3.min(data, xValue) ?? 0, d3.max(data, xValue) ?? 0])
            .range(XRange);

        const YScale = d3
            .scaleLinear()
            .domain([d3.min(data, yValue) ?? 0, d3.max(data, yValue) ?? 0])
            .range(YRange);

        const XAxis = d3.axisBottom(XScale);
        const YAxis = d3.axisLeft(YScale);

        const svg = d3
            .select(ref.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(XAxis);

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(YAxis);

        svg.append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d) => XScale(xValue(d)))
            .attr("cy", (d) => YScale(yValue(d)))
            .attr("r", 1.5)
            .attr("fill", "#69b3a2");

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2 - xField.length)
            .attr("y", height - 10)
            .text(xField.replace(/_/g, " "));
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2 - yField.length * 3)
            .attr("y", 30)
            .text(yField.replace(/_/g, " "));
        svg.append("text")
            .attr("class", "chart-title")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", 20)
            .text(
                `${xField.replace(/_/g, " ")} vs. ${yField.replace(/_/g, " ")}`
            );
    }, []);

    return <div id='barchart' ref={ref} />;
}
