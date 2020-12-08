import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import consts from '../consts'

export const searchUsers = (value) => {
    return dispatch => {
        axios.get(`${consts.API_URL}/user/search/${value}`)
            .then(response => {
                if (response && response.data && response.data.users && response.data.users.length > 0) {
                    dispatch({ type: 'SET_SEARCH_USER_LIST', payload: response.data.users })
                }
                else {
                    dispatch({ type: 'SET_SEARCH_USER_LIST', payload: [] })    
                }
            })
            .catch(e => {
                dispatch({ type: 'SET_SEARCH_USER_LIST', payload: [] })
            })
    }
}