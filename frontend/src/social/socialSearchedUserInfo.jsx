import React, { Component } from 'react'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'

class SocialSearchedUserInfo extends Component {
    render() {
        return (
            <Row id='searchedUser-info-row'>
                <Grid cols='12 3' >
                    <img src='' alt='' id='searchedUser-img' data-test-id='info-img' />
                </Grid>
                <Grid cols='12 6'>
                    <p id='searchedUser-info-name' data-test-id='info-name'></p>
                    <p id='searchedUser-info-nickname' data-test-id='info-nickname'></p>
                    <p id='searchedUser-info-positions' data-test-id='info-positions'>Fut7: <span id='fut7-positions'></span> | Futsal: <span id='futsal-positions'></span></p>
                </Grid>
                <Grid cols='12 3'>
                    <button className='btn btn-success' id='searchedUser-sendSolicitation-button' data-test-id='sendSolicitation-button'>Enviar solicitação</button>
                </Grid>
            </Row>
        )
    }
}

export default SocialSearchedUserInfo