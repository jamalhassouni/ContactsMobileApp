import React from "react";
import { Platform, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import ContactsComponents from "./components/Contacts";
import Details from "./components/Details";
import Options from "./components/Options";
import AddContact from "./components/AddContact";
import { Header } from "react-native-elements";
//navigation.getParam('label')

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
      screen: ContactsComponents,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header
            statusBarProps={{ barStyle: "light-content" }}
            outerContainerStyles={{ backgroundColor: "#0984e3" }}
            centerComponent={{
              text: navigation.getParam("label"),
              style: { color: "#fff" }
            }}
            rightComponent={{
              icon: "more-vert",
              color: "#fff",
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
      navigationOptions: ({ navigation }) => ({
        title: "Details",
        header: (
          <Header
            statusBarProps={{ barStyle: "light-content" }}
            outerContainerStyles={{ backgroundColor: "#0984e3" }}
            centerComponent={{
              text: navigation.getParam("user"),
              style: { color: "#fff" }
            }}
            rightComponent={{
              icon: "home",
              color: "#fff",
              underlayColor: "rgba(255,255,255,0)",
              onPress: () => {
                navigation.navigate("contacts");
              }
            }}
          />
        )
      })
    },
    options: {
      screen: Options,
      navigationOptions: ({ navigation }) => ({
        title: "Options",
        header: (
          <Header
            statusBarProps={{ barStyle: "light-content" }}
            outerContainerStyles={{ backgroundColor: "#0984e3" }}
            centerComponent={{
              text: navigation.getParam("user"),
              style: { color: "#fff" }
            }}
            rightComponent={{
              icon: "home",
              color: "#fff",
              underlayColor: "rgba(255,255,255,0)",
              onPress: () => {
                navigation.navigate("contacts");
              }
            }}
          />
        )
      })
    },
    AddContact: {
      screen: AddContact,
      navigationOptions: ({ navigation }) => ({
        title: "AddContact",
        header: (
          <Header
            statusBarProps={{ barStyle: "light-content" }}
            outerContainerStyles={{ backgroundColor: "#0984e3" }}
            centerComponent={{
              text: navigation.getParam("title"),
              style: { color: "#fff" }
            }}
            rightComponent={{
              icon: "home",
              color: "#fff",
              underlayColor: "rgba(255,255,255,0)",
              onPress: () => {
                navigation.navigate("contacts");
              }
            }}
          />
        )
      })
    }
  },
  {
    initialRouteName: "contacts",
    transitionConfig: transitionConfig
  }
);

export default Routes;
