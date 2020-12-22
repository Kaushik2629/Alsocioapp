import React, { useEffect, useMemo, useState } from 'react';
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


import AsyncStorage from '@react-native-community/async-storage';
import showBookings from './containers/showBookings';
import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import providerTabs from './screens/provider_screens/providerTabs';
import providerServices from './screens/provider_screens/providerServices';
import providerInvoice from './screens/provider_screens/providerInvoice';
import providerQuotes from './screens/provider_screens/providerQuotes';
import providerBranches from './screens/provider_screens/providerBranches';
import providerTeamMembers from './screens/provider_screens/providerTeamMembers';
import ProvderSignUpForm from './screens/ProviderSignUpForm';


const Drawer = createDrawerNavigator();

const App = () => {
	

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

	const theme = CustomDefaultTheme;

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
			signIn: async(foundUser) => {
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
					await AsyncStorage.removeItem('userType')
				} catch (e) {
					console.log(e);
				}
				dispatch({ type: 'LOGOUT' });
			},
			signUp: () => {
				// setUserToken('fgkj');
				// setIsLoading(false);
			},
			// toggleTheme: () => {
			// 	setIsDarkTheme((isDarkTheme) => !isDarkTheme);
			// },
			changeCount: (s) => {
				dispatch({ type: 'COUNT', change: s });
			},
			fetchRole: async(response)=>{
				const userType = response
				try{
					await AsyncStorage.setItem('userToken',userType)
				}catch (e) {
					console.log(e);
				}
				dispatch({type: 'ROLE', token:userType})
			},
			Role: loginState.userToken,
			UserName: loginState.userName,
			itemCount: loginState.showCount,
		}),
		[loginState]
	);

	useEffect(() => {
		setTimeout(async () => {
			let x = [];
			let s = 0;

			let userRole = null;
			let a = null;
			try {
				userRole = await AsyncStorage.getItem('userToken');
				a = await AsyncStorage.getItem('userName');

				let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
				x = [...check];

				for (let index = 0; index < x.length; index++) {
					const element = x[index][1];
					s = s + element;
				}

			} catch (e) {
				console.log(e);
			}
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
						</Drawer.Navigator>
					</NavigationContainer>
				</AuthContext.Provider>
			)}
		</PaperProvider>
	);
};

export default App;
