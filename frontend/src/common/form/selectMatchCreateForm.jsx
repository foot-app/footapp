import React, { Component } from 'react'

import Grid from '../layout/grid'
import { Field } from 'redux-form'


class SelectMatchCreateForm extends Component {
    render() {
        const renderSelectOptions = options => {
            const arrOptions = options || []

            return arrOptions.map(option => (
                <option value={option.value}>{option.text}</option>
            ))
        }

        return (
            <Grid cols={this.props.cols}>
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <Field name={this.props.name} component='select'
                    data-test-id={this.props.name}
                    className='form-control'>
                        {renderSelectOptions(this.props.options)}
                </Field>
            </Grid>
        )
    }
}

export default SelectMatchCreateForm