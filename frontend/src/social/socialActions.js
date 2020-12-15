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

export const sendFriendshipRequest = (requesterUserNickname, targetUserNickname) => {
    return dispatch => {
        axios.post(`${consts.API_URL}/friendshipRequest`, { requesterUserNickname, targetUserNickname })
            .then(response => {
                if (response.data.message) {
                    toastr.success('', response.data.message)
                }
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export const getFriendship = nickname => {
    return dispatch => {
        axios.get(`${consts.API_URL}/friendships/${nickname}`)
            .then(response => {
                const friendshipRequests = response.data.friendshipRequests || []
                dispatch({ type:'SET_FRIENDS_LIST', payload: friendshipRequests })
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export const getPendingFriendshipRequests = nickname => {
    return dispatch => {
        axios.get(`${consts.API_URL}/friendshipRequest/nickname/${nickname}`)
            .then(response => {
                const friendshipRequestsList = []
                const friendshipRequests = response.data.friendshipRequests || []
                if (friendshipRequests && friendshipRequests.length > 0) {
                    $.when(friendshipRequests.forEach(friendshipRequest => {
                        if (friendshipRequest.status == "pending")
                            friendshipRequestsList.push({ requesterUserNickname: friendshipRequest.requesterUserNickname, id: friendshipRequest._id })
                    })).then(() => {
                        dispatch({ type:'SET_PENDING_FRIENDSHIP_REQUESTS', payload: friendshipRequestsList })
                    })

                } else {
                    dispatch({ type:'SET_PENDING_FRIENDSHIP_REQUESTS', payload: [] })
                }
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export const cancelFriendship = (id, targetUserNickname) => {
    return dispatch => {
        axios.delete(`${consts.API_URL}/friendshipRequest/${id}`)
            .then(response => {
                if (response.data.message) {
                    toastr.success('', response.data.message)
                }

                dispatch(getPendingFriendshipRequests(targetUserNickname))
                dispatch(getFriendship(targetUserNickname))
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export const acceptPendingFriendshipRequest = (id, targetUserNickname) => {
    return dispatch => {
        axios.put(`${consts.API_URL}/friendshipRequest/${id}`, { status: 'accepted' })
            .then(response => {
                if (response.data.message) {
                    toastr.success('', response.data.message)
                }
    
                dispatch(getPendingFriendshipRequests(targetUserNickname))
                dispatch(getFriendship(targetUserNickname))
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })       
    }
}