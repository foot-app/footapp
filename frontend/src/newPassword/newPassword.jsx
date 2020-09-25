import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr'
import axios from 'axios'

import Grid from '../common/layout/grid'
import Messages from '../common/msg/messages'
import consts from '../consts'

class NewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmationPassword: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmationPasswordChange = this.handleConfirmationPasswordChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        axios.post(`${consts.OAPI_URL}/resetPassword/changePassword`, {token: this.props.params.token, password: this.state.password, confirmationPassword: this.state.confirmationPassword})
            .then(resp => {
                toastr.success('Sucesso', 'Sua senha foi redefinada com sucesso!')
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }

    handlePasswordChange(event) {
        const state = this.state
        this.setState({password: event.target.value, confirmationPassword: state.confirmationPassword});
    }

    handleConfirmationPasswordChange(event) {
        const state = this.state
        this.setState({password: state.password, confirmationPassword: event.target.value});
    }

    render() {
        return (
            <div>
                <div className='container new-password-container'>
                    <form role='form' onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <h1>Nova senha</h1>
                        </div>
                        <div className='form-group'>
                            <input type='password' className='new-password-input' placeholder='Nova senha' onChange={this.handlePasswordChange} value={this.state.password}/>
                        </div>
                        <div className='form-group'>
                            <input type='password' className='new-password-input' placeholder='Confirmar senha' onChange={this.handleConfirmationPasswordChange} value={this.state.confirmationPassword}/>
                        </div>
                        <div className='form-group'>
                            <Grid cols='12 4' offset='0 4'>
                                <button type='submit' className='new-password-btn'>Enviar</button>
                            </Grid>
                        </div>
                    </form>
                    <Messages/>
                </div>
            </div>
        )
    }
}

export default NewPassword;
