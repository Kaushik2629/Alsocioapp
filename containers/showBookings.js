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
import { RadioButton } from 'react-native-paper';
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

	const initialCartState = {
		cartArray: [],
		totalCartCount: 0,
		showList: [],
		cartCount: 0,
	};

	const cartReducer = (prevState, action) => {
		switch (action.type) {
			case 'SHOW_CART_ITEM':
				return {
					...prevState,
					cartArray: action.array,
					// isLoading: false,
					totalCartCount: action.count,
					showList: action.show,
					cartCount: action.value,
				};
			case 'DELETE_CART_ITEM':
				return {
					...prevState,
					userName: null,
					userToken: null,
					isLoading: false,
				};
		}
	};

	useEffect(() => {
		setTimeout(async () => {
			// setIsLoading(false);
			let showCartArray;
			showCartArray = null;
			let showCartCount = null;
			let showArray = [];
			try {
				showCartArray = route.params.cartDetails;
				let sum = 0;
				for (let index = 0; index < showCartArray.length; index++) {
					const element = showCartArray[index];
					let servicedetails = new FormData();
					servicedetails.append('service_id', element[0]);
					fetch('https://alsocio.geop.tech/app/get-service-details/', {
						method: 'POST',
						body: servicedetails,
					})
						.then((response) => response.json())
						.then((responseJson) => {
							showArray.push(responseJson.service);
							sum = sum + element[1];
							showCartCount = sum;
							dispatch({
								type: 'SHOW_CART_ITEM',
								array: showCartArray,
								count: showCartCount,
								show: showArray,
							});
						});
				}
			} catch (e) {
				console.log(e);
			}
			// console.log('user token: ', userToken);
		}, 100);
	}, []);

	const [cartState, dispatch] = React.useReducer(cartReducer, initialCartState);

	if (cartState.showList && cartState.cartArray !== []) {
		//to generate flatlist
		let showFlatlist = [];
		showFlatlist = [...showFlatlist, ...cartState.showList];
		let showCartlist = [];
		let showTotalCost = 0;
		let showServiceId = 0;
		let costArray = [];
		showFlatlist.map((item) => {
			showCartlist = [...showCartlist, item[0]]; //for flatlist
			showTotalCost = item[0].service_cost;
			showServiceId = item[0].id;
			costArray = [...costArray, [item[0].id, item[0].service_cost]];
		});

		//For cart Count
		let showFetchArray = [];
		showFetchArray = [...showFetchArray, ...cartState.cartArray];

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
			fetch('https://alsocio.geop.tech/app/get-cart-items/', {
				method: 'POST',
				body: recieptDetails,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setReciept(responseJson);
				});
		}, []);

		const [cartCount, setCartcount] = useState([]);
		// const [button, setButtons] = useState(true);
		let a = [];
		const fetchCount = async () => {
			let check = route.params.cartDetails;
			a = [...check];
		};
		fetchCount();
		useEffect(() => {
			setCartcount(a);
		}, []);

		const showPopUp = (properties) => {
			return (
				<Animatable.View
					style={{
						flexGrow: 1,
						backgroundColor: '#fff',
						width: imagewidth,
					}}
					animation='fadeIn'>
					<View style={{ flexDirection: 'row', padding: 15 }}>
						<View style={{ flexGrow: 1 }}>
							<TouchableOpacity
								style={{
									backgroundColor: '#1a237e',
									width: 150,
									height: 35,
									marginBottom: 5,
									borderRadius: 5,
									marginLeft: 10,
									alignSelf: 'flex-start',
								}}
								onPress={() => navigation.navigate('showCartitems')}>
								<Text
									style={{
										color: '#fff',
										textAlign: 'center',
										marginTop: 10,
									}}>
									Previous
								</Text>
							</TouchableOpacity>
						</View>

						<View style={{ flexGrow: 1 }}>
							<TouchableOpacity
								style={{
									backgroundColor: '#1a237e',
									width: 150,
									height: 35,
									marginBottom: 5,
									borderRadius: 5,
									alignSelf: 'flex-end',
								}}
								onPress={
									() => properties.handleSubmit()
									// navigation.navigate('PaymentScreen', {
									// 	cartDetails: cartCount,
									// 	cost: totalCost,
									// })
								}>
								<Text
									style={{
										color: '#fff',
										textAlign: 'center',
										marginTop: 10,
									}}>
									Checkout!
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Animatable.View>
			);
		};

		const addtocart = (serviceId) => {
			for (let index = 0; index < cartCount.length; index++) {
				const element = cartCount[index];
				// alert(element);
				if (element[0] == serviceId) {
					const cartitem = cartCount[index][1];
					return (
						<View style={{ flexGrow: 1 }}>
							<Text
								name='CartCount'
								// style={{marginBottom:20}}
							>
								{cartitem}X
							</Text>
						</View>
					);
				}
			}
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

		const [regionArray, setRegionArray] = useState([]);

		const [cityArray, setCityArray] = useState([]);

		const showRegionOptions = () => {
			let item = [];
			let region_array = [];
			let showCity_array = [];
			let showRegion_array = [];
			fetch('https://alsocio.geop.tech/app/get-city-region/', {
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
		const [selectedValue, setSelectedValue] = React.useState('a');

		const handleRadioChange = (event) => {
			setSelectedValue(event.target.value);
		};

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
				<View style={{ flexDirection: 'row' }}>
					<Picker
						style={{
							flexGrow: 1,
							width: 130,
							borderRadius: 10,
							backgroundColor: '#e0e0e0',
						}}
						selectedValue={regionValue}
						onValueChange={(itemValue) => {
							setRegionValue(itemValue);
							setCityValue();
							properties.setFieldValue('region', itemValue);
						}}>
						<Picker.Item label='Select Region' value='' />
						{regionpicker()}
					</Picker>
					<Picker
						style={{
							flexGrow: 1,
							width: 60,
							borderRadius: 10,
							backgroundColor: '#e0e0e0',
							marginLeft: 10,
						}}
						selectedValue={cityValue}
						onValueChange={(itemValue) => {
							setCityValue(itemValue);
							properties.setFieldValue('city', itemValue);
						}}>
						<Picker.Item label='Select your City' value='' />
						{citypicker()}
					</Picker>
				</View>
			);
		};

		const [payments, setPaymentMethod] = useState('COD');

		const DetailsSchema = Yup.object().shape({
			address: Yup.string()
				.min(10, 'Too Short!')
				.required('Address is Required'),
			region: Yup.string().required('Please Select Your Location'),
		});

		const [confirmModal, setConfirmModal] = useState(false);

		const [isLoading, setIsLoading] = useState(false);

		let showCartArray = route.params.cartDetails;
		let amount = route.params.cost;
		const fetchPayment = (properties) => {
			setIsLoading(true)
			let servicedetails = new FormData();
			servicedetails.append('username', name);
			servicedetails.append('cart_items', JSON.stringify(showCartArray));
			servicedetails.append('cost', amount);
			servicedetails.append('city', properties.city);
			servicedetails.append('region', properties.region);
			servicedetails.append('address', properties.address);
			servicedetails.append('payment_radio', properties.paymentMethod);

			fetch('https://alsocio.geop.tech/app/book-order/', {
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

		const [name, setName] = useState();

		const fetchUserName = async () => {
			const a = await AsyncStorage.getItem('userName');
			setName(a);
		};
		useEffect(() => {
			fetchUserName();
		});

		return (
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
									flex:1,
									padding: 20,
									alignContent: 'center',
									justifyContent: 'center',
									alignSelf:'center',
									padding:20,
									marginTop:50
								}}>
								<Text style={{textAlign:'center'}}>Order is Processing!!</Text>
								<UIActivityIndicator color='#1a237e' />
							</Animatable.View>
						) : null}

						<Modal
							animationType='fade'
							visible={confirmModal}
							transparent={true}>
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
									<Text
										style={{ fontSize: 20, fontWeight: 'bold', padding: 15 }}>
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
								placeholder='Enter your Address'
								onBlur={() => props.setFieldTouched('address')}
								onChangeText={props.handleChange('address')}
								value={props.values.address}
							/>
							{props.touched.address && props.errors.address && (
								<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
									{props.errors.address}
								</Text>
							)}

							<TouchableOpacity onPress={() => setShowPickerModal(true)}>
								<Text style={{ fontSize: 12, marginLeft: 10, marginTop: 10 }}>
									Select Your Region and City!
								</Text>
							</TouchableOpacity>

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
									<Text>{props.values.city}</Text>
								</TouchableOpacity>
							</Card>

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
								data={showCartlist}
								style={styles.flatlist}
								renderItem={({ item }) => {
									return (
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
															uri: 'https:alsocio.geop.tech/media/' + item.img,
														}}
													/>
												</View>
												<View style={{ flexGrow: 3, padding: 25 }}>
													<Text style={{ fontSize: 15 }}>
														{item.main_category}
													</Text>
													<Text style={{ fontSize: 10, fontWeight: 'bold' }}>
														Service By :{' '}
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
											Subtotal
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
											Service Charge
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
		);
	}
};
export default showBookings;

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
