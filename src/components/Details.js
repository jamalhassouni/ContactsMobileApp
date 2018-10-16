import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Alert,
  Dimensions,
  Text,
  ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { FloatingMenu } from "./common";
import { avatarLetter, uniqueNumber } from "./common/Helper";
import { Button, Avatar, List, ListItem, Icon } from "react-native-elements";
import allGradients from "../gradients.json";
import sampleSize from "lodash/sampleSize";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
let middleName, givenName, familyName, FullName, gradient, colors;
class Details extends Component {
  constructor(props) {
    super(props);
    middleName = this.props.contact.middleName || "";
    givenName = this.props.contact.givenName || "";
    familyName = this.props.contact.familyName || "";
    FullName = givenName + " " + middleName + " " + familyName;
    gradient = sampleSize(allGradients, 1);
    colors = gradient[0].colors;
  }
  componentDidMount() {
    this.props.navigation.setParams({
      user: `${FullName} `
    });
    console.log("gradient", gradient[0].name,allGradients.length);
    console.log(
      "numbers ",
      FullName,
      uniqueNumber(this.props.contact.phoneNumbers)
    );
  }
  callContact(phone) {
    RNImmediatePhoneCall.immediatePhoneCall(phone);
  }
  textContact(phone) {
    const url = `sms:${phone}`;
    this.lanuchUrl(url);
  }
  lanuchUrl(url) {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        // Show  end user Message
        Alert.alert("App Not supported");
      } else {
        Linking.openURL(url);
      }
    });
  }
  onBack = () => {
    this.props.navigation.navigate("contacts");
  };
  renderRightElement = number => {
    return (
      <View style={styles.buttons}>
        <Button
          onPress={this.callContact.bind(this, number)}
          icon={{
            name: "phone",
            type: "font-awesome",
            color: colors[1],
            size: 30
          }}
          backgroundColor="transparent"
          buttonStyle={styles.buttonStyle}
        />
        <Button
          onPress={this.textContact.bind(this, number)}
          icon={{ name: "textsms", color: colors[0], size: 30 }}
          backgroundColor="transparent"
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  };
  render() {
    const { width, height } = Dimensions.get("window");
    return (
      <View style={styles.container}>
        <ScrollView>
          <LinearGradient
            colors={colors}
            style={[styles.gradientWrapper, { height: height / 2 }]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <View style={styles.headerLeft}>
              <Icon
                style={styles.iconBack}
                onPress={this.onBack}
                name={"arrow-back"}
                size={20}
                underlayColor={"rgba(255,255,255,0)"}
                color={"#fff"}
              />
            </View>
            <View style={styles.headerRight}>
              <Icon
                style={styles.iconOptions}
                onPress={this.onBack}
                name={"more-vert"}
                size={20}
                underlayColor={"rgba(255,255,255,0)"}
                color={"#fff"}
              />
            </View>

            <View style={styles.top}>
              <Avatar
                rounded
                medium
                overlayContainerStyle={{ backgroundColor: colors[0] }}
                title={avatarLetter(FullName)}
                activeOpacity={0.7}
              />
              <Text style={styles.text}>{FullName}</Text>
            </View>
          </LinearGradient>
          <List containerStyle={styles.list}>
            {uniqueNumber(this.props.contact.phoneNumbers).map((item, i) => (
              <View key={i}>
                <ListItem
                  title={item.number}
                  subtitle={item.label}
                  rightIcon={this.renderRightElement(item.number)}
                  containerStyle={{ borderBottomWidth: 0 }}
                />
                <View
                  style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                  }}
                />
              </View>
            ))}
          </List>
        </ScrollView>
        <FloatingMenu
          icon="edit"
          size={18}
          backgroundColor={colors[0]}
          onPress={() => console.log("yes!")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0,
    backgroundColor: "#fff"
  },
  name: {
    fontSize: 18
  },
  buttons: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    height: 70,
    marginHorizontal: 10
  },
  buttonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  gradientWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
    flexDirection: "row",
    borderTopWidth: 0
  },
  top: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    left: 20,
    padding: 8,
    marginBottom: 10
  },
  text: {
    position: "relative",
    top: 10,
    left: 10,
    fontSize: 18,
    color: "#fff"
  },
  list: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0
  },
  headerLeft: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 10,
    left: 20,
    padding: 8,
    marginBottom: 10
  },
  iconBack: {
    position: "relative",
    top: 0,
    left: 50
  },
  headerRight: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 20,
    padding: 8,
    marginBottom: 10
  },
  iconOptions: {
    position: "relative",
    top: 0,
    right: 50
  }
});

const mapStateToProp = state => {
  console.log("contact", state);
  return {
    contact: state.selection.contact
  };
};
export default connect(mapStateToProp)(Details);
