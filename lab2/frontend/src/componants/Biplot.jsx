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

// const arrows = [[-0.50199866, -0.34400594, 0.45134594, 0.09332531, 0.03945177, 0.40947388, -0.4976357, -0.01918072],
//     [-0.39212988, -0.43080641, 0.0118263, 0.3412185, -0.33849193, -0.56417918, 0.28377937, -0.17511253],]

// const features = ['buildUpPlaySpeed',
//     'buildUpPlayPassing', 'chanceCreationPassing',
//    'chanceCreationCrossing', 'chanceCreationShooting', 'defencePressure',
//    'defenceAggression', 'defenceTeamWidth']


const arrows = [
    {
        "feature": "buildUpPlaySpeed",
        "pc1": -0.50199866,
        "pc2": -0.39212988
    },
    {
        "feature": "buildUpPlayPassing",
        "pc1": -0.34400594,
        "pc2": -0.43080641
    },
    {
        "feature": "defencePressure",
        "pc1": 0.40947388,
        "pc2": -0.56417918
    },
    {
        "feature": "defenceAggression",
        "pc1": -0.4976357,
        "pc2": 0.28377937
    }
]

export default function BiPlot(props) {
    let ref = useRef(null);

    useEffect(() => {
        let width = 500;
        let height = 500;

        const margin = { top: 50, right: 50, bottom: 50, left: 70 };
        const XRange = [margin.left, width - margin.right];
        const YRange = [height - margin.bottom, margin.top];

        const XScale = d3.scaleLinear()
            .domain([-80, 80])
            .range(XRange);

        const YScale = d3.scaleLinear()
            .domain([-80, 80])
            .range(YRange);

        const XAxis = d3.axisBottom(XScale)
        const YAxis = d3.axisLeft(YScale)

        const svg = d3.select(ref.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(XAxis);

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(YAxis);

        svg.append("g")
            .selectAll("circle")
            .data(props.data)
            .join("circle")
            .attr("cx", (d) => XScale(d['pc1']))
            .attr("cy", (d) => YScale(d['pc2']))
            .attr("r", 1)
            .attr("fill", (d, i) => colors[props.labels[i]])

        svg.append("g")
            .selectAll("circle")
            .data(arrows)
            .join("line")
            .attr("x1", XScale(0))
            .attr("y1", YScale(0))
            .attr("x2", (d) => XScale(d['pc1'] * 30))
            .attr("y2", (d) => YScale(d['pc2'] * 30))
            .attr("stroke", "orange")
            .attr('stroke-width', 2)
            .attr("marker-end", 'url(#triangle)')

        // Label arrows with attribute names
        svg.append("g")
            .selectAll("text")
            .data(arrows)
            .join("text")
            .attr("x", d => XScale(d['pc1'] * 40))
            .attr("y", d => YScale(d['pc2'] * 40))
            .text(d => d['feature'])
            .attr("font-size", "5px")
            .attr("fill", "black");

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .text("PC1");
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 30)
            .text("PC2");
        svg.append("text")
            .attr("class", "chart-title")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", 20)
            .text("Biplot");

        return () => {
            d3.select(ref.current).selectAll('*').remove();
        }
    })

    return (
        <div ref={ref} />
    )
}   