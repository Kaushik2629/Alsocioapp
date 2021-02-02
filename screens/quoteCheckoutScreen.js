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
import { ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, RadioButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Card } from 'react-native-paper';
import { Field, Formik } from 'formik';
import { TextInput } from 'react-native-paper';
import { AuthContext } from '../components/context';
import { SkypeIndicator, UIActivityIndicator } from 'react-native-indicators';
import ModalPicker from 'react-native-modal-picker';

const imagewidth = Dimensions.get('window').width;
const imageheight = Dimensions.get('window').height;

const quoteCheckoutScreen = ({ route, navigation }, props) => {
	const { refresh } = useContext(AuthContext);
	const checkName = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(false);

	const [details, setDetails] = useState([]);

	const fetchDetails = async () => {
		let check = route.params.quoteId;
		let quoteDetails = new FormData();
		quoteDetails.append('quote_id', check);
		fetch('https://alsocio.com/app/get-quote-details/', {
			method: 'POST',
			body: quoteDetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				setDetails(responseJson);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		fetchDetails();
	}, [route.params.quoteId]);

	const showPopUp = (properties) => {
		return (
			<Animatable.View
				style={{
					marginTop: 10,
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
							backgroundColor: '#262262',
							width: 180,
							borderRadius: 5,
						}}
						onPress={() => navigation.navigate('QuoteScreen')}>
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
							backgroundColor: '#262262',
							width: 180,
							borderRadius: 5,
						}}
						onPress={() => properties.handleSubmit()}
					>
						<Text
							style={{
								color: '#fff',
								textAlign: 'center',
								paddingVertical: 15,
							}}>
							Pagar
						</Text>
					</TouchableOpacity>
				</View>
				{/* </View> */}
			</Animatable.View>
		);
	};

	//for region
	const [regionArray, setRegionArray] = useState([]);

	const [cityArray, setCityArray] = useState([]);

	const showRegionOptions = () => {
		let item = [];
		let region_array = [];
		let showCity_array = [];
		let showRegion_array = [];
		fetch('https://alsocio.com/app/get-city-region/', {
			method: 'GET',
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
					});
				});
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		{
			showRegionOptions();
		}
	}, [route.params.quoteId]);

	const [cityList, setCityList] = useState([]);

	const [showPickerModal, setShowPickerModal] = useState(false);

	// const [regionValue, setRegionValue] = useState();

	// const [cityValue, setCityValue] = useState();

	const showPicker = (properties) => {
		return (
			<View style={{ justifyContent: 'space-around', padding: 10 }}>
				<View style={{ padding: 10 }}>
					<ModalPicker
						data={data}
						cancelText='end'
						// style={{padding:15, backgroundColor: 'green'}}
						selectStyle={{
							padding: 27,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						cancelTextStyle={{ fontSize: 25 }}
						initValue='Seleccione región'
						onChange={(option) => {
							// alert(option.label);
							// let index1 = regionArray.indexOf(option.label);
							properties.setFieldValue('region', option.label);
							let array = [cityArray[option.key]].toString();
							let city_array = array.split(',');
							console.log(city_array);
							setCityList(city_array);
						}}
					/>
				</View>
				<View style={{ padding: 10 }}>
					<ModalPicker
						selectStyle={{
							padding: 27,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						data={city_data}
						initValue='Ciudad selecta'
						onChange={(option) => {
							properties.setFieldValue('city', option.label);
						}}
					/>
				</View>
			</View>
		);
	};

	let temp = 0;
	const data = regionArray.map((element) => {
		return { key: temp++, label: element };
	});

	let temp1 = 0;
	const city_data = cityList.map((item) => {
		return { key: temp1++, label: item };
	});

	const [payments, setPaymentMethod] = useState('COD');

	const DetailsSchema = Yup.object().shape({
		address: Yup.string()
			.min(10, 'Too Short!')
			.required('La dirección es necesaria'),
		city: Yup.string().required('Seleccione su ubicación'),
	});

	const [confirmModal, setConfirmModal] = useState(false);

	// let showCartArray = route.params.cartDetails;
	// let amount = route.params.cost;
	const fetchPayment = (properties) => {
		setIsLoading(true);
		let quotePayment = new FormData();
		quotePayment.append('username', checkName.UserName);
		quotePayment.append('quote_id',route.params.quoteId)
		quotePayment.append('city', properties.city);
		quotePayment.append('region', properties.region);
		quotePayment.append('address', properties.address);
		quotePayment.append('payment_radio', properties.paymentMethod);

		fetch('https://alsocio.com/app/book-quote-order/', {
			method: 'POST',
			body: quotePayment,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				setIsLoading(false);
				if (responseJson.order_status == 'placed') {
					setConfirmModal(true);
				} else {
					alert('Algo salió mal');
				}
			});
	};

	return (
		<View style={{ flex: 1 }}>
			<Appbar.Header
				style={{
					backgroundColor: '#262262',
					alignItems: 'center',
					marginTop: 0,
				}}>
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
						navigation.navigate('quoteCardPaymentsScreen', {
							quote_id: route.params.quoteId,
							city: values.city,
							region: values.region,
							address: values.address,
							paymentMethod: values.paymentMethod,
							username: checkName.UserName
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
									alignSelf: 'center',
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
								<UIActivityIndicator color='#262262' style={{ padding: 10 }} />
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
									color='#262262'
									style={{
										borderRadius: 20,
										fontSize: 15,
									}}
									onPress={() => {
											refresh(),
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
								placeholder='Direccion'
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
											Seleccione su región y Ciudad
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
											color='#262262'
											style={{
												borderRadius: 20,
												fontSize: 15,
											}}
											onPress={() => {
												if (
													props.values.region != '' &&
													props.values.city != ''
												) {
													setShowPickerModal(!showPickerModal);
												} else {
													alert('Please Select Both!');
												}
											}}
										/>
									</View>
								</View>
							</Modal>

							<Card style={{ borderRadius: 0.3, borderWidth: 0.3,margin:10 }}>
								<View
									style={{
										alignItems: 'center',
										justifyContent: 'center',
										padding: 15,
									}}>
									<View
										style={{
											flexDirection: 'row',
										}}>
										{/* <Card.Content style={{flex: 1,flexDirection: 'row',}}> */}
										<View
											style={{
												flexBasis: 100,
												padding: 10,
												textAlign: 'center',
											}}>
											<Image
												style={{ width: 80, height: 80 }}
												source={{
													uri: 'https:alsocio.com/media/' + details.image,
												}}
											/>
										</View>
										<View
											style={{
												flexGrow: 1,
												paddingHorizontal: 10,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center',
											}}>
											<Text
												style={{
													fontWeight: 'bold',
													fontSize: 15,
													flex: 1,
													flexWrap: 'wrap',
												}}>
												Cotizacione :
												<Text
													style={{
														fontSize: 15,
														fontWeight: '700',
													}}>
													{details.quote}
												</Text>
											</Text>
										</View>
										<View
											style={{
												flexBasis: 50,
												padding: 10,
												textAlign: 'right',
												alignItems: 'flex-end',
											}}>
											<Text>${details.cost}</Text>
										</View>
									</View>
									{/* </Card.Content> */}
								</View>
							</Card>
							<Card
								style={{
									borderRadius: 0.3,
									borderWidth: 0.3,
									padding: 20,
									marginHorizontal: 9,
								}}>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexGrow: 2, padding: (0, 10) }}>
										<Text
											style={{
												marginLeft: 40,
											}}>
											Subtotal
										</Text>
									</View>
									<View
										style={{
											marginRight: 18,
											padding: (0, 10),
										}}>
										<Text>${details.cost}</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexGrow: 2, padding: (0, 10) }}>
										<Text
											style={{
												marginLeft: 40,
											}}>
											Comisión por servicio
										</Text>
									</View>
									<View
										style={{
											marginRight: 18,
											padding: (0, 10),
										}}>
										<Text>${details.service_charges}</Text>
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
										<Text>${details.itbms}</Text>
									</View>
								</View>
							</Card>
							<Card
								style={{
									borderRadius: 0.3,
									borderWidth: 0.3,
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
											$
											{Math.round(
												parseInt(details.cost) +
													parseInt(details.service_charges) +
													parseInt(details.itbms)
											)}
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
										color='#262262'
										value='COD'
										status={
											props.values.paymentMethod === 'COD'
												? 'checked'
												: 'unchecked'
										}
										onPress={() => {
											props.setFieldValue('paymentMethod', 'COD');
										}}
									/>
									<Text style={{ fontSize: 17 }}>COD</Text>
									<RadioButton
										color='#262262'
										value='Card'
										status={
											props.values.paymentMethod === 'Card'
												? 'checked'
												: 'unchecked'
										}
										onPress={() => {
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
export default quoteCheckoutScreen;

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
