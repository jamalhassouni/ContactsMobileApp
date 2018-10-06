import { createStackNavigator } from "react-navigation";
import ContactsComponents from "./components/Contacts";
import Details from "./components/Details";

const Routes = createStackNavigator({
  contacts: {
    screen: ContactsComponents,
    navigationOptions: {
      title: "Contact"
    }
  },
  details: {
    screen: Details,
    navigationOptions: {
      title: "Details"
    }
  }
});

export default Routes;
