import React, { Component } from 'react';
import { Text, StyleSheet, View ,FlatList } from 'react-native';
import { connect } from 'react-redux';



class Contacts  extends Component {

   renderContact = ({item}) =>{
       return  <Text>{item.name}</Text>;
   }
    render() {
        return (
            <View style={styles.container}>
            <FlatList
             data={this.props.contacts}
             renderItem = {this.renderContact}
             keyExtractor={item => item.id}
             />
            </View>
        );
    }
}

const styles = StyleSheet.create({
 container:{
     flex: 1,
 }
});

const  mapStateToProps = state =>{
   return  {
      contacts:state.contacts
   };
};

export default connect(mapStateToProps)(Contacts);