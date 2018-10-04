import { createStackNavigator } from "react-navigation";
import Contacts from "./components/Contacts";
import Details from "./components/Details";

const Routes = createStackNavigator({
  contacts: {
    screen: Contacts,
    navigationOptions:{
      title:'Contact'
    }
  },
  details: {
    screen: Details
  }
});

export default Routes;
