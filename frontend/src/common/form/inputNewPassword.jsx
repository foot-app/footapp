import React from 'react'

export default props => (
    <div className='form-group'>
        <input type='password' className='new-password-input' 
            placeholder={props.placeholder}
            onChange={props.onChange} 
            value={props.value}/>
    </div>
)