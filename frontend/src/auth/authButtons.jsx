import React from 'react'

import Grid from '../common/layout/grid'
import { Link } from 'react-router'

export default props => (
    <div>
        <div className="form-group">
            <Grid cols='12 4' offset='0 4'>
                <button type="submit"
                    className="btn btn-block btn-flat auth-btn">
                    {props.loginMode ? 'Entrar' : 'Registrar'}
                </button>
            </Grid>
        </div>
        <div className="form-group">
            <Grid cols='12 4' offset='0 4' className='text-center'>
                <a onClick={props.changeMode} className='auth-login-mode'>
                    {props.loginMode ? 'Novo usuário? Registrar aqui!' :
                        'Já é cadastrado? Entrar aqui!'}
                </a>
            </Grid>
        </div>
        <div className="form-group">
            <Grid cols='12 4' offset='0 4' className='text-center'>
                {props.loginMode && <Link className='reset-password-link' to='/reset-password'>Esqueceu sua senha?</Link>}
            </Grid>
        </div>
    </div>
)