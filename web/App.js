import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
	NavigationContainer,
	DefaultTheme as NavigationDefaultTheme,
	DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
	Provider as PaperProvider,
	DefaultTheme as PaperDefaultTheme,
	DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

import { DrawerContent } from './screens/DrawerContent';

import MainTabScreen from './screens/MainTabScreen';
import SupportScreen from './screens/SupportScreen';
import SettingsScreen from './screens/SettingsScreen';
import BookmarkScreen from './screens/BookmarkScreen';
import CartScreen from './screens/CartScreen';
import BookingsScreen from './screens/BookingsScreen';
import QuoteScreen from './screens/QuoteScreen';

import { AuthContext } from './components/context';

import RootStackScreen from './screens/RootStackScreen.js';

import AsyncStorage from '@react-native-community/async-storage';
import showBookings from './containers/showBookings';
import sampleBookings from './containers/sampleBookings';
import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import { CartContext } from './components/context';
import providerHome from './screens/provider_screens/providerHome';
import providerTabs from './screens/provider_screens/providerTabs';
import { Navigation } from 'swiper';
import providerServices from './screens/provider_screens/providerServices';
import providerInvoice from './screens/provider_screens/providerInvoice';
import providerQuotes from './screens/provider_screens/providerQuotes';
import providerBranches from './screens/provider_screens/providerBranches';
import providerTeamMembers from './screens/provider_screens/providerTeamMembers';
// import { Provider } from 'react-redux';
// import store from './app/redux/store';
// import Route from './app/routes';

const Drawer = createDrawerNavigator();

const App = () => {
	// const [isLoading, setIsLoading] = React.useState(true);
	// const [userToken, setUserToken] = React.useState(null);

	// const { count, setCount } = React.useContext(CartContext);

	const [isDarkTheme, setIsDarkTheme] = useState(false);

	let a = [];
	let s = 0;
	const fetchCount = async () => {
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		a = [...check];

		// Replaced console(a);
		for (let index = 0; index < a.length; index++) {
			const element = a[index][1];
			// Replaced console(element);
			s = s + element;
			// Replaced console(s);
		}
	};
	useEffect(() => {
		fetchCount();
	}, []);

	const initialLoginState = {
		isLoading: true,
		userName: null,
		userToken: null,
		showCount: 0,
	};

	const CustomDefaultTheme = {
		...NavigationDefaultTheme,
		...PaperDefaultTheme,
		colors: {
			...NavigationDefaultTheme.colors,
			...PaperDefaultTheme.colors,
			background: '#ffffff',
			text: '#333333',
		},
	};

	const CustomDarkTheme = {
		...NavigationDarkTheme,
		...PaperDarkTheme,
		colors: {
			...NavigationDarkTheme.colors,
			...PaperDarkTheme.colors,
			background: '#333333',
			text: '#ffffff',
		},
	};

	const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

	const loginReducer = (prevState, action) => {
		switch (action.type) {
			case 'RETRIEVE_TOKEN':
				return {
					...prevState,
					userToken: action.token,
					userName: action.id,
					showCount: action.change,
					isLoading: false,
				};
			case 'LOGIN':
				return {
					...prevState,
					userName: action.id,
					isLoading: false,
				};
			case 'LOGOUT':
				return {
					...prevState,
					userName: null,
					userToken: null,
					isLoading: false,
				};
			case 'REGISTER':
				return {
					...prevState,
					userName: action.id,
					userToken: action.token,
					isLoading: false,
				};
			case 'COUNT':
				return {
					...prevState,
					showCount: action.change,
				};
			case 'ROLE':
				return{
					...prevState,
					userToken: action.token
				}
		}
	};

	const [loginState, dispatch] = React.useReducer(
		loginReducer,
		initialLoginState
	);

	const authContext = useMemo(
		() => ({
			signIn: async (foundUser) => {
				const userName = String(foundUser[0].username);
				const password = String(foundUser[0].password);
				// let role = null;

				// let userdetails = new FormData();
				// userdetails.append('username', userName);
				// userdetails.append('password', password);
				// fetch('https://alsocio.geop.tech/app/check-login/', {
				// 	method: 'POST',
				// 	body: userdetails,
				// })
				// 	.then((response) => response.json())
				// 	.then(async(responseJson) => {
				// 		await AsyncStorage.setItem('userToken', responseJson.user);
				// 	})
				// 	.catch((error) => console.error(error))
				// 	.finally(() => {});
				// const userToken = await AsyncStorage.getItem('userToken')
				try {
					await AsyncStorage.setItem('userName', userName);
				} catch (e) {
					console.log(e);
				}
				
				dispatch({ type: 'LOGIN', id: userName });
			},
			signOut: async () => {
				try {
					await AsyncStorage.removeItem('userName');
					await AsyncStorage.removeItem('userToken');
					await AsyncStorage.removeItem('userType')
					// await AsyncStorage.removeItem('asyncArray1');
				} catch (e) {
					console.log(e);
				}
				dispatch({ type: 'LOGOUT' });
			},
			signUp: () => {
				// setUserToken('fgkj');
				// setIsLoading(false);
			},
			toggleTheme: () => {
				setIsDarkTheme((isDarkTheme) => !isDarkTheme);
			},
			changeCount: (s) => {
				dispatch({ type: 'COUNT', change: s });
			},
			fetchRole: async(response)=>{
				try{
					await AsyncStorage.setItem('userToken',response)
				}catch (e) {
					console.log(e);
				}
				dispatch({type: 'ROLE', token:response})
			},
			Role: loginState.userToken,
			UserName: loginState.userName,
			itemCount: loginState.showCount,
		}),
		[loginState]
	);

	useEffect(() => {
		setTimeout(async () => {
			// setIsLoading(false);
			// let userName;
			// userName = null;
			let x = [];
			let s = 0;

			let userRole = null;
			let a = null;
			try {
				// userName = await AsyncStorage.getItem('userName');
				userRole = await AsyncStorage.getItem('userToken');
				a = await AsyncStorage.getItem('userName');

				let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
				x = [...check];

				// Replaced console(a);
				for (let index = 0; index < x.length; index++) {
					const element = x[index][1];
					// Replaced console(element);
					s = s + element;
					// Replaced console(s);
				}

			} catch (e) {
				console.log(e);
			}
			// console.log('user token: ', userToken);
			dispatch({
				type: 'RETRIEVE_TOKEN',
				token: userRole,
				id: a,
				change:s,
				isLoading: false,
			});
		}, 100);
	}, []);

	if (loginState.isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	console.log(loginState.userToken);
	console.log(loginState.userName);
	console.log(loginState.showCount);

	return (
		<PaperProvider theme={theme}>
			{loginState.userToken != 'Provider' ? (
				<AuthContext.Provider value={authContext}>
					<NavigationContainer theme={theme}>
						<Drawer.Navigator
							drawerContent={(props) => <DrawerContent {...props} />}>
							{/* <Drawer.Screen name='SplashScreen' component={SplashScreen} /> */}
							<Drawer.Screen name='HomeDrawer' component={MainTabScreen} />
							<Drawer.Screen name='SupportScreen' component={SupportScreen} />
							<Drawer.Screen name='SettingsScreen' component={SettingsScreen} />
							<Drawer.Screen name='BookmarkScreen' component={BookmarkScreen} />
							<Drawer.Screen name='CartScreen' component={CartScreen} />
							<Drawer.Screen name='BookingsScreen' component={BookingsScreen} />
							<Drawer.Screen name='QuoteScreen' component={QuoteScreen} />
							<Drawer.Screen name='showBookings' component={showBookings} />
							<Drawer.Screen name='sampleBookings' component={sampleBookings} />
							<Drawer.Screen name='SignInScreen' component={SignInScreen} />
							<Drawer.Screen name='SignUpScreen' component={SignUpScreen} />
						</Drawer.Navigator>
					</NavigationContainer>
				</AuthContext.Provider>
			) : (
				<AuthContext.Provider value={authContext}>
					<NavigationContainer theme={theme}>
						<Drawer.Navigator
							drawerContent={(props) => <DrawerContent {...props} />}>
							<Drawer.Screen name='providerDrawer' component={providerTabs} />
							<Drawer.Screen name='providerServices' component={providerServices} />
							<Drawer.Screen name='providerInvoice' component={providerInvoice} />
							<Drawer.Screen name='providerQuotes' component={providerQuotes} />
							<Drawer.Screen name='providerBranches' component={providerBranches} />
							<Drawer.Screen name='providerTeamMembers' component={providerTeamMembers} />
							<Drawer.Screen name='SignInScreen' component={SignInScreen} />
							<Drawer.Screen name='SignUpScreen' component={SignUpScreen} />
						</Drawer.Navigator>
					</NavigationContainer>
				</AuthContext.Provider>
			)}
		</PaperProvider>
	);
};

export default App;
