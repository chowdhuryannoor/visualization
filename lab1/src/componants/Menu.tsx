import { MouseEventHandler, useEffect, useState } from "react";
import { attribute, chart } from "../utils/attribute";

interface MenuProps {
    graphType: attribute;
    setAttribute: (graphType: attribute) => void;
    handleFlip: () => void;
}

export default function Menu({
    graphType,
    setAttribute,
    handleFlip,
}: MenuProps) {
    const [var1, setVar1] = useState<number>(-1);
    const [var2, setVar2] = useState<number>(-1);

    const menuItems: attribute[] = [
        { type: chart.barchart, x: "Body_Type" },
        { type: chart.barchart, x: "Diet" },
        { type: chart.barchart, x: "Energy_efficiency" },
        { type: chart.barchart, x: "Frequency_of_Traveling_by_Air" },
        { type: chart.barchart, x: "Heating_Energy_Source" },
        { type: chart.barchart, x: "How_Often_Shower" },
        { type: chart.barchart, x: "Sex" },
        { type: chart.barchart, x: "Social_Activity" },
        { type: chart.barchart, x: "Transport" },
        { type: chart.barchart, x: "Vehicle_Type" },
        { type: chart.barchart, x: "Waste_Bag_Size" },
        { type: chart.histogram, x: "CarbonEmission" },
        { type: chart.histogram, x: "How_Long_Internet_Daily_Hour" },
        { type: chart.histogram, x: "How_Long_TV_PC_Daily_Hour" },
        { type: chart.histogram, x: "How_Many_New_Clothes_Monthly" },
        { type: chart.histogram, x: "Monthly_Grocery_Bill" },
        { type: chart.histogram, x: "Vehicle_Monthly_Distance_Km" },
        { type: chart.histogram, x: "Waste_Bag_Weekly_Count" },
    ];

    //Event Handlers
    const handleSelectVar1 = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setVar1(parseInt(event.target.value));
        setVar2(-1);
        setAttribute(menuItems[parseInt(event.target.value)]);
    };

    const handleSelectVar2 = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setAttribute({
            type: chart.scatterplot,
            x: "",
            scat_x: menuItems[var1],
            scat_y: menuItems[parseInt(event.target.value)],
        });

        setVar2(parseInt(event.target.value));
    };

    function handleClear(): void {
        setAttribute(menuItems[var1]);
        setVar2(-1);
    }

    const handleRadioButton = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        if (parseInt(event.target.value)) {
            setAttribute({
                type: chart.scatterplot,
                x: "",
                scat_x: menuItems[var2],
                scat_y: menuItems[var1],
            });
        } else {
            setAttribute({
                type: chart.scatterplot,
                x: "",
                scat_x: menuItems[var1],
                scat_y: menuItems[var2],
            });
        }
    };

    return (
        <>
            <div className='menu_item'>
                <label htmlFor='var1_dropdown'>Select 1st Attribute</label>
                <select
                    id='var1_dropdown'
                    defaultValue={var1}
                    onChange={handleSelectVar1}
                >
                    <option value={-1} disabled>
                        -- Please select --
                    </option>
                    {menuItems.map((menuItem, i) => {
                        return (
                            <option key={i} value={i}>
                                {menuItem.x.replace(/_/g, " ")}
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
                    value={var2}
                    disabled={graphType.type == chart.none}
                    onChange={handleSelectVar2}
                >
                    <option value={-1} disabled>
                        -- Please select --
                    </option>
                    {menuItems.map((menuItem, i) => {
                        return (
                            <option key={i} value={i}>
                                {menuItem.x.replace(/_/g, " ")}
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
            <div className='menu_item'>
                <label>Select Scatterplot Axis</label>
                <div className='radio_button'>
                    <input
                        id='xy'
                        type='radio'
                        name='choose_axis'
                        value={0}
                        onChange={handleRadioButton}
                        disabled={graphType.type != chart.scatterplot}
                    />
                    <label htmlFor='xy'>(x, y)</label>
                </div>
                <div className='radio_button'>
                    <input
                        id='yx'
                        type='radio'
                        name='choose_axis'
                        value={1}
                        onChange={handleRadioButton}
                        disabled={graphType.type != chart.scatterplot}
                    />
                    <label htmlFor='yx'>(y, x)</label>
                </div>
            </div>
        </>
    );
}
