import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import { resetForm } from './matchActions'

import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import normalizeDate from '../common/form/masks/normalizeDate'
import normalizeSchedule from '../common/form/masks/normalizeSchedule'
import normalizeNumber from '../common/form/masks/normalizeAdressNumber'

  
class MatchCreateForm extends Component {


    cancelEdit() {
        this.props.resetForm();
        window.location = '#/matches'
    }

    render() {
        
        const { handleSubmit } = this.props

        return (
            <form role='form' onSubmit={handleSubmit} id='profileEdit-form'>
                <fieldset>
                    <legend>Partida</legend>
                    <div className='form-group'>
                        <Row>
                            <Grid cols='12'>
                                <label htmlFor='name'>Nome</label>
                                <Field name='name' component='input'
                                    className='form-control'
                                    data-test-id='name'
                                    type='text'/>
                            </Grid>
                        </Row>
                        <Row>
                            <Grid cols='12 4'>
                                <label htmlFor='rentAmount'>Valor do aluguel</label>
                                <Field name='rentAmount' component='input'
                                    className='form-control'
                                    data-test-id='rentAmount'
                                    type='text'/>
                            </Grid>
                            <Grid cols='12 4'>
                                <label htmlFor='matchType'>Tipo de partida</label>
                                <Field name='matchType' component='select'
                                    data-test-id='matchType'
                                    className='form-control'>
                                        <option value='fut7'>Fut7</option>
                                        <option value='futsal'>Futsal</option>
                                </Field>
                            </Grid>
                            <Grid cols='12 4'>
                                <label htmlFor='creatorHasBall'>Criador possui bola?</label>
                                <Field name='creatorHasBall' component='select'
                                    data-test-id='creatorHasBall'
                                    className='form-control'>
                                        <option value='false'>Não possui</option>
                                        <option value='true'>Possui</option>
                                </Field>
                            </Grid>
                        </Row>
                        <Row>
                            <Grid cols='12 4'>
                                <label htmlFor='creatorHasVest'>Criador possui coletes?</label>
                                <Field name='creatorHasVest' component='select'
                                    data-test-id='creatorHasVest'
                                    className='form-control'>
                                        <option value='false'>Não possui</option>
                                        <option value='true'>Possui</option>
                                </Field>
                            </Grid>
                            <Grid cols='12 4'>
                                <label htmlFor='goalkeeperPays'>Goleiro paga?</label>
                                <Field name='goalkeeperPays' component='select'
                                    data-test-id='goalkeeperPays'
                                    className='form-control'>
                                        <option value='false'>Não</option>
                                        <option value='true'>Sim</option>
                                </Field>
                            </Grid>
                        </Row>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Local e horário</legend>
                    <div className='form-group'>
                        <Row>
                            <Grid cols='12 10'>
                                <label htmlFor='street'>Rua</label>
                                <Field name='street' component='input'
                                    className='form-control'
                                    data-test-id='street'
                                    type='text'/>
                            </Grid>
                            <Grid cols='12 2'>
                                <label htmlFor='number'>Número</label>
                                <Field name='number' component='input'
                                    className='form-control'
                                    data-test-id='number'
                                    normalize={normalizeNumber}
                                    type='text'/>
                            </Grid>
                        </Row>
                        <Row>
                            <Grid cols='12 4'>
                                <label htmlFor='neighborhood'>Bairro</label>
                                <Field name='neighborhood' component='input'
                                    className='form-control'
                                    data-test-id='neighborhood'
                                    type='text'/>
                            </Grid>
                            <Grid cols='12 4'>
                                <label htmlFor='city'>Cidade</label>
                                <Field name='city' component='input'
                                    className='form-control'
                                    data-test-id='city'
                                    type='text'/>
                            </Grid>
                            <Grid cols='12 4'>
                                <label htmlFor='state'>Estado</label>
                                <Field name='state' component='input'
                                    className='form-control'
                                    data-test-id='state'
                                    type='text'/>
                            </Grid>
                        </Row>
                        <Row>
                            <Grid cols='12 6'>
                                <label htmlFor='date'>Data</label>
                                <Field name='date' component='input'
                                    className='form-control'
                                    placeholder={'DD/MM/AA'}
                                    data-test-id='date'
                                    normalize={normalizeDate}
                                    type='text'/>
                            </Grid>
                            <Grid cols='12 6'>
                                <label htmlFor='schedule'>Horário</label>
                                <Field name='schedule' component='input'
                                    className='form-control'
                                    placeholder={'HH:MM'}
                                    data-test-id='schedule'
                                    normalize={normalizeSchedule}
                                    type='text'/>
                            </Grid>
                        </Row>
                        
                    </div>
                </fieldset>
                <button type='submit' className='btn btn-success' data-test-id='submit-button'>Criar</button>
                <button type='button' className='btn btn-info' onClick={() => this.cancelEdit()} 
                    data-test-id='cancel-button'>Cancelar
                </button>
            </form>
        )
    }
}

MatchCreateForm = reduxForm({
    form: 'createMatchForm',
    destroyOnUnmount: false
})(MatchCreateForm)

const mapStateToProps = state => ({initialValues: {matchType: 'fut7', creatorHasVest: 'false', creatorHasBall: 'false', goalkeeperPays: 'false'}})
const mapDispatchToProps = dispatch => bindActionCreators({ resetForm } , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(MatchCreateForm)