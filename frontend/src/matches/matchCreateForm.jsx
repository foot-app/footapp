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
import InputMatchCreateForm from '../common/form/inputMatchCreateForm'
import SelectMatchCreateForm from '../common/form/selectMatchCreateForm'
  
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
                            <InputMatchCreateForm cols='12' name='name' label='Nome' />
                        </Row>
                        <Row>
                            <InputMatchCreateForm cols='12 4' name='rentAmount' label='Valor do aluguel' />
                            <SelectMatchCreateForm cols='12 4' name='matchType' 
                                label='Tipo de partida' 
                                options={[{ value: 'fut7', text: 'Fut7' }, { value: 'futsal', text: 'Futsal' }]} />
                            <SelectMatchCreateForm cols='12 4' name='creatorHasBall' 
                                label='Criador possui bola?' 
                                options={[{ value: 'false', text: 'Não possui' }, { value: 'true', text: 'Possui' }]} />
                        </Row>
                        <Row>
                            <SelectMatchCreateForm cols='12 4' name='creatorHasVest' 
                                label='Criador possui coletes?' 
                                options={[{ value: 'false', text: 'Não possui' }, { value: 'true', text: 'Possui' }]} />
                            <SelectMatchCreateForm cols='12 4' name='goalkeeperPays' 
                                label='Goleiro paga?' 
                                options={[{ value: 'false', text: 'Não' }, { value: 'true', text: 'Sim' }]} />
                        </Row>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Local e horário</legend>
                    <div className='form-group'>
                        <Row>
                            <InputMatchCreateForm cols='12 10' name='street' label='Rua' />
                            <InputMatchCreateForm cols='12 2' name='number' label='Número' 
                                normalize={normalizeNumber} />
                        </Row>
                        <Row>
                            <InputMatchCreateForm cols='12 4' name='neighborhood' label='Bairro' />
                            <InputMatchCreateForm cols='12 4' name='city' label='Cidade' />
                            <InputMatchCreateForm cols='12 4' name='state' label='Estado' />
                        </Row>
                        <Row>
                            <InputMatchCreateForm cols='12 6' name='date' label='Data'
                                placeholder={'DD/MM/AA'}
                                normalize={normalizeDate} />
                            <InputMatchCreateForm cols='12 6' name='schedule' label='Horário' 
                                normalize={normalizeSchedule}
                                placeholder={'HH:MM'} />
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