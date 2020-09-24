import React from 'react'

import Messages from '../common/msg/messages'

export default props => (
    <div>
        <div>
            {props.children}
        </div>
        <Messages />
    </div>
)