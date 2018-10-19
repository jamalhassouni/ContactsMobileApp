import React, { Component } from "react";
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  Image,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Picker
} from "react-native";
import Contacts from "react-native-contacts";
import { connect } from "react-redux";
import * as action from "../actions";
import { Icon, Button } from "react-native-elements";
import { Input, CardItem } from "./common";
import Colors from "./common/Colors";
const { width, height } = Dimensions.get("window");
class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      givenName: "",
      familyName: "",
      middleName: "",
      emailAddresses: [],
      label: "mobile",
      number: "",
      labelEmail: "work",
      email: ""
    };
  }
  componentDidMount() {
    /*
    var newPerson = {
  emailAddresses: [{
    label: "work",
    email: "mrniet@example.com",
  }],
  familyName: "Nietzsche",
  givenName: "Friedrich",
}

Contacts.addContact(newPerson, (err) => {
  if (err) throw err;
  // save successful
})

    */
  }
  onBack = () => {
    this.props.navigation.navigate("contacts");
  };
  onSave = () => {
    let newContact = {
      familyName: this.state.familyName,
      givenName: this.state.givenName,
      middleName: this.state.middleName,
      emailAddresses: [
        {
          label: this.state.labelEmail,
          email: this.state.email
        }
      ],
      phoneNumbers: [
        {
          label: this.state.label,
          number: this.state.number
        }
      ]
    };
    // Todo : Add new contact
    console.log("new contact ", newContact);
  };
  renderAvatar = () => {
    return (
      <View style={styles.avatar}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={require("../assets/user.jpg")}
        />
      </View>
    );
  };
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Button
            onPress={this.onBack}
            backgroundColor={Colors.header}
            buttonStyle={styles.buttonCancel}
            title="Cancel"
            textStyle={{ color: Colors.white, fontSize: 12 }}
          />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Add new Contact </Text>
        </View>
        <View style={styles.headerRight}>
          <Button
            onPress={this.onSave}
            backgroundColor={Colors.white}
            buttonStyle={[styles.buttonCancel, { borderColor: Colors.header }]}
            title="Save"
            textStyle={{ color: Colors.header, fontSize: 12 }}
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView >
          {this.renderHeader()}
          {this.renderAvatar()}
          <View style={{ marginTop: 60, padding: 10 }}>
            <CardItem>
              <Input
                value={this.state.givenName}
                placeholder="GivenName"
                onChangeText={givenName => {
                  this.setState({ givenName });
                }}
              />
            </CardItem>
            <CardItem>
              <Input
                value={this.state.middleName}
                placeholder="MiddleName"
                onChangeText={middleName => {
                  this.setState({ middleName });
                }}
              />
            </CardItem>
            <CardItem>
              <Input
                value={this.state.familyName}
                placeholder="FamilyName"
                onChangeText={familyName => {
                  this.setState({ familyName });
                }}
              />
            </CardItem>
            <CardItem>
              <View style={styles.groupBorder}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.label}
                  style={styles.picker}
                  onValueChange={value => this.setState({ label: value })}
                >
                  <Picker.Item label="Mobile" value="mobile" />
                  <Picker.Item label="Work" value="work" />
                  <Picker.Item label="Home" value="home" />
                  <Picker.Item label="Main" value="main" />
                  <Picker.Item label="Work Fax" value="work fax" />
                  <Picker.Item label="Home Fax" value="home fax" />
                  <Picker.Item label="Pager" value="pager" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
                <Input
                  inputStyle={{
                    flex: 1,
                    paddingLeft: 10,
                    fontSize: 14,
                    color: "#000"
                  }}
                  keyboardType="phone-pad"
                  value={this.state.number}
                  placeholder="Phone"
                  onChangeText={number => {
                    this.setState({ number });
                  }}
                />
              </View>
            </CardItem>
            <CardItem>
              <View style={styles.groupBorder}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.labelEmail}
                  style={styles.picker}
                  onValueChange={value => this.setState({ labelEmail: value })}
                >
                  <Picker.Item
                    style={{ color: "red" }}
                    label="Work"
                    value="work"
                  />
                  <Picker.Item label="Home" value="home" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
                <Input
                  inputStyle={{
                    flex: 1,
                    paddingLeft: 10,
                    fontSize: 14,
                    color: "#000"
                  }}
                  keyboardType="email-address"
                  value={this.state.email}
                  placeholder="Email"
                  onChangeText={email => {
                    this.setState({ email });
                  }}
                />
              </View>
            </CardItem>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0,
    backgroundColor: Colors.white
  },
  header: {
    width: width,
    height: 60,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    flexDirection: "row",
    borderTopWidth: 0,
    backgroundColor: Colors.header,
    zIndex: 1
  },
  avatar: {
    flex: 1,
    alignItems: "center",
    height: 55,
    marginTop: 10
  },
  image: {
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 100
  },
  headerLeft: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 10,
    left: 0,
    padding: 8,
    marginBottom: 10
  },
  iconBack: {
    position: "relative",
    top: 0,
    left: 10
  },
  headerRight: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 0,
    padding: 8,
    marginBottom: 10
  },
  iconOptions: {
    position: "relative",
    top: 0,
    right: 10
  },
  headerCenter: {
    position: "absolute",
    top: 10,
    right: 50,
    left: 50,
    padding: 8,
    marginBottom: 10,
    alignItems: "center"
  },
  headerTitle: {
    justifyContent: "center",
    color: Colors.white
  },
  buttonCancel: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.white,
    height: 30,
    width: 62
  },
  groupBorder: {
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderColor: "#95afc0"
  },
  picker: {
    height: 40,
    width: 120
  }
});
const mapStateToProps = state => {
  return {
    contacts: state.contacts.data
  };
};

export default connect(
  mapStateToProps,
  action
)(AddContact);
