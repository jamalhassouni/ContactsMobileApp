import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

const Input = ( props ) => (
  <View style={styles.container} >
     {props.label && ( <Text style={styles.label}>{props.label}</Text>)}

    <TextInput
      autoFocus={props.autoFocus || false}
      keyboardType={props.keyboardType}
      value={props.value}
      placeholder={props.placeholder}
      secureTextEntry={props.secureTextEntry || false}
      autoCorrect={false}
      autoCapitalize='none'
      onChangeText={props.onChangeText}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      editable={props.editable || true}
      style={props.inputStyle || styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40
  },
  label: {
    flex: 1,
    color: "#707070",
    paddingLeft: 10,
    fontSize: 16
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 14,
    color: "#000",
    borderBottomWidth: 0.2,
    borderColor: "#95afc0",
  }
});
export { Input };
