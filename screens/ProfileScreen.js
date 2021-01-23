import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
	Modal,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { MaterialIndicator } from 'react-native-indicators';
import { Appbar, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../components/context';
import * as Yup from 'yup';
import * as Animatable from 'react-native-animatable';


const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const ProfileScreen = ({ navigation }) => {
	const a = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(true);
	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-profile/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setDetails(responseJson);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, [a.UserName]);

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
	};

	useEffect(() => {
		{
			if (a.UserName != null) {
				showRegionOptions();
			}
		}
	}, []);

	const [showPickerModal, setShowPickerModal] = useState(false);

	const [regionValue, setRegionValue] = useState('');

	const [cityValue, setCityValue] = useState('');

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
						setCityValue();
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

	const [customerEditModal, setCustomerEditModal] = useState(false);
	const [providerEditModal, setProviderEditModal] = useState(false);
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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
	const [showMsg, setShowMsg] = useState(false);
	const changePassword = (parameters) => {
		console.log(parameters.email);
		console.log(parameters.confirm_password);
		setIsLoading(true);
		let userDetails = new FormData();
		userDetails.append('email', parameters.email);
		userDetails.append('password', parameters.confirm_password);
		userDetails.append('username', parameters.username);
		fetch('https://alsocio.com/app/update-password/', {
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

	const changePasswordModal = () => {
		return a.UserName != null ? (
			<Modal
				animationType='fade'
				transparent={false}
				visible={showChangePasswordModal}
				onRequestClose={() => {
					setShowChangePasswordModal(!showChangePasswordModal);
				}}>
				<View
					style={{
						backgroundColor: '#fff',
						alignItems:'center',
						justifyContent: 'center',
						shadowColor: '#000',
						borderRadius: 15,
						shadowOffset: {
							width: 5,
							height: 5,
						},
						padding: 10,
						shadowOpacity: 1,
						shadowRadius: 5,
						elevation: 15,
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
								setShowChangePasswordModal(!showChangePasswordModal);
							}}></Icon.Button>
					</TouchableOpacity>
					<Formik
						initialValues={{
							username: a.UserName,
							email: details.email,
							password: '',
							confirm_password: '',
						}}
						onSubmit={(values) => {
							changePassword(values);
						}}
						enableReinitialize={true}
						validationSchema={ChangePasswordSchema}>
						{(props) => (
							<Card
								style={{
									width: imagewidth - 20,
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.8,
									shadowRadius: 10,
									elevation: 15,
									borderRadius: 10,
								}}>
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
										<View style={{ marginTop: 25, paddingHorizontal: 15 }}>
											<Text style={{ textAlign: 'center' }}>
											Contraseña cambiada con éxito
											</Text>
											<TouchableOpacity
												style={styles.otp}
												activeOpacity={0.7}
												onPress={() => {
													setShowChangePasswordModal(false);
													setShowMsg(false)
												}}>
												<Text
													style={{
														alignSelf: 'center',
														fontSize: 13,
														fontWeight: '800',
														margin: 15,
														color: '#fff',
													}}>
													Bueno
												</Text>
											</TouchableOpacity>
										</View>
									</Animatable.View>
								) : null}
								<View>
									<View style={{ margin: 15 }}>
										<TextInput
											mode={'outlined'}
											placeholder='Introduzca nueva contraseña'
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
											placeholder='Confirmar nueva contraseña'
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
												Cambia la contraseña
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</Card>
						)}
					</Formik>
				</View>
			</Modal>
		) : null;
	};

	const showUserProfile = (UserType) => {
		if (UserType == 'Customer') {
			if (isLoading) {
				return (
					<View
						style={{
							padding: 20,
							alignContent: 'center',
							justifyContent: 'center',
							marginTop: 20,
						}}>
						<MaterialIndicator color='#262262' />
					</View>
				);
			}
			return (
				<View>
					{changePasswordModal()}
					<Modal
						animationType='fade'
						visible={customerEditModal}
						transparent={true}
						onRequestClose={() => {
							setCustomerEditModal(!customerEditModal);
						}}>
						<View
							style={{
								marginTop: 50,
								backgroundColor: '#fff',
								shadowColor: '#000',
								marginHorizontal: 20,
								borderRadius: 15,
								shadowOffset: {
									width: 5,
									height: 5,
								},
								padding: 10,
								shadowOpacity: 1,
								shadowRadius: 5,
								elevation: 15,
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
										setCustomerEditModal(!customerEditModal);
									}}></Icon.Button>
							</TouchableOpacity>
							<Formik
								enableReinitialize
								initialValues={{
									first_name: `${details.first_name}`,
									last_name: `${details.last_name}`,
									email: `${details.email}`,
									region: `${details.region}`,
									city: `${details.city}`,
									contact: `${details.contact}`,
								}}
								onSubmit={(values) => {
									setCustomerEditModal(!customerEditModal);
									setIsLoading(true);
									let userdetails = new FormData();
									userdetails.append('username', a.UserName);
									userdetails.append('first_name', values.first_name);
									userdetails.append('last_name', values.last_name);
									userdetails.append('contact', values.contact);
									userdetails.append('region', values.region);
									userdetails.append('city', values.city);
									fetch('https://alsocio.com/app/update-profile/', {
										method: 'POST',
										body: userdetails,
									})
										.then((response) => response.json())
										.then((responseJson) => {
											setDetails(responseJson);
											setIsLoading(false);
										})
										.catch((error) => console.error(error));
								}}>
								{(props) => (
									<View>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Primer nombre
											</Text>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Apellido
											</Text>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={details.first_name}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('first_name')}
												onChangeText={props.handleChange('first_name')}
												value={props.values.first_name}
											/>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={details.last_name}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('last_name')}
												onChangeText={props.handleChange('last_name')}
												value={props.values.last_name}
											/>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Número de contacto-
											</Text>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 10,
													alignSelf: 'center',
												}}>
												Identificación de correo
											</Text>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={`${details.contact}`}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('contact')}
												onChangeText={props.handleChange('contact')}
												value={props.values.contact}
												keyboardType={'numeric'}
											/>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={details.email}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('email')}
												onChangeText={props.handleChange('email')}
												value={props.values.email}
												keyboardType={'email-address'}
											/>
										</View>
										<Text
											style={{
												alignSelf: 'center',
											}}>
											Tu ciudad
										</Text>
										<TouchableOpacity
											onPress={() => setShowPickerModal(true)}
											style={styles.regionOptions}>
											<Text>{props.values.city}</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={{
												borderRadius: 20,
												fontSize: 15,
												margin: 15,
												backgroundColor: '#262262',
											}}
											onPress={() => props.handleSubmit()}>
											<Text
												style={{
													alignSelf: 'center',
													fontSize: 15,
													fontWeight: 'bold',
													margin: 15,
													color: '#fff',
													flexGrow: 1,
												}}>
												Editar perfil
											</Text>
										</TouchableOpacity>

										<Modal
											animationType='fade'
											visible={showPickerModal}
											transparent={true}
											onRequestClose={() => {
												setShowPickerModal(!showPickerModal);
											}}>
											<View
												style={{
													marginTop: 60,
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
														color='#262262'
														style={{
															borderRadius: 20,
															fontSize: 15,
														}}
														onPress={() => setShowPickerModal(!showPickerModal)}
													/>
												</View>
											</View>
										</Modal>
									</View>
								)}
							</Formik>
						</View>
					</Modal>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 10,
						}}>
						<Card style={styles.card}>
							<Card.Content>
								<View
									style={{ flexGrow: 1, padding: 15, borderBottomWidth: 0.45 }}>
									<Text
										style={{
											fontSize: 18,
											fontWeight: '900',
											alignSelf: 'center',
										}}>
										{details.first_name} {details.last_name}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Correo electrónico
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.email}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Contacto
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.contact}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Ciudad
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.city}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Región
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.region}
									</Text>
								</View>
							</Card.Content>
						</Card>
					</View>
					<TouchableOpacity onPress={() => setShowChangePasswordModal(true)}>
						<Text style={{ color: '#262262', marginTop: 15,textAlign:'center' }}>
						Cambia la contraseña?
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							borderRadius: 20,
							fontSize: 15,
							margin: 15,
							backgroundColor: '#262262',
						}}
						onPress={() => setCustomerEditModal(true)}>
						<Text
							style={{
								alignSelf: 'center',
								fontSize: 15,
								fontWeight: 'bold',
								margin: 15,
								color: '#fff',
								flexGrow: 1,
							}}>
							Haga clic aquí para editar su perfil
						</Text>
					</TouchableOpacity>
					{/* </View> */}
				</View>
			);
		}
		if ((UserType = 'Provider')) {
			if (isLoading) {
				return (
					<View
						style={{
							padding: 20,
							alignContent: 'center',
							justifyContent: 'center',
							marginTop: 20,
						}}>
						<MaterialIndicator color='#262262' />
					</View>
				);
			}
			return (
				<ScrollView>
					{changePasswordModal()}
					<Modal
						animationType='fade'
						visible={providerEditModal}
						transparent={true}
						onRequestClose={() => {
							setProviderEditModal(!providerEditModal);
						}}>
						<View
							style={{
								marginTop: 50,
								backgroundColor: '#fff',
								shadowColor: '#000',
								marginHorizontal: 20,
								borderRadius: 15,
								shadowOffset: {
									width: 5,
									height: 5,
								},
								padding: 10,
								shadowOpacity: 1,
								shadowRadius: 5,
								elevation: 15,
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
										setProviderEditModal(!providerEditModal);
									}}></Icon.Button>
							</TouchableOpacity>

							<Formik
								enableReinitialize
								initialValues={{
									first_name: `${details.first_name}`,
									last_name: `${details.last_name}`,
									email: `${details.email}`,
									region: `${details.region}`,
									city: `${details.city}`,
									contact: `${details.contact}`,
									companyName: `${details.company_name}`,
								}}
								onSubmit={(values) => {
									setProviderEditModal(!providerEditModal);
									setIsLoading(true);
									let userdetails = new FormData();
									userdetails.append('username', a.UserName);
									userdetails.append('first_name', values.first_name);
									userdetails.append('last_name', values.last_name);
									userdetails.append('contact', values.contact);
									userdetails.append('region', values.region);
									userdetails.append('city', values.city);
									userdetails.append('company_name', values.companyName);
									fetch('https://alsocio.com/app/update-profile/', {
										method: 'POST',
										body: userdetails,
									})
										.then((response) => response.json())
										.then((responseJson) => {
											setDetails(responseJson);
											setIsLoading(false);
										})
										.catch((error) => console.error(error));
								}}>
								{(props) => (
									<View>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Primer nombre
											</Text>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Apellido
											</Text>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={details.first_name}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('first_name')}
												onChangeText={props.handleChange('first_name')}
												value={props.values.first_name}
											/>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={details.last_name}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('last_name')}
												onChangeText={props.handleChange('last_name')}
												value={props.values.last_name}
											/>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Número de contacto-
											</Text>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 10,
													alignSelf: 'center',
												}}>
												Identificación de correo
											</Text>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={`${details.contact}`}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('contact')}
												onChangeText={props.handleChange('contact')}
												value={props.values.contact}
												keyboardType={'numeric'}
											/>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={details.email}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('email')}
												onChangeText={props.handleChange('email')}
												value={props.values.email}
												keyboardType={'email-address'}
											/>
										</View>
										<Text style={{ alignSelf: 'center' }}>
											Nombre de empresa
										</Text>
										<TextInput
											placeholderTextColor={'#000'}
											placeholder={details.company_name}
											style={{
												margin: 10,
												textAlign: 'center',
												paddingLeft: 10,
												height: 40,
												borderColor: '#262262',
												borderWidth: 1,
												borderRadius: 15,
												fontSize: 10,
												fontWeight: 'bold',
												color: '#000',
											}}
											onBlur={() => props.setFieldTouched('companyName')}
											onChangeText={props.handleChange('companyName')}
											value={props.values.companyName}
										/>
										<Text style={{ alignSelf: 'center' }}>Tu ciudad</Text>
										<TouchableOpacity
											onPress={() => setShowPickerModal(true)}
											style={styles.regionOptions}>
											<Text>{props.values.city}</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={{
												borderRadius: 20,
												fontSize: 15,
												margin: 15,
												backgroundColor: '#262262',
											}}
											onPress={() => props.handleSubmit()}>
											<Text
												style={{
													alignSelf: 'center',
													fontSize: 15,
													fontWeight: 'bold',
													margin: 15,
													color: '#fff',
													flexGrow: 1,
												}}>
												Editar perfil
											</Text>
										</TouchableOpacity>

										<Modal
											animationType='fade'
											visible={showPickerModal}
											transparent={true}
											onRequestClose={() => {
												setShowPickerModal(!showPickerModal);
											}}>
											<View
												style={{
													marginTop: 60,
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
														title='Submit'
														color='#262262'
														style={{
															borderRadius: 20,
															fontSize: 15,
														}}
														onPress={() => setShowPickerModal(!showPickerModal)}
													/>
												</View>
											</View>
										</Modal>
									</View>
								)}
							</Formik>
						</View>
					</Modal>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 10,
						}}>
						<Card style={styles.card}>
							<Card.Content>
								<View
									style={{ flexGrow: 1, padding: 15, borderBottomWidth: 0.45 }}>
									<Text
										style={{
											fontSize: 18,
											fontWeight: '900',
											alignSelf: 'center',
										}}>
										{details.first_name} {details.last_name}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Correo electrónico
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.email}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Contacto
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.contact}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Ciudad
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.city}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Región
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.region}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										nombre de empresa
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.company_name}
									</Text>
								</View>
							</Card.Content>
						</Card>
					</View>
					<TouchableOpacity onPress={() => setShowChangePasswordModal(true)}>
						<Text style={{ color: '#262262', marginTop: 15,textAlign:'center' }}>
						Cambia la contraseña?
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							borderRadius: 20,
							fontSize: 15,
							margin: 15,
							backgroundColor: '#262262',
						}}
						onPress={() => setProviderEditModal(true)}>
						<Text
							style={{
								alignSelf: 'center',
								fontSize: 15,
								fontWeight: 'bold',
								margin: 15,
								color: '#fff',
								flexGrow: 1,
							}}>
							Haga clic aquí para editar su perfil
						</Text>
					</TouchableOpacity>
				</ScrollView>
			);
		}
	};

	return a.UserName != null ? (
		<View style={styles.container}>
			<Appbar.Header
				style={{
					backgroundColor: '#262262',
					alignItems: 'center',
					marginTop: 0,
				}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content titleStyle={{ padding: 10 }} title='Perfil' />
				{/* <Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} /> */}
			</Appbar.Header>
			{showUserProfile(a.Role)}
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Appbar.Header
				style={{
					backgroundColor: '#262262',
					alignItems: 'center',
					marginTop: 0,
				}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Perfil'
					// subtitleStyle={{ marginBottom: 5 }}
				/>
				{/* <Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} /> */}
			</Appbar.Header>
			<View>
				<TouchableOpacity
					style={{
						borderRadius: 20,
						fontSize: 15,
						margin: 15,
						backgroundColor: '#262262',
					}}
					onPress={() => navigation.navigate('SignInScreen')}>
					<Text
						style={{
							alignSelf: 'center',
							fontSize: 15,
							fontWeight: 'bold',
							margin: 15,
							color: '#fff',
							flexGrow: 1,
						}}>
						Inicie sesión para ver su perfil`
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	card: {
		width: imagewidth - 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 10,
		borderRadius: 10,
	},
	info: {
		flexDirection: 'row',
		paddingVertical: 15,
	},
	textInput: {
		flexGrow: 1,
		margin: 10,
		textAlign: 'left',
		paddingLeft: 10,
		height: 40,
		borderColor: '#262262',
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 10,
		fontWeight: 'bold',
		color: '#000',
	},
	regionOptions: {
		flexGrow: 1,
		height: 40,
		borderColor: '#262262',
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 10,
		fontWeight: 'bold',
		color: '#000',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#e0e0e0',
		marginTop: 10,
	},
	otp: {
		borderRadius: 5,
		margin: 15,
		backgroundColor: '#262262',
	},
});
