import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Image,
	FlatList,
	TouchableHighlight,
	TouchableOpacity,
	Platform,
	Modal,
	Alert,
	ImagePickerIOS,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { map } from 'jquery';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { render, unmountComponentAtNode } from 'react-dom';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ListItem } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';
import { FormLabel } from 'react-bootstrap';
import { Formik } from 'formik';
import { TextInput } from 'react-native-paper';
import { Header } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
// import DocumentPicker from 'react-native-document-picker';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const showDetails = ({ route, navigation }) => {
	const [serviceData, setDetails] = useState([]);
	const serviceId = route.params.service_id;
	let servicedetails = new FormData();
	servicedetails.append('service_id', serviceId);

	const fetchDetails = () => {
		useEffect(() => {
			function fetchData() {
				fetch('https://alsocio.geop.tech/app/get-service-details/', {
					method: 'POST',
					body: servicedetails,
				})
					.then((response) => response.json())
					.then((responseJson) => {
						setDetails(responseJson);
					})
					.catch((error) => console.error(error));
			}
			fetchData();
		}, [serviceId]);
	};

	const [cartCount, setCartcount] = useState([]);
	// const [button, setButtons] = useState(true);
	let a = [];
	const fetchCount = async () => {
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		a = [...check];

		setCartcount(a);
	};
	// fetchCount();
	useEffect(() => {
		fetchCount();
	}, []);

	const [addedToCart, setAddedToCart] = useState(false);

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
				return <Text>service is added</Text>;
			}
			if (s > 1) {
				return <Text>services added</Text>;
			}
		};
		return s ? (
			<Animatable.View
				style={{
					marginBottom: 20,
					flexDirection: 'row',
					backgroundColor: '#fff',
					width: imagewidth,
				}}
				animation='fadeIn'>
				<View style={{ flexDirection: 'row', padding: 15 }}>
					<Text
						style={{
							fontWeight: '900',
						}}>
						{s}
						{handleSentence()}
					</Text>
					<TouchableOpacity
						style={{
							backgroundColor: '#1a237e',
							width: 200,
							height: 35,
							marginBottom: 5,
							borderRadius: 5,
							marginLeft: 30,
						}}
						onPress={() => {
							if (slot.length == 0 && addedToCart) {
								alert('Please add Slots!');
							} else {
								navigation.navigate('showCartitems');
							}
						}}>
						<Text
							style={{
								color: '#fff',
								textAlign: 'center',
								marginTop: 10,
							}}>
							Proceed to Cart!
						</Text>
					</TouchableOpacity>
				</View>
			</Animatable.View>
		) : null;
	};

	const addtocart = (serviceId) => {
		// async function fetchData(serviceId) {
		for (let index = 0; index < cartCount.length; index++) {
			const element = cartCount[index];
			// alert(element);
			if (element[0] == serviceId) {
				const cartitem = cartCount[index][1];
				return (
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity
							style={{
								backgroundColor: '#1a237e',
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
								backgroundColor: '#1a237e',
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
		return (
			<TouchableOpacity
				style={{
					backgroundColor: '#f9a825',
					width: 200,
					height: 35,
					marginBottom: 5,
					borderRadius: 5,
					marginLeft: 20,
				}}
				onPress={() => {
					async function arrayData(serviceId) {
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
						setAddedToCart(true);
					}
					arrayData(serviceId);
				}}>
				<Text
					style={{
						color: '#fff',
						textAlign: 'center',
						marginTop: 10,
					}}>
					Add
				</Text>
			</TouchableOpacity>
		);
	};

	const generateStar = (rating) => {
		if (rating == null) {
			return (
				<View
					style={{
						flexDirection: 'row',
					}}>
					<FontAwesome name='star' color='#bdbdbd' size={17} />
					<FontAwesome name='star' color='#bdbdbd' size={17} />
					<FontAwesome name='star' color='#bdbdbd' size={17} />
					<FontAwesome name='star' color='#bdbdbd' size={17} />
					<FontAwesome name='star' color='#bdbdbd' size={17} />
				</View>
			);
		}
		let count = 5;
		for (i = 0; i <= count; i++) {
			if (i + 1 >= rating) {
				return <FontAwesome name='star' color='#fbc02d' size={17} />;
			}
			<FontAwesome name='star' color='#bdbdbd' size={17} />;
		}
	};

	const [modalVisible, setModalVisible] = useState(false);

	const [name, setName] = useState();

	const fetchUserName = async () => {
		const a = await AsyncStorage.getItem('userName');
		setName(a);
	};
	useEffect(() => {
		fetchUserName();
	}, []);

	// const [image, setImage] = useState(null);

	// useEffect(() => {
	// 	(async () => {
	// 		if (Platform.OS !== 'web') {
	// 			const {
	// 				status,
	// 			} = await ImagePicker.requestMediaLibraryPermissionsAsync();
	// 			if (status !== 'granted') {
	// 				alert('Sorry, we need camera roll permissions to make this work!');
	// 			}
	// 		}
	// 	})();
	// }, []);

	// const pickImage = async (properties) => {
	// Launch Camera:
	// const res = await DocumentPicker.pick({
	// 	type: [DocumentPicker.types.images],
	// });
	// console.log(
	// 	res.uri,
	// 	res.type, // mime type
	// 	res.name,
	// 	res.size
	//   );
	// 	properties.setFieldValue('image',res.name)
	// };

	const showForm = () => {
		return (
			<View style={{ flexGrow: 1, padding: 10 }}>
				<Formik
					initialValues={{ request: '', description: '' }}
					onSubmit={(values) => {
						let quoteDetails = new FormData();
						quoteDetails.append('service_id', serviceId);
						quoteDetails.append('description', values.description);
						quoteDetails.append('request_quote', values.request);
						quoteDetails.append('username', name);
						fetch('https://alsocio.geop.tech/app/send-quote/', {
							method: 'POST',
							body: quoteDetails,
						})
							.then((response) => response.json())
							.then((responseJson) => {
								setModalVisible(!modalVisible);
								alert('Quote has been Sent Successfully');
							})
							.catch((error) => console.error(error));
					}}>
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
								placeholder='Enter your Request'
								onChangeText={props.handleChange('request')}
								value={props.values.request}
							/>
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
								placeholder='Enter your Description'
								onChangeText={props.handleChange('description')}
								value={props.values.description}
							/>
							{/* <TouchableOpacity
								activeOpacity={0.5}
								style={{
									alignItems: 'center',
									flexDirection: 'row',
									backgroundColor: '#DDDDDD',
									padding: 5,
								}}
								onPress={() => pickImage(props)}>
								<Text
									style={{
										padding: 10,
										color: 'black',
									}}>
									Choose Image
								</Text>
							</TouchableOpacity> */}
							<Button
								title='Submit'
								color='#1a237e'
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
		var hours = new Date().getHours(); //Current Hours
		var min = new Date().getMinutes(); //Current Minutes
		var sec = new Date().getSeconds(); //Current Seconds
		setCurrentDate(year + '/' + month + '/' + date1);
	}, []);

	const changeDate = async (serviceIdChange, date) => {
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		if (check == null) {
			let temp = [...check, [serviceIdChange, 0, currentDate, '']];
			await AsyncStorage.setItem('dateTimeArray', JSON.stringify(temp));
			const data = [...temp];
			setCartcount(data);
			return;
		}

		async function arrayDateCount(serviceIdChange, changeDate) {
			const arrayDate = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
			for (let index = 0; index < arrayDate.length; index++) {
				const element = arrayDate[index];
				if (serviceIdChange == element[0]) {
					element[2] = changeDate;
					const arrayChangeDate = [...arrayDate];
					await AsyncStorage.setItem(
						'asyncArray1',
						JSON.stringify(arrayChangeDate)
					);
					setCartcount(arrayChangeDate);
					break;
				}
			}
		}
		arrayDateCount(serviceIdChange, date);
	};

	// const [date, setDate] = useState(currentDate);

	const [slot, setSlot] = useState([]);

	const [slotValue, setSlotValue] = useState();

	async function arraySlot(serviceIdChange) {
		const arrayDate = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		for (let index = 0; index < arrayDate.length; index++) {
			const element = arrayDate[index];
			if (serviceIdChange == element[0]) {
				let get_Date = new Date(element[2]);
				let day = get_Date.getDay();
				let slotDetails = new FormData();
				slotDetails.append('day', day);
				slotDetails.append('service_id', serviceIdChange);
				fetch('https://alsocio.geop.tech/app/get-time-slots/', {
					method: 'POST',
					body: slotDetails,
				})
					.then((response) => response.json())
					.then((responseJson) => {
						setSlot(responseJson.slots);
						changeDate(serviceId, date);
					});
			}
		}
	}
	useEffect(() => {
		arraySlot(serviceId);
	}, []);

	const showDatePicker = (serviceId) => {
		// await AsyncStorage.removeItem('dateTimeArray')
		for (let index = 0; index < cartCount.length; index++) {
			const element = cartCount[index];
			if (element[0] == serviceId) {
				let date = cartCount[index][2];
				if (date == '') {
					date = currentDate;
				}
				let time = cartCount[index][3];

				return (
					<View>
						<Text
							style={{
								marginLeft: 10,
								marginTop: 10,
								fontSize: 20,
								fontWeight: 'bold',
							}}>
							Select Date and Time Slot
						</Text>
						<View
							style={{
								flexDirection: 'row',
								width: imagewidth,
								justifyContent: 'space-between',
								padding: 20,
								borderBottomWidth: 0.5,
							}}>
							<DatePicker
								// style={{ width: 200}}
								date={date} // Initial date from state
								mode='date' // The enum of date, datetime and time
								placeholder={currentDate}
								format='YYYY-MM-DD'
								minDate={currentDate}
								confirmBtnText='Confirm'
								cancelBtnText='Cancel'
								customStyles={{
									dateIcon: {
										position: 'absolute',
										left: 0,
										top: 4,
										marginLeft: 0,
									},
									dateInput: {
										marginLeft: 36,
									},
								}}
								onDateChange={(date) => {
									// setDate(date);
									let get_Date = new Date(date);
									let day = get_Date.getDay();
									let slotDetails = new FormData();
									slotDetails.append('day', day);
									slotDetails.append('service_id', serviceId);
									fetch('https://alsocio.geop.tech/app/get-time-slots/', {
										method: 'POST',
										body: slotDetails,
									})
										.then((response) => response.json())
										.then((responseJson) => {
											if (responseJson.slots == 'No Slots Available') {
												setSlot(['No Slots Available']);
											} else {
												setSlot(responseJson.slots);
												changeDate(serviceId, date);
											}
										});
								}}
							/>
							<Picker
								selectedValue={time}
								style={{
									height: 40,
									width: 200,
									borderRadius: 10,
									backgroundColor: '#e0e0e0',
									fontSize: 30,
									textAlign: 'center',
									fontWeight: 'bold',
								}}
								onValueChange={(itemValue) => {
									setSlotValue(itemValue);
									async function arrayTimeSlot(serviceIdChange, changeTime) {
										const arrayDate = JSON.parse(
											await AsyncStorage.getItem('asyncArray1')
										);
										for (let index = 0; index < arrayDate.length; index++) {
											const element = arrayDate[index];
											if (serviceIdChange == element[0]) {
												element[3] = changeTime;
												const arrayChangeDate = [...arrayDate];
												await AsyncStorage.setItem(
													'asyncArray1',
													JSON.stringify(arrayChangeDate)
												);
												setCartcount(arrayChangeDate);
												break;
											}
										}
									}
									arrayTimeSlot(serviceId, itemValue);
								}}
								multiple={false}>
								<Picker.Item label='Select Slots' value='0' />
								{pickeritem(slot)}
							</Picker>
						</View>
					</View>
				);
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
				<View style={{ padding: 10, alignItems: 'flex-start', marginLeft: 15 }}>
					<Text style={{ fontSize: 15 }}>- {item}</Text>
				</View>
			);
		});
	};

	const showIncludes = (includes) => {
		let array = [includes].toString();
		let include_array = array.split(',');
		return include_array.map((item) => {
			return (
				<View style={{ padding: 10, alignItems: 'flex-start', marginLeft: 15 }}>
					<Text style={{ fontSize: 15 }}>- {item}</Text>
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
					marginLeft: 20,
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
						marginLeft: 20,
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

	return (
		<View style={styles.container}>
			<ScrollView>
				<View
					style={{
						marginTop: 20,
						borderColor: '#000',
					}}>
					{fetchDetails()}
					<FlatList
						data={serviceData.service}
						keyExtractor={(item, index) => item.id}
						renderItem={({ item }) => (
							<View
								style={{
									backgroundColor: '#ffffff',
									flexDirection: 'column',
									borderWidth: 0,
									borderRadius: 5,
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
										width: imagewidth * 0.8,
										height: 150,
										marginHorizontal: 20,
										marginVertical: 10,
									}}
									source={{ uri: 'https:alsocio.geop.tech/media/' + item.img }}
								/>
								<View
									style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
									<Text
										style={{ fontSize: 15, fontWeight: '400', marginLeft: 20 }}>
										{item.category}
									</Text>
									{showDiscount(item.service_cost, item.discount)}
									<Text
										style={{
											fontSize: 12,
											marginLeft: 20,
											fontWeight: 'bold',
											marginBottom: 8,
										}}>
										Service By:
										<Text style={{ fontWeight: '700' }}>
											{item.company_name}
										</Text>
									</Text>
									<View
										style={{
											flexDirection: 'row',
											alignContent: 'center',
											marginHorizontal: 20,
											marginBottom: 5,
										}}>
										{generateStar(item.rating)}
									</View>

									{addtocart(item.id)}
									<Text
										style={{
											fontSize: 15,
											marginLeft: 20,
											marginBottom: 5,
											fontWeight: '300',
										}}>
										{item.description}
									</Text>

									<TouchableOpacity
										style={{
											backgroundColor: '#1a237e',
											width: 100,
											height: 40,
											marginLeft: 20,
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
											Quote
										</Text>
									</TouchableOpacity>
									{showDatePicker(item.id)}
								</View>
								<View>
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 15,
											fontWeight: 'bold',
										}}>
										Additional Requirements
									</Text>
									{showRequirements(item.additional_requirements)}
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 15,
											fontWeight: 'bold',
										}}>
										Includes
									</Text>
									{showIncludes(item.includes)}
								</View>
							</View>
						)}
						extraData={cartCount}
						ListEmptyComponent={
							<View style={{ padding: 5, textAlign: 'center' }}>
								<Text>No services available</Text>
							</View>
						}
					/>

					<View style={{ marginBottom: 20 }}>
						<Text
							style={{
								marginLeft: 10,
								marginTop: 10,
								fontSize: 20,
								fontWeight: 'bold',
							}}>
							Business Hours
						</Text>
						<Grid>
							<Row style={{ borderBottomWidth: 0.5, padding: 10 }}>
								<Col>
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 10,
											fontWeight: 'bold',
										}}>
										Day
									</Text>
								</Col>
								<Col>
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 10,
											fontWeight: 'bold',
										}}>
										Start
									</Text>
								</Col>
								<Col>
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 10,
											fontWeight: 'bold',
										}}>
										End
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
														marginLeft: 10,
														marginTop: 10,
														fontSize: 10,
													}}>
													{item.day}
												</Text>
											</Col>
											<Col>
												<Text
													style={{
														marginLeft: 10,
														marginTop: 10,
														fontSize: 10,
													}}>
													{item.start}
												</Text>
											</Col>
											<Col>
												<Text
													style={{
														marginLeft: 10,
														marginTop: 10,
														fontSize: 10,
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
								marginLeft: 10,
								marginTop: 10,
								fontSize: 20,
								fontWeight: 'bold',
							}}>
							Provider Region
						</Text>
						<Grid>
							<Row style={{ borderBottomWidth: 0.5, padding: 10 }}>
								<Col>
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 10,
											fontWeight: 'bold',
										}}>
										City
									</Text>
								</Col>
								<Col>
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 10,
											fontWeight: 'bold',
										}}>
										Region
									</Text>
								</Col>
							</Row>
						</Grid>
						<FlatList
							data={serviceData.branches}
							renderItem={({ item }) => (
								<View style={{ marginTop: 10 }}>
									<Grid>
										<Row>
											<Col>
												<Text
													style={{
														marginLeft: 10,
														marginTop: 10,
														fontSize: 10,
													}}>
													{item.city}
												</Text>
											</Col>
											<Col>
												<Text
													style={{
														marginLeft: 10,
														marginTop: 10,
														fontSize: 10,
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
			</ScrollView>
			{showPopUp()}
		</View>
	);
};

export default showDetails;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
