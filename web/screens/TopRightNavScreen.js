import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const TopRightNavScreen = () => {
    return (
      <View style={styles.container}>

        <FontAwesome 
                    name="user-o"
                    color='#1a237e'
                    size={15}
                /><Text style={{fontSize:12,color:'#1a237e',paddingHorizontal:5}}>Login</Text>
                <FontAwesome 
                    name="plus"
                    color='#1a237e'
                    size={15}
                /><Text style={{fontSize:12,color:'#1a237e',paddingHorizontal:5}}>Sign Up</Text>
      </View>
    );
};
export default TopRightNavScreen;

const styles = StyleSheet.create({
  container: {
    top:0,
    flex: 1, 
    height:5,
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection:"row",
    backgroundColor:'#fff'
  },
  rightside:{
    top:0,
    flex:1,
    height:5,
    paddingRight:10
  }
});