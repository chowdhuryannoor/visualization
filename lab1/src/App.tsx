import { useState } from "react";
import Menu from "./componants/Menu";
import { attribute, chart } from "./utils/attribute";

function App() {
    const [graphType, setGraph] = useState<attribute>({
        type: chart.none,
        x: "-- Please Select --",
    });
    const setAttribute = (attribute: attribute) => {
        console.log(attribute);
        setGraph(attribute);
    };

    return (
        <div id='container_main'>
            <div id='container_title' className='edge_border'>
                Dashboard
            </div>
            <div id='container_content'>
                <div id='container_graph' className='edge_border' />
                <div id='container_menu' className='edge_border'>
                    <Menu graphType={graphType} setAttribute={setAttribute} />
                </div>
            </div>
        </div>
    );
}

export default App;
