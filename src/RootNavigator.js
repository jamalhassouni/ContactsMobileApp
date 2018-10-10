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
        statusBarProps={{ barStyle: 'light-content' }}
        outerContainerStyles={{ backgroundColor: '#324C66' }}
          centerComponent={{ text: navigation.getParam('label'), style: { color: "#fff" } }}
          rightComponent={{ icon: "home", color: "#fff",onPress:()=>{navigation.navigate('contacts') } }}
        />
      )
    })
  },
  details: {
    screen: Details,
    navigationOptions: ({navigation}) =>({
      title: "Details",
      header: (
        <Header
        statusBarProps={{ barStyle: 'light-content' }}
        outerContainerStyles={{ backgroundColor: '#324C66' }}
          centerComponent={{ text: navigation.getParam('user'), style: { color: "#fff" } }}
          rightComponent={{ icon: "home", color: "#fff",onPress:()=>{navigation.navigate('contacts') }}}
        />
      )
    })
  }
});

export default Routes;
