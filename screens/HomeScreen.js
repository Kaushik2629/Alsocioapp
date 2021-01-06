import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	StatusBar,
	Image,
	SafeAreaView,
	ImageBackground,
	ViewComponent,
	FlatList,
	Modal,
} from 'react-native';
import { Dimensions } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import { Badge, Card, IconButton, Colors } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';

import { AuthContext } from '../components/context';
import { MaterialIndicator } from 'react-native-indicators';

const imageheight = Dimensions.get('screen').height;
const imagewidth = Dimensions.get('screen').width;

const HomeScreen = ({ route, navigation }) => {
	const [isLoading, setIsLoading] = useState(true);

	const a = useContext(AuthContext);

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
	}, []);

	const [showPickerModal, setShowPickerModal] = useState(false);

	const [regionValue, setRegionValue] = useState('');

	const [cityValue, setCityValue] = useState('');

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
				style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
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

	const TopLeftNavScreen = () => {
		return regionValue == '' || cityValue == '' ? (
			<View
				style={styles.TopLeftContainer}
				onTouchStart={() => setShowPickerModal(true)}>
				<TouchableOpacity onPress={() => setShowPickerModal(true)}>
					<Text>Selecciona tu Ubicación</Text>
				</TouchableOpacity>
				<IconButton
					icon='map-marker'
					size={20}
					color={Colors.blue900}
					onPress={() => {
						setShowPickerModal(true);
					}}
				/>
			</View>
		) : (
			<View
				style={styles.TopLeftContainer}
				onTouchStart={() => setShowPickerModal(true)}>
				<TouchableOpacity onPress={() => setShowPickerModal(true)}>
					<Text>{cityValue}</Text>
				</TouchableOpacity>
				<IconButton
					icon='map-marker'
					// style={{alignSelf:'flex-end'}}
					size={20}
					color={Colors.blue900}
					onPress={() => {
						setShowPickerModal(true);
					}}
				/>
			</View>
		);
	};

	const fetchCartCount = () => {
		return a.itemCount != 0 ? (
			<Badge
				size={20}
				style={{
					backgroundColor: '#ab000d',
					position: 'absolute',
					top: 5,
					right: 10,
					zIndex: 1000,
				}}>
				<Text style={{ color: '#fff' }}>{a.itemCount}</Text>
			</Badge>
		) : null;
	};

	const checkUser = () => {
		return a.UserName != null ? (
			<View style={styles.showUserName}>
				<Text
					style={{
						fontSize: 12,
						color: '#1a237e',
						// textAlign: 'center',
					}}>
					Hi,{a.UserName}
				</Text>
			</View>
		) : null;
	};

	const [mainCategoryArray, setMainCategoryArray] = useState([]);

	const [mainCategoryImages, setMainCategoryImages] = useState([]);

	const getMainCategory = () => {
		fetch('https://alsocio.com/app/get-main-categories/', {
			method: 'GET',
			// body: usercategory,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setMainCategoryArray(responseJson.main_categories);
				setMainCategoryImages(responseJson.main_category_images);
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		getMainCategory();
	}, []);

	const showImage = (serviceName) => {
		return Object.keys(mainCategoryImages).map((name) => {
			if (serviceName == name) {
				return (
					<Image
						style={{
							width: 50,
							height: 50,
						}}
						source={{
							uri: mainCategoryImages[name],
						}}
					/>
				);
			}
		});
	};

	const [featuredServicesArray, setFeaturedServicesArray] = useState([]);

	const getFeaturedServices = () => {
		fetch('https://alsocio.com/app/get-featured-services/', {
			method: 'GET',
			// body: usercategory,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				// console.log(responseJson);
				setFeaturedServicesArray(responseJson.featured_services);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		getFeaturedServices();
	}, []);

	const [featuredReviewsArray, setFeaturedReviewsArray] = useState([]);

	const getFeaturedReviews = () => {
		fetch('https://alsocio.com/app/get-featured-reviews/', {
			method: 'GET',
			// body: usercategory,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				setFeaturedReviewsArray(responseJson.featured_reviews);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		getFeaturedReviews();
	}, []);

	const showcategory = (category) => {
		navigation.navigate('SupportScreen', {
			category_name: category,
			region: regionValue,
			city: cityValue,
		});
	};

	const showStars=(ratingCount)=>{
		let stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<View >
					{i <= ratingCount ? (
						<Icon
							name='md-star'
							color='#fbc02d'
							size={26}
							style={{ margin: 0 }}
						/>
					) : (
						<Icon
							name='md-star'
							color='grey'
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
					padding:15
				}}>
				{stars}
			</View>
		);
	}

	return (
		<React.Fragment>
			<View style={styles.container}>
				<Modal
					animationType='fade'
					visible={showPickerModal}
					transparent={true}
					onRequestClose={() => {
						setShowPickerModal(!showPickerModal);
					}}>
					<Formik
						initialValues={{ region: '', city: '' }}
						onSubmit={(values) => {
							alert(JSON.stringify(values));
						}}>
						{(props) => (
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
										}}
										onPress={() => {
											setShowPickerModal(!showPickerModal);
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
						)}
					</Formik>
				</Modal>

				<StatusBar backgroundColor='#1a237e' barStyle='light-content' />

				<View style={styles.upperHeaderContainer}>
					{TopLeftNavScreen()}
					{checkUser()}
				</View>

				<View
					style={{
						flexDirection: 'row',
						flexBasis: 70,
						backgroundColor: '#c5cae9',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<View
						style={{
							flexBasis: 70,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Icon.Button
							name='ios-menu'
							style={{ alignSelf: 'center' }}
							size={25}
							color='#000'
							backgroundColor='#c5cae9'
							onPress={() => navigation.openDrawer()}></Icon.Button>
					</View>
					<View style={{ flexGrow: 1 }}>
						<Image
							source={require('../assets/homeScreenImage.png')}
							style={{
								width: 70,
								height: 40,
							}}
						/>
					</View>
					<View style={{ flexBasis: 70, alignItems: 'center' }}>
						<IconButton
							icon='cart'
							size={30}
							color={Colors.black}
							backgroundColor='#c5cae9'
							onPress={() => navigation.navigate('showCartitems')}
						/>
						{fetchCartCount()}
					</View>
				</View>
				{isLoading ? (
					<MaterialIndicator color='#1a237e' />
				) : (
					<ScrollView style={styles.scrollView}>
						<View
							style={{
								marginTop: 10,
								flexDirection: 'row',
								flexWrap: 'wrap',
							}}>
							{mainCategoryArray.map((item) => {
								return (
									<TouchableOpacity
										style={styles.iconcontainer}
										onPress={() => showcategory(item)}>
										{showImage(item)}
										<Text accessibilityRole='button' style={[styles.icontext]}>
											{item}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
						<View
							style={{
								flexGrow: 1,
								alignItems: 'center',
								borderWidth: 0.1,
								margin: 2,
								marginTop: 15,
							}}>
							<Text
								style={{
									fontSize: 18,
									marginTop: 20,
									fontWeight: '900',
								}}>
								Servicios destacados
							</Text>

							<Swiper
								style={{
									height: imageheight / 2.5,
									alignItems: 'center',
									justifyContent: 'center',
								}}
								showsButtons={false}>
								{featuredServicesArray.map((item) => {
									return (
										<Card
											style={{
												shadowColor: '#000',
												shadowOffset: { width: 0, height: 1 },
												shadowOpacity: 0.5,
												shadowRadius: 10,
												elevation: 15,
												margin: 10,
												borderRadius: 10,
											}}
											onPress={() =>
												navigation.navigate('showFeaturedServices', {
													featured_service: item.service,
													region: regionValue,
													city: cityValue,
												})
											}>
											<Card.Cover
												style={{ marginBottom: 10 }}
												source={{
													uri: 'https://alsocio.com/media/' + item.image,
												}}
											/>
											<Card.Content
												style={{
													alignItems: 'center',
													justifyContent: 'center',
												}}>
												<Text>{item.service}</Text>
											</Card.Content>
										</Card>
									);
								})}
							</Swiper>
						</View>

						<View
							style={{
								flexGrow: 1,
								alignItems: 'center',
								borderWidth: 0.1,
								margin: 2,
								marginBottom: 15,
							}}>
							<Text
								style={{
									fontSize: 18,
									marginTop: 20,
									fontWeight: '900',
								}}>
								Reseñas destacadas
							</Text>
							<Swiper style={{ height: imageheight / 4 }} showsButtons={false}>
							{featuredReviewsArray.map((item) => {
									return (
								<Card style={styles.slide1}>
									<Card.Content
										style={{ alignItems: 'center', justifyContent: 'center' }}>
										<Text style={styles.text}>{item.customer_username}</Text>
										<Text
											style={{
												textAlign: 'center',
												marginTop: 15,
												fontSize: 18,
											}}>
											{item.review}
										</Text>
										{showStars(item.rating)}
									</Card.Content>
								</Card>
							);
						})}
							</Swiper>
						</View>
					</ScrollView>
				)}
			</View>
		</React.Fragment>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	iconcontainer: {
		width: imagewidth / 3,
		height: imageheight / 9,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	iconimage: {
		width: 30,
		height: 30,
		marginBottom: 8,
	},
	icontext: {
		fontSize: 12,
		fontWeight: '300',
		padding: 5,
		textAlign: 'center',
	},

	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	servicesbox: {
		flexDirection: 'column',
	},
	scrollView: {
		marginHorizontal: 0,
	},
	subcontainers: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
	},
	featuredservices: {
		borderWidth: 0,
		borderRadius: 10,
		borderColor: '#fce4ec',
		marginBottom: 13,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 1,
		shadowRadius: 10,
		backgroundColor: '#fce4ec',
	},

	slide1: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 15,
		margin: 10,
		borderRadius: 10,
	},
	slide2: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#97CAE5',
	},
	slide3: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#92BBD9',
	},
	text: {
		color: '#000',
		fontSize: 20,
		fontWeight: 'bold',
	},
	upperHeaderContainer: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		flexBasis: 70,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	TopLeftContainer: {
		flexGrow: 1,
		flexDirection: 'row',
		borderRadius: 10,
		borderWidth: 0.2,
		backgroundColor: '#fff',
		// justifyContent: 'flex-end',
		alignItems: 'center',
		borderColor: '#1a237e',
		paddingHorizontal: 10,
		justifyContent: 'space-between',
		marginRight: 10,
	},
	showUserName: {
		flexGrow: 1,
		borderRadius: 10,
		borderWidth: 0.2,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#1a237e',
		paddingVertical: 13,
		paddingHorizontal: 10,
		// height: 40,
		// marginBottom: 15,
	},
});
