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
	TextInput,
} from 'react-native';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import * as Animatable from 'react-native-animatable';
import { Card } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../components/context';

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
			.min(5, 'Too Short!')
			.required('Card Name cannot be empty!'),

		cardNumber: Yup.string()
			.min(10, 'Invalid Card Number')
			.required('Card Number cannot be empty!'),

		expiry: Yup.date().required('Field cannot be empty!'),

		CVV: Yup.string().min(3).required('CVV cannot be empty'),
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
		setIsLoading(true)
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

		fetch('https://alsocio.geop.tech/app/card-book-order/', {
			method: 'POST',
			body: servicedetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
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
			{isLoading ? (
				<Animatable.View
					style={{
						flex: 1,
						padding: 20,
						alignContent: 'center',
						justifyContent: 'center',
						alignSelf: 'center',
						padding: 20,
						marginTop: 50,
					}}>
					<Text style={{ textAlign: 'center' }}>Order is Processing!!</Text>
					<UIActivityIndicator color='#1a237e' />
				</Animatable.View>
			) : null}

			<Modal animationType='fade' visible={confirmModal} transparent={true}>
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
						<Text style={{ fontSize: 20, fontWeight: 'bold', padding: 15 }}>
							Your Order has been Confirmed!
						</Text>
						<Button
							title='Go Back To Home Page'
							color='#1a237e'
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
				</View>
			</Modal>

			<Formik
				initialValues={{ cardName: '', cardNumber: 0, expiry: null, CVV: 0 }}
				onSubmit={(values) => {
					{
						payFunction(values);
					}
				}}
				validationSchema={DetailsSchema}>
				{(props) => (
					<Card style={styles.card}>
						<Card.Content>
							{/* <View style={{ marginTop: 15 }}> */}
							<View style={{ flexDirection: 'row' }}>
								<View>
									<TextInput
										placeholder={'Enter Name On Card'}
										style={styles.textInput}
										onBlur={() => props.setFieldTouched('cardName')}
										onChangeText={props.handleChange('cardName')}
										value={props.values.cardName}
									/>
									{props.touched.cardName && props.errors.cardName && (
										<Text style={{ fontSize: 10, color: 'red' }}>
											{props.errors.cardName}
										</Text>
									)}
								</View>
								<View>
									<TextInput
										placeholder={'Enter Card Number'}
										style={styles.textInput}
										onBlur={() => props.setFieldTouched('cardNumber')}
										onChangeText={props.handleChange('cardNumber')}
										value={props.values.cardNumber}
										keyboardType={'numeric'}
									/>
									{props.touched.cardNumber && props.errors.cardNumber && (
										<Text style={{ fontSize: 10, color: 'red' }}>
											{props.errors.cardNumber}
										</Text>
									)}
								</View>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 15 }}>
								<View>
									<Text style={{ marginLeft: 0, fontSize: 12, marginTop: 20 }}>
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
									{props.touched.expiry && props.errors.expiry && (
										<Text
											style={{
												fontSize: 10,
												color: 'red',
												width: 150,
												marginTop: 10,
											}}>
											{props.errors.expiry}
										</Text>
									)}
								</View>

								<View
									style={{
										flexGrow: 1,
										alignSelf: 'flex-end',
										marginLeft: 60,
										marginTop: 40,
									}}>
									<TextInput
										placeholder={'Enter CVV'}
										style={{
											width: 80,
											textAlign: 'left',
											paddingLeft: 10,
											height: 40,
											borderColor: '#1a237e',
											borderWidth: 1,
											borderRadius: 15,
											fontSize: 10,
											fontWeight: 'bold',
											color: '#000',
											backgroundColor: '#fff',
										}}
										onBlur={() => props.setFieldTouched('CVV')}
										onChangeText={props.handleChange('CVV')}
										value={props.values.CVV}
										keyboardType={'numeric'}
										secureTextEntry={true}
									/>
									{props.touched.CVV && props.errors.CVV && (
										<Text
											style={{
												fontSize: 10,
												color: 'red',
												marginTop: 10,
												width: 80,
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
									backgroundColor: '#1a237e',
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
									Submit
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
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: imagewidth - 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 10,
		borderRadius: 10,
		backgroundColor: '#e0e0e0',
	},
	textInput: {
		width: 150,
		margin: 10,
		textAlign: 'left',
		paddingLeft: 10,
		height: 40,
		borderColor: '#1a237e',
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 10,
		fontWeight: 'bold',
		color: '#000',
		backgroundColor: '#fff',
	},
});
