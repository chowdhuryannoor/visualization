import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";
interface BarGraphProps {
    data: d3.DSVRowArray<string>;
    flip: boolean;
    field: string;
    width: number;
    height: number;
}

export default function BarGraph({
    data,
    flip,
    field,
    width,
    height,
}: BarGraphProps) {
    let ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        console.log("Creating SVG");

        //Count how many values in each category
        const counts: { [key: string]: number } = {};
        data.forEach((row) => {
            let key = row[field];
            if (row[field] == "") {
                key = "None";
            }
            counts[key] = (counts[key] || 0) + 1;
        });

        //convert counts to an array
        const barData: { key: string; count: number }[] = Object.keys(
            counts
        ).map((key) => ({
            key,
            count: counts[key],
        }));

        if (!flip) {
            const margin = { top: 50, right: 50, bottom: 50, left: 70 };
            const X = d3.map(barData, (d) => d.key);
            const Y = d3.map(barData, (d) => d.count);

            const XDomain = X;
            const YDomain = [0, 7000];

            const XRange = [margin.left, width - margin.right];
            const YRange = [height - margin.bottom, margin.top];

            const XScale = d3.scaleBand(XDomain, XRange).padding(0.1);
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
                .data(barData)
                .join("rect")
                .attr("x", (d, i) => XScale(X[i]) ?? 0)
                .attr("y", (d, i) => YScale(Y[i]))
                .attr("height", (d, i) => YScale(0) - YScale(Y[i]))
                .attr("width", XScale.bandwidth())
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
                .text(field.replace(/_/g, " ") + " Bar Chart");
        } else {
            const margin = { top: 50, right: 50, bottom: 50, left: 100 };
            const A = d3.map(barData, (d) => d.count);
            const B = d3.map(barData, (d) => d.key);

            const ADomain = [0, 7000];
            const BDomain = B;

            const XRange = [margin.left, width - margin.right];
            const YRange = [height - margin.bottom, margin.top];

            const AScale = d3.scaleLinear(ADomain, XRange);
            const BScale = d3.scaleBand(BDomain, YRange).padding(0.1);

            const XAxis = d3.axisBottom(AScale);
            const YAxis = d3.axisLeft(BScale);

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
                .call(YAxis)
                .selectAll("text")
                .attr("transform", "rotate(-90)")
                .attr("x", 20)
                .attr("y", -20)
                .style("text-anchor", "end");

            svg.append("g")
                .selectAll("rect")
                .data(barData)
                .join("rect")
                .attr("x", margin.left)
                .attr("y", (d, i) => BScale(B[i]) ?? 0)
                .attr("width", (d, i) => AScale(A[i]))
                .attr("height", (d) => BScale.bandwidth())
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
                .text(field.replace(/_/g, " ") + " Barchart");
        }
    }, []);

    return <div id='barchart' ref={ref} />;
}
