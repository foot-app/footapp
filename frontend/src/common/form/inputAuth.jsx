import React from 'react'
import If from '../operator/if'
import Grid from '../layout/grid'

export default props => (
    <If test={!props.hide}>
        <div className='form-group'>
            <Grid cols='12 4' offset='0 4'>
                <input {...props.input}
                    className={`${props.className}`}
                    placeholder={props.placeholder}
                    readOnly={props.readOnly}
                    type={props.type}
                    data-test-id={props.dataTestId} />
            </Grid>
        </div>
    </If>
)