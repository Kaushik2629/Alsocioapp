import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	FlatList,
	Dimensions,
	Image,
	TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';


const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const CartScreen = ({ route, navigation }) => {
	const [serviceData, setServiceData] = useState([]);
	const [details, setDetails] = useState([]);
	const [showData,setData] = useState(false);
	const totalCost = [];
	// const serviceId = route.params.service_Id;
	// const cart_Count = route.params.cart_Count;

	const fetchDetails = () => {
		useEffect(() => {
			async function fetchData() {
				const arraydetails = JSON.parse(
					await AsyncStorage.getItem('asyncArray1')
				);
				console.log(arraydetails)
				for (let index = 0; index < arraydetails.length; index++) {
					const element = arraydetails[index];
					let servicedetails = new FormData();
					servicedetails.append('service_id', element[0]);
					fetch('https://alsocio.geop.tech/app/get-service-details/', {
						method: 'POST',
						body: servicedetails,
					})
						.then((response) => response.json())
						.then((responseJson) => {
							details.push(responseJson);
							setCartcount(element[1]);
							console.log(responseJson);
							console.log(details);
							//alert(serviceData)
							if (
								details.includes(responseJson) &&
								index == arraydetails.length - 1
							) {
								console.log(details);
								console.log(index);
								// const getData = details.findIndex((obj) => obj.service);
								// console.log(getData);
								//alert(JSON.stringify(details))
								return details.map((element) => {
									console.log(element.service);
									let temparray = [];
									temparray.push(element.service);
									return temparray.map((item) => {
										console.log(item[0]);
										serviceData.push(item[0]);
										console.log(serviceData);
									});
								});
							}
							setData(true)
						})
						.catch((error) => console.error(error));
				}
			}
			fetchData();
		}, []);
		//fetchDetailsArray();
	};

	const fetchDetailsArray = () => {
		
			return showData ?(
				<FlatList
					data={serviceData}
					renderItem={({ item }) => {
						const cost = cartCount * item.service_cost;
						totalCost.push(cost)
						return (
							<View style={{ flex: 1 }}>
								<Text>Your Cost is - {item.service_cost}</Text>
								<Image
									style={{
										width: imagewidth * 0.8,
										height: 150,
										marginHorizontal: 20,
										marginVertical: 10,
									}}
									source={{
										uri: 'https:alsocio.geop.tech/media/' + item.img,
									}}
								/>
								<Grid>
									<Row>
										<Col>
											<Text
												style={{
													fontsize: 5,
													marginLeft: 20,
													fontStyle: 'Caption',
													marginBottom: 5,
													fontWeight: '300',
												}}>
												<Text style={{ fontWeight: 'bold' }}>Service By:</Text>
												{item.company_name}
											</Text>
										</Col>
										<Col>{addtocart()}</Col>
									</Row>
									<Row>
										<Col style={{ alignItems: 'center', marginTop: 20 }}>
											<TouchableOpacity
												style={{
													backgroundColor: '#e0e0e0',
													width: 50,
													height: 35,
													marginBottom: 5,
													borderRadius: 5,
													marginLeft: 20,
													alignItems: 'center',
												}}
												onPress={() => {
													setDetails([]);
													async function removeItem() {
														await AsyncStorage.removeItem('asyncArray1');
													}
													removeItem();
												}}>
												<Icon
													name='ios-trash'
													size={30}
													//backgroundColor='#fff'
													style={{
														color: '#8d8d8d',
														textAlign: 'center',
													}}></Icon>
											</TouchableOpacity>
										</Col>
									</Row>
									<Row>
										<Col>
											<View style={{ flexDirection: 'row' }}>
												<View>
													<TouchableOpacity
														style={{
															backgroundColor: '#1a237e',
															width: 100,
															height: 40,
															borderRadius: 5,
															marginBottom: 8,
															marginLeft: 20,
														}}
														onPress={() => showDatepicker()}>
														<Text
															style={{
																color: '#fff',
																textAlign: 'center',
																marginTop: 12,
																fontSize: 10,
															}}>
															Select a Date
														</Text>
													</TouchableOpacity>
												</View>
												<View>
													<TouchableOpacity
														style={{
															backgroundColor: '#1a237e',
															width: 100,
															height: 40,
															borderRadius: 5,
															marginBottom: 8,
															position: 'relative',
															left: '100%',
															textAlign: 'center',
														}}
														onPress={() => showTimepicker()}>
														<Text
															style={{
																color: '#fff',
																// marginTop: 10,
																textAlign: 'center',
																marginTop: 12,
																fontSize: 10,
															}}>
															Select Time Slot
														</Text>
													</TouchableOpacity>
												</View>
												{show && (
													<DateTimePicker
														testID='dateTimePicker'
														value={date}
														mode={mode}
														is24Hour={true}
														display='default'
														onChange={onChange}
													/>
												)}
											</View>
										</Col>
									</Row>
								</Grid>
							</View>
						);
					}}
					extraData={cartCount}
					ListEmptyComponent={<Text>You've deleted the items!</Text>}
				/>
			):(
				<Text>Not at all!</Text>
			)

		
	};

	const [cartCount, setCartcount] = useState();
	const [button, setButtons] = useState(false);
	const addtocart = () => {
		return button ? (
			<TouchableOpacity
				style={{
					backgroundColor: '#f9a825',
					width: 200,
					height: 35,
					marginBottom: 5,
					borderRadius: 5,
					marginLeft: 20,
				}}
				onPress={() => setButtons(false)}>
				<Text
					style={{
						color: '#fff',
						textAlign: 'center',
						marginTop: 10,
					}}>
					Add
				</Text>
			</TouchableOpacity>
		) : (
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
					onPress={() => handleDecrement()}>
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
					style={{ textAlign: 'center', marginTop: 5, marginHorizontal: 5 }}>
					{cartCount}
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
					onPress={() => handleIncrement()}>
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
	};

	const handleIncrement = () => {
		setCartcount(cartCount + 1);
	};

	const handleDecrement = () => {
		setCartcount(cartCount - 1);
		if (cartCount == 1) {
			setCartcount(1);
			setButtons(true);
		}
	};

	const [date, setDate] = useState(new Date(1598051730000));
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode('date');
	};

	const showTimepicker = () => {
		showMode('time');
	};

	const paymentsPopup = ()=>{
		const arr=0;
		if (button==false)
		{
			console.log(totalCost)
			// <Text>{totalCost}</Text>
			totalCost.map((element)=>{
				alert(arr+element)
				return <Text>{total}</Text>
				})
		}
	}

	return (
		<View style={styles.container}>
			<View
				style={{
					flex: 0.14, //0.14
					top: 0,
					width: imagewidth,
					backgroundColor: '#1a237e',
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<Icon.Button
					name='ios-arrow-back'
					size={25}
					backgroundColor='#1a237e'
					style={{ marginLeft: 5 }}
					onPress={() => navigation.goBack()}></Icon.Button>

				<FlatList
					data={details}
					renderItem={({ item }) => (
						<Text
							style={{
								fontSize: 20,
								marginTop: 5,
								marginHorizontal: 50,
								color: '#fff',
								fontWeight: '300',
								marginLeft: imagewidth / 4,
							}}>
							My Cart!
						</Text>
					)}
				/>
				<Icon.Button
					name='ios-menu'
					size={25}
					backgroundColor='#1a237e'
					style={{ marginLeft: 30, right: 0 }}
					onPress={() => navigation.openDrawer()}></Icon.Button>
			</View>
			{fetchDetails()}
			<ScrollView style={{ flex: 1, top: 0 }}>
				{/* <Text>{details}</Text> */}
				<View style={{ flex: 1 }}>{fetchDetailsArray()}</View>
			</ScrollView>
			{paymentsPopup()}
			<View style={{ flexDirection: 'row', marginBottom: 15 }}>
				<TouchableOpacity
					style={{
						backgroundColor: '#1a237e',
						width: 200,
						height: 35,
						marginBottom: 5,
						borderRadius: 5,
						marginLeft: 20,
					}}
					onPress={() => navigation.goBack()}>
					<Text
						style={{
							color: '#fff',
							textAlign: 'center',
							marginTop: 10,
						}}>
						Add More!
					</Text>
				</TouchableOpacity>
				
				<TouchableOpacity
					style={{
						backgroundColor: '#1a237e',
						width: 200,
						height: 35,
						marginBottom: 5,
						borderRadius: 5,
						marginLeft: 20,
					}}
					onPress={() => alert('Bookings page coming soon!')}>
					<Text
						style={{
							color: '#fff',
							textAlign: 'center',
							marginTop: 10,
						}}>
						Next
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};
export default CartScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
