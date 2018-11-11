import React, { PureComponent } from "react";
import {
  PermissionsAndroid,
  View,
  Linking,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import * as action from "../actions";
import {
  defaultColors,
  sumChars,
  avatarLetter,
  _contains
} from "./common/Helper";
import { Icon, ListItem, Avatar } from "react-native-elements";
import Swipeable from "./Swipeable";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import Colors from "./common/Colors";

class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      enable: true
    };
  }

  // this method to navigate to the details page with selected contact
  onContactSelected = contact => {
    this.props.selectContact(contact);
    this.props.navigation.navigate("details");
  };

  //enable or disable scroll on swipe
  setScrollEnabled(enable) {
    this.setState({
      enable
    });
  }

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

  // this method for render separator between ListItem
  renderSeparator = key => {
    if (this.props.displayPhoto) {
      this.marginLeft = "14%";
    } else {
      this.marginLeft = "6%";
    }
    return (
      <View
        key={key}
        style={{
          height: 0.5,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: this.marginLeft
        }}
      />
    );
  };

  renderInfo(contact, FullName, phone, givenName, background) {
    if (this.props.displayPhoto) {
      this.GroupColor = Colors.text;
      return (
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
      );
    } else {
      this.GroupColor = Colors.Group;
      return (
        <ListItem
          onPress={this.onContactSelected.bind(this, contact)}
          title={FullName}
          containerStyle={{ borderBottomWidth: 0 }}
        />
      );
    }
  }
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

  render() {
    const contact = this.props.item;
    const index = this.props.index;
    const middleName = contact.middleName || "";
    const givenName = contact.givenName || "";
    const familyName = contact.familyName || "";
    let FullName;
    if (this.props.viewAs == "familyName") {
      FullName = middleName + " " + familyName + " " + givenName;
    } else {
      FullName = givenName + " " + middleName + " " + familyName;
    }

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
          color={Colors.Group}
        />
      </View>
    );

    return [
      <Swipeable
        key={index}
        index={index}
        leftContent={leftContent}
        rightContent={rightContent}
        onLeftActionRelease={this.callContact.bind(this, phone)}
        onRightActionRelease={this.textContact.bind(this, phone)}
        setScrollEnabled={enable => this.setScrollEnabled(enable)}
      >
        {this.renderInfo(contact, FullName, phone, givenName, background)}
      </Swipeable>,
      this.renderSeparator(`sepa-${index}`)
    ];
  }
}

const styles = StyleSheet.create({
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
    loading: state.contacts.loading,
    sortBy: state.contacts.sortBy
  };
};

export default connect(
  mapStateToProps,
  action
)(Contact);
