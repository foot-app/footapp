import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import consts from '../consts'
import { reset as resetForm, initialize, updateSyncErrors } from 'redux-form'
import { storage } from '../firebase/firebaseConfig'

export const init = values => {
    return [
        initialize('profileEditForm', values)
    ]
}

export const update = (values, nickname) => {
    return dispatch => {
        if (validateUpdateData(values)) {
            axios.put(`${consts.API_URL}/user/${nickname}`, values)
                .then(response => {
                    toastr.success('', response.data.message)     
                    changeAuthNickname(values.nickname)
                    window.location = '#/profile'
                })
                .catch(e => {
                    e.response.data.errors.forEach(error => toastr.error('Erro', error))
                })
        }
    }
}

const treatCallbackAndUserInfo = (callback, setUserInfo, response, dispatch) => {
    if (callback) {
        callback(response.data.userData)
    }

    if (setUserInfo) {
        dispatch({ type: 'SET_USER_INFO', payload: response.data.userData})
    }
}

export const getUserByNickname = (nickname, callback, setUserInfo) => {
    return dispatch => {
        axios.get(`${consts.API_URL}/user/${nickname}`)
            .then(response => {
                treatCallbackAndUserInfo(callback, setUserInfo, response, dispatch)
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

const validateUpdateData = values => {
    const arrErrors = []

    if (!values.name) {
        arrErrors.push('Campo nome completo é de preenchimento obrigatório')
    }
    if (!values.nickname) {
        arrErrors.push('Campo nome de usuário é de preenchimento obrigatório')
    }
    
    arrErrors.forEach(error => {
        toastr.error('', error)
    })

    return arrErrors.length > 0 ? false : true
}

const changeAuthNickname = (nickname) => {
    const userKey = '_footapp'
    const userInfoLocalStorage = JSON.parse(localStorage.getItem(userKey))
    
    userInfoLocalStorage.nickname = nickname
    localStorage.setItem(userKey, JSON.stringify(userInfoLocalStorage))
}