import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Checkbox, TextInput } from 'react-native-paper';
import { Field, Formik } from 'formik';
import * as Animatable from 'react-native-animatable';
import * as Yup from 'yup';
import { Picker } from '@react-native-community/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { UIActivityIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const forgotPasswordScreen = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(false);

	const [showMsg, setShowMsg] = useState(false);

	const [showSignUpButton, setShowSignUpButton] = useState(false);

	const sendOtp = (properties) => {
		setIsLoading(true);
		if (properties.values.username == '' || properties.values.email == '') {
			alert('Email/Username is empty');
			return;
		}
		let register = new FormData();
		register.append('username', properties.values.username);
		register.append('email', properties.values.email);
		fetch('https://www.alsocio.com/app/send-otp/', {
			method: 'POST',
			body: register,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				setIsLoading(false);
				if (responseJson.user == 'Username and Email already exists') {
					setChangePasswordBox(true);
				} else {
					setShowSignUpButton(true);
				}
			});
	};
	const ChangePasswordSchema = Yup.object().shape({
		username: Yup.string().required('Se requiere nombre de usuario'),
		email: Yup.string().email('Email inválido').required('Necesario'),
		password: Yup.string()
			.required('No se proporcionó contraseña')
			.min(
				8,
				'La contraseña es demasiado corta: debe tener un mínimo de 8 caracteres.'
			),
		confirm_password: Yup.string()
			.required('Necesario.')
			.test(
				'Las contraseñas coinciden',
				'¡Las contraseñas no coinciden!',
				function (value) {
					return this.parent.password === value;
				}
			),
	});

	const changePassword = (parameters) => {
		console.log(parameters.email);
		console.log(parameters.confirm_password);
		setIsLoading(true);
		let userDetails = new FormData();
		userDetails.append('email', parameters.email);
		userDetails.append('password', parameters.confirm_password);
		userDetails.append('username', parameters.username);
		fetch('https://www.alsocio.com/app/update-password/', {
			method: 'POST',
			body: userDetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				setIsLoading(false);
				setShowMsg(true);
				// if (responseJson.password_change == 'successful') {
				// 	navigation.navigate('SignInScreen');
				// }
			});
	};

	// const [isCustomer, setIsCustomer] = useState(true);

	const [changePasswordBox, setChangePasswordBox] = useState(false);

	return (
		<View style={styles.container}>
			{isLoading ? (
				<Animatable.View
					style={{
						flex: 0.2,
						alignSelf: 'center',
						backgroundColor: '#fff',
						width: imagewidth - 50,
						alignItems: 'center',
						justifyContent: 'center',
						borderTopRadius: 15,
						shadowOffset: {
							width: 2,
							height: 2,
						},
						shadowColor: '#000',
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						elevation: 5,
					}}>
					<UIActivityIndicator color='#262262' />
					<Text style={{ textAlign: 'center' }}>Processing...</Text>
				</Animatable.View>
			) : null}
			<Formik
				initialValues={{
					username: '',
					email: '',
					password: '',
					confirm_password: '',
				}}
				onSubmit={(values) => {
					changePassword(values);
				}}
				enableReinitialize={true}
				validationSchema={ChangePasswordSchema}>
				{(props) => (
					<Card style={styles.card}>
						{showMsg ? (
							<Animatable.View
								style={{
									position: 'absolute',
									backgroundColor: '#fff',
									shadowColor: '#000',
									width: imagewidth - 15,
									height: 250,
									borderRadius: 15,
									shadowOffset: {
										width: 2,
										height: 2,
									},
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
									zIndex: 999,
									elevation: 10,
									// alignItems:'center',
									justifyContent: 'center',
								}}>
								<View style={{marginTop:25,paddingHorizontal:15}}>
									<Text style={{ textAlign: 'center' }}>
										Changed Password Successfully
									</Text>
									<TouchableOpacity
										style={styles.otp}
										activeOpacity={0.7}
										onPress={() => {
											navigation.navigate('SignInScreen');
										}}>
										<Text
											style={{
												alignSelf: 'center',
												fontSize: 13,
												fontWeight: '800',
												margin: 15,
												color: '#fff',
											}}>
											Go to Sign In
										</Text>
									</TouchableOpacity>
								</View>
							</Animatable.View>
						) : null}
						{/* <View style={{ marginTop: 15 }}> */}
						{changePasswordBox == false ? (
							<ScrollView style={{ margin: 20 }}>
								<View>
									<View style={{ flexDirection: 'column' }}>
										<TextInput
											mode='outlined'
											placeholder='Ingrese el correo electrónico'
											onBlur={() => props.setFieldTouched('email')}
											onChangeText={props.handleChange('email')}
											value={props.values.email}
										/>
										{props.touched.email && props.errors.email && (
											<Text
												style={{
													fontSize: 10,
													paddingHorizontal: 10,
													color: 'red',
												}}>
												{props.errors.email}
											</Text>
										)}
										<TextInput
											mode='outlined'
											placeholder='Introduzca su nombre de usuario'
											onBlur={() => props.setFieldTouched('username')}
											onChangeText={props.handleChange('username')}
											value={props.values.username}
										/>
										{props.touched.username && props.errors.username && (
											<Text
												style={{
													fontSize: 10,
													paddingHorizontal: 10,
													color: 'red',
												}}>
												{props.errors.username}
											</Text>
										)}
									</View>
								</View>
								<TouchableOpacity
									style={styles.otp}
									activeOpacity={0.7}
									onPress={() => {
										if (props.touched.email && props.errors.email) {
											alert(
												'¡Por favor introduzca una dirección de correo electrónico válida!'
											);
											return;
										}
										sendOtp(props);
									}}>
									<Text
										style={{
											alignSelf: 'center',
											fontSize: 13,
											fontWeight: '800',
											margin: 15,
											color: '#fff',
											flexGrow: 1,
										}}>
										Verificar Detalles
									</Text>
								</TouchableOpacity>
								{showSignUpButton ? (
									<View>
										<Text
											style={{
												fontSize: 10,
												alignSelf: 'center',
												color: '#262262',
											}}>
											Sorry,No User Found
										</Text>
										<TouchableOpacity
											style={styles.otp}
											activeOpacity={0.7}
											onPress={() => {
												navigation.navigate('continueWith');
											}}>
											<Text
												style={{
													alignSelf: 'center',
													fontSize: 13,
													fontWeight: '800',
													margin: 15,
													color: '#fff',
													flexGrow: 1,
												}}>
												Register as New User
											</Text>
										</TouchableOpacity>
									</View>
								) : null}
								{/* <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}> */}
							</ScrollView>
						) : (
							<ScrollView>
								<View>
									<View style={{ margin: 15 }}>
										<TextInput
											mode={'outlined'}
											placeholder='Enter New PassWord'
											onBlur={() => props.setFieldTouched('password')}
											onChangeText={props.handleChange('password')}
											value={props.values.password}
											secureTextEntry={true}
										/>
										{props.touched.password && props.errors.password && (
											<Text style={{ fontSize: 10, color: 'red' }}>
												{props.errors.password}
											</Text>
										)}
									</View>
									<View style={{ margin: 15 }}>
										<TextInput
											mode={'outlined'}
											placeholder='Confirm New Password'
											onBlur={() => props.setFieldTouched('confirm_password')}
											onChangeText={props.handleChange('confirm_password')}
											value={props.values.confirm_password}
											secureTextEntry={true}
										/>

										{props.touched.confirm_password &&
											props.errors.confirm_password && (
												<Text style={{ fontSize: 10, color: 'red' }}>
													{props.errors.confirm_password}
												</Text>
											)}
									</View>
									<View style={{ justifyContent: 'center', padding: 5 }}>
										<TouchableOpacity
											style={styles.otp}
											activeOpacity={0.7}
											onPress={() => {
												props.handleSubmit();
											}}>
											<Text
												style={{
													alignSelf: 'center',
													fontSize: 13,
													fontWeight: '800',
													margin: 15,
													color: '#fff',
													flexGrow: 1,
												}}>
												Change Password
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</ScrollView>
						)}

						{/* </View> */}
					</Card>
				)}
			</Formik>
		</View>
	);
};

export default forgotPasswordScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor:'#262262'
	},
	textInput: {
		width: imagewidth / 2.5,
		margin: 10,
		textAlign: 'left',
		paddingLeft: 10,
		color: '#000',
	},
	button: {
		alignItems: 'center',
		marginTop: 50,
	},
	textSign: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	textPrivate: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 20,
	},
	color_textPrivate: {
		color: 'grey',
	},
	otp: {
		borderRadius: 5,
		margin: 15,
		backgroundColor: '#262262',
	},
	card: {
		width: imagewidth - 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 10,
		elevation: 15,
		borderRadius: 10,
	},
	checkbox: {
		marginVertical: 5,
		marginHorizontal: 10,
		alignSelf: 'center',
		flexDirection: 'row',
	},
	label: {
		alignSelf: 'center',
		fontSize: 12,
	},
	signIn: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		backgroundColor: '#262262',
	},
});
