import Contacts from "react-native-contacts";
let contactsList = [];
Contacts.getAll((err, contacts) => {
  if (err) throw err;

  // contacts returned
  contacts.map(contact => {
    const contactInfo = {
      familyName: contact.familyName,
      givenName: contact.givenName,
      phoneNumbers: contact.phoneNumbers,
      emailAddresses: contact.emailAddresses
    };
    contactsList.push(contactInfo);
  });
});

export default () => contactsList;
