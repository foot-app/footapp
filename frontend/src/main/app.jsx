import React from 'react'

import Messages from '../common/msg/messages'

export default props => (
    <div>
        <div>
            <h1>Hello World</h1>
            {props.children}
        </div>
        <Messages />
    </div>
)