import React, { Component } from "react";
import { View, StyleSheet, Linking, Alert } from "react-native";
import { connect } from "react-redux";
import { CardItem } from "./common";
import { Card, Button } from "react-native-elements";
let middleName, givenName, familyName, FullName, phone;
class Details extends Component {
  constructor(props) {
    super(props);
    middleName = this.props.contact.middleName || "";
    givenName = this.props.contact.givenName || "";
    familyName = this.props.contact.familyName || "";
    FullName = givenName + " " + middleName + " " + familyName;
    phone = this.props.contact.phoneNumbers[0].number;
  }
  componentDidMount() {
    this.props.navigation.setParams({
      user: `${FullName} `
    });
  }
  callContact = () => {
    const url = `tel:${phone}`;
    this.lanuchUrl(url);
  };
  textContact = () => {
    const url = `sms:${phone}`;
    this.lanuchUrl(url);
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
  render() {
    return (
      <Card title={FullName}>
        <CardItem>
          <View style={styles.buttons}>
            <Button
              onPress={this.callContact}
              icon={{ name: "phone", type: "font-awesome" }}
              backgroundColor="#e74c3c"
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0
              }}
              title="Call"
            />
          </View>
          <View style={styles.buttons}>
            <Button
              onPress={this.textContact}
              icon={{ name: "textsms" }}
              backgroundColor="#3498db"
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0
              }}
              title="Text"
            />
          </View>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  name: {
    fontSize: 18
  },
  buttons: {
    flex: 1,
    height: 70,
    marginHorizontal: 10
  }
});

const mapStateToProp = state => {
  return {
    contact: state.selection.contact
  };
};
export default connect(mapStateToProp)(Details);
