import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import If from '../common/operator/if'
import { searchUsers } from './socialActions'
import consts from '../consts'
import { clearUserInfo } from './socialUtils'

class SocialSearchBar extends Component {
    constructor(props) {
        super(props)
        this.searchUsers = this.searchUsers.bind(this)
        this.renderSearchResultList = this.renderSearchResultList.bind(this)
    }

    componentDidMount() {
        $('#searchedUser-info-row').hide()
    }

    searchUsers(event) {
        const searchValue = event.target.value

        $('#searchedUser-info-row').hide()
        this.props.searchUsers(searchValue)
    }

    showPositions(positionsArray, selector) {
        positionsArray.forEach((position, index) => {
            $(selector).append(position.toUpperCase() + (index < positionsArray.length - 1 ? '-' : ''))
        })
    }

    loadUserInfo(user) {
        clearUserInfo()
        $('#searchedUser-info-row').show()
        $('#userSearch-list').hide()
        $('#userSearch').val('')
        
        const userFut7Positions = user.fut7Positions || []
        const userFutsalPositions = user.futsalPositions || []
        
        $('#searchedUser-img').attr('src', user.profilePicture ? user.profilePicture : consts.PROFILE_PICTURE_DEFAULT)
        $('#searchedUser-img').attr('alt', 'Foto do jogador' + user.name)
        $('#searchedUser-info-name').text(user.name)
        $('#searchedUser-info-nickname').text(user.nickname)

        this.showPositions(userFut7Positions, '#fut7-positions')
        this.showPositions(userFutsalPositions, '#futsal-positions')
    }

    renderSearchResultList(searchUserList) {
        $('#userSearch-list').show()
        const userList = searchUserList || []
        const userKey = '_footapp'
        const currentUserInfoLocalStorage = JSON.parse(localStorage.getItem(userKey));
        const currentUserNickname = currentUserInfoLocalStorage.nickname

        return userList.map((user, index) => (
            <If test={user.nickname != currentUserNickname} key={index}>
                <li key={index} className='text-center' onClick={() => this.loadUserInfo(user)}>{user.name}</li>
            </If>
        ))
    }

    render() {
        return (
            <Row>
                <Grid cols='12 4' offset='0 2' className='text-center'>
                    <label htmlFor=''>Adicione o(a) amigo(a) boleiro(a) </label>
                </Grid>
                <Grid cols='12 4'>
                    <div className='input-group'>
                        <span className='input-group-append'>
                            <span className='input-group-text bg-transparent'>
                                <i className='icon ion-ios-search'></i>
                            </span>
                        </span>
                        <input name='userSearch' id='userSearch' data-test-id='userSearch' className='form-control' onChange={ this.searchUsers } />
                    </div>
                    <ul id='userSearch-list' className='list-group' data-test-id='userSearch-list'>
                        { this.renderSearchResultList(this.props.social.searchUserList) }
                    </ul>
                </Grid>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ social: state.social })
const mapDispatchToProps = dispatch => bindActionCreators({ searchUsers } , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(SocialSearchBar)