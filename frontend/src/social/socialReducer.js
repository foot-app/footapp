const INITIAL_STATE = { searchUserList: [], friendsList: [], pendingFriendshipRequests: []}

export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'SET_SEARCH_USER_LIST':
            return { ...state, searchUserList: action.payload}
        case 'SET_FRIENDS_LIST':
            return { ...state, friendsList: action.payload }
        case 'SET_PENDING_FRIENDSHIP_REQUESTS':
            return { ...state, pendingFriendshipRequests: action.payload }
        default:
            return state
    }
}