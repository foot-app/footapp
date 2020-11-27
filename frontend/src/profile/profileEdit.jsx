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
        this.prepareFormDataAndUpdate = this.prepareFormDataAndUpdate.bind(this)
    }

    componentWillMount() {
        const authUser = this.props.auth.user
        if (!this.props.auth.validToken || !authUser) {
            toastr.info('', 'É necessário fazer login antes de acessar as informações de perfil')
            window.location = '/#/auth'
        }
        else {
            const userNickname = authUser.nickname
            this.props.getUserByNickname(userNickname, this.props.init, true)
        }
    }

    getValuesFromCheckbox(selector, array) {
        $.each($(selector), (index, element) => {
            array.push($(element).val())
        })
    }

    prepareFormDataAndUpdate(values) {
        const userNickname = this.props.auth.user.nickname
        const fut7Positions = []
        const futsalPositions = []

        this.getValuesFromCheckbox("[name^='fut7-positions']:checked", fut7Positions)
        this.getValuesFromCheckbox("[name^='futsal-positions']:checked", futsalPositions)

        values.fut7Positions = fut7Positions
        values.futsalPositions = futsalPositions

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
                        <ProfileEditForm onSubmit={this.prepareFormDataAndUpdate}/>
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