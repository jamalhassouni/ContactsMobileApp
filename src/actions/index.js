export const selectContact = contact => {
  return {
    type: "select_contact",
    payload: contact
  };
};
export const RefreshList = () => {
  return {
    type: "refresh_list",
    payload: null
  };
};

export const fetchContact = contacts => {
  return dispatch => {
    dispatch({ type: "FETCHING", payload: contacts });
  };
};
export const SearchContacts = (searchContacts, query) => {
  return dispatch => {
    if (query !== "") {
      dispatch({ type: "searching", payload: searchContacts, query: query });
    }else {
      dispatch({
        type: "searchDone",
        payload: searchContacts,
        count: searchContacts.length
      });
    }
  };
};
