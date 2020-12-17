import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr'
import axios from 'axios'
import SearchBar from './searchBar'
import PublicMatchesList from './publicMatchesList'

import consts from '../consts'

class SearchPage extends Component {
    constructor(props) {
        super();
        this.state = { publicMatches: []}
        this.getPublicMatches = this.getPublicMatches.bind(this);
        this.getPublicMatches();
    }

    getPublicMatches() {
        const _this = this;
        axios.get(`${consts.API_URL}/publicMatches/list`)
            .then(resp => {
                this.setState({publicMatches: resp.data})
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }

    render() {
        return (
            <div className='search-container'>
                <PublicMatchesList publicMatches={this.state.publicMatches} />
                <SearchBar />
            </div>       
        )
    }
}

export default SearchPage