import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Field, change } from 'redux-form'
import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import InputDefault from '../common/form/inputDefault'
import { uploadImageToFirebase, deleteImageFromFirebase } from '../firebase/firebaseTasks'
import { toastr } from 'react-redux-toastr'

class ProfileEditFormRegistrationInfo extends Component {
    constructor(props) {
        super(props);
        this.treatImage = this.treatImage.bind(this);
    }
    
    treatImage(element) {
        const _this = this
        const el = element.target
        const imageFile = el.files[0]
        const targetFieldName = el.name.substring(0, el.name.indexOf('Aux'))
        const userEmailReplaced = this.props.auth.user.email.replace('@', '.')
        
        if (imageFile.type == 'image/jpeg' || imageFile.type == 'image/jpg' || imageFile.type == 'image/png') {
            const showPreviewImage = imageUrl => { 
                const previewProfilePictureElement = document.getElementById('previewProfilePicture')
                previewProfilePictureElement.classList.remove('d-none') 
                previewProfilePictureElement.src = imageUrl
            }

            const fillProfilePictureField = imageUrl => { 
                _this.props.change('profileEditForm', targetFieldName, imageUrl)
                showPreviewImage(imageUrl)
            }

            uploadImageToFirebase(imageFile, userEmailReplaced, fillProfilePictureField)
        }
        else {
            toastr.warning('', 'Formato inválido. Formatos permitidos: png, jpg e jpeg.')
        }
    }

    removeImage(targetField, targetPreview) {
        const clearFieldsAndPreview = () => {
            const previewProfilePictureElement = document.getElementById(targetPreview)
            previewProfilePictureElement.classList.add('d-none')
            previewProfilePictureElement.src = ''

            document.getElementsByName(targetField)[0].value = ''
            document.getElementsByName(`${targetField}Aux`)[0].value = ''
        }

        const imageUrl = document.getElementsByName(targetField)[0].value || ''

        if (!imageUrl || imageUrl == this.props.profile.userInfo.profilePicture) return

        deleteImageFromFirebase(imageUrl, clearFieldsAndPreview)
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <fieldset>
                <legend>Cadastro</legend>
                <div className='form-group'>
                    <Row>
                        <InputDefault cols='12 4' name='name' labelText='Nome completo' component='input' className='form-control' type='text' dataTestId='name' />
                        <InputDefault cols='12 4' name='nickname' labelText='Nome de usuário' component='input' className='form-control' type='text' dataTestId='nickname' />
                        <Grid cols='12 4'>
                            <label htmlFor='profilePictureAux'>Foto de perfil</label>
                            <div className='input-group'>
                                <input type='file' name='profilePictureAux' className='form-control'
                                    onChange={this.treatImage} data-test-id='profilePictureAux' />
                                <div className='input-group-append'>
                                    <span className='input-group-text' 
                                        onClick={ () => this.removeImage('profilePicture', 'previewProfilePicture') }
                                        data-test-id='profilePictureAux_delete'>
                                        <i className='fa fa-times'></i>
                                    </span>
                                </div>
                            </div>
                            <Field name='profilePicture' component='input'
                                className='form-control'
                                type='hidden'
                                data-test-id='profilePicture' />
                            <img id='previewProfilePicture' src={this.props.profile.userInfo.profilePicture || ''} className={!this.props.profile.userInfo.profilePicture ? 'd-none' : 'img-thumbnail'} />
                        </Grid>
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
const mapDispatchToProps = dispatch => bindActionCreators({ change } , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditFormRegistrationInfo)