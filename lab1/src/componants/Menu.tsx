function Menu() {
    const menuItems = ["item1", "item2", "item3", "item4", "item5"];
    return (
        <>
            <ul className='list-group'>
                {menuItems.map((item) => (
                    <li className='list-group-item' key={item}>
                        {item}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Menu;
