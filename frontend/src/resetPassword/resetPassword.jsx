import React, { Component } from 'react'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Grid from '../common/layout/grid'
import Messages from '../common/msg/messages'
import consts from '../consts'

class ResetPassword extends Component {

    constructor(props) {
        super(props)
        this.state = {email: ''}

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ email: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        const email = this.state.email
        axios
        .post(`${consts.OAPI_URL}/resetPassword/sendEmail`, { email })
            .then(resp => {
                toastr.success('Sucesso', 'Sua solicitação de redefinição de senha foi enviada com sucesso! Confira seu e-mail para proseguir com o procedimento.', {
                    onHideComplete: () => window.location = '/'
                })
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }

    render() {
        return (
            <div>
                <div className='container reset-password-container'>
                    <form role='form' onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <h1 data-test-id='reset_password_title'>Recuperação de senha</h1>
                        </div>
                        <div>
                            <div className='form-group'>
                                <input data-test-id='email_input' type='text' className='reset-password-input' placeholder='e-mail' onChange={this.handleChange} value={this.state.email}/>
                            </div>
                            <div className='form-group'>
                                <Grid cols='12 4' offset='0 4'>
                                    <button data-test-id='confirm_btn' type='submit' className='reset-password-btn'>Enviar</button>
                                </Grid>
                            </div>
                        </div>
                    </form>
                    <Messages />
                </div>
            </div>
        )
    }
}

export default ResetPassword;