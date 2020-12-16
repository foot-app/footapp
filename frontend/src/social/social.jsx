import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { searchUsers } from './socialActions'
import SocialSearchBar from './socialSearchBar'
import SocialSearchedUserInfo from './socialSearchedUserInfo'
import SocialFriendsList from './socialFriendsList'
import SocialPendingFriendshipRequests from './socialPendingFriendshipRequests'
import { getFriendship, getPendingFriendshipRequests } from './socialActions'

class Social extends Component {
    constructor(props) {
        super(props)

        this.props.getFriendship(this.props.auth.user.nickname)
        this.props.getPendingFriendshipRequests(this.props.auth.user.nickname)
    }

    render() {
        return (
            <div id='social-content' className='container'>
                <SocialSearchBar />
                <SocialSearchedUserInfo />
                <SocialFriendsList />
                <SocialPendingFriendshipRequests />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    social: state.social,
    auth: state.auth
})
const mapDispatchToProps = dispatch => bindActionCreators({
    searchUsers, getFriendship, getPendingFriendshipRequests
} , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Social)