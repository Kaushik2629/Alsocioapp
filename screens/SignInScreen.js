import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Platform,
	StyleSheet,
	StatusBar,
	Alert,
	ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';

import { AuthContext } from '../components/context';

import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

const imageheight = Dimensions.get('screen').height;
const imagewidth = Dimensions.get('screen').width;

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

	const [isLoading, setIsLoading] = useState(false);

	const [userType, setUserType] = useState();

	const { colors } = useTheme();

	const { signIn, fetchRole } = useContext(AuthContext);

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
		setIsLoading(true);
		let userdetails = new FormData();
		userdetails.append('username', userName);
		userdetails.append('password', password);
		fetch('https://alsocio.com/app/check-login/', {
			method: 'POST',
			body: userdetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				JSON.stringify(responseJson.username);
				// console.log(responseJson);
				if (responseJson.username == '') {
					setIsLoading(false);
					alert('nombre de usuario o contraseña incorrecta');
				} else {
					setData({
						...data,
						getUsername: responseJson.username,
					});
					setUserType(responseJson.user);
					const foundUser = [data, setData].filter((item) => {
						return userName == item.username && password == item.password;
					});
					signIn(responseJson.username);
					fetchRole(responseJson.user);
				}
			})
			.catch((error) => console.error(error))
			.finally(() => {});
	};
	useEffect(() => {
		setIsLoading(false);
		if (a.Role != null && a.Role == 'Customer' && a.UserName != null) {
			navigation.navigate('Home');
		}
		if (a.Role != null && a.Role == 'Provider' && a.UserName != null) {
			navigation.navigate('providerHome');
		}
	}, [a.Role]);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor='#262262' barStyle='light-content' />
			<Animatable.View style={styles.header} animation='fadeIn'>
				<Animatable.Image
					source={require('../assets/icon.png')}
					style={{
						width: imagewidth / 2,
						height: imageheight / 6,
						alignSelf: 'center',
					}}
					resizeMode='contain'
				/>
			</Animatable.View>
			{isLoading ? <ActivityIndicator size='large' color='#fff' /> : null}
			<Animatable.View
				animation='fadeInUp'
				style={[
					styles.footer,
					{
						backgroundColor: colors.background,
					},
				]}>
				<KeyboardAvoidingView behavior="padding">
					<Text
						style={[
							styles.text_footer,
							{
								color: colors.text,
							},
						]}>
						Nombre de usuario
					</Text>
					<View style={styles.action}>
						<FontAwesome name='user-o' color={colors.text} size={20} />
						<TextInput
							placeholder='Su nombre de usuario'
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
								El nombre de usuario debe tener 4 caracteres.
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
						Contraseña
					</Text>
					<View style={styles.action}>
						<Feather name='lock' color={colors.text} size={20} />
						<TextInput
							placeholder='Tu contraseña'
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
								La contraseña debe tener 8 caracteres.
							</Text>
						</Animatable.View>
					)}

					<TouchableOpacity
						onPress={() => navigation.navigate('forgotPasswordScreen')}>
						<Text style={{ color: '#009387', marginTop: 15 }}>
							Forgot password?
						</Text>
					</TouchableOpacity>
					<View style={styles.button}>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								loginHandle(data.username, data.password);
							}}
							style={[
								styles.signIn,
								{
									borderColor: '#26418f',
									borderWidth: 0.5,
									marginTop: 15,
									backgroundColor: '#262262',
								},
							]}>
							<Text
								style={[
									styles.textSign,
									{
										color: '#fff',
									},
								]}>
								Iniciar sesión
							</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</Animatable.View>
		</View>
	);
};

export default SignInScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#262262',
	},
	header: {
		flex: 0.4,
		justifyContent: 'flex-end',
		paddingHorizontal: 20,
	},
	footer: {
		flex: 0.6,
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
		marginTop: 20,
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
