import React, { Component, useContext, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	Button,
	Modal,
} from 'react-native';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import * as Animatable from 'react-native-animatable';
import { Card, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../components/context';
import { UIActivityIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const paymentsScreen = ({ route, navigation }) => {
	const [currentDate, setCurrentDate] = useState('');

	const { changeCount } = useContext(AuthContext);

	useEffect(() => {
		var month = new Date().getMonth() + 1; //Current Month
		var year = new Date().getFullYear(); //Current Year
		var hours = new Date().getHours(); //Current Hours
		var min = new Date().getMinutes(); //Current Minutes
		var sec = new Date().getSeconds(); //Current Seconds
		setCurrentDate(year + '/' + month);
	}, []);

	const DetailsSchema = Yup.object().shape({
		cardName: Yup.string()
			.min(5, '¡Demasiado corto!')
			.required('¡El nombre de la tarjeta no puede estar vacío!'),

		cardNumber: Yup.string()
			.min(10, 'Numero de tarjeta invalido')
			.required('¡El número de tarjeta no puede estar vacío!'),

		expiry: Yup.string().required('¡El campo no puede estar vacío!'),

		CVV: Yup.string().min(3).required('CVV no puede estar vacío'),
	});

	const [confirmModal, setConfirmModal] = useState(false);

	const [name, setName] = useState();

	const fetchUserName = async () => {
		const a = await AsyncStorage.getItem('userName');
		setName(a);
	};
	useEffect(() => {
		fetchUserName();
	});

	const [isLoading, setIsLoading] = useState(false);

	const payFunction = (parameters) => {
		setIsLoading(true);
		let servicedetails = new FormData();
		servicedetails.append('username', name);
		servicedetails.append('cart_items', JSON.stringify(route.params.cartItems));
		servicedetails.append('cost', route.params.cost);
		servicedetails.append('city', route.params.city);
		servicedetails.append('region', route.params.region);
		servicedetails.append('address', route.params.address);
		servicedetails.append('payment_radio', route.params.paymentMethod);
		servicedetails.append('name', parameters.cardName);
		servicedetails.append('card_number', parameters.cardNumber);
		servicedetails.append('expiration', parameters.expiry);
		servicedetails.append('cvv', parameters.CVV);

		fetch('https://alsocio.com/app/card-book-order/', {
			method: 'POST',
			body: servicedetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				setIsLoading(false);
				if (responseJson.order_status == 'placed') {
					setConfirmModal(true);
					AsyncStorage.removeItem('asyncArray1');
				} else {
					alert('Something Went Wrong');
				}
			});
	};

	return (
		<View style={styles.container}>
			<Modal animationType='fade' visible={confirmModal} transparent={true}>
				<View
					style={{
						backgroundColor: '#fff',
						shadowColor: '#000',
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
					<Text style={{ fontSize: 20, fontWeight: 'bold', padding: 15 }}>
						Your Order has been Confirmed!
					</Text>
					<Button
						title='Go Back To Home Page'
						color='#262262'
						style={{
							borderRadius: 20,
							fontSize: 15,
						}}
						onPress={() => {
							changeCount(0),
								setConfirmModal(!confirmModal),
								navigation.navigate('Home');
						}}
					/>
				</View>
			</Modal>

			<Formik
				initialValues={{ cardName: '', cardNumber: 0, expiry: '', CVV: 0 }}
				onSubmit={(values) => {
					payFunction(values);
				}}
				validationSchema={DetailsSchema}>
				{(props) => (
					<Card style={styles.card}>
						{isLoading ? (
							<Animatable.View
								style={{
									position: 'absolute',
									backgroundColor: '#fff',
									shadowColor: '#000',
									width:imagewidth-15,
									marginTop:15,
									borderRadius: 15,
									shadowOffset: {
										width: 2,
										height: 2,
									},
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
									zIndex: 999,
								}}>
								<View style={{ justifyContent: 'center' }}>
									<UIActivityIndicator
										color='#262262'
										style={{ padding: 20 }}
									/>
									<Text style={{ textAlign: 'center', padding: 20 }}>
									El pedido se está procesando!!
									</Text>
								</View>
							</Animatable.View>
						) : // <Text>Loading...</Text>
						null}
						<Card.Content>
							{/* <View style={{ marginTop: 15 }}> */}
							<View>
								<View style={{ flexDirection: 'row' }}>
									<TextInput
										placeholder={'Ingrese el nombre en la tarjeta'}
										mode='outlined'
										style={styles.textInput}
										onBlur={() => props.setFieldTouched('cardName')}
										onChangeText={props.handleChange('cardName')}
										value={props.values.cardName}
									/>
									<TextInput
										placeholder={'Ingrese el número de tarjeta'}
										mode='outlined'
										style={styles.textInput}
										onBlur={() => props.setFieldTouched('cardNumber')}
										onChangeText={props.handleChange('cardNumber')}
										value={props.values.cardNumber}
										keyboardType={'numeric'}
									/>
								</View>
								<View style={{ flexDirection: 'row' }}>
									{props.touched.cardName && props.errors.cardName && (
										<Text
											style={{
												fontSize: 10,
												width: imagewidth / 2.5,
												textAlign: 'center',
												color: 'red',
											}}>
											{props.errors.cardName}
										</Text>
									)}
									{props.touched.cardNumber && props.errors.cardNumber && (
										<Text
											style={{
												fontSize: 10,
												width: imagewidth / 2.5,
												marginLeft: 25,
												textAlign: 'center',
												color: 'red',
											}}>
											{props.errors.cardNumber}
										</Text>
									)}
								</View>
								<View style={{ flexDirection: 'row' }}>
									<View style={styles.textInput}>
										<Text style={{ marginLeft: 0, fontSize: 12 }}>
											Enter Expiration Date
										</Text>
										<DatePicker
											date={props.values.expiry} // Initial date from state
											mode='date' // The enum of date, datetime and time
											placeholder={props.values.expiry}
											format='YYYY-MM'
											confirmBtnText='Confirm'
											cancelBtnText='Cancel'
											customStyles={{
												dateIcon: {
													position: 'absolute',
													left: 0,
													top: 15,
													marginLeft: 2,
												},
												dateInput: {
													marginLeft: 36,
													marginTop: 20,
													backgroundColor: '#fff',
												},
											}}
											onDateChange={(date) => {
												// setDate(date);
												props.setFieldValue('expiry', date);
											}}
										/>
									</View>
									<View style={styles.textInput}>
										<TextInput
											placeholder={'Ingrese CVV'}
											maxLength={3}
											mode='outlined'
											style={{
												width: imagewidth / 3,
												marginLeft: 20,
											}}
											onBlur={() => props.setFieldTouched('CVV')}
											onChangeText={props.handleChange('CVV')}
											value={props.values.CVV}
											keyboardType={'numeric'}
											secureTextEntry={true}
										/>
									</View>
								</View>
								<View style={{ flexDirection: 'row' }}>
									{props.touched.expiry && props.errors.expiry && (
										<Text
											style={{
												fontSize: 10,
												width: imagewidth / 2.5,
												textAlign: 'center',
												color: 'red',
											}}>
											{props.errors.expiry}
										</Text>
									)}
									{props.touched.CVV && props.errors.CVV && (
										<Text
											style={{
												flexGrow: 1,
												fontSize: 10,
												width: imagewidth / 2.5,
												alignSelf: 'flex-end',
												textAlign: 'right',
												color: 'red',
											}}>
											{props.errors.CVV}
										</Text>
									)}
								</View>
							</View>

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
									}}>
									Enviar
								</Text>
							</TouchableOpacity>
						</Card.Content>
					</Card>
				)}
			</Formik>
		</View>
	);
};
export default paymentsScreen;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: imagewidth - 20,
		justifyContent:'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 10,
		borderRadius: 10,
		backgroundColor: '#e0e0e0',
	},
	textInput: {
		width: imagewidth / 2.5,
		margin: 10,
		textAlign: 'left',
		color: '#000',
		fontSize: 13,
	},
});
