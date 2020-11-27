import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, change } from 'redux-form'

import ProfileEditFormPhysicInfo from './profileEditFormPhysicInfo'
import ProfileEditFormRegistrationInfo from './profileEditFormRegistrationInfo'
import ProfileEditFormPositions from './profileEditFormPositions'

class ProfileEditForm extends Component {
    cancelEdit() {
        window.location = '#/profile'
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <form role='form' onSubmit={handleSubmit} id='profileEdit-form'>
                <ProfileEditFormRegistrationInfo />
                <ProfileEditFormPhysicInfo />
                <ProfileEditFormPositions />
                <button type='submit' className='btn btn-success' data-test-id='submit-button'>Alterar</button>
                <button type='button' className='btn btn-info' onClick={() => this.cancelEdit()} 
                    data-test-id='cancel-button'>Cancelar
                </button>
            </form>
        )
    }
}

ProfileEditForm = reduxForm({
    form: 'profileEditForm',
    destroyOnUnmount: false
})(ProfileEditForm)
const mapStateToProps = state => ({ 
    auth: state.auth,
    profile: state.profile
})
const mapDispatchToProps = dispatch => bindActionCreators({ change } , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditForm)