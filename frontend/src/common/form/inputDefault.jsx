import React from 'react'
import { Field } from 'redux-form'
import Grid from '../layout/grid'

export default props => (
    <Grid cols={props.cols}>
        <label htmlFor={props.name}>{props.labelText}</label>
        <Field name={props.name} component={props.component}
            className={props.className}
            type={props.type}
            normalize={props.normalize}
            data-test-id={props.dataTestId} />
    </Grid>
)