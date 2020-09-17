import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import App from './app'

class AuthOrApp extends Component {
    render() {
        return <App>{this.props.children}</App>
    }
}

const mapStateToProps = state => ({  })
const mapDispatchToProps = dispatch => bindActionCreators({  }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AuthOrApp)