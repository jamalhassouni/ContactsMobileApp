const INITIAL_STATE = {
  count: 0,
  loading: true,
  refreshing: false,
  data: [],
  fullData: [],
  query: "",
  sortBy: "givenName",
  displayPhoto: true,
  viewAs: "givenName"
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCHING":
      return {
        ...state,
        data: action.payload,
        fullData: action.payload,
        count: action.payload.length,
        loading: false
      };
    case "refresh_list":
      return { ...state, refreshing: true, query: "", loading: false };
    case "searching":
      return {
        ...state,
        data: action.payload,
        count: action.payload.length,
        query: action.query,
        loading: false
      };
    case "searchDone":
      return {
        ...state,
        data: action.payload,
        count: action.count,
        loading: false
      };
    case "ChangeSort":
      return {
        ...state,
        sortBy: action.payload
      };
    case "ChangeviewAs":
      return {
        ...state,
        viewAs: action.payload
      };
    case "ChangedisplayPhoto":
      return {
        ...state,
        displayPhoto: action.payload
      };

    default:
      return state;
  }
};
