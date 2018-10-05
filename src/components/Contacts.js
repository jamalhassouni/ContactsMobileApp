import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import * as action from "../actions";
class Contacts extends Component {
  onContactSelected = contact => {
    this.props.selectContact(contact);
    this.props.navigation.navigate("details");
  };
  renderContact = ({ item }) => {
    let FullName = item.givenName + " " + item.familyName;
    let phone = item.phoneNumbers[0].number;
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
  return {
    contacts: state.contacts
  };
};

export default connect(
  mapStateToProps,
  action
)(Contacts);
