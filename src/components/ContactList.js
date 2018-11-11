import React, { PureComponent } from "react";
import {
  PermissionsAndroid,
  Platform,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  AsyncStorage,
  SectionList
} from "react-native";
import Contacts from "react-native-contacts";
import { connect } from "react-redux";
import filter from "lodash/filter";
import * as action from "../actions";
import {
  uniqueList,
  _contains,
  groupArrayByFirstChar,
  getSectionList,
  getSectionListSize
} from "./common/Helper";
import { FloatingMenu } from "./common";
import { List, SearchBar } from "react-native-elements";
import Group from "./Group";
import Contact from "./Contact";
import GroupSectionList from "./GroupSectionList";
const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = 56.34; // height of item
const HEADER_HEIGHT = 39; // the height of the packet header
const SEPARATOR_HEIGHT = 0.5; // the height of the dividing line

import Colors from "./common/Colors";

class ContactList extends PureComponent {
  constructor(props) {
    super(props);
    this.color = "";
    this.groupRow = [];
    this.GroupColor = Colors.text;
    this.state = {
      enable: true,
      displayPhoto: true,
      sortValue: false,
      viewAs: "givenName",
      sectionList: this.props.sectionList,
      isShow: false,
      group: "A"
    };
  }

  componentWillMount() {
    this.updateViewStyle();
    /**
     *  check if paltform is android
     * then request android required permissions
     */
    if (Platform.OS == "android") {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE
      ])
        .then(obj => {
          if (obj["android.permission.READ_CONTACTS"] == "granted") {
            this._fetchData();
          }
        })
        .catch(err => {
          console.log("PermissionsAndroid", err);
        });
    }
    this.props.navigation.setParams({
      label: `${this.props.countList} Contacts`
    });
    this._fetchData();
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
    if (nextProps.sectionList !== this.props.sectionList) {
      this.setState({ sectionList: nextProps.sectionList });
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
    /**
     *  if  navigation state has param check
     *  then update View Style
     */
    if (nextProps.navigation.state.params.check) {
      this.updateViewStyle();
    }
    /*
     * check if groupPos not  equal this.props.groupPos
     * then  update  groupRow Array
     */
    if (nextProps.groupPos !== this.props.groupPos) {
      this.groupRow = nextProps.groupPos;
    }
  }
  updateViewStyle = () => {
    AsyncStorage.getItem("displayPhoto").then(value => {
      if (value == "yes") {
        this.setState({ displayPhoto: true });
      } else if (value == "no") {
        this.setState({ displayPhoto: false });
      }
    });
    AsyncStorage.getItem("sortValue").then(value => {
      if (value == "yes") {
        this.props.ChangeSortBy("familyName");
        this.setState({ sortValue: true });
      } else if (value == "no") {
        this.props.ChangeSortBy("givenName");
        this.setState({ sortValue: false });
      }
    });
    AsyncStorage.getItem("viewAsFamilyName").then(value => {
      if (value == "yes") {
        this.setState({ viewAs: "familyName" });
      } else if (value == "no") {
        this.setState({ viewAs: "givenName" });
      }
    });
  };
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
            this.props.fetchContact(uniqueList(contacts, this.props.sortBy));
          });
        }
      }
    );
  };

  // this method for refresh list data
  _onRefresh = () => {
    this._fetchData();
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

  onScrollEnd = e => {
    const layout = e.nativeEvent.contentOffset.y;
    this.props.changePosition(layout);
  };

  handleScroll = nativeEvent => {
    if (nativeEvent.contentOffset.y == this.props.scrolledTO) {
      //console.log("yes > ");
      //   this.backColor = "#ff7675";
    } else {
      //console.log('no <');
      // this.backColor = "#00d2d3";
    }
  };
  // This side returns data such as A, 0
  _onSectionselect = (chapter, index) => {
    let wait = new Promise(resolve => setTimeout(resolve, 500)); // Smaller number should work
    wait
      .then(() => {
        // Jump to an item
        this.scroller.scrollToLocation({
          animated: true,
          sectionIndex: index,
          itemIndex: -1,
          viewPosition: 0
        });
      })
      .catch(err => {
        console.log("scrollToLocation", err);
      });
  };
  _getItemLayout(data, index) {
    let [length, separator, header] = [
      ITEM_HEIGHT,
      SEPARATOR_HEIGHT,
      HEADER_HEIGHT
    ];
    return { length, offset: (length + separator) * index + header, index };
  }

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

  // this method for render Indicator
  renderIndicator = () => {
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
          color={Colors.header}
          size="large"
        />
      </View>
    );
  };

  renderContent() {
    if (this.props.contacts.length > 0) {
      return (
        <List containerStyle={styles.list}>
          <SectionList
            // onViewableItemsChanged={this._onViewableItemsChanged}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            onMomentumScrollEnd={e => this.onScrollEnd(e)}
            onScrollEndDrag={e => this.onScrollEnd(e)}
            onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
            /* viewabilityConfig={{
                itemVisiblePercentThreshold: 50 //means if 50% of the item is visible
              }}*/
            style={{ width: width - 20 }}
            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            ref={ref => {
              this.scroller = ref;
            }}
            getItemLayout={this.getItemLayout}
            renderItem={({ item, index, section }) => (
              <Contact
                navigation={this.props.navigation}
                item={item}
                index={index}
                viewAs={this.state.viewAs}
                section={section}
                displayPhoto={this.state.displayPhoto}
              />
            )}
            renderSectionHeader={({ section: { group } }) => (
              <Group
                index={group}
                titleStyle={{ color: this.GroupColor }}
                name={group}
                style={{
                  backgroundColor: "#fff"
                }}
              />
            )}
            sections={this.props.contacts}
            keyExtractor={(item, index) => item + index}
            stickySectionHeadersEnabled={true}
          />
          <GroupSectionList
            sections={this.state.sectionList}
            onSectionSelect={this._onSectionselect}
          />
        </List>
      );
    } else {
      return this.renderIndicator();
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.MainContainer}>
        {this.renderHeader()}
        {this.renderContent()}
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
  }
});
const mapStateToProps = state => {
  return {
    contacts: groupArrayByFirstChar(state.contacts.data, state.contacts.sortBy),
    fullData: state.contacts.fullData,
    countList: state.contacts.count,
    refreshing: state.contacts.refreshing,
    query: state.contacts.query,
    loading: state.contacts.loading,
    scrolledTO: state.contacts.scrolledTO,
    groupPos: state.contacts.groupPos,
    sortBy: state.contacts.sortBy,
    sectionList: getSectionList(state.contacts.data),
    sectionSize: getSectionListSize(state.contacts.data)
  };
};

export default connect(
  mapStateToProps,
  action
)(ContactList);
