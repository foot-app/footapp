import React, { Component } from 'react'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { clearUserInfo, clearSearch } from './socialUtils'

class SocialSearchedUserInfo extends Component {
    resetSearch() {
        clearUserInfo()
        clearSearch()
    }

    render() {
        return (
            <Row id='searchedUser-info-row'>
                <Grid cols='12 3' className='searchedUser-info-div'>
                    <img src='' alt='' id='searchedUser-img' data-test-id='info-img' />
                </Grid>
                <Grid cols='12 6' className='searchedUser-info-div'>
                    <p id='searchedUser-info-name' data-test-id='info-name'></p>
                    <p id='searchedUser-info-nickname' data-test-id='info-nickname'></p>
                    <p id='searchedUser-info-positions' data-test-id='info-positions'>Fut7: <span id='fut7-positions'></span> | Futsal: <span id='futsal-positions'></span></p>
                </Grid>
                <Grid cols='12 3' className='searchedUser-button-div'>
                    <button className='btn btn-success' id='searchedUser-sendSolicitation-button' data-test-id='sendSolicitation-button'>Enviar solicitação</button>
                    <button className='btn btn-info' id='searchedUser-clean-button' data-test-id='clean-button' onClick={ () => this.resetSearch() }><i className='fa fa-close'></i></button>
                </Grid>
            </Row>
        )
    }
}

export default SocialSearchedUserInfo