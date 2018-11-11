import React from "react";
import { Platform, StyleSheet } from "react-native";
import { createStackNavigator } from "react-navigation";
import ContactsComponent from "./components/Contacts";
import ContactList from "./components/ContactList";
import Details from "./components/Details";
import Options from "./components/Options";
import AddContact from "./components/AddContact";
import EditContact from "./components/EditContact";
import { Header } from "react-native-elements";
import Colors from "./components/common/Colors";

const transitionConfig = () => {
  return {
    screenInterpolator: sceneProps => {
      const { position, layout, scene, index, scenes } = sceneProps;
      const toIndex = index;
      const thisSceneIndex = scene.index;
      const height = layout.initHeight;
      const width = layout.initWidth;

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        outputRange: [width, 0, 0]
      });

      // Since we want the card to take the same amount of time
      // to animate downwards no matter if it's 3rd on the stack
      // or 53rd, we interpolate over the entire range from 0 - thisSceneIndex
      const translateY = position.interpolate({
        inputRange: [0, thisSceneIndex],
        outputRange: [height, 0]
      });

      const slideFromRight = { transform: [{ translateX }] };
      const slideFromBottom = { transform: [{ translateY }] };

      const lastSceneIndex = scenes[scenes.length - 1].index;

      // Test whether we're skipping back more than one screen
      // and slide from bottom if true
      if (lastSceneIndex - toIndex > 1) {
        // Do not transoform the screen being navigated to
        if (scene.index === toIndex) return;
        // Hide all screens in between
        if (scene.index !== lastSceneIndex) return { opacity: 0 };
        // Slide top screen down
        return slideFromBottom;
      }
      // Otherwise slide from right
      return slideFromRight;
    }
  };
};
//height: Platform.OS === 'ios' ? 70 :  70 - 24
const Routes = createStackNavigator(
  {
    contacts: {
      screen: ContactList,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header
            statusBarProps={{ barStyle: "light-content" }}
            outerContainerStyles={styles.outerContainerStyles}
            centerComponent={{
              text: navigation.getParam("label"),
              style: { color: Colors.white }
            }}
            rightComponent={{
              icon: "more-vert",
              containerStyle:{width:45,height:45,position: 'relative',top:15},
              iconStyle: {  },
              color: Colors.white,
              underlayColor: "rgba(255,255,255,0)",
              onPress: () => {
                navigation.navigate("options");
              }
            }}
          />
        )
      })
    },
    details: {
      screen: Details,
      navigationOptions: () => ({
        title: "Details",
        header: null
      })
    },
    options: {
      screen: Options,
      navigationOptions: ({ navigation }) => ({
        title: "Options",
        header: (
          <Header
            statusBarProps={{ barStyle: "light-content" }}
            placement="left"
            centerComponent={{
              text: "Contacts",
              style: { color: Colors.white, fontSize: 16, paddingRight: 10 }
            }}
            outerContainerStyles={{
              backgroundColor: Colors.header,
              height: 45,
              alignItems: "flex-start",
            }}
            leftComponent={{
              icon: "arrow-back",
              containerStyle:{width:45,height:45,position: 'relative',top:15},
              size: 18,
              iconStyle: { marginRight: 20, paddingRight: 10,top: -3,},
              color: Colors.white,
              underlayColor: "rgba(255,255,255,0)",
              onPress: () => {
                navigation.navigate("contacts",{check:false});
              }
            }}
          />
        )
      })
    },
    AddContact: {
      screen: AddContact,
      navigationOptions: () => ({
        title: "AddContact",
        header: null
      })
    },
    EditContact: {
      screen: EditContact,
      navigationOptions: () => ({
        title: "EditContact",
        header: null
      })
    }
  },
  {
    initialRouteName: "contacts",
    transitionConfig: transitionConfig
  }
);
const styles = StyleSheet.create({
  outerContainerStyles: {
    backgroundColor: Colors.header,
    height: 45,
  }
});
export default Routes;
