const INITIAL_STATE = { userInfo: {} }

export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'SET_USER_INFO':
            return { ...state, userInfo: action.payload }
        default:
            return state
    }
}