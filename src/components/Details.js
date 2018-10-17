import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Alert,
  Dimensions,
  Text,
  ScrollView,
  PermissionsAndroid,
  Animated
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Contacts from "react-native-contacts";
import { connect } from "react-redux";
import { FloatingMenu } from "./common";
import { avatarLetter, uniqueNumber } from "./common/Helper";
import { Button, Avatar, List, ListItem, Icon } from "react-native-elements";
import allGradients from "../gradients.json";
import sampleSize from "lodash/sampleSize";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
let middleName, givenName, familyName, FullName, gradient, colors;
const { width, height } = Dimensions.get("window");
class Details extends Component {
  constructor(props) {
    super(props);
    middleName = this.props.contact.middleName || "";
    givenName = this.props.contact.givenName || "";
    familyName = this.props.contact.familyName || "";
    FullName = givenName + " " + middleName + " " + familyName;
    gradient = sampleSize(allGradients, 1);
    colors = gradient[0].colors;
    this.state = {
      modalY: new Animated.Value(-height),
      bounceValue: new Animated.Value(height) //This is the initial position of the subview
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({
      user: `${FullName} `
    });
  }
  callContact(phone) {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE).then(
      granted => {
        if (granted) {
          //  Initiate immediate phone call
          RNImmediatePhoneCall.immediatePhoneCall(phone);
        }
      }
    );
  }
  textContact(phone) {
    const url = `sms:${phone}`;
    this.lanuchUrl(url);
  }
  DeleteContact = () => {
    this.closeModalBottom();
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
    ).then(granted => {
      if (granted) {
        // delete a record using only it's recordID
        Contacts.deleteContact(
          { recordID: this.props.contact.recordID },
          (err, recordId) => {
            if (err) throw err;
            // contact deleted
            console.log("deleted ", recordId);
            this.props.navigation.navigate("contacts");
          }
        );
      }
    });
  };
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
  openModalTop() {
    this.closeModalBottom();
    Animated.timing(this.state.modalY, {
      duration: 300,
      toValue: 0
    }).start();
  }

  closeModalTop() {
    Animated.timing(this.state.modalY, {
      duration: 300,
      toValue: -height
    }).start();
  }
  renderDivider = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "80%",
          backgroundColor: "#CED0CE",
          marginLeft: "5%"
        }}
      />
    );
  };
  openModalButtom() {
    this.closeModalTop();
    //This will animate the transalteY of the modal bottom between 0 & 100 depending on its current state
    //100 comes from the style below, which is the height of the modal bottom.
    Animated.spring(this.state.bounceValue, {
      toValue: 0,
      //velocity: 3,
      //tension: 2,
      duration: 300
      //friction: 8
    }).start();
  }

  closeModalBottom() {
    Animated.spring(this.state.bounceValue, {
      toValue: height,
      //velocity: 3,
      //tension: 2,
      duration: 300
      //friction: 8
    }).start();
  }
  render() {
    // render top modal
    var ModalTop = (
      <Animated.View
        style={[
          styles.ModalTop,
          { transform: [{ translateY: this.state.modalY }] }
        ]}
      >
        <List
          containerStyle={[styles.list, { backgroundColor: "transparent" }]}
        >
          <ListItem
            underlayColor={"rgba(255,255,255,0)"}
            onPress={this.closeModalTop.bind(this)}
            rightIcon={
              <Icon
                underlayColor={"rgba(255,255,255,0)"}
                onPress={this.closeModalTop.bind(this)}
                name="close"
                color="#ff7979"
              />
            }
            containerStyle={{ borderBottomWidth: 0 }}
          />
          {this.renderDivider()}
          <ListItem
            underlayColor={"rgba(255,255,255,0)"}
            hideChevron
            onPress={this.openModalButtom.bind(this)}
            title="Delete Contact"
            containerStyle={{ borderBottomWidth: 0 }}
          />
          {this.renderDivider()}
        </List>
      </Animated.View>
    );

    // render  modal bottom
    var ModalBottom = (
      <Animated.View
        style={[
          styles.ModalBottom,
          { transform: [{ translateY: this.state.bounceValue }] }
        ]}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 5
          }}
        >
          Delete this contact?
        </Text>
        <Text style={{ fontSize: 16, margin: 10 }}>
          Delete "{FullName}
          "?
        </Text>
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            paddingBottom: 5
          }}
        >
          <Button
            buttonStyle={styles.mdBottom}
            titleStyle={{ color: "red" }}
            onPress={this.DeleteContact}
            title="Yes"
          />
          <Button
            buttonStyle={styles.mdBottom}
            onPress={this.closeModalBottom.bind(this)}
            title="Cancel"
          />
        </View>
      </Animated.View>
    );
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
                onPress={this.openModalTop.bind(this)}
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
        {ModalTop}
        {ModalBottom}
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
  },
  ModalTop: {
    height: 120,
    width: width,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#dff9fb",
    justifyContent: "center"
  },
  ModalBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#dff9fb",
    height: 140,
    zIndex: 2,
    padding: 10
  },
  mdBottom: {
    backgroundColor: "rgba(92, 99,216, 1)",
    width: 100,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 5
  }
});

const mapStateToProp = state => {
  console.log("contact", state);
  return {
    contact: state.selection.contact
  };
};
export default connect(mapStateToProp)(Details);
