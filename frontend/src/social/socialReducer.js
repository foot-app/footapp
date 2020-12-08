const INITIAL_STATE = { searchUserList: [] }

export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'SET_SEARCH_USER_LIST':
            return { ...state, searchUserList: action.payload}
        default:
            return state
    }
}