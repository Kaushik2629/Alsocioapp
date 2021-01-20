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

const customerSignUpScreen = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(false);

	const [regionArray, setRegionArray] = useState([]);

	const [cityArray, setCityArray] = useState([]);

	const showRegionOptions = () => {
		let item = [];
		let region_array = [];
		let showCity_array = [];
		let showRegion_array = [];
		fetch('https://alsocio.com/app/get-city-region/', {
			method: 'GET',
			// body: usercategory,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				item = [...item, responseJson];

				item.map((item) => {
					region_array = [...region_array, item.region_city_dict];

					region_array.map((city) => {
						showRegion_array = Object.keys(city);
						setRegionArray(showRegion_array);

						showCity_array = Object.values(city);
						setCityArray(showCity_array);
						// setSelectedCity(showCity_array);
					});
				});
			})
			.catch((error) => console.error(error));
		// return selectedRegion.map((element) => {
		// 	// return <option value={element}>{element}</option>;
		// });
	};

	useEffect(() => {
		{
			showRegionOptions();
		}
	}, []);

	const [showPickerModal, setShowPickerModal] = useState(false);

	const [regionValue, setRegionValue] = useState();

	const [cityValue, setCityValue] = useState();

	const regionpicker = () => {
		return regionArray.map((element) => {
			return <Picker.Item label={element} value={element} />;
		});
	};

	let cityRegion = null;
	const citypicker = () => {
		let index = regionArray.indexOf(regionValue);
		let array = [cityArray[index]].toString();
		let city_array = array.split(',');

		return city_array.map((item) => {
			cityRegion = regionValue + ',' + item;
			return <Picker.Item label={item} value={item} />;
		});
	};

	const showPicker = (properties) => {
		return (
			<View
				style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Picker
					style={{
						marginVertical: 10,
						width: imagewidth / 1.5,
						borderRadius: 10,
						backgroundColor: '#e0e0e0',
					}}
					selectedValue={regionValue}
					onValueChange={(itemValue) => {
						setRegionValue(itemValue);
						properties.setFieldValue('region', itemValue);
					}}>
					<Picker.Item label='Seleccionar región' value='' />
					{regionpicker()}
				</Picker>
				<Picker
					style={{
						marginVertical: 10,
						width: imagewidth / 1.5,
						borderRadius: 10,
						backgroundColor: '#e0e0e0',
					}}
					selectedValue={cityValue}
					onValueChange={(itemValue) => {
						setCityValue(itemValue);
						properties.setFieldValue('city', itemValue);
					}}>
					<Picker.Item label='Seleccionar ciudad' value='' />
					{citypicker()}
				</Picker>
			</View>
		);
	};

	const regionDivision = () => {
		return cityValue == null ? (
			<TouchableOpacity
				style={{
					borderColor: '#1a237e',
					fontSize: 10,
					margin: 10,
					fontWeight: 'bold',
					color: '#000',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#e0e0e0',
				}}
				onPress={() => setShowPickerModal(true)}>
				<Text style={{ fontSize: 12, padding: 15 }}>
					Select Your Region and City!
				</Text>
			</TouchableOpacity>
		) : (
			<TouchableOpacity
				style={{
					borderColor: '#1a237e',
					fontSize: 10,
					margin: 10,
					fontWeight: 'bold',
					color: '#000',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#e0e0e0',
				}}
				onPress={() => setShowPickerModal(true)}>
				<Text style={{ fontSize: 12, padding: 15 }}>
					{regionValue},{cityValue}
				</Text>
			</TouchableOpacity>
		);
	};

	const [OTP, setOtp] = useState();

	const sendOtp = (properties) => {
		setIsLoading(true);
		// if (properties.errors.username == '' || properties.errors.email == '') {
		// 	setIsLoading(false);
		// 	return;
		// }
		let register = new FormData();
		register.append('username', properties.values.username);
		register.append('email', properties.values.email);
		fetch('https://alsocio.com/app/send-otp/', {
			method: 'POST',
			body: register,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				setIsLoading(false);
				if (responseJson.user == 'OTP enviado con éxito') {
					console.log(responseJson);
					setOtp(responseJson.otp);
					alert(responseJson.user);
				} else {
					alert(responseJson.user);
				}
			});
	};
	const SignUpSchema = Yup.object().shape({
		first_name: Yup.string().required('Se requiere el primer nombre'),
		last_name: Yup.string().required('Se requiere apellido'),
		region: Yup.string().required('Seleccione su ubicación'),
		city: Yup.string().required('Seleccione su ubicación'),
		contact: Yup.string().min(5, '¡Inválido!').required('Se requiere contacto'),
		username: Yup.string()
			.min(3, 'Necesario')
			.required('Se requiere nombre de usuario'),
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
		otp: Yup.string().required('No se proporciona OTP.').min(4, 'Otp inválido'),
	});

	const registerUser = (parameters) => {
		setIsLoading(true);
		let userDetails = new FormData();
		userDetails.append('first_name', parameters.first_name);
		userDetails.append('last_name', parameters.last_name);
		userDetails.append('customer_city', parameters.city);
		userDetails.append('customer_region', parameters.region);
		userDetails.append('email', parameters.email);
		userDetails.append('username', parameters.username);
		userDetails.append('password', parameters.confirm_password);
		userDetails.append('contact', parameters.contact);
		fetch('https://alsocio.com/app/customer-signup/', {
			method: 'POST',
			body: userDetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				if (responseJson.signup == 'successful') {
					navigation.navigate('SignInScreen');
				}
			});
	};

	// const [isCustomer, setIsCustomer] = useState(true);

	const [showSignUpBox, setShowSignUpBox] = useState(false);

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
					<UIActivityIndicator color='#1a237e' />
					<Text style={{ textAlign: 'center' }}>Procesando...</Text>
				</Animatable.View>
			) : null}
			<Formik
				initialValues={{
					first_name: '',
					last_name: '',
					region: '',
					city: '',
					contact: '',
					username: '',
					email: '',
					otp: '',
					password: '',
					confirm_password: '',
					terms_conditions: false,
					email_updates: false,
				}}
				onSubmit={(values) => {
					registerUser(values);
				}}
				validationSchema={SignUpSchema}>
				{(props) => (
					<Card style={styles.card}>
						{/* <View style={{ marginTop: 15 }}> */}
						<Modal
							animationType='fade'
							visible={showPickerModal}
							transparent={true}
							onRequestClose={() => {
								setShowPickerModal(!showPickerModal);
							}}>
							<View
								style={{
									backgroundColor: '#fff',
									shadowColor: '#000',
									marginTop: 50,
									marginHorizontal: 20,
									borderRadius: 15,
									shadowOffset: {
										width: 2,
										height: 2,
									},
									padding: 10,
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
								}}>
								<TouchableOpacity
									style={{
										flexGrow: 1,
										elevation: 3,
										alignSelf: 'flex-end',
									}}>
									<Icon.Button
										name='ios-close'
										size={25}
										backgroundColor='#fff'
										color='#000'
										style={{ padding: 15, textAlign: 'right' }}
										onPress={() => {
											setShowPickerModal(!showPickerModal);
										}}></Icon.Button>
								</TouchableOpacity>
								{showPicker(props)}
								<Button
									title='Enviar'
									color='#1a237e'
									style={{
										borderRadius: 20,
										fontSize: 15,
									}}
									onPress={() => setShowPickerModal(!showPickerModal)}
								/>
							</View>
						</Modal>
						{showSignUpBox == false ? (
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
										if (!props.errors.email && !props.errors.username) {
											sendOtp(props);
										}
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
										Enviar OTP
									</Text>
								</TouchableOpacity>
								{/* <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}> */}
								<TextInput
									mode={'outlined'}
									placeholder='Ingrese OTP'
									keyboardType={'numeric'}
									onBlur={() => props.setFieldTouched('otp')}
									onChangeText={props.handleChange('otp')}
									value={props.values.otp}
								/>
								{props.touched.otp && props.errors.otp && (
									<Text style={{ fontSize: 10, color: 'red' }}>
										{props.errors.otp}
									</Text>
								)}
								<TouchableOpacity
									style={styles.otp}
									activeOpacity={0.7}
									onPress={() => {
										if (props.values.otp == OTP) {
											setShowSignUpBox(true);
											return;
										} else {
											alert('Ingrese una OTP válida');
										}
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
										Verificar Otp
									</Text>
								</TouchableOpacity>
							</ScrollView>
						) : (
							<ScrollView>
								<View>
									<View style={{ flexDirection: 'row' }}>
										<TextInput
											mode='outlined'
											style={styles.textInput}
											placeholder='Primer nombre'
											onBlur={() => props.setFieldTouched('first_name')}
											onChangeText={props.handleChange('first_name')}
											value={props.values.first_name}
										/>
										<TextInput
											mode='outlined'
											style={styles.textInput}
											placeholder='Apellido'
											onBlur={() => props.setFieldTouched('last_name')}
											onChangeText={props.handleChange('last_name')}
											value={props.values.last_name}
										/>
									</View>
									<View style={{ flexDirection: 'row' }}>
										{props.touched.first_name && props.errors.first_name && (
											<Text
												style={{
													fontSize: 10,
													width: imagewidth / 2.5,
													textAlign: 'center',
													color: 'red',
												}}>
												{props.errors.first_name}
											</Text>
										)}
										{props.touched.last_name && props.errors.last_name && (
											<Text
												style={{
													fontSize: 10,
													width: imagewidth / 2.5,
													textAlign: 'right',
													color: 'red',
												}}>
												{props.errors.last_name}
											</Text>
										)}
									</View>
									<View style={{ justifyContent: 'center', padding: 10 }}>
										<TextInput
											mode={'outlined'}
											placeholder='Ingrese Contacto'
											keyboardType={'numeric'}
											onBlur={() => props.setFieldTouched('contact')}
											onChangeText={props.handleChange('contact')}
											value={props.values.contact}
										/>
										{props.touched.contact && props.errors.contact && (
											<Text style={{ fontSize: 10, color: 'red' }}>
												{props.errors.contact}
											</Text>
										)}
										{regionDivision()}
										<TextInput
											mode={'outlined'}
											placeholder='Introducir la contraseña'
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
										<TextInput
											mode={'outlined'}
											placeholder='Confirmar la contraseña'
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

										<View style={styles.checkbox}>
											<Checkbox
												color='#1a237e'
												value={props.values.terms_conditions}
												status={
													props.values.terms_conditions === true
														? 'checked'
														: 'unchecked'
												}
												onPress={() => {
													props.setFieldValue(
														'terms_conditions',
														!props.values.terms_conditions
													);
												}}
											/>
											<Text style={styles.label}>
												Aceptar terminos y condiciones
											</Text>
										</View>
										<View style={styles.checkbox}>
											<Checkbox
												color='#1a237e'
												value={props.values.email_updates}
												status={
													props.values.email_updates === true
														? 'checked'
														: 'unchecked'
												}
												onPress={() => {
													props.setFieldValue(
														'email_updates',
														!props.values.email_updates
													);
												}}
											/>
											<Text style={styles.label}>
												Me gustaría recibir actualizaciones y promociones por
												correo electrónico
											</Text>
										</View>
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
												Regístrate
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

export default customerSignUpScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1a237e',
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
		backgroundColor: '#1a237e',
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
		backgroundColor: '#1a237e',
	},
});
