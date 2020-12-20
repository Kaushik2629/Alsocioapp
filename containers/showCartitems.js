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
import { Col, Row, Grid } from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../components/context';
import { Card } from 'react-native-paper';
import { MaterialIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('window').width;
const imageheight = Dimensions.get('window').height;

const showCartitems = ({ route, navigation }, props) => {
	const { changeCount } = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(true);

	const checkName = useContext(AuthContext);

	const [cartCount, setCartcount] = useState([]);
	let a = [];
	const fetchCount = async () => {
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
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
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		if (check != null) {
			for (let index = 0; index < check.length; index++) {
				const element = check[index];
				let servicedetails = new FormData();
				servicedetails.append('service_id', element[0]);
				fetch('https://alsocio.geop.tech/app/get-service-details/', {
					method: 'POST',
					body: servicedetails,
				})
					.then((response) => response.json())
					.then((responseJson) => {
						setIsLoading(false);
						showList = [...showList, ...responseJson.service];
						setDetails(showList);
					});
			}
		}
	};
	useEffect(() => {
		fetchDetails();
	}, []);

	const removeItem = async (serviceId) => {
		const filterObject = details.filter((item) => item.id != serviceId);
		setDetails(filterObject);
		try {
			let arrayCartCount = JSON.parse(
				await AsyncStorage.getItem('asyncArray1')
			);
			for (let index = 0; index < arrayCartCount.length; index++) {
				const element = arrayCartCount[index];
				if (serviceId == element[0]) {
					element[1] = 0;
					// Replaced console(element);
				}
			}
			const filterData = [...arrayCartCount].filter((item) => item[1] > 0);
			// Replaced console(filterData);
			const arrayDecCount = [...filterData];
			await AsyncStorage.setItem('asyncArray1', JSON.stringify(filterData));
			setCartcount(arrayDecCount);
		} catch {
			console.log(e);
		}
	};

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
				if (element[1] == 0) {
					const filterObject = details.filter(
						(item) => item.id != serviceIdDec
					);
					setDetails(filterObject);
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
			await AsyncStorage.setItem('asyncArray1', JSON.stringify(arrayIncCount));
			setCartcount(arrayIncCount);
		}
		arrayCartCount(serviceIdinc);
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

	if (isLoading) {
		return (
			<View
				style={{
					padding: 20,
					alignContent: 'center',
					justifyContent: 'center',
					marginTop:20
				}}>
				<MaterialIndicator color='#1a237e' />
			</View>
		);
	}

	if (details.length != 0 && cartCount.length != 0) {
		let costArray = [];
		details.map((item) => {
			if (item.discount == null || item.discount == 0) {
				costArray = [...costArray, [item.id, item.service_cost]];
			} else {
				costArray = [...costArray, [item.id, item.discount]];
			}
		});

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
								if (checkName.UserName == null) {
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
		//For cart Count

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
										color: '#fff',
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
										color: '#fff',
									}}>
									Sign Up
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<FlatList
					data={details}
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
													{
														removeItem(item.id);
													}
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
				<View style={styles.footer}></View>
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				<Text style={{ fontSize: 25 }}>No Items Added</Text>
			</View>
		);
	}
};
export default showCartitems;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
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
