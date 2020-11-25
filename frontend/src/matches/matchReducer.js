const INITIAL_STATE = { myMatches: [] }

export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'SET_MY_MATCHES':
            return { ...state, myMatches: action.payload}
        default:
            return state
    }
}