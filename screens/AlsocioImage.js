import React, { Component } from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';

export default class AlsocioImage extends Component {
  render() {
    return (
      <View style={{ flexDirection: 'row' ,paddingHorizontal:10}}>
        <Image
         source={require('../assets/logo.jpg')}
          style={{
            width: 100,
            height: 40,
            //borderRadius: 40 / 2,
            marginHorizontal:25,
            marginTop:10
          }}
        />
      </View>
    );
  }
}