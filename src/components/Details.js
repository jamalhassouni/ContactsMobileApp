import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import {connect} from 'react-redux';
import {Card,CardItem,Button} from './common';


 class Details extends Component {
   callContact = () => {
    const phone = this.props.contact.phone;
    console.log(`Calling ${phone}`);
   }
   textContact = () =>{
    const phone = this.props.contact.phone;
    console.log(`Messaging ${phone}`);
   }
  render() {
    return (
     <Card>
       <CardItem>
         <View style={styles.container}>
         <Text style={styles.name}>{this.props.contact.name}</Text>
         </View>
       </CardItem>
       <CardItem>
         <View style={styles.buttons}>
          <Button onPress={this.callContact}>Call</Button>
         </View>
         <View style={styles.buttons}>
          <Button onPress={this.textContact}>Text</Button>
         </View>
       </CardItem>
     </Card>
    );
  }
}

const styles = StyleSheet.create({
   container:{
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,

   },
   name:{
    fontSize:18
   },
   buttons:{
    flex: 1,
    height:70,
    marginHorizontal: 10,
   }
});

const mapStateToProp = state =>{
   return {
      contact:state.selection.contact
   };
}
export default  connect(mapStateToProp)(Details);