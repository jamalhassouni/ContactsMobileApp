import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

const Input = ( props ) => (
  <View style={styles.container}>
    <Text style={styles.label}>{props.label}</Text>
    <TextInput
      value={props.value}
      placeholder={props.placeholder}
      secureTextEntry={props.secureTextEntry || false}
      autoCorrect={false}
      autoCapitalize='none'
      onChangeText={props.onChangeText}
      style={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 60
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
    fontSize: 16,
    color: "#000",
    borderBottomWidth: 0.5,
    borderColor: "#95afc0",
  }
});
export { Input };
