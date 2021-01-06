import AsyncStorage from '@react-native-community/async-storage';
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
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, RadioButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Card } from 'react-native-paper';
import { Field, Formik } from 'formik';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import { AuthContext } from '../components/context';
import { SkypeIndicator, UIActivityIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('window').width;
const imageheight = Dimensions.get('window').height;

const showBookings = ({ route, navigation }, props) => {
	const { changeCount } = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(false);

	const checkName = useContext(AuthContext);

	const [cartCount, setCartcount] = useState([]);
	let a = [];
	const fetchCount = async () => {
		let check = route.params.cartDetails;
		if (check != null) {
			a = [...check];
			setCartcount(a);
		}
	};
	// fetchCount();
	useEffect(() => {
		fetchCount();
	}, []);

	const [details, setDetails] = useState([]);

	const fetchDetails = async () => {
		let showList = [];
		let check = route.params.cartDetails;
		if (check != null) {
			for (let index = 0; index < check.length; index++) {
				const element = check[index];
				let servicedetails = new FormData();
				servicedetails.append('service_id', element[0]);
				fetch('https://alsocio.com/app/get-service-details/', {
					method: 'POST',
					body: servicedetails,
				})
					.then((response) => response.json())
					.then((responseJson) => {
						// console.log(responseJson)
						showList = [...showList, ...responseJson.service];
						setDetails(showList);
					});
			}
		}
	};
	useEffect(() => {
		fetchDetails();
	}, []);

	//for reciept
	let recieptCartItem = null;
	let recieptTotalCost = 0;
	const [showReciept, setReciept] = useState(null);
	// const fetchReciept = async () => {
	useEffect(() => {
		recieptCartItem = route.params.cartDetails;
		recieptTotalCost = route.params.cost;
		let recieptDetails = new FormData();
		recieptDetails.append('cart_items', JSON.stringify(recieptCartItem));
		recieptDetails.append('cost', recieptTotalCost);
		fetch('https://alsocio.com/app/get-cart-items/', {
			method: 'POST',
			body: recieptDetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				setReciept(responseJson);
			});
	}, []);

	const addtocart = (serviceId) => {
		for (let index = 0; index < cartCount.length; index++) {
			const element = cartCount[index];
			// alert(element);
			if (element[0] == serviceId) {
				const cartitem = cartCount[index][1];
				return (
					<View style={{ flexGrow: 1 }}>
						<Text
						// style={{marginBottom:20}}
						>
							{cartitem}X
						</Text>
					</View>
				);
			}
		}
	};

	const showPopUp = (properties) => {
		return (
			<Animatable.View
				style={{
					marginTop:10,
					flexDirection: 'row',
					backgroundColor: '#fff',
					borderWidth: 0.5,
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.8,
					shadowRadius: 2,
					elevation: 15,
					alignItems: 'center',
					justifyContent: 'center',
					paddingVertical: 15,
				}}
				animation='fadeInUpBig'>
				{/* <View style={{ flexDirection: 'row', padding: 15 }}> */}
				<View style={{ flexGrow: 1, alignItems: 'center' }}>
					<TouchableOpacity
						style={{
							// alignSelf: 'flex-end',
							backgroundColor: '#1a237e',
							width: 180,
							borderRadius: 5,
						}}
						onPress={() => navigation.navigate('showCartitems')}>
						<Text
							style={{
								color: '#fff',
								textAlign: 'center',
								paddingVertical: 15,
							}}>
							Previo
						</Text>
					</TouchableOpacity>
				</View>

				<View style={{ flexGrow: 1, alignItems: 'center' }}>
					<TouchableOpacity
						style={{
							// alignSelf: 'flex-end',
							backgroundColor: '#1a237e',
							width: 180,
							borderRadius: 5,
						}}
						onPress={() => properties.handleSubmit()}>
						<Text
							style={{
								color: '#fff',
								textAlign: 'center',
								paddingVertical: 15,
							}}>
							Revisa
						</Text>
					</TouchableOpacity>
				</View>
				{/* </View> */}
			</Animatable.View>
		);
	};

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
			showRegionOptions();
		}
	}, []);

	//For Radio Buttons

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
				style={{
					flexGrow: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
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

	const [payments, setPaymentMethod] = useState('COD');

	const DetailsSchema = Yup.object().shape({
		address: Yup.string().min(10, 'Too Short!').required('Address is Required'),
		city: Yup.string().required('Please Select Your Location'),
	});

	const [confirmModal, setConfirmModal] = useState(false);

	let showCartArray = route.params.cartDetails;
	let amount = route.params.cost;
	const fetchPayment = (properties) => {
		setIsLoading(true);
		let servicedetails = new FormData();
		servicedetails.append('username', checkName.UserName);
		servicedetails.append('cart_items', JSON.stringify(showCartArray));
		servicedetails.append('cost', amount);
		servicedetails.append('city', properties.city);
		servicedetails.append('region', properties.region);
		servicedetails.append('address', properties.address);
		servicedetails.append('payment_radio', properties.paymentMethod);

		fetch('https://alsocio.com/app/book-order/', {
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

	let recieptArray = [];
	let subCost = route.params.cost;
	recieptArray = [showReciept];
	let charge = 0;
	let itbms = 0;
	let total = 0;
	const showRecieptArray = () => {
		if (showReciept != null) {
			for (let index = 0; index < [showReciept].length; index++) {
				const element = recieptArray[index];
				// alert(element.cost);
				charge = element.charge;
				itbms = element.itbms;
				total = element.total;
			}
			return;
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<Appbar.Header style={{ backgroundColor: '#1a237e',alignItems:'center', marginTop: 0 }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content titleStyle={{ padding: 10 }} title='Detalles de pago' />
			</Appbar.Header>

			<Formik
				initialValues={{
					address: '',
					region: '',
					city: '',
					paymentMethod: 'COD',
				}}
				onSubmit={(values) => {
					if (values.paymentMethod == 'COD') {
						fetchPayment(values);
					}
					if (values.paymentMethod == 'Card') {
						navigation.navigate('paymentsScreen', {
							cartItems: route.params.cartDetails,
							cost: route.params.cost,
							city: values.city,
							region: values.region,
							address: values.address,
							paymentMethod: values.paymentMethod,
						});
					}
				}}
				validationSchema={DetailsSchema}>
				{(props) => (
					<View style={styles.container}>
						{isLoading ? (
							<Animatable.View
								style={{
									position: 'absolute',
									alignSelf:'center',
									backgroundColor: '#fff',
									shadowColor: '#000',
									width: imagewidth - 50,
									alignItems: 'center',
									justifyContent: 'center',
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
								<UIActivityIndicator color='#1a237e' style={{ padding: 10 }} />
								<Text style={{ textAlign: 'center', padding: 20 }}>
								Se está procesando el pedido...
								</Text>
							</Animatable.View>
						) : null}

						<Modal
							animationType='fade'
							visible={confirmModal}
							transparent={true}>
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
									Su pedido ha sido confirmado
								</Text>
								<Button
									title='Volver a la página principal'
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
						</Modal>
						<ScrollView>
							<TextInput
								multiline
								minHeight={70}
								style={{
									borderWidth: 1,
									borderColor: '#ddd',
									borderRadius: 8,
									padding: 10,
									fontSize: 15,
									margin: 10,
								}}
								placeholder='Ingrese su direccion'
								onBlur={() => props.setFieldTouched('address')}
								onChangeText={props.handleChange('address')}
								value={props.values.address}
							/>
							{props.touched.address && props.errors.address && (
								<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
									{props.errors.address}
								</Text>
							)}

							{/* <TouchableOpacity
							onPress={() => setShowPickerModal(true)}></TouchableOpacity> */}

							<Card
								style={{
									borderWidth: 1,
									borderColor: '#ddd',
									borderRadius: 8,
									padding: 10,
									fontSize: 15,
									margin: 10,
								}}>
								<TouchableOpacity onPress={() => setShowPickerModal(true)}>
									{props.values.city == '' && props.values.region == '' ? (
										<Text style={{ fontSize: 12, textAlign: 'center' }}>
											Seleccione su región y Cirty
										</Text>
									) : (
										<Text>
											{props.values.region},{props.values.city}
										</Text>
									)}
								</TouchableOpacity>
							</Card>
							{props.touched.city && props.errors.city && (
								<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
									{props.errors.city}
								</Text>
							)}

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
											color='#1a237e'
											style={{
												borderRadius: 20,
												fontSize: 15,
											}}
											onPress={() => setShowPickerModal(!showPickerModal)}
										/>
									</View>
								</View>
							</Modal>

							<FlatList
								data={details}
								style={styles.flatlist}
								renderItem={({ item }) => {
									return (
										<Card
											style={{
												borderRadius: 5,
												borderWidth: 0.2,
												padding: 13,
											}}>
											<View
												style={{
													alignItems: 'flex-start',
													justifyContent: 'flex-start',
												}}>
												<View
													style={{
														flexDirection: 'row',
														shadowColor: '#000',
														shadowOffset: { width: 0, height: 1 },
														shadowOpacity: 0.5,
														shadowRadius: 1,
														elevation: 1,
														borderRadius: 1,
														padding: 15,
													}}>
													{/* <Card.Content style={{flex: 1,flexDirection: 'row',}}> */}
													<View
														style={{
															flexGrow: 1,
															padding: 10,
															textAlign: 'center',
														}}>
														<Image
															style={{ width: 70, height: 70 }}
															source={{
																uri: 'https:alsocio.com/media/' + item.img,
															}}
														/>
													</View>
													<View style={{ flexGrow: 3, padding: 25 }}>
														<Text style={{ fontSize: 15 }}>
															{item.main_category}
														</Text>
														<Text style={{ fontSize: 10, fontWeight: 'bold' }}>
															Servicio por :
															<Text style={{ fontWeight: '400' }}>
																{item.company_name}
															</Text>
														</Text>
													</View>
													<View
														style={{
															flexGrow: 2,
															padding: 10,
															textAlign: 'right',
														}}>
														{addtocart(item.id)}
														<Text>${item.service_cost}</Text>
													</View>
												</View>
												{/* </Card.Content> */}
											</View>
										</Card>
									);
								}}
							/>
							{showRecieptArray()}
							<Card
								style={{
									borderRadius: 5,
									borderWidth: 0.2,
									padding: 20,
									marginHorizontal: 9,
								}}>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexGrow: 2, padding: (0, 10) }}>
										<Text
											style={{
												marginLeft: 40,
											}}>
											Total parcial
										</Text>
									</View>
									<View
										style={{
											marginRight: 18,
											padding: (0, 10),
										}}>
										<Text>${subCost}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexGrow: 2, padding: (0, 10) }}>
										<Text
											style={{
												marginLeft: 40,
											}}>
											Cargo por servicio
										</Text>
									</View>
									<View
										style={{
											marginRight: 18,
											padding: (0, 10),
										}}>
										<Text>${charge}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexGrow: 2, padding: (0, 10) }}>
										<Text
											style={{
												marginLeft: 40,
											}}>
											ITBMS
										</Text>
									</View>
									<View
										style={{
											marginRight: 18,
											padding: (0, 10),
										}}>
										<Text>${itbms}</Text>
									</View>
								</View>
							</Card>
							<Card
								style={{
									borderRadius: 5,
									borderWidth: 0.2,
									padding: 20,
									marginHorizontal: 9,
								}}>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexGrow: 2, padding: (0, 10) }}>
										<Text
											style={{
												alignSelf: 'center',
												fontSize: 25,
												fontWeight: 'bold',
											}}>
											Total
										</Text>
									</View>
									<View
										style={{
											flexGrow: 1,
											padding: (0, 10),
										}}>
										<Text
											style={{
												alignSelf: 'center',
												fontSize: 25,
												fontWeight: '400',
											}}>
											${total}
										</Text>
									</View>
								</View>
								<View
									style={{
										flexGrow: 1,
										flexDirection: 'row',
										alignItems: 'center',
										margin: (10, 'auto'),
									}}>
									<RadioButton
										color='#1a237e'
										value='COD'
										status={payments === 'COD' ? 'checked' : 'unchecked'}
										onPress={() => {
											setPaymentMethod('COD'),
												props.setFieldValue('paymentMethod', 'COD');
										}}
									/>
									<Text style={{ fontSize: 17 }}>COD</Text>
									<RadioButton
										color='#1a237e'
										value='Card'
										status={payments === 'Card' ? 'checked' : 'unchecked'}
										onPress={() => {
											setPaymentMethod('Card'),
												props.setFieldValue('paymentMethod', 'Card');
										}}
									/>
									<Text style={{ fontSize: 17 }}>Card</Text>
									<Image
										style={{ width: 50, height: 30, marginLeft: 15 }}
										source={require('../assets/mastercard-image.png')}
									/>
									<Image
										style={{ width: 75, height: 30, marginLeft: 2 }}
										source={require('../assets/visa-image.png')}
									/>
								</View>
							</Card>
						</ScrollView>
						{showPopUp(props)}
					</View>
					
				)}
			</Formik>
		</View>
	);
};
export default showBookings;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		// alignItems: 'center',
		justifyContent: 'center',
	},
	flatlist: {
		// flex: 1,
		padding: 10,
		marginBottom: 10,
	},
	flatlistContainer: {
		flex: 1,
		height: imageheight * 0.8,
	},
	flatlistImage: {
		width: 85,
		// display: 'block',
		// maxWidth: '100%',
		// maxHeight: '100%',
		// marginHorizontal: 20,
		// marginVertical: 10,
	},
});

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		// padding: theme.spacing(2),
// 		// flexGrow: 1,
// 	},
// 	paper: {
// 		verticalAlign: 'top',
// 		padding: theme.spacing(3, 2),
// 		// margin: 5,
// 		maxWidth: 500,
// 		marginBottom: 15,
// 	},
// 	image: {
// 		width: 128,
// 		height: 128,
// 	},
// 	img: {
// 		margin: 'auto',
// 		display: 'block',
// 		maxWidth: '100%',
// 		maxHeight: '100%',
// 	},
// 	root1: {
// 		color: green[400],
// 		'&$checked': {
// 			color: green[600],
// 		},
// 	},
// 	checked: {},
// }));
