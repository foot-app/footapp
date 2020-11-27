import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Row from '../common/layout/row'
import InputDefault from '../common/form/inputDefault'
import ProfilePictureEdit from './profilePictureEdit'

class ProfileEditFormRegistrationInfo extends Component {
    render() {
        return (
            <fieldset>
                <legend>Cadastro</legend>
                <div className='form-group'>
                    <Row>
                        <InputDefault cols='12 4' name='name' labelText='Nome completo' component='input' className='form-control' type='text' dataTestId='name' />
                        <InputDefault cols='12 4' name='nickname' labelText='Nome de usuário' component='input' className='form-control' type='text' dataTestId='nickname' />
                        <ProfilePictureEdit />
                    </Row>
                </div>
            </fieldset>
        )
    }
}

const mapStateToProps = state => ({ 
    auth: state.auth,
    profile: state.profile
})
const mapDispatchToProps = dispatch => bindActionCreators({  } , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditFormRegistrationInfo)