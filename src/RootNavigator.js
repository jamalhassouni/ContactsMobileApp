import React from "react";
import { createStackNavigator } from "react-navigation";
import ContactsComponents from "./components/Contacts";
import Details from "./components/Details";
import { Header } from "react-native-elements";
//navigation.getParam('label')
const Routes = createStackNavigator({
  contacts: {
    screen: ContactsComponents,
    navigationOptions: ({ navigation }) => ({
      header: (
        <Header
          leftComponent={{ text: "Contacts", style: { color: "#fff" } }}
          centerComponent={{ text: navigation.getParam('label'), style: { color: "#fff" } }}
          rightComponent={{ icon: "home", color: "#fff" }}
        />
      )
    })
  },
  details: {
    screen: Details,
    navigationOptions: {
      title: "Details"
    }
  }
});

export default Routes;
