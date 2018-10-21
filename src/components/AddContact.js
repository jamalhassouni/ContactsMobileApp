import React, { Component } from "react";
import {
  PermissionsAndroid,
  ScrollView,
  Image,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Picker,
  Animated,
  DatePickerAndroid
} from "react-native";
import Contacts from "react-native-contacts";
import { connect } from "react-redux";
import * as action from "../actions";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/AntDesign";
import { Input, CardItem } from "./common";
import Colors from "./common/Colors";
import Message from "./common/Toast";
const { width, height } = Dimensions.get("window");
class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(height), //This is the initial position of the subview
      givenName: "",
      familyName: "",
      middleName: "",
      label: "mobile",
      number: "",
      labelEmail: "work",
      email: "",
      labelbirthday: "birthday",
      birthday: "Date",
      labelWebsite: "website",
      website: "",
      showBirthday: false,
      showNotes: false,
      showWebsite: false,
      note: "",
      company: "",
      jobTitle: "",
      month: "",
      day: "",
      year: "",
      error: "",
      icon: "downcircleo",
      showAllInputNames: false,
      suffix: "",
      prefix: ""
    };
  }
  componentDidMount() {}

  onBack = () => {
    this.props.navigation.navigate("contacts");
  };
  // this method  save  contact in addressBook
  onSave = () => {
    let newContact = {
      familyName: this.state.familyName,
      givenName: this.state.givenName,
      middleName: this.state.middleName,
      emailAddresses: [
        {
          label: this.state.labelEmail,
          email: this.state.email
        }
      ],
      company: this.state.company,
      jobTitle: this.state.jobTitle,
      phoneNumbers: [
        {
          label: this.state.label,
          number: this.state.number
        }
      ],
      urlAddresses: [
        {
          label: this.state.labelWebsite,
          url: this.state.website
        }
      ],
      birthday: {
        year: this.state.year,
        month: this.state.month,
        day: this.state.day
      },
      note: this.state.note,
      prefix: this.state.prefix,
      suffix: this.state.suffix
    };
    // Todo : Add new contact
    if (
      this.state.givenName.trim() != "" &&
      this.state.familyName.trim() != "" &&
      this.state.number.trim() != ""
    ) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
      ).then(granted => {
        if (granted) {
          // Add new contact
          Contacts.addContact(newContact, err => {
            if (err) throw err;
            // save successful
            Message("Contact Added successfully");
            this.clearInput("all");
            this.props.navigation.navigate("contacts", { refresh: true });
          });
        }
      });
    } else {
      Message("Please check the fields");
    }
  };
  // this method  clear  input data and reset state for each  input
  clearInput = type => {
    switch (type) {
      case "givenName":
        return this.setState({ givenName: "" });
      case "familyName":
        return this.setState({ familyName: "" });
      case "middleName":
        return this.setState({ middleName: "" });
      case "date":
        return this.setState({
          birthday: "Date",
          year: "",
          month: "",
          day: "",
          showBirthday: false
        });
      case "number":
        return this.setState({ number: "" });
      case "email":
        return this.setState({ email: "" });
      case "note":
        return this.setState({ note: "" });
      case "website":
        return this.setState({ website: "" });
      case "prefix":
        return this.setState({ prefix: "" });
      case "suffix":
        return this.setState({ suffix: "" });
      case "company":
        return this.setState({ company: "", jobTitle: "" });
      case "all":
        return this.setState({
          givenName: "",
          familyName: "",
          middleName: "",
          number: "",
          email: "",
          note: "",
          website: "",
          prefix: "",
          suffix: "",
          company: "",
          jobTitle: ""
        });
    }
  };

  // this method show date Picker
  async _onMyDatePress() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.changeBirthday(year, month, day);
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }
  // this method  update  birthday state
  changeBirthday = (year, month, day) => {
    let birh = `${month + 1}/${day}/${year}`;
    this.setState({
      birthday: birh,
      year: year,
      month: month + 1,
      day: day
    });
  };
  //  this method render  Birtday input

  renderBirthday = () => {
    this.closeModalBottom();
    return (
      <CardItem>
        <View style={styles.groupBorder}>
          <Picker
            mode="dropdown"
            selectedValue={this.state.labelbirthday}
            style={styles.picker}
            onValueChange={value => this.setState({ labelbirthday: value })}
          >
            <Picker.Item label="Birthday" value="birthday" />
            <Picker.Item label="Anniversary" value="Anniversary" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          <View style={{ height: 40, flex: 1, flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 14,
                flex: 1,
                paddingLeft: 10,
                position: "relative",
                top: 10
              }}
              onPress={this._onMyDatePress.bind(this)}
            >
              {this.state.birthday}
            </Text>
            {this.state.birthday != "Date" && (
              <Icon
                onPress={this.clearInput.bind(this, "date")}
                name="minuscircleo"
                style={styles.iconMinus}
                size={20}
              />
            )}
          </View>
        </View>
      </CardItem>
    );
  };
  // this method render website input
  renderWebsite = () => {
    this.closeModalBottom();
    return (
      <CardItem>
        <View style={styles.groupBorder}>
          <Picker
            mode="dropdown"
            selectedValue={this.state.labelWebsite}
            style={styles.picker}
            onValueChange={value => this.setState({ labelWebsite: value })}
          >
            <Picker.Item label="Website" value="website" />
          </Picker>
          <View style={{ height: 40, flex: 1, flexDirection: "row" }}>
            <Input
              inputStyle={{
                flex: 1,
                paddingLeft: 10,
                fontSize: 14,
                color: "#000"
              }}
              keyboardType="url"
              value={this.state.website}
              placeholder="Website"
              onChangeText={website => {
                this.setState({ website });
              }}
            />
            {this.state.website != "" && (
              <Icon
                onPress={this.clearInput.bind(this, "website")}
                name="minuscircleo"
                style={styles.iconMinus}
                size={20}
              />
            )}
          </View>
        </View>
      </CardItem>
    );
  };
  // this method render notes input
  renderNotes = () => {
    this.closeModalBottom();
    return (
      <CardItem>
        <Input
          value={this.state.note}
          placeholder="Notes"
          onChangeText={note => {
            this.setState({ note });
          }}
        />
        {this.state.note != "" && (
          <Icon
            onPress={this.clearInput.bind(this, "note")}
            name="minuscircleo"
            style={styles.iconMinus}
            size={20}
          />
        )}
      </CardItem>
    );
  };
  // this method render  all name inputs
  showNamesInputs = () => {
    if (this.state.showAllInputNames) {
      this.setState({ icon: "downcircleo", showAllInputNames: false });
    } else {
      this.setState({ icon: "upcircleo", showAllInputNames: true });
    }
  };
  // this method  show modal
  openModalButtom() {
    //This will animate the transalteY of the modal bottom between 0 & 100 depending on its current state
    //100 comes from the style below, which is the height of the modal bottom.
    Animated.spring(this.state.bounceValue, {
      toValue: 0,
      //velocity: 3,
      //tension: 2,
      duration: 300
      //friction: 8
    }).start();
  }
  // this method  close modal
  closeModalBottom() {
    Animated.spring(this.state.bounceValue, {
      toValue: height,
      //velocity: 3,
      //tension: 2,
      duration: 300
      //friction: 8
    }).start();
  }
  // this method render  avatar
  renderAvatar = () => {
    return (
      <View style={styles.avatar}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={require("../assets/user.jpg")}
        />
      </View>
    );
  };
  // this method render header
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Button
            onPress={this.onBack}
            backgroundColor={Colors.header}
            buttonStyle={styles.buttonCancel}
            title="Cancel"
            textStyle={{ color: Colors.white, fontSize: 12 }}
          />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Add new Contact </Text>
        </View>
        <View style={styles.headerRight}>
          <Button
            onPress={this.onSave}
            backgroundColor={Colors.white}
            buttonStyle={[styles.buttonCancel, { borderColor: Colors.header }]}
            title="Save"
            textStyle={{ color: Colors.header, fontSize: 12 }}
          />
        </View>
      </View>
    );
  };
  //  this method render modal content
  renderCustomField = () => {
    return (
      // render  modal bottom
      <Animated.View
        style={[
          styles.ModalBottom,
          { transform: [{ translateY: this.state.bounceValue }] }
        ]}
      >
        <ScrollView>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 5
            }}
          >
            Add another field
          </Text>
          <CardItem backgroundColor="transparent">
            <View style={[styles.groupBorder, { justifyContent: "center" }]}>
              <Button
                onPress={() => this.setState({ showBirthday: true })}
                backgroundColor="trasparent"
                title="Birthday"
                buttonStyle={styles.buttonStyles}
                textStyle={styles.textStyle}
              />
            </View>
          </CardItem>
          <CardItem>
            <View style={[styles.groupBorder, { justifyContent: "center" }]}>
              <Button
                onPress={() => this.setState({ showWebsite: true })}
                backgroundColor="trasparent"
                title="Website"
                buttonStyle={styles.buttonStyles}
                textStyle={styles.textStyle}
              />
            </View>
          </CardItem>
          <CardItem>
            <View style={[styles.groupBorder, { justifyContent: "center" }]}>
              <Button
                onPress={() => this.setState({ showNotes: true })}
                backgroundColor="trasparent"
                title="Notes"
                buttonStyle={styles.buttonStyles}
                textStyle={styles.textStyle}
              />
            </View>
          </CardItem>
          <CardItem>
            <View style={[styles.groupBorder, { justifyContent: "center" }]}>
              <Button
                onPress={this.closeModalBottom.bind(this)}
                backgroundColor="trasparent"
                title="Close"
                buttonStyle={styles.buttonStyles}
                textStyle={styles.textStyle}
              />
            </View>
          </CardItem>
        </ScrollView>
      </Animated.View>
    );
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderHeader()}
        <ScrollView>
          {this.renderAvatar()}
          <View style={{ padding: 10 }}>
            {this.state.showAllInputNames && (
              <CardItem>
                <Input
                  value={this.state.prefix}
                  placeholder="Name prefix"
                  onChangeText={prefix => {
                    this.setState({ prefix });
                  }}
                />
                {this.state.prefix != "" && (
                  <Icon
                    onPress={this.clearInput.bind(this, "prefix")}
                    name="minuscircleo"
                    style={styles.iconMinus}
                    size={20}
                  />
                )}
              </CardItem>
            )}
            <CardItem>
              <Input
                autoFocus={true}
                value={this.state.givenName}
                placeholder="Given Name"
                onChangeText={givenName => {
                  this.setState({ givenName });
                }}
              />
              {this.state.givenName != "" && (
                <Icon
                  onPress={this.clearInput.bind(this, "givenName")}
                  name="minuscircleo"
                  style={styles.iconMinus}
                  size={20}
                />
              )}
              <Icon
                onPress={this.showNamesInputs}
                name={this.state.icon}
                style={styles.icon}
                size={20}
              />
            </CardItem>
            {this.state.showAllInputNames && (
              <CardItem>
                <Input
                  value={this.state.middleName}
                  placeholder="Middle Name"
                  onChangeText={middleName => {
                    this.setState({ middleName });
                  }}
                />
                {this.state.middleName != "" && (
                  <Icon
                    onPress={this.clearInput.bind(this, "middleName")}
                    name="minuscircleo"
                    style={styles.iconMinus}
                    size={20}
                  />
                )}
              </CardItem>
            )}
            <CardItem>
              <Input
                value={this.state.familyName}
                placeholder="Family Name"
                onChangeText={familyName => {
                  this.setState({ familyName });
                }}
              />
              {this.state.familyName != "" && (
                <Icon
                  onPress={this.clearInput.bind(this, "familyName")}
                  name="minuscircleo"
                  style={styles.iconMinus}
                  size={20}
                />
              )}
            </CardItem>
            {this.state.showAllInputNames && (
              <CardItem>
                <Input
                  value={this.state.suffix}
                  placeholder="Name suffix"
                  onChangeText={suffix => {
                    this.setState({ suffix });
                  }}
                />
                {this.state.suffix != "" && (
                  <Icon
                    onPress={this.clearInput.bind(this, "suffix")}
                    name="minuscircleo"
                    style={styles.iconMinus}
                    size={20}
                  />
                )}
              </CardItem>
            )}
            <CardItem>
              <Input
                value={this.state.company}
                placeholder="Company"
                onChangeText={company => {
                  this.setState({ company });
                }}
              />
              {this.state.company != "" && (
                <Icon
                  onPress={this.clearInput.bind(this, "company")}
                  name="minuscircleo"
                  style={styles.iconMinus}
                  size={20}
                />
              )}
            </CardItem>
            <CardItem>
              <Input
                value={this.state.jobTitle}
                placeholder="Title"
                onChangeText={jobTitle => {
                  this.setState({ jobTitle });
                }}
              />
            </CardItem>
            <CardItem>
              <View style={styles.groupBorder}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.label}
                  style={styles.picker}
                  onValueChange={value => this.setState({ label: value })}
                >
                  <Picker.Item label="Mobile" value="mobile" />
                  <Picker.Item label="Work" value="work" />
                  <Picker.Item label="Home" value="home" />
                  <Picker.Item label="Main" value="main" />
                  <Picker.Item label="Work Fax" value="work fax" />
                  <Picker.Item label="Home Fax" value="home fax" />
                  <Picker.Item label="Pager" value="pager" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
                <Input
                  inputStyle={{
                    flex: 1,
                    paddingLeft: 10,
                    fontSize: 14,
                    color: "#000"
                  }}
                  keyboardType="phone-pad"
                  value={this.state.number}
                  placeholder="Phone"
                  onChangeText={number => {
                    this.setState({ number });
                  }}
                />
                {this.state.number != "" && (
                  <Icon
                    onPress={this.clearInput.bind(this, "number")}
                    name="minuscircleo"
                    style={styles.iconMinus}
                    size={20}
                  />
                )}
              </View>
            </CardItem>
            <CardItem>
              <View style={styles.groupBorder}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.labelEmail}
                  style={styles.picker}
                  onValueChange={value => this.setState({ labelEmail: value })}
                >
                  <Picker.Item
                    style={{ color: "red" }}
                    label="Work"
                    value="work"
                  />
                  <Picker.Item label="Home" value="home" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
                <Input
                  inputStyle={{
                    flex: 1,
                    paddingLeft: 10,
                    fontSize: 14,
                    color: "#000"
                  }}
                  keyboardType="email-address"
                  value={this.state.email}
                  placeholder="Email"
                  onChangeText={email => {
                    this.setState({ email });
                  }}
                />
                {this.state.email != "" && (
                  <Icon
                    onPress={this.clearInput.bind(this, "email")}
                    name="minuscircleo"
                    style={styles.iconMinus}
                    size={20}
                  />
                )}
              </View>
            </CardItem>
            {this.state.showBirthday && this.renderBirthday()}
            {this.state.showNotes && this.renderNotes()}
            {this.state.showWebsite && this.renderWebsite()}
            <CardItem>
              <View style={[styles.groupBorder, { justifyContent: "center" }]}>
                <Button
                  onPress={this.openModalButtom.bind(this)}
                  backgroundColor={Colors.white}
                  title="Add another field"
                  buttonStyle={{ width: width }}
                  textStyle={{ color: Colors.text, fontSize: 12 }}
                />
              </View>
            </CardItem>
          </View>
        </ScrollView>
        {this.renderCustomField()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0,
    backgroundColor: Colors.white
  },
  header: {
    width: width,
    height: 60,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    flexDirection: "row",
    borderTopWidth: 0,
    backgroundColor: Colors.header,
    zIndex: 1
  },
  avatar: {
    flex: 1,
    alignItems: "center",
    marginTop: 10
  },
  image: {
    justifyContent: "center",
    width: 46,
    height: 46,
    borderRadius: 100
  },
  headerLeft: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 10,
    left: 0,
    padding: 8,
    marginBottom: 10
  },
  iconBack: {
    position: "relative",
    top: 0,
    left: 10
  },
  headerRight: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 0,
    padding: 8,
    marginBottom: 10
  },
  iconOptions: {
    position: "relative",
    top: 0,
    right: 10
  },
  headerCenter: {
    position: "absolute",
    top: 10,
    right: 50,
    left: 50,
    padding: 8,
    marginBottom: 10,
    alignItems: "center"
  },
  headerTitle: {
    justifyContent: "center",
    color: Colors.white
  },
  buttonCancel: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.white,
    height: 30,
    width: 62
  },
  groupBorder: {
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderColor: "#95afc0"
  },
  picker: {
    height: 40,
    width: 120
  },
  ModalBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#dff9fb",
    //  height: width,
    zIndex: 2,
    padding: 10
  },
  buttonStyles: { width: width, justifyContent: "flex-start" },
  textStyle: { color: Colors.text, fontSize: 16 },
  iconMinus: {
    color: "#ff7979",
    position: "relative",
    left: 0,
    top: 10
  },
  icon: {
    width: 20,
    height: 20,
    color: "#95afc0",
    position: "relative",
    left: 0,
    top: 10,
    marginLeft: 10
  }
});
const mapStateToProps = state => {
  console.log(state);
  return {
    contacts: state.contacts.data
  };
};

export default connect(
  mapStateToProps,
  action
)(AddContact);
