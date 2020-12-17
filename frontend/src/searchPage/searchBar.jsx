import React from 'react';

class SearchBar extends React.Component {

    constructor() {
        super()
    }

    render() {
        return (
            <div>
                <input
                    className="search-bar"
                    placeholder={"Buscar partida"}
                />
            </div>
        )
    }
}

export default SearchBar;