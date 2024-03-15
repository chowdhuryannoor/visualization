import { useEffect, useRef } from "react";
import ScatterPlot from "./ScatterPlot";
import * as d3 from "d3";

export default function ScatterPlotMatrix(props) {

    //calculate the matrix
    const matrix = []
    for (let row = 0; row < props.attrs.length; row++){
        for (let col = 0; col < props.attrs.length; col++){
            matrix.push(<ScatterPlot 
                    key={props.attrs[row].Attribute + props.attrs[col].Attribute} 
                    data={props.data} 
                    labels = {props.labels}
                    xField={props.attrs[row].Attribute} 
                    yField={props.attrs[col].Attribute}
                />)
        }
    }

    return(
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '500px' }}>{matrix}</div>
    )   
}