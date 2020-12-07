import React, { useContext, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Platform,
	StyleSheet,
	StatusBar,
	Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
//import LinearGradient from 'expo-linear-gradient/build/LinearGradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';

import { AuthContext } from '../components/context';

import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

const SignInScreen = ({ navigation }) => {
	const [data, setData] = useState({
		username: '',
		password: '',
		getUsername: '',
		check_textInputChange: false,
		secureTextEntry: true,
		isValidUser: true,
		isValidPassword: true,
		userToken: null,
	});

	const [userType,setUserType]=useState()

	const { colors } = useTheme();

	const { signIn,fetchRole } = useContext(AuthContext);

	const a = useContext(AuthContext);

	const textInputChange = (val) => {
		if (val.trim().length >= 4) {
			setData({
				...data,
				username: val,
				check_textInputChange: true,
				isValidUser: true,
			});
		} else {
			setData({
				...data,
				username: val,
				check_textInputChange: false,
				isValidUser: false,
			});
		}
	};

	const handlePasswordChange = (val) => {
		if (val.trim().length >= 8) {
			setData({
				...data,
				password: val,
				isValidPassword: true,
			});
		} else {
			setData({
				...data,
				password: val,
				isValidPassword: false,
			});
		}
	};

	const updateSecureTextEntry = () => {
		setData({
			...data,
			secureTextEntry: !data.secureTextEntry,
		});
	};

	const handleValidUser = (val) => {
		if (val.trim().length >= 4) {
			setData({
				...data,
				isValidUser: true,
			});
		} else {
			setData({
				...data,
				isValidUser: false,
			});
		}
	};

	const loginHandle = (userName, password) => {
	
		let userdetails = new FormData();
		userdetails.append('username', userName);
		userdetails.append('password', password);
		fetch('https://alsocio.geop.tech/app/check-login/', {
			method: 'POST',
			body: userdetails,
		})
			.then((response) => response.json())
			.then(async (responseJson) => {
				JSON.stringify(responseJson.username);
				// console.log(responseJson);
				if (responseJson.username == '') {
					alert('Wrong Input');
				} else {
					setData({
						...data,
						getUsername: responseJson.username,
					});
					setUserType(responseJson.user)
					const foundUser = [data, setData].filter((item) => {
						return (
							userName == item.username &&
							password == item.password
						);
					});
					signIn(foundUser);
					fetchRole(responseJson.user)
					// alert(JSON.stringify(a.loginState))
					// let a = await AsyncStorage.getItem('userType');
					// let b = await AsyncStorage.getItem('userName');
				}
			})
			.catch((error) => console.error(error))
			.finally(() => {});
	};
	if (a.Role == 'Customer' && a.UserName !== null) {
		navigation.navigate('Home');
	}
	if (a.Role == 'Provider' && a.UserName !== null) {
		navigation.navigate('providerHome');
	}

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor='#1a237e' barStyle='light-content' />

			<Animatable.View animation='fadeInDown' style={styles.header}>
				<Text style={styles.text_header}>Welcome to Alsocio!</Text>
			</Animatable.View>
			<Animatable.View
				animation='fadeInUp'
				style={[
					styles.footer,
					{
						backgroundColor: colors.background,
					},
				]}>
				<Text
					style={[
						styles.text_footer,
						{
							color: colors.text,
						},
					]}>
					Username
				</Text>
				<View style={styles.action}>
					<FontAwesome name='user-o' color={colors.text} size={20} />
					<TextInput
						placeholder='Your Username'
						placeholderTextColor='#666666'
						style={[
							styles.textInput,
							{
								color: colors.text,
							},
						]}
						autoCapitalize='none'
						onChangeText={(val) => textInputChange(val)}
						onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
					/>
					{data.check_textInputChange ? (
						<Animatable.View animation='bounceIn'>
							<Feather name='check-circle' color='green' size={20} />
						</Animatable.View>
					) : null}
				</View>
				{data.isValidUser ? null : (
					<Animatable.View animation='fadeInLeft' duration={500}>
						<Text style={styles.errorMsg}>
							Username must be 4 characters long.
						</Text>
					</Animatable.View>
				)}

				<Text
					style={[
						styles.text_footer,
						{
							color: colors.text,
							marginTop: 35,
						},
					]}>
					Password
				</Text>
				<View style={styles.action}>
					<Feather name='lock' color={colors.text} size={20} />
					<TextInput
						placeholder='Your Password'
						placeholderTextColor='#666666'
						secureTextEntry={data.secureTextEntry ? true : false}
						style={[
							styles.textInput,
							{
								color: colors.text,
							},
						]}
						autoCapitalize='none'
						onChangeText={(val) => handlePasswordChange(val)}
					/>
					<TouchableOpacity onPress={updateSecureTextEntry}>
						{data.secureTextEntry ? (
							<Feather name='eye-off' color='grey' size={20} />
						) : (
							<Feather name='eye' color='grey' size={20} />
						)}
					</TouchableOpacity>
				</View>
				{data.isValidPassword ? null : (
					<Animatable.View animation='fadeInLeft' duration={500}>
						<Text style={styles.errorMsg}>
							Password must be 8 characters long.
						</Text>
					</Animatable.View>
				)}

				<TouchableOpacity>
					<Text style={{ color: '#009387', marginTop: 15 }}>
						Forgot password?
					</Text>
				</TouchableOpacity>
				<View style={styles.button}>
					<TouchableOpacity
						style={styles.signIn}
						onPress={() => {
							loginHandle(data.username, data.password);
						}}>
						<LinearGradient
							colors={['#00227b', '#26418f']}
							style={styles.signIn}>
							<Text
								style={[
									styles.textSign,
									{
										color: '#fff',
									},
								]}>
								Sign In
							</Text>
						</LinearGradient>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => navigation.navigate('SignUpScreen')}
						style={[
							styles.signIn,
							{
								borderColor: '#26418f',
								borderWidth: 0.5,
								marginTop: 15,
							},
						]}>
						<Text
							style={[
								styles.textSign,
								{
									color: '#00227',
								},
							]}>
							Sign Up
						</Text>
					</TouchableOpacity>
				</View>
			</Animatable.View>
		</View>
	);
};

export default SignInScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1a237e',
	},
	header: {
		flex: 0.5,
		justifyContent: 'flex-end',
		paddingHorizontal: 20,
		paddingBottom: 50,
	},
	footer: {
		flex: 1,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 20,
		paddingVertical: 30,
	},
	text_header: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 30,
	},
	text_footer: {
		color: '#05375a',
		fontSize: 18,
	},
	action: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
		paddingBottom: 5,
	},
	actionError: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#FF0000',
		paddingBottom: 5,
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
	},
	errorMsg: {
		color: '#FF0000',
		fontSize: 14,
	},
	button: {
		alignItems: 'center',
		marginTop: 50,
	},
	signIn: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
	},
	textSign: {
		fontSize: 18,
		fontWeight: 'bold',
	},
});
