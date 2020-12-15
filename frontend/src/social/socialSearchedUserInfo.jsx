import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { clearUserInfo, clearSearch } from './socialUtils'
import { sendFriendshipRequest } from './socialActions'

class SocialSearchedUserInfo extends Component {
    resetSearch() {
        clearUserInfo()
        clearSearch()
    }

    sendFriendshipRequisition() {
        this.props.sendFriendshipRequest(this.props.auth.user.nickname, $('#searchedUser-info-nickname').text())
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
                    <button className='btn btn-success' id='searchedUser-sendSolicitation-button' data-test-id='sendSolicitation-button' onClick={ () => this.sendFriendshipRequisition() }>Enviar solicitação</button>
                    <button className='btn btn-info' id='searchedUser-clean-button' data-test-id='clean-button' onClick={ () => this.resetSearch() }><i className='fa fa-close'></i></button>
                </Grid>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ sendFriendshipRequest } , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(SocialSearchedUserInfo)