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

	const count = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(true);

	const checkName = useContext(AuthContext);

	const [cartCount, setCartcount] = useState([]);
	let a = [];
	const fetchCount = async () => {
		let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		if (check == null) {
			setIsLoading(false);
			setDetails([]);
		} else if (check.length != 0) {
			a = [...check];
			setCartcount(a);
			return;
		} else {
			setIsLoading(false);
			setDetails([]);
		}
	};
	// fetchCount();
	useEffect(() => {
		fetchCount();
	}, [count.itemCount]);

	const [details, setDetails] = useState([]);

	const fetchDetails = async () => {
		// alert('ijijj')
		let showList = [];
		// let check = JSON.parse(await AsyncStorage.getItem('asyncArray1'));
		if (cartCount.length != 0) {
			// console.log(check)
			for (let index = 0; index < cartCount.length; index++) {
				const element = cartCount[index];
				let servicedetails = new FormData();
				servicedetails.append('service_id', element[0]);
				fetch('https://alsocio.com/app/get-service-details/', {
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
			return;
		}
	};
	useEffect(() => {
		fetchDetails();
	}, [cartCount.length]);

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
				}
			}
			const filterData = [...arrayCartCount].filter((item) => item[1] > 0);
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
								backgroundColor: '#262262',
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
	};

	const showDiscount = (cost, discount) => {
		return discount == null || discount == 0 ? (
			<View
				style={{
					marginLeft: 20,
					marginTop: 10,
					flexDirection: 'row',
				}}>
				<Text
					style={{
						fontSize: 15,
						fontWeight: 'bold',
					}}>
					Subtotal -
				</Text>
				<Text style={{ fontSize: 15 }}>${cost}</Text>
			</View>
		) : (
			<View style={{ marginLeft: 20, marginTop: 10, flexDirection: 'row' }}>
				<Text>Subtotal -</Text>
				<Text
					style={{
						marginLeft:10,
						fontSize: 15,
						fontWeight: 'bold',
						textDecorationLine: 'line-through',
						textDecorationStyle: 'solid',
					}}>
					${cost}
				</Text>
				<Text
					style={{
						fontSize: 15,
						fontWeight: 'bold',
						marginLeft: 5,
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
					marginTop: 20,
				}}>
				<MaterialIndicator color='#262262' />
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
					return <Text>1 servicio aggregado</Text>;
				}
				if (s > 1) {
					return <Text>{s} services added</Text>;
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
					<View style={{ flexDirection: 'row', padding: 15 }}>
						<View>
							<View style={{ flexGrow: 1 }}>
								<Text>{handleSentence()}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row' }}>
								<Text style={{ fontWeight: 'bold' }}>Total :</Text>
								<Text>${showTotalCostPopup()}</Text>
							</View>
						</View>
						<View
							style={{
								flexGrow: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<TouchableOpacity
								style={{
									alignSelf: 'flex-end',
									backgroundColor: '#262262',
									width: 200,
									borderRadius: 5,
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
										paddingVertical: 15,
									}}>
									Revisa
								</Text>
							</TouchableOpacity>
						</View>
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
								Ingrese / Regístrese para continuar
							</Text>
							<TouchableOpacity
								style={{
									borderRadius: 20,
									fontSize: 15,
									margin: 15,
									backgroundColor: '#262262',
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
									Iniciar sesión
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									borderRadius: 20,
									fontSize: 15,
									margin: 15,
									backgroundColor: '#262262',
								}}
								onPress={() => {
									navigation.navigate('customerSignUpScreen'),
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
									Regístrate
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
									paddingVertical: 10,
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
										width: imagewidth - 40,
										height: imageheight / 3,
										margin: 10,
									}}
									source={{
										uri: 'https:alsocio.com/media/' + item.img,
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
												<Text style={{ fontWeight: 'bold' }}>
													Servicio por:
												</Text>
												{item.company_name}
											</Text>
										</Col>
										<Col>{addtocart(item.id)}</Col>
									</Row>
									<Row>
										<Col style={{ alignItems: 'center', marginTop: 20 }}>
											<TouchableOpacity
												style={{
													backgroundColor: '#262262',
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
													Editar detalles
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

				<View>{showPopUp()}</View>
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				<Text style={{ fontSize: 25 }}>No se han añadido elementos</Text>
			</View>
		);
	}
};
export default showCartitems;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	footer: {
		bottom: 0,
		flex: 0.8,
	},
});
