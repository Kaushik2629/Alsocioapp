import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import { StatusBar } from 'react-native';
import AlsocioImage from './AlsocioImage';
import SearchBox from './SearchBox';
import TopLeftNavScreen from './TopLeftNavScreen';
import TopRightNavScreen from './TopRightNavScreen';
import { View } from 'react-native-animatable';
import { SearchBar } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { param } from 'jquery';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const imagewidth = Dimensions.get('window').width;


const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#1a237e',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: 'Updates',
          tabBarColor: '#1a237e',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-notifications" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#1a237e',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarColor: '#1a237e',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-aperture" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

export default MainTabScreen;


const HomeStackScreen = ({navigation}) => (
  
<HomeStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#fff',
        height:90
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'
        },
    }}> 
         {/* <TopStack.Screen name="TopNav" component={TopRightNavScreen}
        /> */}
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
          headerTitle:false,
        headerRight: () => (
            <View style={{flexDirection:"column",alignItems:"flex-end",height:80}}>
              <TopRightNavScreen/>
              <View style={{height:58,flexDirection:"row",alignItems:"center",backgroundColor:'#1a237e'}}>
            <Icon.Button name="ios-search" size={19} backgroundColor='#1a237e' onPress={()=>navigation.navigate('SearchBox')}></Icon.Button>
            <Icon.Button name="ios-menu" size={19} backgroundColor="#1a237e" onPress={() =>navigation.openDrawer() }></Icon.Button>
            </View>
          </View>
        ),
        headerLeft: ()=>(
          <View style={{flexDirection:"column",alignItems:"flex-start",height:80}}>
              <TopLeftNavScreen/>
              <View style={{backgroundColor:'#1a237e',flexDirection:'row',height:58,width:500}}>
                < AlsocioImage/>
              </View>
          </View>
          ),
        headerLeftContainerStyle:{
         padding:0,
        },
        headerRightContainerStyle:{
          padding:0
        },
        }} />
</HomeStack.Navigator>
);

const DetailsStackScreen = ({navigation}) => (
<DetailsStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#1f65ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'
        },
    }}>
        <DetailsStack.Screen name="Details" component={DetailsScreen} options={{
        headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#1f65ff" onPress={() => navigation.openDrawer()}></Icon.Button>
        )
        }} />
</DetailsStack.Navigator>
);


