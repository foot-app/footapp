import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as toastrReducer, toastr } from 'react-redux-toastr'

const rootReducer = combineReducers({
    form: formReducer,
    toastr: toastrReducer
})

export default rootReducer