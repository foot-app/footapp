import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { toastr } from 'react-redux-toastr'
import { getUserByNickname, init, update } from './profileActions'
import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { Link } from 'react-router'
import ProfileEditForm from './profileEditForm'

class ProfileEdit extends Component {
    constructor(props) {
        super(props)
        this.getNicknameAndUpdate = this.getNicknameAndUpdate.bind(this)
    }

    componentWillMount() {
        const authUser = this.props.auth.user
        if (!this.props.auth.validToken || !authUser) {
            toastr.info('', 'É necessário fazer login antes de acessar as informações de perfil')
            window.location = '/#/auth'
        }
        else {
            const userNickname = authUser.nickname
            this.props.getUserByNickname(userNickname, this.props.init)
        }
    }

    getNicknameAndUpdate(values) {
        const userNickname = this.props.auth.user.nickname
        this.props.update(values, userNickname)
    }

    render() {
        return (
            <div id='profileEdit-content' className='container'>
                <Row>
                    <Grid cols='12' className='text-center'>
                        <h2>Altere suas informações</h2>
                    </Grid>
                </Row>
                <Row>
                    <Grid cols='12' className='text-center'>
                        <ProfileEditForm onSubmit={this.getNicknameAndUpdate}/>
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
    getUserByNickname, init, update
} , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit)