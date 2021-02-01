import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
	NavigationContainer,
	DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
	Provider as PaperProvider,
	DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';

import { DrawerContent } from './screens/DrawerContent';

import MainTabScreen from './screens/MainTabScreen';
import SupportScreen from './screens/SupportScreen';
import SettingsScreen from './screens/SettingsScreen';
import QuoteScreen from './screens/QuoteScreen';
import { AuthContext } from './components/context';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import AsyncStorage from '@react-native-community/async-storage';
import showBookings from './containers/showBookings';
import SignInScreen from './screens/SignInScreen';
import customerSignUpScreen from './screens/customerSignUpScreen';
import providerTabs from './screens/provider_screens/providerTabs';
import providerServices from './screens/provider_screens/providerServices';
import providerInvoice from './screens/provider_screens/providerInvoice';
import providerQuotes from './screens/provider_screens/providerQuotes';
import providerBranches from './screens/provider_screens/providerBranches';
import providerTeamMembers from './screens/provider_screens/providerTeamMembers';
import providerPaymentDetails from './screens/provider_screens/providerPaymentDetails';
import continueWith from './screens/continueWith';
import ProviderSignUpForm from './screens/ProviderSignUpForm';
import showFeaturedServices from './screens/showFeaturedServices';
import forgotPasswordScreen from './screens/forgotPasswordScreen';

const Drawer = createDrawerNavigator();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

const App = () => {
	const initialLoginState = {
		isLoading: false,
		userName: null,
		userToken: null,
		showCount: 0,
		region: '',
		city: '',
		// notification:'',
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

	const theme = CustomDefaultTheme;

	const loginReducer = (prevState, action) => {
		switch (action.type) {
			case 'RETRIEVE_TOKEN':
				return {
					...prevState,
					userToken: action.token,
					userName: action.id,
					showCount: action.change,
					city: action.selectCity,
					isLoading: true,
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
				return {
					...prevState,
					userToken: action.token,
				};
			case 'REFRESH':
				return {
					...prevState,
					isLoading: true,
				};
			case 'REGION':
				return {
					...prevState,
					region: action.selectRegion,
				};
			case 'CITY':
				return {
					...prevState,
					city: action.selectCity,
				};
		}
	};

	const [loginState, dispatch] = React.useReducer(
		loginReducer,
		initialLoginState
	);

	const authContext = useMemo(
		() => ({
			signIn: async (foundUser) => {
				const userName = foundUser;
				const password = String(foundUser[0].password);
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
					await AsyncStorage.removeItem('userType');
				} catch (e) {
					console.log(e);
				}
				dispatch({ type: 'LOGOUT' });
			},
			// signUp: () => {

			// },
			// toggleTheme: () => {
			// 	setIsDarkTheme((isDarkTheme) => !isDarkTheme);
			// },
			changeCount: (s) => {
				if (s != null) {
					dispatch({ type: 'COUNT', change: s });
				}
			},
			fetchRole: async (response) => {
				const userType = response;
				try {
					await AsyncStorage.setItem('userToken', userType);
				} catch (e) {
					console.log(e);
				}
				dispatch({ type: 'ROLE', token: userType });
			},
			refresh: () => {
				dispatch({ type: 'REFRESH' });
			},
			// notifyUser: (message)=>{
			// 	let x = [];
			// 	x=x.push(message)
			// 	dispatch({type: 'NOTIFY', getNotifications:x})
			// },
			regionSelect: (regionValue) => {
				dispatch({ type: 'REGION', selectRegion: regionValue });
			},
			citySelect: async (cityValue) => {
				dispatch({ type: 'CITY', selectCity: cityValue });
				try {
					await AsyncStorage.setItem('cityValue', cityValue);
				} catch (e) {
					console.log(e);
				}
			},
			Role: loginState.userToken,
			UserName: loginState.userName,
			itemCount: loginState.showCount,
			Refresh: loginState.isLoading,
			regionValue: loginState.region,
			cityValue: loginState.city,
			// notificationMessage:loginState.notification
		}),
		[loginState]
	);

	useEffect(() => {
		setTimeout(async () => {
			let x = [];
			let s = 0;
			let userRole = null;
			let a = null;
			let updateCityValue = null;
			try {
				userRole = await AsyncStorage.getItem('userToken');
				a = await AsyncStorage.getItem('userName');
				updateCityValue = await AsyncStorage.getItem('cityValue');

				let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
				if (check != null) {
					if (check.length != 0) {
						x = [...check];

						for (let index = 0; index < x.length; index++) {
							const element = x[index][1];
							s = s + element;
						}
					}
				}
			} catch (e) {
				console.log(e);
			}
			dispatch({
				type: 'RETRIEVE_TOKEN',
				token: userRole,
				id: a,
				change: s,
				selectCity: updateCityValue,
			});
		}, 100);
	}, []);

	console.log(loginState.isLoading)

	// const [notificationBody, setNotificationBody] = useState([]);
	const fetchNotifications = () => {
		// alert('id')
		if (loginState.userName != null) {
			let customer_name = new FormData();
			customer_name.append('username', loginState.userName);
			fetch('https://alsocio.com/app/get-notifications/', {
				method: 'POST',
				body: customer_name,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					// console.log(responseJson);
					if (responseJson.notifications.length != 0) {
						console.log('called in function');
						// setNotificationBody(responseJson.notifications);
						responseJson.notifications.map((item) => {
							console.log(item.notification);
							sendPushNotification(expoPushToken, item.notification);
						});
					}
				})
				.catch((error) => console.error(error));
		}
	};
	useEffect(() => {
		var t = setInterval(() => {
			fetchNotifications();
			// console.log(loginState.userName)
		}, 8000);
		return () => {
			clearTimeout(t);
		};
	}, [loginState]);

	//to send expo notification
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	async function registerForPushNotificationsAsync() {
		let token;
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(
				Permissions.NOTIFICATIONS
			);
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				const { status } = await Permissions.askAsync(
					Permissions.NOTIFICATIONS
				);
				finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				alert('Failed to get push token for push notification!');
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync()).data;
			console.log(token);
		} else {
			console.log('Must use physical device for Push Notifications');
		}

		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			});
		}

		// let uid = firebase.auth().currentUser.uid;
		// firebase.database().ref("users").child(uid).update({
		// 	expoPushToken:token
		// })

		return token;
	}

	useEffect(() => {
		registerForPushNotificationsAsync().then((token) =>
			setExpoPushToken(token)
		);

		// This listener is fired whenever a notification is received while the app is foregrounded
		notificationListener.current = Notifications.addNotificationReceivedListener(
			(notification) => {
				setNotification(notification);
			}
		);

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		responseListener.current = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				console.log(response);
			}
		);

		return () => {
			Notifications.removeNotificationSubscription(notificationListener);
			Notifications.removeNotificationSubscription(responseListener);
		};
	}, []);

	async function sendPushNotification(expoPushToken, notifiedMessage) {
		const message = {
			to: expoPushToken,
			sound: 'default',
			title: 'Notifying You!',
			body: notifiedMessage,
			data: { data: 'goes here' },
		};

		await fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Accept-encoding': 'gzip, deflate',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(message),
		});
	}

	// if (loginState.isLoading) {
	// 	return (
	// 		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
	// 			<ActivityIndicator size='large' />
	// 		</View>
	// 	);
	// }

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
							<Drawer.Screen name='QuoteScreen' component={QuoteScreen} />
							<Drawer.Screen name='showBookings' component={showBookings} />
							<Drawer.Screen name='SignInScreen' component={SignInScreen} />
							<Drawer.Screen
								name='showFeaturedServices'
								component={showFeaturedServices}
							/>
							<Drawer.Screen
								name='forgotPasswordScreen'
								component={forgotPasswordScreen}
							/>
							<Drawer.Screen
								name='customerSignUpScreen'
								component={customerSignUpScreen}
							/>
							<Drawer.Screen
								name='ProviderSignUpForm'
								component={ProviderSignUpForm}
							/>
							<Drawer.Screen name='continueWith' component={continueWith} />
							<Drawer.Screen name='quoteCheckoutScreen' component={quoteCheckoutScreen} />
						</Drawer.Navigator>
					</NavigationContainer>
				</AuthContext.Provider>
			) : (
				<AuthContext.Provider value={authContext}>
					<NavigationContainer theme={theme}>
						<Drawer.Navigator
							drawerContent={(props) => <DrawerContent {...props} />}>
							<Drawer.Screen name='providerDrawer' component={providerTabs} />
							<Drawer.Screen
								name='providerServices'
								component={providerServices}
							/>
							<Drawer.Screen
								name='providerInvoice'
								component={providerInvoice}
							/>
							<Drawer.Screen name='providerQuotes' component={providerQuotes} />
							<Drawer.Screen
								name='providerBranches'
								component={providerBranches}
							/>
							<Drawer.Screen
								name='providerTeamMembers'
								component={providerTeamMembers}
							/>
							<Drawer.Screen
								name='providerPaymentDetails'
								component={providerPaymentDetails}
							/>
						</Drawer.Navigator>
					</NavigationContainer>
				</AuthContext.Provider>
			)}
		</PaperProvider>
	);
};

export default App;
