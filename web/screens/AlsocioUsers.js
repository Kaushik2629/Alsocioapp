import React, { Component } from 'react';

import { StyleSheet, View, Text, Image, ActivityIndicator, Button } from 'react-native';
import { block } from 'react-native-reanimated';

export default class AlsocioUsers extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          isLoading: true,
          dataSource: ''
        }
      }

    postRequest = async() =>{
        let formData = new FormData();
        formData.append('username','sachin');
        console.log(formData);
        fetch('https://alsocio.geop.tech/check-login/',{
            method:'POST',
            body: formData
        })
            .then((response) => response.json())
            .then((responseJson) => {
            this.setState({ dataSource: JSON.stringify(responseJson) })
            })
            .catch((error) => console.error(error))
            .finally(() => {
            this.setState({ isLoading: false });
        });
        
    }

  render() {
    return (
        <View style={{
                  flex: 1
                  }}
        >
            <Button onPress={this.postRequest} title="Click here!!"/>
            <Text style={{fontWeight:block}}>{this.state.dataSource}</Text>
        </View>
    );
  }
  
}
