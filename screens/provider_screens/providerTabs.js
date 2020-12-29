import React, { useEffect, useState } from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import { Image, StatusBar } from 'react-native';

import { Dimensions } from 'react-native';

// import { CartContext } from '../components/context';

import providerHome from './providerHome';
import providerBookings from './providerBookings';
import providerSlot from './provideSlot';
import ProfileScreen from '../ProfileScreen';
import providerChatContainer from './providerChatContainer';

const ProviderStack = createStackNavigator();
// const DetailsStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const imagewidth = Dimensions.get('window').width;

const providerTabs = ({ navigation }) => {
	
	return (
		<ProviderStack.Navigator>
			<ProviderStack.Screen
				name='providerHome'
				component={providerStackScreen}
				options={{
					headerShown: false,
				}}
			/>
		<ProviderStack.Screen
				name='providerChatContainer'
				component={providerChatContainer}
				options={{
					headerShown: false,
				}}
			/>
		</ProviderStack.Navigator>
	);
};

export default providerTabs;

const providerStackScreen = ({ navigation, route }) => {
	return (
		<Tab.Navigator activeColor='#fff' barStyle={{ backgroundColor: '#1a237e' }}>
			<Tab.Screen
				name='providerHome'
				component={providerHome}
				options={{
					tabBarLabel: 'Home',
					tabBarColor: '#1a237e',
					tabBarIcon: ({ color }) => (
						<Icon name='ios-home' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='providerBookings'
				component={providerBookings}
				options={{
					tabBarLabel: 'Bookings',
					tabBarColor: '#1a237e',
					tabBarIcon: ({ color }) => (
						<Icon name='md-calendar' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Business Hours'
				component={providerSlot}
				options={{
					tabBarLabel: 'Business Hours',
					tabBarColor: '#1a237e',
					tabBarIcon: ({ color }) => (
						<Icon name='md-clock' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={ProfileScreen}
				options={{
					tabBarLabel: 'Profile',
					tabBarColor: '#1a237e',
					tabBarIcon: ({ color }) => (
						<Icon name='ios-person' color={color} size={26} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};

// const providerStackScreen = ({ navigation, route }) => {
// 	return (
// 		<Tab.Navigator activeColor='#fff'>
// 			<Tab.Screen
// 				name='Home'
// 				component={providerHome}
// 				options={{
// 					tabBarLabel: 'Home',
// 					tabBarColor: '#1a237e',
// 					tabBarIcon: ({ color }) => (
// 						<Icon name='ios-home' color={color} size={26} />
// 					),
// 				}}
// 			/>
// 			 <Tab.Screen
// 				name='providerBookings'
// 				component={providerBookings}
// 				options={{
// 					tabBarLabel: 'Bookings',
// 					tabBarColor: '#1a237e',
// 					tabBarIcon: ({ color }) => (
// 						<Image source={require('../../assets/calendar.png')}
// 						style={{
// 							width:26,
// 							height:26,
// 						}}/>
// 					),
// 				}}
// 			/>
//             {/*
// 			<Tab.Screen
// 				name='Notifications'
// 				// component={DetailsStackScreen}
// 				options={{
// 					tabBarLabel: 'Updates',
// 					tabBarColor: '#1a237e',
// 					tabBarIcon: ({ color }) => (
// 						<Icon name='ios-notifications' color={color} size={26} />
// 					),
// 				}}
// 			/>
// 			<Tab.Screen
// 				name='Profile'
// 				// component={ProfileScreen}
// 				options={{
// 					tabBarLabel: 'Profile',
// 					tabBarColor: '#1a237e',
// 					tabBarIcon: ({ color }) => (
// 						<Icon name='ios-person' color={color} size={26} />
// 					),
// 				}}
// 			/> */}
// 		</Tab.Navigator>
// 	);
// };

// const DetailsStackScreen = ({ navigation }) => (
// 	<DetailsStack.Navigator>
// 		<DetailsStack.Screen
// 			name='Details'
// 			component={DetailsScreen}
// 			options={{
// 				headerShown:false,
// 			}}
// 		/>
// 	</DetailsStack.Navigator>
// );
