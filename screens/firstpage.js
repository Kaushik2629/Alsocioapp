import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Image, SafeAreaView, ActivityIndicator, TouchableHighlight, TouchableOpacity,
         Button, StatusBar} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';  


function firstpage(props) {
    return (
        <SafeAreaView style={styles.container}>
            
      <Text onPress={() => console.log("worked!")}>fefewf</Text>

        <View style={styles.containerimage}>
            <TouchableOpacity onPress={() => navigation.navigate('./screens/signinform')} >
                <View style={styles.image}>
                    <Image
                    style={{width:190,height:80}}
                    fadeDuration = {1000}
                                source={require("../assets/logo.jpg")} />
                        <StatusBar style="auto" />
                </View>
            </TouchableOpacity >
        </View>

      <View style={styles.bottom}>
    <Button 
    style={styles.button}
    title="Know More"  
    onPress={()=>navigation.navigate('..screens/signinform')}/>
    </View>
    </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#003c8f',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom:36,
    },

    image : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 10,  
        elevation: 5
    
    },
    
    containerimage: {
      flex: 1,
      backgroundColor: '#003c8f',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom:36,
      bottom : 0
    },
  
    button: {
      position: "absolute",
      bottom: 0,
      borderRadius:20
    },
  
    bottom: {
      flex: 1,
      width:350,
      justifyContent: 'flex-end',
      marginBottom: 36,
    }
  });

export default firstpage;