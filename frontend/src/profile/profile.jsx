import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { toastr } from 'react-redux-toastr'
import { getUserByNickname } from './profileActions'
import { changeLoggedUserInfo } from '../auth/authActions'
import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import If from '../common/operator/if'
import { Link } from 'react-router'

class Profile extends Component {
    componentWillMount() {
        const authUser = this.props.auth.user
        if (!this.props.auth.validToken || !authUser) {
            toastr.info('', 'É necessário fazer login antes de acessar as informações de perfil')
            window.location = '/#/auth'
        }
        else {
            this.loadLoggedUserInfo(authUser)
        }
    }

    loadLoggedUserInfo(authUser) {
        let userNickname = authUser.nickname

        const userKey = '_footapp'
        const userInfoLocalStorage = JSON.parse(localStorage.getItem(userKey))
        const userStateNickname = userInfoLocalStorage.nickname

        if (userStateNickname && userNickname != userStateNickname) {
            userNickname = userStateNickname
            this.props.changeLoggedUserInfo(userInfoLocalStorage)
        }

        this.props.getUserByNickname(userNickname, false, true)
    }

    render() {
        return (
            <div id='profile-content' className='container'>
                <section className='record-data-section'>
                    <If test={this.props.profile.userInfo.profilePicture}>
                        <Row id='profilePicture-row'>
                            <Grid cols='12' className='text-center'>
                                <p>
                                    <img src={this.props.profile.userInfo.profilePicture || ''} alt={this.props.profile.userInfo.name || ''}
                                    data-test-id='profilePicture' />
                                </p>
                            </Grid>
                        </Row>
                    </If>
                    <Row id='name-row'>
                        <Grid cols='12' className='text-center'>
                            <p data-test-id='name'>{this.props.profile.userInfo.name || ''}</p>
                        </Grid>
                    </Row>
                    <Row id='nickname-row'>
                        <Grid cols='12' className='text-center'>
                            <p data-test-id='nickname'><span id='best-know-as-span'>Mais conhecido(a) como </span>{this.props.profile.userInfo.nickname || ''}</p>
                        </Grid>
                    </Row>
                </section>
                <section className='physical-characteristics-section'>
                    <Row id='physical-row'>
                        <Grid cols='12' className='text-center'>
                            <p data-test-id='physical-data'>{this.props.profile.userInfo.height || '-'} cm | {this.props.profile.userInfo.weight || '-'} kg | {this.props.profile.userInfo.preferredFoot || '-'}</p>
                        </Grid>
                    </Row>
                </section>
                <Row id='button-row'>
                    <Grid cols='12' className='text-center'>
                        <Link to='/profile/edit' className='btn btn-warning' role='button' data-test-id='edit-button'>
                            <i className='fa fa-pencil'></i>
                        </Link>
                    </Grid>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})
const mapDispatchToProps = dispatch => bindActionCreators({
    getUserByNickname, changeLoggedUserInfo
} , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Profile)