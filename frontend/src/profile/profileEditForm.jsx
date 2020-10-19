import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import normalizeWeight from '../common/form/masks/normalizeWeight'
import normalizeHeight from '../common/form/masks/normalizeHeight'

class ProfileEditForm extends Component {
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
                            <Grid cols='12 4' offset='0 2'>
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
const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => bindActionCreators({} , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditForm)