import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import * as action from "../actions";
import { List, ListItem } from "react-native-elements";
class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortValue: false,
      displayPhoto: true,
      viewAsFamilyName: false
    };
  }

  componentWillMount() {
    // get data from Storage
    AsyncStorage.getItem("sortValue").then(value => {
      if (value == "yes") {
        this.setState({ sortValue: true });
      } else {
        this.setState({ sortValue: false });
      }
    });
    AsyncStorage.getItem("displayPhoto").then(value => {
      if (value == "yes") {
        this.setState({ displayPhoto: true });
      } else {
        this.setState({ displayPhoto: false });
      }
    });
    AsyncStorage.getItem("viewAsFamilyName").then(value => {
      if (value == "yes") {
        this.setState({ viewAsFamilyName: true });
      } else {
        this.setState({ viewAsFamilyName: false });
      }
    });
  }

  /**
   * handleSort
   *  check value of switch  and  update sortValue storage and state
   * @Param  {Boolean} value  (value of sort list by family name)
   */
  handleSort = value => {
    this.setState({ sortValue: value });
    if (value) {
      AsyncStorage.setItem("sortValue", "yes");
    } else {
      AsyncStorage.setItem("sortValue", "no");
    }
  };
 /**
   * handlePhotos
   *  check value of switch  and  update displayPhoto storage and state
   * @Param  {Boolean} value  (value of Display photos and info)
   */
  handlePhotos = value => {
    this.setState({ displayPhoto: value });
    if (value) {
      AsyncStorage.setItem("displayPhoto", "yes");
    } else {
      AsyncStorage.setItem("displayPhoto", "no");
    }
  };
 /**
   * handleViewAsFamilyName
   *  check value of switch  and  update viewAsFamilyName storage and state
   * @Param  {Boolean} value  (value of view contact as Family name first )
   */
  handleViewAsFamilyName = () => {
    this.setState({ viewAsFamilyName: value });
    if (value) {
      AsyncStorage.setItem("viewAsFamilyName", "yes");
    } else {
      AsyncStorage.setItem("viewAsFamilyName", "no");
    }
  };
  render() {
    return (
      <View style={styles.mainConatinerStyle}>
        <List containerStyle={styles.list}>
          <ListItem
            onPress={() => console.log("cliked")}
            switchButton
            hideChevron
            trackColor={"#00BCD4"}
            title={"Sort list by"}
            subtitle={"Family Name"}
            switched={this.state.sortValue}
            onSwitch={value => {
              this.handleSort(value);
            }}
            containerStyle={{ borderBottomWidth: 0 }}
          />
          <ListItem
            onPress={() => console.log("cliked")}
            switchButton
            hideChevron
            trackColor={"#00BCD4"}
            title={"Display photos and info"}
            switched={this.state.displayPhoto}
            onSwitch={value => {
              this.handlePhotos(value);
            }}
            containerStyle={{ borderBottomWidth: 0 }}
          />
          <ListItem
            onPress={() => console.log("cliked")}
            switchButton
            hideChevron
            trackColor={"#00BCD4"}
            title={"View contact as"}
            subtitle={"Family Name first"}
            switched={this.state.viewAsFamilyName}
            onSwitch={value => {
              this.handleViewAsFamilyName(value);
            }}
            containerStyle={{ borderBottomWidth: 0 }}
          />
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainConatinerStyle: {
    flex: 1,
    backgroundColor: "#fff"
  },
  list: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0
  }
});

const mapStateToProp = state => {
  return {
    contacts: state.contacts.data
  };
};
export default connect(mapStateToProp,action)(Options);
