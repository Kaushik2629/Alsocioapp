import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';

const imagewidth = Dimensions.get('window').width;
const imageheight = Dimensions.get('window').height;
const SearchBox = ({navigation}) => {
  
    const [data, setData] = React.useState({
      search:'',
    });

    const updateSearch = (search) => {
      setData({
        ...data,
        search
      });
    };
    

    <View style={{ flexDirection: 'column' ,alignItems:'stretch'}}>
              <SearchBar
                round
                placeholder="Type Here..."
                containerStyle= {{justifyContent:'center', height:40,padding:5,width:imagewidth}}
                inputContainerStyle={{padding:5,height:5,width:imagewidth*0.98,opacity:1,backgroundColor:'#fff'}}
                inputStyle={{height:2,backgroundColor:'#fff'}}
                lightTheme
                onChangeText={updateSearch}
                value={search}
                />        
        </View>
  }
  
  export default SearchBox;