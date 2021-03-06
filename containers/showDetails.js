import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Image,
	FlatList,
	TouchableOpacity,
	Platform,
	Modal,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import { Appbar, Card, IconButton, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { MaterialIndicator } from 'react-native-indicators';
import { AuthContext } from '../components/context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const showDetails = ({ route, navigation }) => {
	const [serviceData, setDetails] = useState([]);
	const serviceId = route.params.service_id;
	let servicedetails = new FormData();
	servicedetails.append('service_id', serviceId);
	const { changeCount, refresh } = useContext(AuthContext);
	const count = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(true);

	const fetchDetails = () => {
		useEffect(() => {
			function fetchData() {
				fetch('https://www.alsocio.com/app/get-service-details/', {
					method: 'POST',
					body: servicedetails,
				})
					.then((response) => response.json())
					.then((responseJson) => {
						setDetails(responseJson);
						setIsLoading(false);
					})
					.catch((error) => console.error(error));
			}
			fetchData();
		}, [serviceId]);
	};

	// for fetching asyncArray1  and setting the cartCount
	const [cartCount, setCartcount] = useState([]);
	// const [button, setButtons] = useState(true);
	let a = [];
	const fetchCount = async () => {
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		if (check == null) {
			setCartcount([]);
		} else if (check.length != 0) {
			a = [...check];
			setCartcount(a);
			return;
		} else {
			setCartcount([]);
		}
	};
	// fetchCount();
	useEffect(() => {
		fetchCount();
	}, [serviceId]);

	const [addedToCart, setAddedToCart] = useState(false);

	//to change count from context
	useEffect(() => {
		let s = 0;
		const showCartPopUp = async () => {
			for (let index = 0; index < cartCount.length; index++) {
				const element = cartCount[index][1];
				s = s + element;
			}
		};
		showCartPopUp();
		changeCount(s);
	}, [cartCount]);

	//For Decrement
	const handleDecrement = (e, serviceIdDec) => {
		async function arrayCartCountDec(serviceIdDec) {
			const arrayCartCount = JSON.parse(
				await AsyncStorage.getItem('asyncArray1')
			);
			for (let index = 0; index < arrayCartCount.length; index++) {
				const element = arrayCartCount[index];
				if (serviceIdDec == element[0]) {
					element[1] = element[1] - 1;
				}
			}
			const filterData = [...arrayCartCount].filter((item) => item[1] > 0);

			const arrayDecCount = [...filterData];
			await AsyncStorage.setItem('asyncArray1', JSON.stringify(filterData));
			setCartcount(arrayDecCount);
		}
		arrayCartCountDec(serviceIdDec);
	};

	//For Increment
	const handleIncrement = (serviceIdinc) => {
		async function arrayCartCount(serviceIdinc) {
			const arrayCartCount = JSON.parse(
				await AsyncStorage.getItem('asyncArray1')
			);
			for (let index = 0; index < arrayCartCount.length; index++) {
				const element = arrayCartCount[index];
				if (serviceIdinc == element[0]) {
					element[1] = element[1] + 1;
				}
			}
			const arrayIncCount = [...arrayCartCount];
			await AsyncStorage.setItem('asyncArray1', JSON.stringify(arrayIncCount));
			setCartcount(arrayIncCount);
		}
		arrayCartCount(serviceIdinc);
	};

	//For TotalCartCount

	const showPopUp = () => {
		let s = 0;
		const showCartPopUp = async () => {
			for (let index = 0; index < cartCount.length; index++) {
				const element = cartCount[index][1]; // Replaced console(element);
				s = s + element;
			}
		};
		if (
			Platform.OS === 'android' ||
			Platform.OS == 'ios' ||
			Platform.OS === 'web'
		) {
			showCartPopUp();
		}

		const handleSentence = () => {
			if (s == 1) {
				return (
					<Text style={{ textAlign: 'center' }}> 1 Servicio agregados</Text>
				);
			}
			if (s > 1) {
				return (
					<Text style={{ textAlign: 'center' }}>{s} Servicios agregados</Text>
				);
			}
		};
		return s ? (
			<Animatable.View
				style={{
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
				{/* <View style={{ flexDirection: 'row', padding: 15,alignItems:'center',justifyContent:'center' }}> */}
				<View style={{ flexGrow: 1 }}>{handleSentence()}</View>
				<View
					style={{
						flexGrow: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<TouchableOpacity
						style={{
							backgroundColor: '#262262',
							width: 200,
							borderRadius: 5,
						}}
						onPress={() => {
							if (addedToCart && slotValue == '') {
								alert('Agregue ranuras!');
							} else if (addedToCart && slotValue == 'No Slots Available') {
								alert('Cannot Proceed without adding slots');
							} else if (newDate == '') {
								alert('Agregue ranuras!');
							} else {
								navigation.navigate('showCartitems');
							}
						}}>
						<Text
							style={{
								color: '#fff',
								textAlign: 'center',
								paddingVertical: 15,
							}}>
							Ir al carrito
						</Text>
					</TouchableOpacity>
				</View>

				{/* </View> */}
			</Animatable.View>
		) : null;
	};

	const [slotPickerModal, setSlotPickerModal] = useState(false);

	const addtocart = (serviceId) => {
		// async function fetchData(serviceId) {
		if (cartCount == [] || cartCount == null) {
			return;
		}
		if (cartCount.length != 0 && cartCount != []) {
			for (let index = 0; index < cartCount.length; index++) {
				const element = cartCount[index];
				// alert(element);
				if (element[0] == serviceId && element[1] != 0) {
					const cartitem = cartCount[index][1];
					return (
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity
								style={{
									backgroundColor: '#262262',
									width: 50,
									height: 35,
									marginBottom: 5,
									borderRadius: 5,
									marginLeft: 20,
								}}
								onPress={(e) => handleDecrement(e, serviceId)}>
								<Text
									style={{
										color: '#fff',
										textAlign: 'center',
										marginTop: 10,
									}}>
									-
								</Text>
							</TouchableOpacity>
							<Text
								name='CartCount'
								style={{
									textAlign: 'center',
									marginTop: 5,
									marginHorizontal: 5,
								}}>
								{cartitem}
							</Text>
							<TouchableOpacity
								style={{
									backgroundColor: '#262262',
									width: 50,
									height: 35,
									marginBottom: 5,
									borderRadius: 5,
									marginLeft: 20,
								}}
								onPress={() => handleIncrement(serviceId)}>
								<Text
									style={{
										color: '#fff',
										textAlign: 'center',
										marginTop: 10,
									}}>
									+
								</Text>
							</TouchableOpacity>
						</View>
					);
				}
			}
			setAddedToCart(false);
		}
		return (
			<TouchableOpacity
				style={{
					backgroundColor: '#f9a825',
					width: 200,
					height: 40,
					marginBottom: 5,
					borderRadius: 5,
					// marginLeft: 20,
					justifyContent:'center'
				}}
				onPress={() => {
					async function arrayData(serviceId) {
						setSlotPickerModal(true);
						const arrayDetails = await AsyncStorage.getItem('asyncArray1');
						if (arrayDetails == null) {
							const array = [];
							await AsyncStorage.setItem('asyncArray1', JSON.stringify(array));
						}

						const arrayData = await AsyncStorage.getItem('asyncArray1');
						const arrayDet = JSON.parse(arrayData);
						let temp = [...arrayDet, [serviceId, 1, '', '']];

						const arrayCount = [...temp];
						await AsyncStorage.setItem('asyncArray1', JSON.stringify(temp));
						setCartcount(arrayCount);
						// setCartcount(arrayCount);
						setAddedToCart(true);
					}
					arrayData(serviceId);
				}}>
				<Text
					style={{
						color: '#fff',
						textAlign: 'center',
					}}>
					Añadir
				</Text>
			</TouchableOpacity>
		);
	};

	const generateStar = (rating) => {
		let stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<View>
					{i <= rating ? (
						<Icon
							name='md-star'
							color='#fbc02d'
							size={26}
							style={{ margin: 0 }}
						/>
					) : (
						<Icon
							name='md-star'
							color='#bdbdbd'
							size={26}
							color='#bdbdbd'
							style={{ margin: 0 }}
						/>
					)}
				</View>
			);
		}

		return (
			<View
				style={{
					flexDirection: 'row',
					alignSelf: 'center',
				}}>
				{stars}
			</View>
		);
	};

	const [modalVisible, setModalVisible] = useState(false);

	const showForm = () => {
		return (
			<View style={{ flexGrow: 1, padding: 10 }}>
				<Formik
					initialValues={{ request: '', description: '', uri: '' }}
					onSubmit={(values) => {
						setIsLoading(true)
						let quoteDetails = new FormData();
						quoteDetails.append('service_id', serviceId);
						quoteDetails.append('description', values.description);
						quoteDetails.append('request_quote', values.request);
						quoteDetails.append('username', count.UserName);
						if (values.uri != '') {
							quoteDetails.append('image', {
								uri: values.uri,
								name: filename,
								type,
							});
						} else {
							quoteDetails.append('image', {
								uri: values.uri,
							});
						}
						fetch('https://www.alsocio.com/app/send-quote/', {
							method: 'POST',
							body: quoteDetails,
							headers: {
								'content-type': 'multipart/form-data',
							},
						})
							.then((response) => response.json())
							.then((responseJson) => {
								setModalVisible(!modalVisible);
								setIsLoading(false)
								refresh();
								alert('La cotización se ha enviado correctamente');
							})
							.catch((error) => console.error(error));
					}}
					validationSchema={QuoteSchema}>
					{(props) => (
						<View>
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
								placeholder='
								Ingrese su Solicitud'
								onChangeText={props.handleChange('request')}
								value={props.values.request}
							/>
							{props.touched.request && props.errors.request && (
								<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
									{props.errors.request}
								</Text>
							)}
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
									marginBottom: 20,
								}}
								placeholder='Ingrese su descripción'
								onChangeText={props.handleChange('description')}
								value={props.values.description}
							/>
							{props.touched.description && props.errors.description && (
								<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
									{props.errors.description}
								</Text>
							)}
							<TouchableOpacity onPress={() => uploadImage(props)}>
								<Text style={{ fontSize: 12, marginLeft: 10, marginTop: 10 }}>
									Cargar imagen
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
								}}
								onPress={() => uploadImage(props)}>
								<Text>{props.values.uri}</Text>
							</Card>
							{props.touched.uri && props.errors.uri && (
								<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
									{props.errors.uri}
								</Text>
							)}

							<Button
								title='Enviar'
								color='#262262'
								style={{
									borderRadius: 20,
									fontSize: 15,
								}}
								onPress={() => props.handleSubmit()}
							/>
						</View>
					)}
				</Formik>
			</View>
		);
	};

	//for date and time picker
	const [currentDate, setCurrentDate] = useState('');

	useEffect(() => {
		var date1 = new Date().getDate(); //Current Date
		var month = new Date().getMonth() + 1; //Current Month
		var year = new Date().getFullYear(); //Current Year
		setCurrentDate(year + '/' + month + '/' + date1);
	}, [serviceId]);

	//to change date and slot value
	const [newDate, setnewDate] = useState(currentDate);
	const [slotValue, setSlotValue] = useState();

	const changeDate = async (serviceIdChange, date) => {
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		if (check == null) {
			let temp = [...check, [serviceIdChange, 0, currentDate, '']];
			await AsyncStorage.setItem('dateTimeArray', JSON.stringify(temp));
			const data = [...temp];
			setCartcount(data);
		}

		async function arrayDateCount(serviceIdChange, changeDate) {
			const arrayDate = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
			for (let index = 0; index < cartCount.length; index++) {
				const element = cartCount[index];
				if (serviceIdChange == element[0]) {
					element[2] = changeDate;
					const arrayChangeDate = [...cartCount];
					await AsyncStorage.setItem(
						'asyncArray1',
						JSON.stringify(arrayChangeDate)
					);
					setCartcount(arrayChangeDate);
				}
			}
		}
		arrayDateCount(serviceIdChange, date);
	};

	const [slot, setSlot] = useState([]);

	var date1 = new Date().getDate(); //Current Date
	var month = new Date().getMonth() + 1; //Current Month
	var year = new Date().getFullYear(); //Current Year

	const arraySlot = (serviceIdChange) => {
		if (cartCount == [] || cartCount == null) {
			return;
		}
		if (cartCount.length != 0 && cartCount != []) {
			for (let index = 0; index < cartCount.length; index++) {
				const element = cartCount[index];
				if (serviceIdChange == element[0]) {
					// alert('jbjibdr');
					let get_Date = new Date();
					// alert(get_Date)
					if (element[2] != '') {
						// alert(element[2].getDate())
						let arr = [element[2]].toString();
						arr = arr.split('T');
						let time = arr[0].toString();
						setnewDate(time);
					} else {
						setnewDate('');
					}
					setSlotValue(element[3]);
					// let day = get_Date.getDay();
					// let slotDetails = new FormData();
					// slotDetails.append('day', day);
					// slotDetails.append('service_id', serviceIdChange);
					// fetch('https://www.alsocio.com/app/get-time-slots/', {
					// 	method: 'POST',
					// 	body: slotDetails,
					// })
					// 	.then((response) => response.json())
					// 	.then((responseJson) => {
					// 		setSlot(responseJson.slots);
					// 		changeDate(serviceIdChange, time);
					// 	});
				}
			}
			return;
		}
	};
	useEffect(() => {
		arraySlot(serviceId);
	}, [count.itemCount]);

	const [showDatePickerModal, setShowDatePickerModal] = useState(false);

	const makeTwoDigits=(Number)=>{
		const monthString = `${Number}`;
		if (monthString.length === 2) return parseInt(Number);
		return `0${parseInt(Number)}`;
	}

	const showDatePicker = (serviceId) => {
		// await AsyncStorage.removeItem('dateTimeArray')
		if (cartCount.length != 0) {
			for (let index = 0; index < cartCount.length; index++) {
				const element = cartCount[index];
				if (element[0] == serviceId) {
					return (
						<View>
							<Modal
								animationType='fade'
								visible={slotPickerModal}
								transparent={true}
								onRequestClose={() => {
									setSlotPickerModal(!slotPickerModal);
								}}>
								<View
									style={{
										marginTop: 60,
									}}>
									<View
										style={{
											backgroundColor: '#fff',
											shadowColor: '#000',
											marginTop: 60,
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
													setSlotPickerModal(!slotPickerModal);
												}}></Icon.Button>
										</TouchableOpacity>
										<View
											style={{
												flexGrow: 1,
												alignItems: 'center',
												justifyContent: 'center',
											}}>
											<Text
												style={{
													marginLeft: 10,
													marginTop: 5,
													fontSize: 20,
													fontWeight: 'bold',
													marginBottom: 15,
												}}>
												Seleccionar fecha y hora
											</Text>											
											<View>
												{/* For Date */}
												<TouchableOpacity
													onPress={() => {
														setShowDatePickerModal(true);
													}}
													style={{
														backgroundColor: '#fff',
														alignSelf: 'stretch',
														padding: 10,
														margin: 8,
														borderRadius: 5,
														borderWidth: 0.4,
													}}>
													{newDate == '' ? (
														<Text style={{ fontSize: 18 }}>
															Seleccione fecha
														</Text>
													) : (
														<Text style={{ fontSize: 18 }}>{newDate}</Text>
													)}
												</TouchableOpacity>
												{/* {Platform.OS == "ios" && ( */}
												<DateTimePickerModal
													isVisible={showDatePickerModal}
													mode='date'
													date={new Date()}
													onConfirm={(date) => {
														// alert(date.getMonth()+1)
														setShowDatePickerModal(!showDatePickerModal);
														setSlotValue('');
														setSlot([]);
														let get_Date = date;
														let day = get_Date.getDay();
														setnewDate(
															date.getFullYear() +
																'-' +
																makeTwoDigits(parseInt(date.getMonth()+1)) +
																'-' +
																makeTwoDigits(parseInt(date.getDate()))
														);
														let slotDetails = new FormData();
														slotDetails.append('day', day);
														slotDetails.append('service_id', serviceId);
														fetch('https://www.alsocio.com/app/get-time-slots/', {
															method: 'POST',
															body: slotDetails,
														})
															.then((response) => response.json())
															.then((responseJson) => {
																if (
																	responseJson.slots == 'No Slots Available'
																) {
																	setSlot(['No Slots Available']);
																} else {
																	setSlot(responseJson.slots);
																	changeDate(
																		serviceId,
																		date.getFullYear() +
																			'-' +
																			makeTwoDigits(parseInt(date.getMonth()+1)) +																	
																			'-' +
																			makeTwoDigits(parseInt(date.getDate()))
																	);
																}
															});
													}}
													onCancel={() => {
														setShowDatePickerModal(!showDatePickerModal);
													}}
												/>
												{/* )} */}
											</View>

											<Picker
												selectedValue={slotValue}
												style={{
													marginVertical: 20,
													width: imagewidth / 2,
													borderRadius: 10,
													backgroundColor: '#e0e0e0',
												}}
												onValueChange={(itemValue) => {
													setSlotValue(itemValue);
													async function arrayTimeSlot(
														serviceIdChange,
														changeTime
													) {
														const arrayDate = JSON.parse(
															await AsyncStorage.getItem('asyncArray1')
														);
														for (
															let index = 0;
															index < cartCount.length;
															index++
														) {
															const element = cartCount[index];
															if (serviceIdChange == element[0]) {
																element[3] = changeTime;
																const arrayChangeDate = [...cartCount];
																await AsyncStorage.setItem(
																	'asyncArray1',
																	JSON.stringify(arrayChangeDate)
																);
																setCartcount(arrayChangeDate);
																return;
															}
														}
													}
													arrayTimeSlot(serviceId, itemValue);
												}}
												multiple={false}>
												<Picker.Item label='Hora' value='' />
												{pickeritem(slot)}
											</Picker>
										</View>
										<TouchableOpacity
											style={{
												borderRadius: 20,
												fontSize: 15,
												margin: 10,
												backgroundColor: '#262262',
											}}
											onPress={() => {
												setSlotPickerModal(!slotPickerModal);
											}}>
											<Text
												style={{
													alignSelf: 'center',
													fontSize: 15,
													fontWeight: 'bold',
													margin: 15,
													color: '#fff',
												}}>
												Seleccionar
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</Modal>
							{slotValue != '' ? (
								<View style={{ flexDirection: 'row', margin: 20 }}>
									<View
										style={{
											flexGrow: 1,
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										<Text
											style={{
												fontSize: 20,
												fontWeight: '800',
											}}>
											Fecha :
										</Text>
										<Text style={{ margin: 15, fontSize: 20 }}>{newDate}</Text>
									</View>
									<View
										style={{
											flexGrow: 1,
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										<Text
											style={{
												fontSize: 20,
												fontWeight: '800',
											}}>
											Hora :
										</Text>
										{slotValue == 'No Slots Available' ? (
											<Text style={{ margin: 12, fontSize: 12 }}>
												No hay espacios disponibles
											</Text>
										) : (
											<Text style={{ margin: 15, fontSize: 20 }}>
												{slotValue}
											</Text>
										)}
									</View>
									<View
										style={{
											position: 'absolute',
											zIndex: 999,
											width: 50,
											height: 50,
											alignItems: 'center',
											justifyContent: 'center',
											right: 50,
											top: -30,
										}}>
										<IconButton
											size={30}
											icon='pencil'
											color='#fff'
											style={{
												resizeMode: 'center',
												backgroundColor: '#262262',
												//backgroundColor:'black'
											}}
											onPress={() => {
												setSlotPickerModal(!slotPickerModal);
											}}
										/>
									</View>
								</View>
							) : null}
						</View>
					);
				}
			}
		}
	};

	const pickeritem = (slotItem) => {
		// await showDatePicker();

		let q = [...slotItem];
		if (q == []) {
			return <Picker.Item label='No Slots Available' value='' />;
		}
		return q.map((element) => {
			return <Picker.Item label={element} value={element} />;
		});
	};

	const showRequirements = (requirements) => {
		let array = [requirements].toString();
		let requirement_array = array.split(',');
		return requirement_array.map((item) => {
			return (
				<View style={{flexDirection:'row',paddingHorizontal:10}}>
					<View style={{flexBasis: 20}}>
						<Text>-</Text>
					</View>
					<View style={{flexGrow: 1}}>
						<Text style={{flex: 1, flexWrap: 'wrap'}}>{item.trim()+"\n"}</Text>
					</View>
				</View>
			);
		});
	};

	const showIncludes = (includes) => {
		let array = [includes].toString();
		let include_array = array.split(',');
		return include_array.map((item) => {
			return (
				// <View style={{ padding: 10, marginLeft: 15 }}>
				// 	<Text style={{ fontSize: 15,flex:1,flexWrap:'wrap',flexDirection:'row' }}>- <Text>{item}</Text></Text>
				// </View>
				// <View style={{flexDirection:'row'}}><Text>{'-'+ item}</Text></View>
				<View style={{flexDirection:'row',paddingHorizontal:10}}>
					<View style={{flexBasis: 20}}>
						<Text>-</Text>
					</View>
					<View style={{flexGrow: 1}}>
						<Text style={{flex: 1, flexWrap: 'wrap'}}>{item.trim()+"\n"}</Text>
					</View>
				</View>
			);
		});
	};

	const showDiscount = (cost, discount) => {
		return discount == null || discount == 0 ? (
			<Text
				style={{
					fontSize: 15,
					fontWeight: '500',
					marginTop: 10,
				}}>
				${cost}
			</Text>
		) : (
			<View style={{ flexDirection: 'row' }}>
				<Text
					style={{
						fontSize: 15,
						fontWeight: '500',
						marginTop: 10,
						textDecorationLine: 'line-through',
						textDecorationStyle: 'solid',
					}}>
					${cost}
				</Text>
				<Text
					style={{
						fontSize: 15,
						fontWeight: '500',
						marginLeft: 5,
						marginTop: 10,
					}}>
					${discount}
				</Text>
			</View>
		);
	};

	let filename = null;
	let type = null;

	const uploadImage = async (properties) => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			// aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			properties.setFieldValue('uri', result.uri);

			// ImagePicker saves the taken photo to disk and returns a local URI to it
			let localUri = result.uri;
			filename = localUri.split('/').pop();

			// Infer the type of the image
			let match = /\.(\w+)$/.exec(filename);
			type = match ? `image/${match[1]}` : `image`;
		}
	};

	const QuoteSchema = Yup.object().shape({
		request: Yup.string()
			.min(1, 'Too Short!')
			.required('Se requiere solicitud'),
		description: Yup.string()
			.min(1, '¡Demasiado corto!')
			.required('Se requiere descripción'),
	});

	return (
		<>
			<Appbar.Header
				style={{
					backgroundColor: '#262262',
					alignItems: 'center',
					marginTop: 0,
				}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Detalles del servicio'
				/>
			</Appbar.Header>
			<View style={styles.container}>
			<ScrollView>
				{fetchDetails()}
				{isLoading ? (
					<View
						style={{
							padding: 20,
							alignContent: 'center',
							justifyContent: 'center',
						}}>
						<MaterialIndicator color='#262262' />
					</View>
				) : (
					<View>
						<FlatList
							data={serviceData.service}
							keyExtractor={(item, index) => item.id}
							renderItem={({ item }) => (
								<View
									style={{
										flexDirection: 'column',
									}}>
									<Modal
										animationType='fade'
										visible={modalVisible}
										transparent={true}
										onRequestClose={() => {
											setModalVisible(!modalVisible);
										}}>
										<View
											style={{
												marginTop: 60,
											}}>
											<View
												style={{
													backgroundColor: '#fff',
													shadowColor: '#000',
													marginTop: 60,
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
															setModalVisible(!modalVisible);
														}}></Icon.Button>
												</TouchableOpacity>
												{showForm()}
											</View>
										</View>
									</Modal>
									<Image
										style={{
											height: imageheight / 3,
										}}
										source={{
											uri: 'https:alsocio.com/media/' + item.img,
										}}
									/>
									<View
										style={{
											alignItems: 'flex-start',
											flexDirection: 'column',
										}}>
										<Text
											style={{
												fontSize: 15,
												fontWeight: '400',
											}}>
											{item.category}
										</Text>
										{showDiscount(item.service_cost, item.discount)}
										<Text
											style={{
												fontWeight: 'bold',
											}}>
											Servicio por :{' '}
											<Text style={{ fontWeight: '500' }}>
												{item.company_name}
											</Text>
										</Text>
										<View
											style={{
												flexDirection: 'row',
												alignContent: 'center',
												marginBottom: 10,
											}}>
											{generateStar(item.rating)}
										</View>
										{addtocart(item.id)}
										<Text
											style={{
												fontSize: 15,
												marginBottom: 5,
												fontWeight: '300',
											}}>
											{item.description}
										</Text>
										{/* <View style={{ justifyContent: 'center' }}> */}
										{item.covid_norms == true ? (
											<View style={{ flexDirection: 'row'}}>
												<Icon
													name='ios-checkbox-outline'
													color='#262262'
													size={36}
												/>
												<Text
													style={{
														fontSize: 15,
														marginLeft:10,
														fontWeight: '400',
														flex: 1,
														flexWrap: 'wrap',
													}}>
													El Proveedor de servicio cumple con todas las medias
													de bioseguridad
												</Text>
											</View>
										) : null}
										{item.additional_charges == true ? (
											<Text
												style={{
													fontSize: 10,
													padding: 10,
													color: 'red',
													flexGrow: 1,
													textAlign: 'right',
													alignSelf: 'flex-start',
												}}>
												*Pueden aplicarse cargos adicionales
											</Text>
										) : null}
										{/* </View> */}
										{count.UserName != null ? (
											<TouchableOpacity
												style={{
													backgroundColor: '#262262',
													width: 100,
													height: 40,
													borderRadius: 5,
													marginBottom: 8,
												}}
												onPress={() => setModalVisible(true)}>
												<Text
													style={{
														color: '#fff',
														textAlign: 'center',
														marginTop: 10,
													}}>
													Cotizar
												</Text>
											</TouchableOpacity>
										) : null}
										{showDatePicker(item.id)}
									</View>
									<View>
										<Text
											style={{
												marginTop: 10,
												marginBottom:10,
												fontSize: 20,
												fontWeight: 'bold',
											}}>
											Requerimientos adicionales
										</Text>
										{showRequirements(item.additional_requirements)}
										<Text
											style={{
												marginTop: 10,
												marginBottom:10,
												fontSize: 20,
												fontWeight: 'bold',
											}}>
											Incluye 
										</Text>
										{showIncludes(item.includes)}
									</View>
								</View>
							)}
							extraData={cartCount}
							ListEmptyComponent={
								<View style={{ padding: 5, textAlign: 'center' }}>
									<Text>No hay servicios disponibles</Text>
								</View>
							}
						/>

						<View style={{ marginBottom: 20 }}>
							<Text
								style={{
									marginTop: 10,
									fontSize: 20,
									fontWeight: 'bold',
								}}>
								Horas de trabajo
							</Text>
							<Grid>
								<Row style={{ borderBottomWidth: 0.5, padding: 10 }}>
									<Col>
										<Text
											style={{
												marginTop: 10,
												fontWeight: 'bold',
											}}>
											Día
										</Text>
									</Col>
									<Col>
										<Text
											style={{
												marginTop: 10,
												fontWeight: 'bold',
											}}>
											comienzo
										</Text>
									</Col>
									<Col>
										<Text
											style={{
												marginTop: 10,
												fontWeight: 'bold',
											}}>
											Fin
										</Text>
									</Col>
								</Row>
							</Grid>
							<FlatList
								data={serviceData.business_hours}
								renderItem={({ item }) => (
									<View style={{ marginTop: 10 }}>
										<Grid>
											<Row style={{ borderBottomWidth: 0.2, padding: 10 }}>
												<Col>
													<Text
														style={{
															marginTop: 10,
														}}>
														{item.day}
													</Text>
												</Col>
												<Col>
													<Text
														style={{
															marginTop: 10,
														}}>
														{item.start}
													</Text>
												</Col>
												<Col>
													<Text
														style={{
															marginTop: 10,
														}}>
														{item.end}
													</Text>
												</Col>
											</Row>
										</Grid>
									</View>
								)}
							/>
						</View>
						<View style={{ marginBottom: 20 }}>
							<Text
								style={{
									marginTop: 10,
									fontSize: 20,
									fontWeight: 'bold',
								}}>
								Zonas de servicio
							</Text>
							<Grid>
								<Row style={{ borderBottomWidth: 0.5, padding: 10 }}>
									<Col>
										<Text
											style={{
												marginTop: 10,
												fontWeight: 'bold',
											}}>
											Ciudad
										</Text>
									</Col>
									<Col>
										<Text
											style={{
												marginTop: 10,
												fontWeight: 'bold',
											}}>
											Región
										</Text>
									</Col>
								</Row>
							</Grid>
							<FlatList
								data={serviceData.branches}
								renderItem={({ item }) => (
									<View style={{ marginTop: 10 }}>
										<Grid>
											<Row style={{ borderBottomWidth: 0.2, padding: 10 }}>
												<Col>
													<Text
														style={{
															marginTop: 10,
														}}>
														{item.city}
													</Text>
												</Col>
												<Col>
													<Text
														style={{
															marginTop: 10,
														}}>
														{item.region}
													</Text>
												</Col>
											</Row>
										</Grid>
									</View>
								)}
							/>
						</View>
					</View>
				)}
			</ScrollView>
		</View>
		{showPopUp()}
		</>
	);
};

export default showDetails;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10
	},
});
