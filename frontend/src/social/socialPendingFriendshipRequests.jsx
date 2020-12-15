import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { getPendingFriendshipRequests, cancelFriendship, acceptPendingFriendshipRequest } from './socialActions'

class SocialFriendsList extends Component {
    constructor(props) {
        super(props)

        this.props.getPendingFriendshipRequests(this.props.auth.user.nickname)
    }
    
    render() {
        const { pendingFriendshipRequests } = this.props.social

        const renderPendingFriendshipRequests = pendingFriendshipRequests => {
            const pendingFriendshipRequestsList = pendingFriendshipRequests || []
            return pendingFriendshipRequestsList.map((pendingRequest, index) => (
                <Row key={index}>
                    <Grid cols='6' className='d-flex justify-content-end align-items-center text-white'>
                        <span>{pendingRequest.requesterUserNickname || ''}</span>
                    </Grid>
                    <Grid cols='6' className='pendingFriendshipRequests-actions d-flex justify-content-start align-items-center'>
                        <button className='btn btn-success' data-test-id={`acceptPendingFriendshipRequest-${index}`} onClick={ () => this.props.acceptPendingFriendshipRequest(pendingRequest.id, this.props.auth.user.nickname) }><i className='fa fa-check'></i></button>
                        <button className='btn btn-danger' data-test-id={`refusePendingFriendshipRequest-${index}`} onClick={ () => this.props.cancelFriendship(pendingRequest.id, this.props.auth.user.nickname) }><i className='fa fa-close'></i></button>
                    </Grid>
                </Row>
            ))
        }

        return (
            <Row id='friendsList-row'>
                <Grid cols='12' className='text-center'>
                    <fieldset>
                        <legend className='text-center'>Solicitações de amizade</legend>
                        { renderPendingFriendshipRequests(pendingFriendshipRequests) }
                    </fieldset>
                </Grid>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ 
    social: state.social,
    auth: state.auth 
})
const mapDispatchToProps = dispatch => bindActionCreators({ 
    getPendingFriendshipRequests, cancelFriendship, acceptPendingFriendshipRequest
} , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(SocialFriendsList)