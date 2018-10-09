const INITIAL_STATE = {  count:null,refreshing:false, data: [] };
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case 'FETCHING':
        return {...state, data: action.payload,count:action.payload.length };
        case 'getAll':
        return {...state, data: action.payload,count:action.payload.length,refreshing:false };
       case 'refresh_list':
       return {...state, refreshing:true };
        default:
            return state;
    }
};