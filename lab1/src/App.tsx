import { useEffect, useState } from "react";
import Menu from "./componants/Menu";
import BarGraph from "./componants/BarGraph";
import { attribute, chart } from "./utils/attribute";
import * as d3 from "d3";
import Histogram from "./componants/Histogram";
import ScatterPlot from "./componants/ScatterPlot";

function App() {
    const [graphType, setGraph] = useState<attribute>({
        type: chart.none,
        x: "-- Please Select --",
    });
    const [flip, setFlip] = useState<boolean>(false);
    const [data, setData] = useState<d3.DSVRowArray<string>>();

    //Load the data when the app starts
    useEffect(() => {
        d3.csv("../data/Carbon Emission.csv").then((d) => {
            d.map((d) => {
                if (d["Vehicle_Type"] == "") {
                    d["Vehicle_Type"] = "None";
                }
                return d;
            });
            setData(d);
        });
    }, []);

    //Event Handlers to set state
    const handleFlip = () => {
        setFlip(!flip);
    };

    const setAttribute = (attribute: attribute) => {
        console.log(attribute);
        setGraph(attribute);
    };

    //conditionally load the graph based on attributes
    let graphBox;
    if (data) {
        if (graphType.type === chart.barchart) {
            graphBox = (
                <BarGraph
                    key={String(graphType.x.toString() + flip.toString())}
                    data={data}
                    flip={flip}
                    field={graphType.x}
                    width={800}
                    height={500}
                />
            );
        } else if (graphType.type === chart.histogram) {
            graphBox = (
                <Histogram
                    key={String(graphType.x.toString() + flip.toString())}
                    data={data}
                    flip={flip}
                    field={graphType.x}
                    width={800}
                    height={500}
                />
            );
        } else if (graphType.type === chart.scatterplot) {
            console.log("I rerendered");
            if (graphType.scat_x && graphType.scat_y) {
                graphBox = (
                    <ScatterPlot
                        key={`${graphType.scat_x.x}${graphType.scat_y.x}`}
                        data={data}
                        scat_x={graphType.scat_x}
                        scat_y={graphType.scat_y}
                        width={800}
                        height={500}
                    />
                );
            }
        } else {
            graphBox = <label>Select Options Below</label>;
        }
    } else {
        graphBox = <pre>Loading...</pre>;
    }

    return (
        <div id='container_main'>
            <div id='container_title'>
                <label>Carbon Emissions Dashboard</label>
                <p>
                    Select options in the menu below to create visualizations of
                    a carbon emissions dataset.
                </p>
            </div>
            <div id='container_content'>
                <div id='container_graph' className='edge_border'>
                    {graphBox}
                </div>
                <div id='container_menu' className='edge_border'>
                    <Menu
                        graphType={graphType}
                        setAttribute={setAttribute}
                        handleFlip={handleFlip}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
