import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { getFriendship, cancelFriendship } from './socialActions'

class SocialFriendsList extends Component {
    constructor(props) {
        super(props)

        this.props.getFriendship(this.props.auth.user.nickname)
    }
    
    render() {
        const { friendsList } = this.props.social

        const renderFriendsList = (friends) => {
            const friendsList = friends || []

            return friendsList.map((friend, index) => (
                <Row key={index}>
                    <Grid cols='6' className='d-flex align-items-center justify-content-end text-white'>
                        {friend.targetUserNickname == this.props.auth.user.nickname ? friend.requesterUserNickname : friend.targetUserNickname}
                    </Grid>
                    <Grid cols='6' className='d-flex align-items-center justify-content-start'>
                        <button className='btn btn-danger' data-test-id={`cancelFriendship-${index}`} onClick={ () => this.props.cancelFriendship(friend._id, friend.targetUserNickname) }>Desfazer amizade</button>
                    </Grid>
                </Row>
            ))
        }

        return (
            <Row id='friendsList-row'>
                <Grid cols='12'>
                    <fieldset>
                        <legend className='text-center'>Amigos</legend>
                        { renderFriendsList(friendsList) }
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
    getFriendship, cancelFriendship 
} , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(SocialFriendsList)