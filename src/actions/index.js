export const selectContact = contact => {
  return {
    type: "select_contact",
    payload: contact
  };
};

export const fetchContact = contacts => {
  return {
    type: "FETCHING",
    payload: contacts
  };
};
