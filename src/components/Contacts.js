import React, { Component } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Contacts from "react-native-contacts";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import * as action from "../actions";
import {
  List,
  ListItem,
  SearchBar,
  Button,
  Avatar
} from "react-native-elements";
import Swipeable from "react-native-swipeable";
const defaultColors = [
  "#2ecc71", // emerald
  "#3498db", // peter river
  "#8e44ad", // wisteria
  "#e67e22", // carrot
  "#e74c3c", // alizarin
  "#1abc9c", // turquoise
  "#2c3e50" // midnight blue
];
function sumChars(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }

  return sum;
}
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

  avatarLetter = FullName => {
    return FullName.match(/\b(\w)/g)
      .join("")
      .toUpperCase();
  };

  uniqueList(list) {
    list = list.filter(
      (elm, index, self) =>
        index ===
        self.findIndex(
          t => t.phoneNumbers[0].number === elm.phoneNumbers[0].number
        )
    );
    return list.sort((a, b) =>
      a.givenName.toUpperCase().localeCompare(b.givenName.toUpperCase())
    );
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
        clearIcon
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
    const avatar = item.thumbnailPath || "";
    let i = sumChars(givenName) % defaultColors.length;
    let background = defaultColors[i];
    const leftContent = (
      <Button buttonStyle={styles.buttons} title="Show Contact" />
    );
    return (
      <Swipeable
        leftButtonWidth={100}
        leftContent={leftContent}
        onLeftActionRelease={this.onContactSelected.bind(this, item)}
      >
        <ListItem
          onPress={this.onContactSelected.bind(this, item)}
          roundAvatar
          title={FullName}
          subtitle={phone}
          avatar={
            <Avatar
              size="small"
              rounded
              overlayContainerStyle={{ backgroundColor: background }}
              title={this.avatarLetter(givenName)}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
          }
          containerStyle={{ borderBottomWidth: 0 }}
        />
      </Swipeable>
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
        <ActivityIndicator
          style={{ flex: 1, alignSelf: "center" }}
          color="#00cec9"
          size="large"
        />
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
            ListFooterComponent={this.renderFooter}
          />
        </List>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: "#324C66",
    height: 55,
    marginTop: 5
  }
});
const mapStateToProps = state => {
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
