const INITIAL_STATE = {
  count: 0,
  loading: true,
  refreshing: false,
  data: [],
  fullData: [],
  query: "",
  scrolledTO:0
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
      return { ...state, refreshing: true, query: "" ,loading:false};
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
    case "changePos":
      return {
        ...state,
        scrolledTO:action.payload
      };

    default:
      return state;
  }
};
