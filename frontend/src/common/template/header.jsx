import React, { Component } from 'react'
import { Link } from 'react-router'

class Header extends Component {
    toggleSidebar() {
        if (document.getElementById("menu-sidebar").getAttribute('data-state') == 'opened') {
            document.getElementById("menu-sidebar").style.width = "0";
            document.getElementById("menu-sidebar").setAttribute('data-state', 'closed')
        }
        else {
            document.getElementById("menu-sidebar").style.width = "250px";
            document.getElementById("menu-sidebar").setAttribute('data-state', 'opened')
        }
    }
    
    render() {
        return (
            <nav className='navbar navbar-expand-lg fixed-top navbar-dark bg-black' id='header'>
                <button type='button' className='btn btn-dark'
                    onClick={this.toggleSidebar} >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='d-md-flex d-block flex-row mx-md-auto mx-0'>
                    <Link to='/' className='navbar-brand'>
                        <p id='navbar-brand-p'>Footapp</p>
                    </Link>
                </div>
            </nav>
        )
    }
}

export default Header