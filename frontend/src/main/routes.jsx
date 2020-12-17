import React from 'react'
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router'

import AuthOrApp from './authOrApp'
import App from './app'
import Home from '../home/home'
import ResetPassword from '../resetPassword/resetPassword'
import NewPassword from '../newPassword/newPassword'
import Profile from '../profile/profile'
import ProfileEdit from '../profile/profileEdit'
import Matches from '../matches/matches'
import MatchCreate from '../matches/matchCreate'
import SearchPage from '../searchPage/searchPage';

export default props => (
    <Router history={hashHistory}>
        <Route path='/' component={AuthOrApp} >
            <Route path='/' component={App} />
            <IndexRoute component={Home} />
            <Route path='/home' component={Home} />
            <Route path='/profile' component={Profile} />
            <Route path='/profile/edit' component={ProfileEdit} />
            <Route path='/matches' component={Matches} />
            <Route path='/match/create' component={MatchCreate} />
            <Route path='/search' component={SearchPage} />
        </Route>
        <Route path='/reset-password' component={ResetPassword} />
        <Route path='/reset-password/:token/changePassword' component={NewPassword} />
        <Redirect from='*' to='/' />
    </Router>
)