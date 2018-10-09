const INITIAL_STATE = { contacts: [] };

export default (state = {}, action) => {
    switch (action.type) {
      case 'FETCHING':
        return { contacts: action.payload };
        case 'getAll':
        return { contacts: action.payload };
        default:
            return state;
    }
};