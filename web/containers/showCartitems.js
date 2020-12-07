import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useContext, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	Modal,
	Button,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import showCart from '../reducers/showCart';
import { Col, Row, Grid } from 'react-native-easy-grid';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

import { NavigationEvents } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import DatePicker from 'react-native-datepicker';
import { Picker } from '@react-native-community/picker';
import { render } from 'react-dom';
import RNRestart from 'react-native-restart';
import { AuthContext } from '../components/context';
import { Card } from 'react-native-paper';

const imagewidth = Dimensions.get('window').width;
const imageheight = Dimensions.get('window').height;

const showCartitems = ({ route, navigation }, props) => {
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
					showList: action.delete,
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
				showCartArray = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
				console.log(showCartArray);
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
							console.log(responseJson.service);
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

	const [name, setName] = useState();

	const fetchUserName = async () => {
		const a = await AsyncStorage.getItem('userName');
		setName(a);
	};
	useEffect(() => {
		fetchUserName();
	});

	const [cartState, dispatch] = React.useReducer(cartReducer, initialCartState);

	if (cartState.showList && cartState.cartArray !== []) {
		//to generate flatlist
		let showFlatlist = [];
		showFlatlist = [...showFlatlist, ...cartState.showList];
		let showCartlist = [];

		let costArray = [];

		showFlatlist.map((item) => {
			showCartlist = [...showCartlist, item[0]]; //for flatlist

			if (item[0].discount == null || item[0].discount == 0) {
				costArray = [...costArray, [item[0].id, item[0].service_cost]];
			} else {
				costArray = [...costArray, [item[0].id, item[0].discount]];
			}
		});

		//For cart Count
		let showFetchArray = [];
		showFetchArray = [...showFetchArray, ...cartState.cartArray];

		const [cartCount, setCartcount] = useState([]);

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

		useEffect(()=>{
			let s = 0;
			const showCartPopUp = async () => {
				for (let index = 0; index < cartCount.length; index++) {
					const element = cartCount[index][1];
					s = s + element;
				}	
			};
			showCartPopUp();
			changeCount(s)
		},[cartCount])

		const handleDecrement = (serviceIdDec) => {
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
				await AsyncStorage.setItem(
					'asyncArray1',
					JSON.stringify(arrayIncCount)
				);
				setCartcount(arrayIncCount);
			}
			arrayCartCount(serviceIdinc);
		};

		const showPopUp = () => {
			let s = 0;
			const showCartPopUp = async () => {
				for (let index = 0; index < cartCount.length; index++) {
					const element = cartCount[index][1];
					s = s + element;
				}
				
			};
			showCartPopUp();

			let totalCost = 0;
			function showTotalCostPopup() {
				let amount = 0;

				for (let index = 0; index < cartCount.length; index++) {
					for (let index1 = 0; index1 < costArray.length; index1++) {
						if (cartCount[index][0] == costArray[index1][0]) {
							const element = cartCount[index][1];
							const item = costArray[index1][1];
							amount = amount + element * item;
						}
					}

					totalCost = amount;
				}
				return <Text>{amount}</Text>;
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
						bottom: 0,
						flexDirection: 'row',
						backgroundColor: '#fff',
						width: imagewidth,
					}}
					animation='fadeIn'>
					<View style={{ flexDirection: 'row', padding: 15 }}>
						<View>
							<Text
								style={{
									fontWeight: '900',
								}}>
								{s}
								{handleSentence()}
							</Text>
							<Text
								style={{
									fontWeight: '900',
								}}>
								${showTotalCostPopup()}
							</Text>
						</View>

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
								if (name == null) {
									setShowPickerModal(true);
								} else {
									navigation.navigate('showBookings', {
										cartDetails: cartCount,
										cost: totalCost,
									});
								}
							}}>
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
				</Animatable.View>
			) : null;
		};

		const addtocart = (serviceId) => {
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
								onPress={(e) => handleDecrement(serviceId)}>
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
					Cost is -${cost}
				</Text>
			) : (
				<View style={{ flexDirection: 'row' }}>
					<Text>Cost is -</Text>
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

		const [showPickerModal, setShowPickerModal] = useState(false);

		return (
			<View style={styles.container}>
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
							<Text
								style={{
									alignSelf: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									margin: 15,
								}}>
								Please Login/SignUp to continue
							</Text>
							<TouchableOpacity
								style={{
									borderRadius: 20,
									fontSize: 15,
									margin: 15,
									backgroundColor: '#1a237e',
								}}
								onPress={() => {
									navigation.navigate('SignInScreen'),
										setShowPickerModal(!showPickerModal);
								}}>
								<Text
								style={{
									alignSelf: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									margin: 15,
									color:'#fff'
								}}>
								Sign In
							</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									borderRadius: 20,
									fontSize: 15,
									margin: 15,
									backgroundColor: '#1a237e',
								}}
								onPress={() => {
									navigation.navigate('SignUpScreen'),
										setShowPickerModal(!showPickerModal);
								}}>
								<Text
								style={{
									alignSelf: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									margin: 15,
									color:'#fff'
								}}>
								Sign Up
							</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				<FlatList
					data={showCartlist}
					renderItem={({ item }) => {
						return (
							<Card
								style={{
									flex: 1,
									padding: 10.0,
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.5,
									shadowRadius: 10,
									elevation: 10,
									margin: 10,
									borderRadius: 10,
								}}>
								{showDiscount(item.service_cost, item.discount)}

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
													fontSize: 15,
													marginLeft: 20,
													fontStyle: 'Caption',
													marginBottom: 5,
													fontWeight: '300',
												}}>
												<Text style={{ fontWeight: 'bold' }}>Service By:</Text>
												{item.company_name}
											</Text>
										</Col>
										<Col>{addtocart(item.id)}</Col>
									</Row>
									<Row>
										<Col style={{ alignItems: 'center', marginTop: 20 }}>
											<TouchableOpacity
												style={{
													backgroundColor: '#1a237e',
													width: 200,
													height: 35,
													marginBottom: 5,
													borderRadius: 5,
													marginLeft: 20,
													alignItems: 'center',
													justifyContent: 'center',
												}}
												onPress={() =>
													navigation.navigate('showDetails', {
														service_id: item.id,
													})
												}>
												<Text
													style={{
														color: '#fff',
														alignSelf: 'center',
														textAlign: 'center',
													}}>
													Edit Details
												</Text>
											</TouchableOpacity>
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
													async function removeItem() {
														const arrayCartCount = JSON.parse(
															await AsyncStorage.getItem('asyncArray1')
														);
														for (
															let index = 0;
															index < arrayCartCount.length;
															index++
														) {
															const element = arrayCartCount[index];
															if (item.id == element[0]) {
																element[1] = 0;
																// Replaced console(element);
															}
														}
														const filterData = [...arrayCartCount].filter(
															(item) => item[1] > 0
														);
														// Replaced console(filterData);
														const arrayDecCount = [...filterData];
														await AsyncStorage.setItem(
															'asyncArray1',
															JSON.stringify(filterData)
														);
														setCartcount(arrayDecCount);
														dispatch({
															type: 'SHOW_CART_ITEM',
															array: filterData,
															count: item.count,
															show: arrayDecCount,
														});
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
										<Col></Col>
									</Row>
								</Grid>
							</Card>
						);
					}}
					// extraData={dateArray[1]}
					ListEmptyComponent={<Text>You've deleted the items!</Text>}
				/>
				{showPopUp()}
				{/* <FlatList
				data = {showCartlist}
				renderItem = {({item})=>{
					return(
					showPopUp(item.id, item.service_cost)
					)
				}}
				/> */}
				<View style={styles.footer}></View>
			</View>
		);
	}

	// if(cartState.showList!==null){
	//   console.log(cartState.showList)
	// }

	return (
		<View style={styles.container}>
			<Text>Hey</Text>
		</View>
	);
};
export default showCartitems;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},
	footer: {
		bottom: 0,
		flex: 0.8,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingVertical: 50,
		paddingHorizontal: 30,
	},
});
