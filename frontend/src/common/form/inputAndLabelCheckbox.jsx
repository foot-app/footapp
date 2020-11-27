import React from 'react'

export default props => (
    <div>
        <label htmlFor={props.name} className='form-check-label'>
            <input type='checkbox' id={props.name} name={props.name} className='form-check-input'
                value={props.value} />{props.label}
        </label>
    </div>
)