import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';

export default class FetchcartCount extends Component {
  constructor(props) {
    super(props);
    this.state = {cartCount: [] };
  }
  fetchCount=async()=>{
    let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
    a = [...check];
    // Replaced console(a);
    this.setState({cartCount:a})
    alert(check)
  };
  render() {
    let a=[];
    
    // useEffect(() => {
      fetchCount()
    // }, []);
  
    let s=0;
    // function fetchCartCount(){
      for (let index = 0; index < this.state.cartCount.length; index++) {
        const element = this.state.cartCount[index][1];
        // Replaced console(element);
        s = s + element;
        // Replaced console(s);
      }
      return s?(
        <Badge size={20} style={{backgroundColor:'#fff',position:'absolute',top:0,right:0}}><Text style={{color:'#000'}}>{s}</Text></Badge>
      ):(
        null
      )
    // }
    // return (
    //   fetchCartCount()
    // );
  }
}