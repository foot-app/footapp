import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { searchUsers } from './socialActions'
import SocialSearchBar from './socialSearchBar'
import SocialSearchedUserInfo from './socialSearchedUserInfo'

class Social extends Component {
    render() {
        return (
            <div id='social-content' className='container'>
                <SocialSearchBar />
                <SocialSearchedUserInfo />
            </div>
        )
    }
}

const mapStateToProps = state => ({ social: state.social })
const mapDispatchToProps = dispatch => bindActionCreators({ searchUsers } , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Social)