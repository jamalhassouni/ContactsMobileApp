import React, { Component } from "react";
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
  componentWillMount() {
    this.props.getAllContacts();
  }

  _onRefresh = () => {
    //Start Rendering Spinner
    this.setState({ refreshing: true });
    this.props.getAllContacts();
    console.log("refreshing...");
    console.log(this.props.contacts);
    this.setState({ refreshing: false }); //Stop Rendering Spinner
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
              refreshing={this.state.refreshing}
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
  return {
    contacts: state.contacts.contacts
  };
};

export default connect(
  mapStateToProps,
  action
)(ContactsComponents);
