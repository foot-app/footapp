const userKey = '_footapp'
export const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem(userKey)),
    validToken: false
}

export function reducer (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'TOKEN_VALIDATED':
            if (action.payload) {
                return {
                    ...state,
                    validToken: true
                }
            } else {
                localStorage.removeItem(userKey)
                return {
                    ...state,
                    validToken: false,
                    user: null
                }
            }
        case 'USER_FETCHED':
            localStorage.setItem(userKey, JSON.stringify(action.payload))
            return {
                ...state, user: action.payload, validToken: true
            }
        default:
            return state
    }
}