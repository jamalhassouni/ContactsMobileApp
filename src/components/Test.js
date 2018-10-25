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
  RefreshControl,
  Text,
  ScrollView,
  Dimensions,
  findNodeHandle
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
  _contains,
  groupArrayByFirstChar
} from "./common/Helper";
import { FloatingMenu } from "./common";
import { Icon, List, ListItem, SearchBar, Avatar } from "react-native-elements";
import Swipeable from "react-native-swipeable";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
const { width, height } = Dimensions.get("window");
let groupRow = [];

class Test extends Component {
  constructor(props) {
    super(props);
    this.state ={
      scrolledTO:0,
    }
  }
   componentDidMount = () => {
     // TODO: change color when pos equal  scrollView pos
    console.log("scrolledTo",this.state.scrolledTO)
   };

  componentWillMount() {
    /**
     *  check if paltform is android
     * then request android required permissions
     */
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

  /**
   * check if  nextProps not equal this.props.contacts
   * then  return true for update component
   * if not equal return false
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.contacts !== nextProps.contacts) {
      return true;
    }

    return false;
  }
  componentWillReceiveProps(nextProps) {
    /*
     * check if count list not  equal this.props.countList
     * then  set Params to  update count in header
     */
    if (nextProps.countList !== this.props.countList) {
      this.props.navigation.setParams({
        label: `${nextProps.countList} Contacts`
      });
    }

    /**
     * check if has params refresh
     * then  refresh data
     */
    if (nextProps.navigation.state.params.refresh) {
      this._fetchData();
      this.props.navigation.setParams({
        refresh: false
      });
    }
  }
  // this method for  fetch all contact form  addressBook
  _fetchData = () => {
    /**
     *  check if READ_CONTACTS permission is granted
     * then fetch data
     * otherwise, don't fetch data
     */
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then(
      granted => {
        if (granted) {
          Contacts.getAll((err, contacts) => {
            this.props.fetchContact(uniqueList(contacts));
          });
        }
      }
    );
  };
  // this method for refresh list data
  _onRefresh = () => {
    this._fetchData();
  };

  // this method to navigate to the details page with selected contact
  onContactSelected = contact => {
    this.props.selectContact(contact);
    this.props.navigation.navigate("details");
  };

  // this method to navigate to the AddContact page
  onClickAddContact = () => {
    this.props.navigation.navigate("AddContact");
  };

  // this method to handle search
  handleSearch = text => {
    const formattedQuery = text.trim().toLowerCase();
    const data = filter(this.props.fullData, user => {
      return _contains(user, formattedQuery);
    });
    this.props.SearchContacts(data, text);
  };

  // this method for render separator between ListItem
  renderSeparator = key => {
    return (
      <View
        key={key}
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  // this method for render header
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

  // this method for check if openUrl supported or not
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

  // this method to  open default android messenger

  textContact(phone) {
    const url = `sms:${phone}`;
    this.lanuchUrl(url);
  }

  // this method for call to  contact phone number
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
  scrollToRow(index) {
    this.setState({scrolledTO:index});
    this.scroller.scrollTo({x: 0, y: index,animated: true});

  }
  scrollToTop = () => {
    this.scroller.scrollTo({ x: 0, y: 0, animated: true });
  };
  renderContact = data => {
    return data.map((contact, index) => {
      const middleName = contact.middleName || "";
      const givenName = contact.givenName || "";
      const familyName = contact.familyName || "";
      const FullName = givenName + " " + middleName + " " + familyName;
      //const avatar = item.thumbnailPath || "";
      const phone = contact.phoneNumbers[0].number;
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

      return [
        <Swipeable
          key={index}
          leftActionActivationDistance={100}
          leftContent={leftContent}
          rightActionActivationDistance={100}
          rightContent={rightContent}
          onLeftActionRelease={this.callContact.bind(this, phone)}
          onRightActionRelease={this.textContact.bind(this, phone)}
        >
          <ListItem
            onPress={this.onContactSelected.bind(this, contact)}
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
        </Swipeable>,
        this.renderSeparator(`sepa-${index}`)
      ];
    });
  };
  // this method for render footer
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
        <View style={styles.rightList}>
          <Text onPress={this.scrollToTop} style={styles.rightText}>
            3
          </Text>
          {
this.props.contacts.map((data, key) => {
            return (
              <Text
                key={key}
                onPress={() =>
                  this.scrollToRow(groupRow[key].y)
                }
                style={styles.rightText}
              >
                {data.group}
              </Text>
            );
          })}
        </View>
        <ScrollView
        onScroll={event => {
                    const layout = event.nativeEvent.contentOffset.y;
                    this.setState({scrolledTO:layout});
                  }}
          ref={ref => (this.scroller = ref)}
          style={{ width: width - 20 }}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <List containerStyle={styles.list}>
            {this.props.contacts.map((data, key) => {
              return [
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    groupRow.push({group:data.group,x:layout.x,y:layout.y,height:layout.height,width:layout.width});
                    console.log('grouprow',groupRow);
                  }}
                  key={key}
                >
                  <ListItem
                    hideChevron
                    title={data.group}
                    containerStyle={{ borderBottomWidth: 0 }}
                  />
                </View>,
                this.renderContact(data.children)
              ];
            })}
          </List>
        </ScrollView>
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
    flex: 1,
    backgroundColor: "#fff"
  },
  list: {
    flex: 1,
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
  },
  rightList: {
    backgroundColor: "transparent",
    flex: 1,
    width: 20,
    height: height,
    position: "absolute",
    top: 56,
    right: 0,
    zIndex: 1
  },
  rightText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
    color: "#00d2d3"
  }
});
const mapStateToProps = state => {
  return {
    contacts: groupArrayByFirstChar(state.contacts.data),
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
)(Test);
