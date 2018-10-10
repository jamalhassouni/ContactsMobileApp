import React, { Component } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Contacts from "react-native-contacts";
import {
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import * as action from "../actions";
import { List, ListItem, SearchBar } from "react-native-elements";
class ContactsComponents extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation.setParams({
      label: `${this.props.countList} Contacts`
    });
    this._fetchData();
  }

  uniqueList(list) {
    list = list.filter(
      (elm, index, self) =>
        index ===
        self.findIndex(
          t => t.phoneNumbers[0].number === elm.phoneNumbers[0].number
        )
    );
    return list.sort();
  }
  _fetchData = () => {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts."
      })
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Contacts.getAll((err, contacts) => {
              this.props.fetchContact(this.uniqueList(contacts));
              this.props.navigation.setParams({
                label: `${this.props.countList} Contacts`
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
  };
  _onRefresh = () => {
    this._fetchData();
    this.props.navigation.setParams({
      label: `${this.props.countList} Contacts`
    });
  };

  onContactSelected = contact => {
    this.props.selectContact(contact);
    this.props.navigation.navigate("details");
  };
  _contains = (user, query) => {
    if (
      user.givenName !== null &&
      user.givenName !== undefined &&
      user.givenName.toLowerCase().includes(query)
    ) {
      return true;
    } else if (
      user.familyName !== null &&
      user.familyName !== undefined &&
      user.familyName.toLowerCase().includes(query)
    ) {
      return true;
    } else if (
      user.middleName !== null &&
      user.middleName !== undefined &&
      user.middleName.toLowerCase().includes(query)
    ) {
      return true;
    }

    return false;
  };
  handleSearch = text => {
    const formattedQuery = text.trim().toLowerCase();
    const data = _.filter(this.props.fullData, user => {
      return this._contains(user, formattedQuery);
    });
    this.props.SearchContacts(data, text);
    this.props.navigation.setParams({
      label: `${this.props.countList} Contacts`
    });
    console.log(this.props.countList);
  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <SearchBar
        onChangeText={this.handleSearch}
        placeholder="Type Here..."
        lightTheme
        round
      />
    );
  };
  renderContact = ({ item }) => {
    const middleName = item.middleName || "";
    const givenName = item.givenName || "";
    const familyName = item.familyName || "";
    const FullName = givenName + " " + middleName + " " + familyName;
    const phone = item.phoneNumbers[0].number;
    const avatar = item.thumbnailPath || null;
    return (
      <ListItem
        onPress={this.onContactSelected.bind(this, item)}
        roundAvatar
        title={FullName}
        subtitle={phone}
        avatar={{ uri: avatar }}
        containerStyle={{ borderBottomWidth: 0 }}
      />
    );
  };
  renderFooter = () => {
    if (!this.props.loading) return null;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ActivityIndicator color="#00cec9" size="large" />
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
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
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListEmptyComponent={this.renderFooter}
          />
        </List>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    contacts: state.contacts.data,
    fullData: state.contacts.fullData,
    countList: state.contacts.count,
    refreshing: state.contacts.refreshing,
    query: state.contacts.query,
    loading: state.contacts.loading
  };
};

export default connect(
  mapStateToProps,
  action
)(ContactsComponents);
