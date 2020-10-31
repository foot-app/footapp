import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector, change } from 'redux-form'

import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import normalizeWeight from '../common/form/masks/normalizeWeight'
import normalizeHeight from '../common/form/masks/normalizeHeight'
import { toastr } from 'react-redux-toastr'
import { uploadImageToFirebase, deleteImageFromFirebase } from '../firebase/firebaseTasks'

class ProfileEditForm extends Component {
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
                _this.props.change(targetFieldName, imageUrl)
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

    cancelEdit() {
        window.location = '#/profile'
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <form role='form' onSubmit={handleSubmit} id='profileEdit-form'>
                <fieldset>
                    <legend>Cadastro</legend>
                    <div className='form-group'>
                        <Row>
                            <Grid cols='12 4'>
                                <label htmlFor='name'>Nome completo</label>
                                <Field name='name' component='input'
                                    className='form-control'
                                    type='text'
                                    data-test-id='name' />
                            </Grid>
                            <Grid cols='12 4'>
                                <label htmlFor='nickname'>Nome de usuário</label>
                                <Field name='nickname' component='input'
                                    className='form-control'
                                    type='text'
                                    data-test-id='nickname' />
                            </Grid>
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
                <fieldset>
                    <legend>Físico</legend>
                    <div className='form-group'>
                        <Row>
                            <Grid cols='12 4'>
                                <label htmlFor='height'>Altura (cm)</label>
                                <Field name='height' component='input'
                                    className='form-control'
                                    type='text'
                                    normalize={normalizeHeight}
                                    data-test-id='height' />
                            </Grid>
                            <Grid cols='12 4'>
                                <label htmlFor='weight'>Peso (kg)</label>
                                <Field name='weight' component='input'
                                    className='form-control'
                                    type='text'
                                    normalize={normalizeWeight}
                                    data-test-id='weight' />
                            </Grid>
                            <Grid cols='12 4'>
                                <label htmlFor='preferredFoot'>Pé preferido</label>
                                <Field name='preferredFoot' component='select'
                                    className='form-control'
                                    data-test-id='preferredFoot'>
                                        <option value='Direito'>Direito</option>
                                        <option value='Esquerdo'>Esquerdo</option>
                                        <option value='Ambos'>Ambos</option>
                                </Field>
                            </Grid>
                        </Row>
                    </div>
                </fieldset>
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