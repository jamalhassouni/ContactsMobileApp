import React, { Component } from 'react';
import { Text, StyleSheet, View ,Button } from 'react-native';

export default class Contacts  extends Component {
    render() {
        return (
            <View>
     <Button title='Details' onPress={() => this.props.navigation.navigate('details') }/>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});