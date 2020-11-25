import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import consts from '../consts'
import { reset } from 'redux-form'


const moment = require('moment');


export const create = (values) => {
    const userKey = '_footapp'
    const userInfoLocalStorage = JSON.parse(localStorage.getItem(userKey));
    values.ownerNickname = userInfoLocalStorage.nickname

    return dispatch => {
        if(validateData(values)) {
            values.date = createDataObject(values);
            axios.put(`${consts.API_URL}/match/create`, values)
            .then(response => {
                if (response.data.message) {
                    toastr.success('Sucesso', 'Partida criada com sucesso')
                    dispatch(reset('createMatchForm'))
                }
                window.location = '#/matches'
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
        } 
    }
}

export const loadMyMatches = () => {
    const userKey = '_footapp'
    const userInfoLocalStorage = JSON.parse(localStorage.getItem(userKey));
    const ownerNickname = userInfoLocalStorage.nickname;

    return dispatch => {
        axios.get(`${consts.API_URL}/matches/${ownerNickname}`)
            .then(response => {
                dispatch({ type: 'SET_MY_MATCHES', payload: [...response.data]})
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}


export const deleteMatch = (matchId) => {
    return dispatch => {
        return new Promise(resolve => {
            axios.put(`${consts.API_URL}/match/delete`, {matchId})
            .then(response => {
                toastr.success('Sucesso', 'A partida foi deletada com sucesso!')
                resolve()
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
                resolve()
            })
        })
    }
}

export const resetForm = (formValues) => {
    return dispatch => {
        dispatch(reset('createMatchForm'))
    }
}

const createDataObject = (values) => {
    const day = values.date.slice(0, 2);
    const month = values.date.slice(3, 5);
    const year = values.date.slice(6, 10);
    const hour = values.schedule.slice(0, 2);
    const minute = values.schedule.slice(3, 5);
    return new Date(year, month, day, hour, minute, 0, 0);
}

const evaluateField = (values, field, mapFieldsError, arrErrors) => {
    if (!values[field])
        arrErrors.push(`O campo ${mapFieldsError[field]} é de preenchimento obrigatório`)
    else {
        if (field == 'date') {
            const day = values.date.slice(0, 2);
            const month = values.date.slice(3, 5);
            const year = values.date.slice(6, 10);
            if (!moment(`${day} ${month} ${year}`, 'DD MM YYYY').isValid()) {
                arrErrors.push('Data inválida');
            } 
        }
        else if (field == 'schedule') {
            const hour = values.schedule.slice(0, 2);
            const minute = values.schedule.slice(3, 5);

            if(hour > 23 || minute > 59) {
                arrErrors.push('Horário inválido');
            }
        }
    }
}

const validateData = (values) => {
    const arrErrors = []
    const mapFieldsError = { name: 'nome', street: 'rua', number: 'número', neighborhood: 'bairro', city: 'cidade', state: 'estado', date: 'data', schedule: 'horário' }

    Object.keys(mapFieldsError).forEach(field => {
        evaluateField(values, field, mapFieldsError, arrErrors)
    })

    arrErrors.forEach(error => {
        toastr.error('', error)
    })

    return arrErrors.length > 0 ? false : true
}