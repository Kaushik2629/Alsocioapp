import React, { useEffect, useMemo, useState } from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import { Image, StatusBar } from 'react-native';

import { Dimensions } from 'react-native';
import SupportScreen from './SupportScreen';
import showCartitems from '../containers/showCartitems';
import showBookings from '../containers/showBookings';
import showServices from './showServices';
import showDetails from '../containers/showDetails';
import paymentsScreen from '../containers/paymentsScreen';
import SignInScreen from './SignInScreen';
import chatContainer from '../containers/chatContainer';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const imagewidth = Dimensions.get('window').width;

const MainTabScreen = ({ navigation }) => {
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen
				name='Home'
				component={HomeStackScreen}
				options={{
					headerShown: false,
				}}
			/>
			<HomeStack.Screen
				name='SupportScreen'
				component={SupportScreen}
				options={{
					headerShown: false,
				}}
			/>
			<HomeStack.Screen
				name='showCartitems'
				component={showCartitems}
				options={{
					headerStyle: {
						backgroundColor: '#262262',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					title: 'Mi carrito',
				}}
			/>
			<HomeStack.Screen
				name='showServices'
				component={showServices}
				options={{
					headerShown: false,
				}}
			/>
			<HomeStack.Screen
				name='showDetails'
				component={showDetails}
				options={{
					headerShown: false,
				}}
			/>
			<HomeStack.Screen
				name='showBookings'
				component={showBookings}
				options={{
					headerShown: false,
				}}
			/>

			<HomeStack.Screen
				name='paymentsScreen'
				component={paymentsScreen}
				options={{
					headerStyle: {
						backgroundColor: '#262262',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					title: 'Payments',
				}}
			/>
			<HomeStack.Screen
				name='SignInScreen'
				component={SignInScreen}
				options={{
					headerShown: false,
				}}
			/>
			<HomeStack.Screen
				name='chatContainer'
				component={chatContainer}
				options={{
					headerShown: false,
				}}
			/>
		</HomeStack.Navigator>
	);
};

export default MainTabScreen;

const HomeStackScreen = ({ navigation, route }) => {
	return (
		<Tab.Navigator activeColor='#fff'>
			<Tab.Screen
				name='Home'
				component={HomeScreen}
				options={{
					tabBarLabel: 'Inicio',
					tabBarColor: '#262262',
					tabBarIcon: ({ color }) => (
						<Icon name='ios-home' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Explore'
				component={ExploreStackScreen}
				options={{
					tabBarLabel: 'Reservaciones',
					tabBarColor: '#262262',
					tabBarIcon: ({ color }) => (
						<Icon name='md-calendar' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Notifications'
				component={DetailsStackScreen}
				options={{
					tabBarLabel: 'Notificaciones',
					tabBarColor: '#262262',
					tabBarIcon: ({ color }) => (
						<Icon name='ios-notifications' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={ProfileScreen}
				options={{
					tabBarLabel: 'Perfil',
					tabBarColor: '#262262',
					tabBarIcon: ({ color }) => (
						<Icon name='ios-person' color={color} size={26} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};

const DetailsStackScreen = ({ navigation }) => (
	<DetailsStack.Navigator>
		<DetailsStack.Screen
			name='Details'
			component={DetailsScreen}
			options={{
				headerShown: false,
			}}
		/>
	</DetailsStack.Navigator>
);

const ExploreStackScreen = ({ navigation }) => (
	<ExploreStack.Navigator>
		<ExploreStack.Screen
			name='Explore'
			component={ExploreScreen}
			options={{
				headerShown: false,
			}}
		/>
	</ExploreStack.Navigator>
);
