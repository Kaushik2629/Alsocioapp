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

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const BookmarkScreen = ({ route, navigation }) => {
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
		// Replaced console(a);
		setCartcount(a);
	};
	// fetchCount();
	useEffect(() => {
		fetchCount();
	}, []);

	//For Decrement
	const handleDecrement = (e, serviceIdDec) => {
		// Replaced console(e.target);
		async function arrayCartCountDec(serviceIdDec) {
			const arrayCartCount = JSON.parse(
				await AsyncStorage.getItem('asyncArray1')
			);
			for (let index = 0; index < arrayCartCount.length; index++) {
				const element = arrayCartCount[index];
				if (serviceIdDec == element[0]) {
					element[1] = element[1] - 1;
					// Replaced console(element);
				}
			}
			const filterData = [...arrayCartCount].filter((item) => item[1] > 0);
			// Replaced console(filterData);
			const arrayDecCount = [...filterData];
			await AsyncStorage.setItem('asyncArray1', JSON.stringify(filterData));
			setCartcount(arrayDecCount);
		}
		arrayCartCountDec(serviceIdDec);
	};

	//For Increment
	const handleIncrement = (serviceIdinc) => {
		// Replaced console(serviceIdinc);
		async function arrayCartCount(serviceIdinc) {
			const arrayCartCount = JSON.parse(
				await AsyncStorage.getItem('asyncArray1')
			);
			for (let index = 0; index < arrayCartCount.length; index++) {
				const element = arrayCartCount[index];
				if (serviceIdinc == element[0]) {
					element[1] = element[1] + 1;
					// Replaced console(element);
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
				const element = cartCount[index][1];
				// Replaced console(element);
				s = s + element;
				// Replaced console(s);
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
						onPress={() => navigation.navigate('showCartitems')}>
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
				// Replaced console(cartCount);
				// Replaced console(element[1]);
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
					// Replaced console(serviceId);
					// setButtons(false);
					async function arrayData(serviceId) {
						const arrayDetails = await AsyncStorage.getItem('asyncArray1');
						if (arrayDetails == null) {
							const array = [];
							await AsyncStorage.setItem('asyncArray1', JSON.stringify(array));
						}
						//const array = [[31, 1], [32, 2]];
						//// Replaced console(array)
						//await AsyncStorage.setItem('asyncArray1',JSON.stringify(array));
						const arrayData = await AsyncStorage.getItem('asyncArray1');
						const arrayDet = JSON.parse(arrayData);
						let temp = [...arrayDet, [serviceId, 1, '', '']];

						// let temp1 = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
						// // Replaced console(temp1);
						const arrayCount = [...temp];
						await AsyncStorage.setItem('asyncArray1', JSON.stringify(temp));
						setCartcount(arrayCount);
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
		// Replaced console(rating);
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

	const showForm = () => {
		return (
			<View style={{ flexGrow: 1, padding: 20 }}>
				<Formik
					initialValues={{ request: '', description: '' }}
					onSubmit={(values) => {
						console.log(values);
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
									marginBottom: 30,
								}}
								placeholder='Enter your Description'
								onChangeText={props.handleChange('description')}
								value={props.values.description}
							/>
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

	// const [time, setTime] = useState();
	// const [slot, setSlot] = useState([]);

	// for storing date and time
	// let b = [];
	// const fetchDate = async () => {

	// 	b = [...check];
	// 	setDateArray(b);

	// };
	// // fetchCount();
	// useEffect(() => {
	// 	fetchDate();
	// }, []);

	const [dateArray, setDateArray] = useState([]);

	const changeDate = async(serviceIdChange, date) => {
		
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		if (check == null) {
			let temp = [...check, [serviceIdChange, 0, currentDate, '']];
			await AsyncStorage.setItem('dateTimeArray', JSON.stringify(temp));
			const data = [...temp];
			setCartcount(data);
			return
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
					break
				}
			}
		}
		arrayDateCount(serviceIdChange, date);
	};

	// const [date, setDate] = useState(currentDate);

	const [slot, setSlot] = useState([]);

	const [slotValue, setSlotValue] = useState();

	const showDatePicker = (serviceId) => {
		// await AsyncStorage.removeItem('dateTimeArray')
		for (let index = 0; index < cartCount.length; index++) {
			const element = cartCount[index];
			if (element[0] == serviceId) {
				let date = cartCount[index][2];
				if (date == '') {
					date = currentDate;
				}
				let time=cartCount[index][3]
				
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
									console.log(date);
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
											console.log(responseJson);
											setSlot(responseJson.slots);
											changeDate(serviceId, date);
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
									setSlotValue(itemValue)
									async function arrayTimeSlot(serviceIdChange, changeTime) {
										const arrayDate = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
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
												console.log(JSON.parse(await AsyncStorage.getItem('asyncArray1')));
												break
											}
										}
									}
									arrayTimeSlot(serviceId, itemValue);
								}}
								multiple={false}>
								<Picker.Item label='No Slots Available' value='0' />
								{/*calling picker item function*/}
								{pickeritem(slot)}
							</Picker>
						</View>
					</View>
				);
			}
		}
	};

	const pickeritem = (slotItems) => {
		// await showDatePicker();
		let q = [...slotItems];
		return q.map((element) => {
			return <Picker.Item label={element} value={element} />;
		});
	};

	return (
		<View style={styles.container}>
			<Header
				statusBarProps={{ barStyle: 'light-content' }}
				barStyle='light-content' // or directly
				containerStyle={{
					backgroundColor: '#1a237e',
					width: imagewidth,
					height: 100,
					paddingTop: 38,
					marginTop: 20,
				}}
				centerComponent={
					<View>
						<Text
							style={{
								color: '#fff',
								fontWeight: 'bold',
								fontSize: 20,
								padding: 5,
							}}>
							Service Details
						</Text>
					</View>
				}
				leftComponent={
					<View
						style={{
							flexDirection: 'row',

							alignItems: 'flex-start',
						}}>
						<Icon.Button
							name='ios-arrow-back'
							size={25}
							backgroundColor='#1a237e'
							onPress={() => navigation.goBack()}></Icon.Button>
					</View>
				}
				rightComponent={
					<View
						style={{
							flexDirection: 'row',

							alignItems: 'flex-start',
						}}>
						<Icon.Button
							name='ios-menu'
							size={25}
							backgroundColor='#1a237e'
							onPress={() => navigation.openDrawer()}></Icon.Button>
					</View>
				}
			/>
			<ScrollView>
				<Modal
					animationType='fade'
					visible={modalVisible}
					transparent={true}
					onRequestClose={() => {
						setModalVisible(!modalVisible);
					}}>
					<View
						style={{
							flex: 1,
							marginTop: 60,
						}}>
						<View
							style={{
								backgroundColor: '#fff',
								shadowColor: '#000',
								marginTop: 50,
								marginHorizontal: 40,
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
										style={{ fontsize: 5, fontWeight: '400', marginLeft: 20 }}>
										{item.category}
									</Text>
									<Text
										style={{
											fontsize: 10,
											fontWeight: '500',
											marginLeft: 20,
											marginTop: 10,
										}}>
										${item.service_cost}
									</Text>
									<Text
										style={{
											fontsize: 5,
											marginLeft: 20,
											fontWeight: '400',
											marginBottom: 8,
										}}>
										Service By:{item.company_name}
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
											fontsize: 5,
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
							</View>
						)}
						extraData={cartCount}
						ListEmptyComponent={
							<View>
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

export default BookmarkScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
