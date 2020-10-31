import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SidebarItem from './sidebarItem'
import { logout } from '../../auth/authActions'

class Sidebar extends Component {
    render() {
        return (
            <div id="menu-sidebar" className="sidenav" data-state='closed'>
                <SidebarItem path='/profile' icon='fa fa-user' name='Perfil' />
                <SidebarItem path='/matches' icon='fa fa-play-circle' name='Partidas' />
                <SidebarItem icon='fa fa-sign-out' name='Sair' action={() => this.props.logout()} />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ logout } , dispatch)
export default connect(null, mapDispatchToProps)(Sidebar)