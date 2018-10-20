//import liraries
import React from 'react';
import { View, StyleSheet } from 'react-native';

// create a component
const CardItem = props => {
    return (
        <View style={styles.container} key={props.index}>
            { props.children }
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: 5,
        marginBottom: 10,
    },
});

//make this component available to the app
export { CardItem };