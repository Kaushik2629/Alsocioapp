import React, { useEffect, useMemo, useState } from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import { Image, StatusBar } from 'react-native';

import SearchBox from './SearchBox';
import TopLeftNavScreen from './TopLeftNavScreen';
import TopRightNavScreen from './TopRightNavScreen';
import { View } from 'react-native-animatable';
import { SearchBar } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { param } from 'jquery';
import SupportScreen from './SupportScreen';
import showCartitems from '../containers/showCartitems';
import BookingsScreen from './BookingsScreen';
import showBookings from '../containers/showBookings';
import showServices from './showServices';
import showDetails from '../containers/showDetails';
import sampleBookings from '../containers/sampleBookings';
import paymentsScreen from '../containers/paymentsScreen';
import { CartContext } from '../components/context';
import AsyncStorage from '@react-native-community/async-storage';
import SignInScreen from './SignInScreen';
import { set } from 'react-native-reanimated';


const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const imagewidth = Dimensions.get('window').width;

const MainTabScreen = ({ navigation }) => { 
	
	// let a = [];
	// let s = 0;
	// const [user,setUser] = useState(0)
	// const fetchCount = async () => {
	// 	let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
	// 	a = [...check];
		
	// 	// Replaced console(a);
	// 	for (let index = 0; index < a.length; index++) {
	// 		const element = a[index][1];
	// 		// Replaced console(element);
	// 		s = s + element;
	// 		// Replaced console(s);
	// 	}
	// 	let name = await AsyncStorage.getItem('userName')
	// 	const details = async()=>{
	// 		return{
	// 			count:s,
	// 			username:name,
	// 		}
	// 	}
	// 	const userDetails = await details();
	// 	setUser(userDetails)
	// };
	// // fetchCount();
	// useEffect(() => {
	// 	fetchCount();
	// },[]);

	// const providerValue=useMemo(()=>({user,setUser}),[user,setUser])
	
	return(
	// <CartContext.Provider value={providerValue} >
	<HomeStack.Navigator>
		{/* <TopStack.Screen name="TopNav" component={TopRightNavScreen}
        /> */}
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
			// navigationOptions={{
			// 	tabBarColor: '#000'
			//   }}

			options={{
				headerStyle: {
					backgroundColor: '#1a237e',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				title: 'Services',
				headerRight: () => (
					<Icon.Button
						name='ios-menu'
						size={25}
						backgroundColor='#1a237e'
						onPress={() => navigation.openDrawer()}></Icon.Button>
				),
				// headerRight: ()=>(
				//     // <ShoppingCartIcon/>
				// )
			}}
		/>
		<HomeStack.Screen
			name='showCartitems'
			component={showCartitems}
			options={{
				headerStyle: {
					backgroundColor: '#1a237e',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				title: 'My Cart',
				headerRight: () => (
					<Icon.Button
						name='ios-menu'
						size={25}
						backgroundColor='#1a237e'
						onPress={() => navigation.openDrawer()}></Icon.Button>
				),
				// headerRight: ()=>(
				//     // <ShoppingCartIcon/>
				// )
			}}
		/>
		<HomeStack.Screen
			name='showServices'
			component={showServices}
			// navigationOptions={{
			// 	tabBarColor: '#000'
			//   }}

			options={{
				headerStyle: {
					backgroundColor: '#1a237e',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				title: 'Service Items',
				headerRight: () => (
					<Icon.Button
						name='ios-menu'
						size={25}
						backgroundColor='#1a237e'
						onPress={() => navigation.openDrawer()}></Icon.Button>
				),
				// headerRight: ()=>(
				//     // <ShoppingCartIcon/>
				// )
			}}
		/>
		<HomeStack.Screen
			name='showDetails'
			component={showDetails}
			// navigationOptions={{
			// 	tabBarColor: '#000'
			//   }}

			options={{
				headerStyle: {
					backgroundColor: '#1a237e',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				title: 'Service Details',
				headerRight: () => (
					<Icon.Button
						name='ios-menu'
						size={25}
						backgroundColor='#1a237e'
						onPress={() => navigation.openDrawer()}></Icon.Button>
				),
				// headerRight: ()=>(
				//     // <ShoppingCartIcon/>
				// )
			}}
		/>
		<HomeStack.Screen
			name='showBookings'
			component={showBookings}
			// navigationOptions={{
			// 	tabBarColor: '#000'
			//   }}

			options={{
				headerStyle: {
					backgroundColor: '#1a237e',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				title: 'Bookings',
				headerRight: () => (
					<Icon.Button
						name='ios-menu'
						size={25}
						backgroundColor='#1a237e'
						onPress={() => navigation.openDrawer()}></Icon.Button>
				),
				// headerRight: ()=>(
				//     // <ShoppingCartIcon/>
				// )
			}}
		/>

		<HomeStack.Screen
			name='paymentsScreen'
			component={paymentsScreen}
			// navigationOptions={{
			// 	tabBarColor: '#000'
			//   }}

			options={{
				headerStyle: {
					backgroundColor: '#1a237e',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				title: 'Payments',
				headerRight: () => (
					<Icon.Button
						name='ios-menu'
						size={25}
						backgroundColor='#1a237e'
						onPress={() => navigation.openDrawer()}></Icon.Button>
				),
				// headerRight: ()=>(
				//     // <ShoppingCartIcon/>
				// )
			}}
		/>
		<HomeStack.Screen
			name='SignInScreen'
			component={SignInScreen}
			options={{
				headerShown: false,
			}}
		/>
	</HomeStack.Navigator>
	// </CartContext.Provider>
)};

export default MainTabScreen;

const HomeStackScreen = ({ navigation, route }) => {
	return (
		<Tab.Navigator activeColor='#fff'>
			<Tab.Screen
				name='Home'
				component={HomeScreen}
				options={{
					tabBarLabel: 'Home',
					tabBarColor: '#1a237e',
					tabBarIcon: ({ color }) => (
						<Icon name='ios-home' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Explore'
				component={ExploreScreen}
				options={{
					tabBarLabel: 'Bookings',
					tabBarColor: '#1a237e',
					tabBarIcon: ({ color }) => (
						<Image source={require('../assets/calendar.png')}
						style={{
							width:26,
							height:26,
						}}/>
					),
				}}
			/>
			<Tab.Screen
				name='Notifications'
				component={DetailsStackScreen}
				options={{
					tabBarLabel: 'Updates',
					tabBarColor: '#1a237e',
					tabBarIcon: ({ color }) => (
						<Icon name='ios-notifications' color={color} size={26} />
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

const DetailsStackScreen = ({ navigation }) => (
	<DetailsStack.Navigator>
		<DetailsStack.Screen
			name='Details'
			component={DetailsScreen}
			options={{
				headerShown:false,
			}}
		/>
	</DetailsStack.Navigator>
);
