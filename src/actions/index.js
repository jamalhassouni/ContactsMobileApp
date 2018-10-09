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
  return {
    type: "FETCHING",
    payload: contacts
  };
};

/*
async function requestContactsPermission() {
  if (Platform.OS == "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Contacts",
          message: "This app would like to view your contacts. "
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Contacts");
        Contacts.getAll((err, contacts) => {
          if (err) throw err;

          // contacts returned
          return (contactsList = contacts);
        });
      } else {
        console.log("Contacts permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export const getAllContacts = () => {
  return dispatch => {
    requestContactsPermission().then(() => {
      console.log("Contacts", contactsList);
      dispatch({ type: 'refresh_list' });
      dispatch({ type: "getAll", payload: contactsList });
    });
  };
};
*/
