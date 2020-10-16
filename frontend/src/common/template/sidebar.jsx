import React, { Component } from 'react'

import SidebarItem from './sidebarItem'

class Sidebar extends Component {
    render() {
        return (
            <div id="menu-sidebar" className="sidenav" data-state='closed'>
                <SidebarItem path='/profile' icon='fa fa-user' name='Perfil' />
            </div>
        )
    }
}

export default Sidebar