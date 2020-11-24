import React from 'react'

import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import InputDefault from '../common/form/inputDefault'
import { Field } from 'redux-form'
import normalizeHeight from '../common/form/masks/normalizeHeight'
import normalizeWeight from '../common/form/masks/normalizeWeight'

export default props => (
    <fieldset>
        <legend>Físico</legend>
        <div className='form-group'>
            <Row>
                <InputDefault cols='12 4' name='height' labelText='Altura (cm)' component='input' className='form-control' type='text' normalize={normalizeHeight} dataTestId='height' />
                <InputDefault cols='12 4' name='weight' labelText='Peso (kg)' component='input' className='form-control' type='text' normalize={normalizeWeight} dataTestId='weight' />
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
)