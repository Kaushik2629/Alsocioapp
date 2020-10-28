import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import{ Picker }from'@react-native-community/picker';
import Icon from 'react-native-vector-icons/Feather';
import AlsocioImage from './AlsocioImage';
import { useScreens } from 'react-native-screens';

const TopLeftNavScreen = () => {
  const [selectedValue, setSelectedValue] = useState("java");
    return (
      <View style={styles.container}>
        <Picker
        selectedValue={selectedValue}
        style={{height:20,width: 150 ,borderRadius:10}}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
      </View>
    );

    

//   const [data, setData] = React.useState({
//     country: 'uk'
// });
};

export default TopLeftNavScreen;

const styles = StyleSheet.create({
  container: {
    top:0,
    flex: 1, 
    height:5,
    alignItems: 'space-between', 
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