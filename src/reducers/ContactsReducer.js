import Contacts from "react-native-contacts";
import { PermissionsAndroid } from "react-native";
let contactsList = [];
async function requestContactsPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: "App Contacts Permission",
        message: " App needs access to your Contacts "
      },
      PermissionsAndroid.PERMISSIONS.READ_PROFILE,
      {
        title: "Permission to Read Profile",
        message: "App needs permission to read profile"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the Contacts");
      Contacts.getAll((err, contacts) => {
        if (err) throw err;

        // contacts returned
        contacts.map(contact => {
          const contactInfo = {
            familyName: contact.familyName,
            givenName: contact.givenName,
            middleName: contact.middleName,
            phoneNumbers: contact.phoneNumbers,
            emailAddresses: contact.emailAddresses
          };
          contactsList.push(contactInfo);
        });
      });
    } else {
      console.log("Contacts permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}
requestContactsPermission();

const INITIAL_STATE = { contacts: contactsList };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'FETCHING':
            return { ...state, contacts: action.payload };
        default:
            return state;
    }
};