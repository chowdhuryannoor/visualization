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
        const margin = { top: 50, right: 50, bottom: 50, left: 70 };
        const XRange = [margin.left, width - margin.right];
        const YRange = [height - margin.bottom, margin.top];

        //function for finding the min and max values
        const xField = scat_x.x;
        const yField = scat_y.x;

        //determine the xScaling
        let XScale: any;
        let getCircleX;
        if (scat_x.type == chart.histogram) {
            XScale = d3
                .scaleLinear()
                .domain([
                    d3.min(data, (d: any) => parseInt(d[xField])) ?? 0,
                    d3.max(data, (d: any) => parseInt(d[xField])) ?? 0,
                ])
                .range(XRange);
            getCircleX = (d: any) => XScale(parseInt(d[xField]));
        } else {
            XScale = d3
                .scaleBand(
                    d3.map(data, (d) => d[xField]),
                    XRange
                )
                .padding(0.1);
            getCircleX = (d: any) => XScale.bandwidth() / 2 + XScale(d[xField]);
        }

        //determine the y scaling
        let YScale: any;
        let getCircleY;
        if (scat_y.type == chart.histogram) {
            YScale = d3
                .scaleLinear()
                .domain([
                    d3.min(data, (d: any) => parseInt(d[yField])) ?? 0,
                    d3.max(data, (d: any) => parseInt(d[yField])) ?? 0,
                ])
                .range(YRange);

            getCircleY = (d: any) => YScale(parseInt(d[yField]));
        } else {
            YScale = d3
                .scaleBand(
                    d3.map(data, (d) => d[yField]),
                    YRange
                )
                .padding(0.1);

            getCircleY = (d: any) => YScale.bandwidth() / 2 + YScale(d[yField]);
        }

        let radius: any = (d: any) => 1.5;
        if (scat_x.type == chart.barchart && scat_y.type == chart.barchart) {
            const counts: { [key: string]: number } = {};
            data.forEach(
                (d) =>
                    (counts[`(${getCircleX(d)},${getCircleY(d)})`] =
                        (counts[`(${getCircleX(d)},${getCircleY(d)})`] || 0) +
                        1)
            );
            let max = 0;
            for (let key of Object.keys(counts)) {
                if (counts[key] > max) {
                    max = counts[key];
                }
            }

            const radiusScale = d3
                .scaleLinear()
                .domain([0, max])
                .range([0, 20]);
            radius = (d: any) =>
                radiusScale(counts[`(${getCircleX(d)},${getCircleY(d)})`]);
        }

        //screate axis
        const XAxis = d3.axisBottom<any>(XScale);
        const YAxis = d3.axisLeft<any>(YScale);

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
            .attr("cx", (d) => getCircleX(d) ?? 0)
            .attr("cy", (d) => getCircleY(d) ?? 0)
            .attr("r", (d) => radius(d) ?? 1.5)
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
