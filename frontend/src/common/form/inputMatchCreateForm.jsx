import React from 'react'

import Grid from '../layout/grid'
import { Field } from 'redux-form'

export default props => (
    <Grid cols={props.cols}>
        <label htmlFor={props.name}>{props.label}</label>
        <Field name={props.name} component='input'
            className='form-control'
            data-test-id={props.name}
            type='text'
            normalize={props.normalize}
            placeholder={props.placeholder} />
    </Grid>
)