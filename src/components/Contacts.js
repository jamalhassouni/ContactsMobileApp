import React, { Component } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Contacts from "react-native-contacts";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import * as action from "../actions";
class ContactsComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }
  componentDidMount() {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts."
      })
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Contacts.getAll((err, contacts) => {
              this.props.fetchContact(contacts);
              this.props.navigation.setParams({
                label: (
                  <Text style={{ marginRight: 10 }}>
                    {this.props.countList} Contacts
                  </Text>
                )
              });
            });
          } else {
            // Handle
          }
        })
        .catch(err => {
          console.log("PermissionsAndroid", err);
        });
    }
    console.log("count", this.props.countList);
  }

  _onRefresh = () => {
    this.props.getAllContacts();
    this.props.navigation.setParams({
      label: (
        <Text style={{ marginRight: 10 }}>{this.props.countList} Contacts</Text>
      )
    });
    console.log("count refresh", this.props.countList);
    console.log("refreshing...");
  };

  onContactSelected = contact => {
    this.props.selectContact(contact);
    this.props.navigation.navigate("details");
  };

  renderContact = ({ item }) => {
    const middleName = item.middleName || "";
    const givenName = item.givenName || "";
    const familyName = item.familyName || "";
    const FullName = givenName + " " + middleName + " " + familyName;
    const phone = item.phoneNumbers[0].number;
    return (
      <View style={styles.contact}>
        <TouchableOpacity onPress={this.onContactSelected.bind(this, item)}>
          <Text style={styles.name}>{FullName}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.contacts}
          renderItem={this.renderContact}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contact: {
    flex: 1,
    padding: 20,
    borderColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#fff"
  },
  name: {
    fontSize: 16
  },
  phone: {
    fontSize: 14,
    color: "#ddd"
  }
});

const mapStateToProps = state => {
  console.log(state);
  return {
    contacts: state.contacts.data,
    countList: state.contacts.count,
    refreshing: state.contacts.refreshing
  };
};

export default connect(
  mapStateToProps,
  action
)(ContactsComponents);
