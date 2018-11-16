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
import {
    uniqueList,
  } from "./common/Helper";
import Colors from "./common/Colors";
import Message from "./common/Toast";
import cloneDeep from "lodash/cloneDeep";
const { width, height } = Dimensions.get("window");
class EditContact extends Component {
  constructor(props) {
    super(props);
    url = "";
    email = "";
    labelEmail = "work";
    labelWebsite = "website";
    labelPhone = "mobile";
    number = "";
    suffix = this.props.contact.suffix || "";
    prefix = this.props.contact.prefix || "";
    note = this.props.contact.note || ""
    jobTitle = this.props.contact.jobTitle || "";
    company = this.props.contact.company || "";
    middleName = this.props.contact.middleName || "";
    givenName = this.props.contact.givenName || "";
    familyName = this.props.contact.familyName || "";
    FullName = givenName + " " + middleName + " " + familyName;
    if(this.props.contact.urlAddresses[0] != null ){
     url =  this.props.contact.urlAddresses[0].url;
    }
    if(this.props.contact.emailAddresses[0] != null ){
        labelEmail = this.props.contact.emailAddresses[0].label;
        email= this.props.contact.emailAddresses[0].email ;
    }
    if(this.props.contact.phoneNumbers[0] != null){
      labelPhone  =  this.props.contact.phoneNumbers[0].label;
      number = this.props.contact.phoneNumbers[0].number;
    }
    this.state = {
      bounceValue: new Animated.Value(height), //This is the initial position of the subview
      givenName: givenName,
      familyName: familyName,
      middleName: middleName,
      label: labelPhone,
      number: number,
      labelEmail:labelEmail,
      email:email,
      labelWebsite:labelWebsite,
      website:url,
      note: note,
      company: company,
      jobTitle: jobTitle,
      error: "",
      icon: "downcircleo",
      showAllInputNames: false,
      suffix: suffix,
      prefix: prefix,
      editing: false,
      modalType: "",
      Record:this.props.contact,
    };
  }
  componentDidMount() {
  console.log(this.props.contact);
  }
  // TODO: fix modal  show up
  // FIXME: fix  confim back modal
  onBack = () => {
    if (this.state.editing) {
      this.openModalButtom("confirmBack");
    } else {
      this.props.navigation.navigate("details");
    }
  };
  ForceBack = () => {
    this.props.navigation.navigate("details");
  };
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
  // this method  save  contact in addressBook
  onSave(){
      // TODO : fix update
      Message("This feature is currently unavailable");
/*
   let Record = cloneDeep(this.state.Record);
   Record.givenName = this.state.givenName;
    Record.middleName = this.state.middleName;
    Record.familyName = this.state.familyName;
    Record.prefix = this.state.prefix;
    Record.suffix = this.state.suffix;
    Record.company = this.state.company;
    Record.jobTitle = this.state.jobTitle;
    Record.phoneNumbers[0].label = this.state.label;
    Record.phoneNumbers[0].number = this.state.number;
    Record.note = this.state.note;
  if(Record.emailAddresses[0]!=null){
      Record.emailAddresses[0].label = this.state.labelEmail;
      Record.emailAddresses[0].email = this.state.email;
    }else{
      Record.emailAddresses.push({
        label:this.state.labelEmail,
        email:this.state.email,
     });
    }
    if(Record.urlAddresses[0] != null){
      Record.urlAddresses= [];
      console.log("website ",this.state.website);
      console.log("url ",Record.urlAddresses[0]);
      console.log("urlAddresses ",Record.urlAddresses);
      console.log("props urlAddresses ",this.props.contact.urlAddresses);
      console.log("state urlAddresses ",this.state.Record.urlAddresses);
      //Record.urlAddresses[0].url = this.state.website;
    }else{
      /* Record.urlAddresses.push({
         url:this.state.website
       });

  }
    console.log("Record",Record);

    if (this.state.givenName.trim() != "" && this.state.number.trim() != "") {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
      ).then(granted => {
        if (granted) {
          // update contact
           Contacts.updateContact(Record, (err) => {
            if (err) throw err;
            // record updated
            this.clearInput("all");
           // this.props.UpdateContact(Record);
            this.setState({ editing: false });
            Message("Contact Updated successfully");
            this._fetchData();
            this.props.navigation.navigate("contacts");
          })
        }
      });
    } else {
      Message("Please check the fields");
    }
    */
  }
  // this method  for Delete Contact
  DeleteContact = () => {
    this.closeModalBottom();
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
    ).then(granted => {
      if (granted) {
        // delete a record using only it's recordID
        Contacts.deleteContact(
          { recordID: this.props.contact.recordID },
          (err, recordId) => {
            if (err) throw err;
            // contact deleted
            Message("Successfully deleted");
            this._fetchData();
            this.props.navigation.navigate("contacts");
          }
        );
      }
    });
  };
  // this method  clear  input data and reset state for each  input
  clearInput = type => {
    switch (type) {
      case "givenName":
        return this.setState({ givenName: "", editing: true });
      case "familyName":
        return this.setState({ familyName: "", editing: true });
      case "middleName":
        return this.setState({ middleName: "", editing: true });
      case "number":
        return this.setState({ number: "", editing: true });
      case "email":
        return this.setState({ email: "", editing: true });
      case "note":
        return this.setState({ note: "", editing: true });
      case "website":
        return this.setState({ website: "", editing: true });
      case "prefix":
        return this.setState({ prefix: "", editing: true });
      case "suffix":
        return this.setState({ suffix: "", editing: true });
      case "company":
        return this.setState({ company: "", jobTitle: "", editing: true });
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
          jobTitle: "",
          editing: true
        });
    }
  };

  // this method render website input
  renderWebsite = () => {
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
  openModalButtom(type) {
    this.setState({ modalType: type });
    //This will animate the transalteY of the modal bottom between 0 & 100 depending on its current state
    //100 comes from the style below, which is the height of the modal bottom.
    Animated.spring(this.state.bounceValue, {
      toValue: 0,
      //velocity: 3,
      //tension: 2,
      duration: 300,
      useNativeDriver: true,
      //friction: 8
    }).start();
  }
  // this method  close modal
  closeModalBottom() {
    Animated.spring(this.state.bounceValue, {
      toValue: height,
      //velocity: 3,
      //tension: 2,
      duration: 300,
      useNativeDriver: true,
      //friction: 8
    }).start();
  }
  // this method render  avatar
  renderAvatar = () => {
    return (
      <View style={styles.avatar}>
        <Image
          height={46}
          width={46}
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
          <Text style={styles.headerTitle}>Edit contact </Text>
        </View>
        <View style={styles.headerRight}>
          <Button
            onPress={this.onSave.bind(this)}
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
  renderCustomField = type => {
    switch (type) {
      case "confirmDelete":
        return (
          <Animated.View
            style={[
              styles.ModalBottom,
              { transform: [{ translateY: this.state.bounceValue }] }
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 5
              }}
            >
              Delete this contact?
            </Text>
            <Text style={{ fontSize: 16, margin: 10 }}>
              Delete "{FullName}
              "?
            </Text>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                paddingBottom: 5
              }}
            >
              <Button
                buttonStyle={styles.mdBottom}
                titleStyle={{ color: "red" }}
                onPress={this.DeleteContact}
                title="Yes"
              />
              <Button
                buttonStyle={styles.mdBottom}
                onPress={this.closeModalBottom.bind(this)}
                title="Cancel"
              />
            </View>
          </Animated.View>
        );
      case "confirmBack":
        return (
          <Animated.View
            style={[
              styles.ModalBottom,
              { transform: [{ translateY: this.state.bounceValue }] }
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 5
              }}
            >
              Cancel
            </Text>
            <Text style={{ fontSize: 16, margin: 10 }}>
              Discard your changes?
            </Text>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                paddingBottom: 5
              }}
            >
              <Button
                buttonStyle={styles.mdBottom}
                titleStyle={{ color: "red" }}
                onPress={this.ForceBack}
                title="Yes"
              />
              <Button
                buttonStyle={styles.mdBottom}
                onPress={this.closeModalBottom.bind(this)}
                title="Cancel"
              />
            </View>
          </Animated.View>
        );
    }
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
            {this.renderNotes()}
            {this.renderWebsite()}
            <CardItem>
              <View style={[styles.groupBorder, { justifyContent: "center" }]}>
                <Button
                  onPress={this.openModalButtom.bind(this, "confirmDelete")}
                  backgroundColor={Colors.white}
                  title="Delete 1 contact"
                  buttonStyle={{ width: width }}
                  textStyle={{ color: "#ff7979", fontSize: 12 }}
                />
              </View>
            </CardItem>
          </View>
        </ScrollView>
        {this.renderCustomField(this.state.modalType)}
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
    height: 45,
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
    top: 0,
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
    top: 0,
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
    top: 0,
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
   // width: 62
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
  },
  mdBottom: {
    backgroundColor: "rgba(92, 99,216, 1)",
    width: 100,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 5
  }
});
const mapStateToProps = state => {
  return {
    contact: state.selection.contact
  };
};

export default connect(
  mapStateToProps,
  action
)(EditContact);
