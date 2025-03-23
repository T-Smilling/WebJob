const searchReducer = (state = false, action) => {
    switch (action.type) {
        case 'SEARCH':
            return action.status;
        default:
            return state;
    }
}

export default searchReducer;