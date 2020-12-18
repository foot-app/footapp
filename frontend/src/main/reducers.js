import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as toastrReducer, toastr } from 'react-redux-toastr'

import { reducer as AuthReducer } from '../auth/authReducer'
import { reducer as ProfileReducer } from '../profile/profileReducer'
import { reducer as MatchReducer } from '../matches/matchReducer'
import { reducer as SocialReducer } from '../social/socialReducer'

const rootReducer = combineReducers({
    form: formReducer,
    toastr: toastrReducer,
    auth: AuthReducer,
    profile: ProfileReducer,
    match: MatchReducer,
    social: SocialReducer
})

export default rootReducer