import React, { Component } from 'react'

class SidebarItem extends Component {
    closeSidebarAndRedirect() {
        document.getElementById("menu-sidebar").style.width = "0";
        document.getElementById("menu-sidebar").setAttribute('data-state', 'closed')
        window.location = '#' + this.props.path
    }

    render() {
        return (
            <div onClick={() => this.props.action ? this.props.action() : this.closeSidebarAndRedirect()}>
                <i className={this.props.icon}></i> {this.props.name}
            </div>
        )
    }
}

export default SidebarItem