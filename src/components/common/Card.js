//import liraries
import React  from 'react';
import { View,StyleSheet } from 'react-native';

// create a component
const Card = (props) => {
    return (
        <View style={styles.container}>
            { props.children }
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#dff9fb',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 60
    },
});

//make this component available to the app
export { Card };