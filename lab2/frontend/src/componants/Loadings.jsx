import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function Loadings(props) {
    // let ref = useRef(null);

    // useEffect(() => {
    //     let row = ["Loadings"];
    //     let column = ["Feature"]
    //     props.data.forEach((d) => {
    //         column.push(d.Attribute)
    //         row.push(d.loading.toFixed(2))
    //     })

    //     const table = d3.select(ref.current).append('table')

    //     const thead = table.append('thead').append('tr')

    //     const tbody = table.append('tbody')

    //     thead.selectAll('th')
    //         .data(column)
    //         .enter()
    //         .append('th')
    //         .text((d) => d)

    //     let rows = tbody.selectAll("tr")
    //         .data([row])
    //         .enter()
    //         .append('tr')

    //     rows.selectAll("td")
    //         .data(row)
    //         .enter()
    //         .append('td')
    //         .text(d => d)

    //     return () => (
    //         d3.select(ref.current).selectAll('*').remove()
    //     )
    // })

    let row = ["Loadings"];
        let column = ["Feature"]
        props.data.forEach((d) => {
            column.push(d.Attribute)
            row.push(d.loading.toFixed(2))
        })

    return (
        // <div style={{display: "flex"}}>
            <table id='test'>
                <thead>
                    <tr>
                        {column.map((c, i) => (
                            <th key={i} style={{ fontSize: "12px"}}>{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {row.map((c, i) => (
                            <td key={i} style={{ textAlign: "center"}}>{c}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        // </div>
    )
}