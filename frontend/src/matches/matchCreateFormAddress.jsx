import React from 'react'

import InputMatchCreateForm from '../common/form/inputMatchCreateForm'
import normalizeNumber from '../common/form/masks/normalizeAdressNumber'
import normalizeDate from '../common/form/masks/normalizeDate'
import normalizeSchedule from '../common/form/masks/normalizeSchedule'
import Row from '../common/layout/row'

export default props => (
    <fieldset>
        <legend>Local e horário</legend>
        <div className='form-group'>
            <Row>
                <InputMatchCreateForm cols='12 10' name='street' label='Rua' />
                <InputMatchCreateForm cols='12 2' name='number' label='Número' normalize={normalizeNumber} />
            </Row>
            <Row>
                <InputMatchCreateForm cols='12 4' name='neighborhood' label='Bairro' />
                <InputMatchCreateForm cols='12 4' name='city' label='Cidade' />
                <InputMatchCreateForm cols='12 4' name='state' label='Estado' />
            </Row>
            <Row>
                <InputMatchCreateForm cols='12 6' name='date' label='Data' placeholder={'DD/MM/AA'} normalize={normalizeDate} />
                <InputMatchCreateForm cols='12 6' name='schedule' label='Horário' normalize={normalizeSchedule} placeholder={'HH:MM'} />
            </Row>
            
        </div>
    </fieldset>
)