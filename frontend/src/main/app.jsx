import React from 'react'

import Messages from '../common/msg/messages'
import Header from '../common/template/header'
import Sidebar from '../common/template/sidebar'

export default props => (
    <div>
        <Header />
        <Sidebar />
        <div>
            {props.children}
        </div>
        <Messages />
    </div>
)