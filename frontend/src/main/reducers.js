import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as toastrReducer, toastr } from 'react-redux-toastr'

import { reducer as AuthReducer } from '../auth/authReducer'

const rootReducer = combineReducers({
    form: formReducer,
    toastr: toastrReducer,
    auth: AuthReducer
})

export default rootReducer