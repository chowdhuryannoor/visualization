import { MouseEventHandler, useState } from "react";
import { attribute, chart } from "../utils/attribute";

interface MenuProps {
    graphType: attribute;
    setAttribute: (graphType: attribute) => void;
    handleFlip: () => void;
}

function Menu({ graphType, setAttribute, handleFlip }: MenuProps) {
    const [var1, setVar1] = useState<number>(-1);
    const [var2, setVar2] = useState<number>(-1);

    const menuItems: attribute[] = [
        { type: chart.barchart, x: "categorial1" },
        { type: chart.barchart, x: "categorial2" },
        { type: chart.barchart, x: "categorial3" },
        { type: chart.barchart, x: "categorial4" },
        { type: chart.histogram, x: "numeric1" },
        { type: chart.histogram, x: "numeric2" },
        { type: chart.histogram, x: "numeric3" },
        { type: chart.histogram, x: "numeric4" },
    ];

    //Event Handlers
    const handleSelectVar1 = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setVar1(parseInt(event.target.value));
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

        setVar2(parseInt(event.target.value));
    };

    function handleClear(): void {
        setAttribute(menuItems[var1]);
        setVar2(-1);
    }

    const handleRadioButton = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        if (parseInt(event.target.value))
            setAttribute({
                type: chart.scatterplot,
                x: menuItems[var2].x,
                y: menuItems[var1].x,
            });
        else
            setAttribute({
                type: chart.scatterplot,
                x: menuItems[var1].x,
                y: menuItems[var2].x,
            });
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
                        // checked={
                        //     var1 != -1 &&
                        //     var2 != -1 &&
                        //     graphType.y == menuItems[var1].x &&
                        //     graphType.x == menuItems[var1].x
                        // }
                        onChange={handleRadioButton}
                    />
                    <label htmlFor='yx'>(y, x)</label>
                </div>
            </div>
        </>
    );
}

export default Menu;
