import { MouseEventHandler, useState } from "react";
import { attribute, chart } from "../utils/attribute";

interface MenuProps {
    graphType: attribute;
    setAttribute: (graphType: attribute) => void;
    handleFlip: () => void;
}

function Menu({ graphType, setAttribute, handleFlip}: MenuProps) {
    const [scatterPlotDropdown, setScatterPlotDropdown] = useState()

    const menuItems = [
        { type: chart.barchart, x: "categorial1" },
        { type: chart.barchart, x: "categorial2" },
        { type: chart.barchart, x: "categorial3" },
        { type: chart.barchart, x: "categorial4" },
        { type: chart.histogram, x: "numeric1" },
        { type: chart.histogram, x: "numeric2" },
        { type: chart.histogram, x: "numeric3" },
        { type: chart.histogram, x: "numeric4" },
    ];

    const handleSelectVar1 = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setAttribute(menuItems[parseInt(event.target.value)]);
    };

    const handleSelectVar2 = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setAttribute({
            type: chart.scatterplot,
            x: graphType.x,
            y: menuItems[parseInt(event.target.value)].x,
        });

        setScatterPlotDropdown(parseInt(event.target.value))
    };

    function handleClear(event: React.MouseEvent<HTMLButtonElement>): void {
        throw new Error("Function not implemented.");
    }

    return (
        <>
            <div className='menu_item'>
                <label htmlFor='var1_dropdown'>Select 1st Attribute</label>
                <select
                    id='var1_dropdown'
                    defaultValue={-1}
                    onChange={handleSelectVar1}
                >
                    <option value={-1} disabled>
                        -- Please select --
                    </option>
                    {menuItems.map((menuItem, i) => {
                        return (
                            <option key={i} value={i}>
                                {menuItem.x}
                            </option>
                        );
                    })}
                </select>
                <button
                    disabled={
                        graphType.type == chart.none ||
                        graphType.type == chart.scatterplot
                    }
                    onClick={handleFlip}
                >
                    Flip
                </button>
            </div>
            <div className='menu_item'>
                <label htmlFor='var2_dropdown'>Select 2nd Attribute</label>
                <select
                    id='var2_dropdown'
                    value={scatterPlotDropdown}
                    disabled={graphType.type == chart.none}
                    onChange={handleSelectVar2}
                >
                    <option value={-1} disabled>
                        -- Please select --
                    </option>
                    {menuItems.map((menuItem, i) => {
                        return (
                            <option key={i} value={i}>
                                {menuItem.x}
                            </option>
                        );
                    })}
                </select>
                <button
                    disabled={graphType.type == chart.none}
                    onClick={handleClear}
                >
                    Clear
                </button>
            </div>
        </>
    );
}

export default Menu;
