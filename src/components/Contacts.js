import React, { Component } from "react";
import {
  PermissionsAndroid,
  Platform,
  View,
  FlatList,
  Linking,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl
} from "react-native";
import Contacts from "react-native-contacts";
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
import { Icon, List, ListItem, SearchBar, Avatar } from "react-native-elements";
import Swipeable from "react-native-swipeable";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";

class ContactsComponents extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (Platform.OS == "android") {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE
      ]).catch(err => {
        console.log("PermissionsAndroid", err);
      });
    }
    this.props.navigation.setParams({
      label: `${this.props.countList} Contacts`
    });
    this._fetchData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.contacts !== nextProps.contacts) {
      return true;
    }

    return false;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.refresh) {
      this._fetchData();
      this.props.navigation.setParams({
        refresh: false
      });
    }
  }
  _fetchData = () => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then(
      granted => {
        if (granted) {
          Contacts.getAll((err, contacts) => {
            this.props.fetchContact(uniqueList(contacts));
            this.props.navigation.setParams({
              label: `${this.props.countList} Contacts`
            });
          });
        }
      }
    );
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
  textContact(phone) {
    const url = `sms:${phone}`;
    this.lanuchUrl(url);
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
      <View style={styles.leftSwipeItem}>
        <Icon
          name={"phone"}
          type="font-awesome"
          size={30}
          underlayColor={"rgba(255,255,255,0)"}
          color={"#ee5253"}
        />
      </View>
    );
    const rightContent = (
      <View style={styles.rightSwipeItem}>
        <Icon
          name={"textsms"}
          size={30}
          underlayColor={"rgba(255,255,255,0)"}
          color={"#00d2d3"}
        />
      </View>
    );

    return (
      <Swipeable
        leftActionActivationDistance={100}
        leftContent={leftContent}
        rightActionActivationDistance={100}
        rightContent={rightContent}
        onLeftActionRelease={this.callContact.bind(this, phone)}
        onRightActionRelease={this.textContact.bind(this, phone)}
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
            ref={ref => {
              this.flatListRef = ref;
            }}
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
        <FloatingMenu
          icon="user-plus"
          size={18}
          onPress={this.onClickAddContact}
        />
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
    backgroundColor: "transparent"
  },
  SearchBar: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "transparent"
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
    backgroundColor: "#fff"
  },
  rightSwipeItem: {
    alignItems: "flex-start",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20
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
