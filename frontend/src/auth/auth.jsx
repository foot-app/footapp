import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import Grid from '../common/layout/grid'
import Input from '../common/form/inputAuth'
import Messages from '../common/msg/messages'
import { login, signup } from './authActions'

class Auth extends Component {
    constructor(props) {
        super(props)
        this.state = { loginMode: true }
    }
    changeMode() {
        this.setState({ loginMode: !this.state.loginMode })
    }
    onSubmit(values) {
        const { login, signup } = this.props
        this.state.loginMode ? login(values) : signup(values)
    }
    render() {
        const { loginMode } = this.state
        const { handleSubmit } = this.props
        return (
            <div>
                <div className='container auth-container'>
                    <form role='form' onSubmit={handleSubmit(v => this.onSubmit(v))}>
                        <Field component={Input} type="input" name="name" 
                            dataTestId='name' className='auth-input' placeholder="Nome" hide={loginMode} />
                        <Field component={Input} type="email" name="email"
                            dataTestId='email' className='auth-input' placeholder="E-mail" />
                        <Field component={Input} type="password" name="password"
                            dataTestId='password' className='auth-input' placeholder="Senha" />
                        <Field component={Input} type="password" name="confirm_password"
                            dataTestId='confirm_password' className='auth-input' placeholder="Confirmar Senha" hide={loginMode} />
                        <div className="form-group">
                            <Grid cols='12 4' offset='0 4'>
                                <button type="submit"
                                    className="btn btn-block btn-flat auth-btn">
                                    {loginMode ? 'Entrar' : 'Registrar'}
                                </button>
                            </Grid>
                        </div>
                        <div className="form-group">
                            <Grid cols='12 4' offset='0 4' className='text-center'>
                                <a onClick={() => this.changeMode()} className='auth-login-mode'>
                                    {loginMode ? 'Novo usuário? Registrar aqui!' :
                                        'Já é cadastrado? Entrar aqui!'}
                                </a>
                            </Grid>
                        </div>
                        <div className="form-group">
                            <Grid cols='12 4' offset='0 4' className='text-center'>
                                {loginMode &&
                                    <Link to='/reset-password'>Esqueceu sua senha?</Link>
                                }
                            </Grid>
                        </div>
                    </form>
                    <Messages />
                </div>
            </div>
        )
    }
}
Auth = reduxForm({ form: 'authForm' })(Auth)
const mapDispatchToProps = dispatch => bindActionCreators({ login, signup }, dispatch)
export default connect(null, mapDispatchToProps)(Auth)