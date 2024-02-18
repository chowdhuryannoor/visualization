import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";
interface HistogramProps {
    data: d3.DSVRowArray<string>;
    flip: boolean;
    field: string;
    width: number;
    height: number;
}

export default function Histogram({
    data,
    flip,
    field,
    width,
    height,
}: HistogramProps) {
    let ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const values: number[] = data.map((obj) => parseInt(obj[field]));
        const min = d3.min(values) ?? 0;
        const max = d3.max(values) ?? 0;
        let numBins: number;
        if (max - min > 10) numBins = 10;
        else numBins = max;

        const binGen = d3
            .bin()
            .domain([min ?? 0, max ?? 0])
            .thresholds(numBins);
        const bins = binGen(values);

        if (!flip) {
            const margin = { top: 50, right: 50, bottom: 50, left: 70 };

            const XDomain: number[] = [
                bins[0].x0 ?? 0,
                bins[bins.length - 1].x1 ?? 0,
            ];
            const YDomain = [0, d3.max(bins, (d) => d.length) ?? 0 + 10];

            const XRange = [margin.left, width - margin.right];
            const YRange = [height - margin.bottom, margin.top];

            const XScale = d3.scaleLinear(XDomain, XRange);
            const YScale = d3.scaleLinear(YDomain, YRange);

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
                .selectAll("rect")
                .data(bins)
                .join("rect")
                .attr("x", (d) => XScale(d.x0 ?? 0) + 1)
                .attr("y", (d) => YScale(d.length))
                .attr("height", (d) => YScale(0) - YScale(d.length))
                .attr("width", (d) => XScale(d.x1 ?? 0) - XScale(d.x0 ?? 0) - 1)
                .attr("fill", "#69b3a2");

            svg.append("text")
                .attr("class", "x-axis-label")
                .attr("x", width / 2 - field.length * 3)
                .attr("y", height - 10)
                .text(field.replace(/_/g, " "));
            svg.append("text")
                .attr("class", "y-axis-label")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", 18)
                .text("Frequency");
            svg.append("text")
                .attr("class", "chart-title")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", 20)
                .text(field.replace(/_/g, " ") + " Histogram");
        } else {
            const margin = { top: 50, right: 50, bottom: 50, left: 70 };

            const XDomain = [0, d3.max(bins, (d) => d.length) ?? 0 + 10];
            const YDomain: number[] = [
                bins[0].x0 ?? 0,
                bins[bins.length - 1].x1 ?? 0,
            ];

            const XRange = [margin.left, width - margin.right];
            const YRange = [height - margin.bottom, margin.top];

            const XScale = d3.scaleLinear(XDomain, XRange);
            const YScale = d3.scaleLinear(YDomain, YRange);

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
                .selectAll("rect")
                .data(bins)
                .join("rect")
                .attr("x", margin.left)
                .attr("y", (d) => YScale(d.x1 ?? 0))
                .attr("width", (d) => XScale(d.length))
                .attr(
                    "height",
                    (d) => YScale(d.x0 ?? 0) - YScale(d.x1 ?? 0) - 1
                )
                .attr("fill", "#69b3a2");
            svg.append("text")
                .attr("class", "x-axis-label")
                .attr("x", width / 2 - field.length)
                .attr("y", height - 10)
                .text("Frequency");
            svg.append("text")
                .attr("class", "y-axis-label")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2 - field.length * 3)
                .attr("y", 30)
                .text(field.replace(/_/g, " "));
            svg.append("text")
                .attr("class", "chart-title")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", 20)
                .text(field.replace(/_/g, " ") + " Histogram");
        }
    }, []);

    return <div id='barchart' ref={ref} />;
}
