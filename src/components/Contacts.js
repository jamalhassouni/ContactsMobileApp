import React, { PureComponent } from "react";
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
import filter from "lodash/filter";
import * as action from "../actions";
import {
  defaultColors,
  sumChars,
  uniqueList,
  avatarLetter,
  _contains
} from "./common/Helper";
import { FloatingMenu } from "./common";
import {
  List,
  ListItem,
  SearchBar,
  Button,
  Avatar
} from "react-native-elements";
import Swipeable from "react-native-swipeable";

class ContactsComponents extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation.setParams({
      label: `${this.props.countList} Contacts`
    });
    this._fetchData();
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
              this.props.fetchContact(uniqueList(contacts));
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

  onClickAddContact = () => {
    this.props.navigation.navigate("AddContact");
  };
  handleSearch = text => {
    const formattedQuery = text.trim().toLowerCase();
    const data = filter(this.props.fullData, user => {
      return _contains(user, formattedQuery);
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
        containerStyle={styles.SearchBar}
        inputStyle={{ height: 40 }}
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
    //const avatar = item.thumbnailPath || "";
    const phone = item.phoneNumbers[0].number;
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
              title={avatarLetter(givenName)}
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
          color="#0984e3"
          size="large"
        />
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={styles.MainContainer}>
        {this.renderHeader()}
        <List containerStyle={styles.list}>
          <FlatList
            data={this.props.contacts}
            ref={(ref) => { this.flatListRef = ref; }}
            initialNumToRender={10}
            renderItem={this.renderContact}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            ItemSeparatorComponent={this.renderSeparator}
          />
        </List>
        {this.renderFooter()}
        <FloatingMenu size={18} onPress={this.onClickAddContact} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1
  },
  list: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0
  },
  buttons: {
    backgroundColor: "#324C66",
    height: 55,
    marginTop: 5
  },
  SearchBar: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "transparent"
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
