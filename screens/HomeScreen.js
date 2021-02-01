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
import { Badge, Card, IconButton, Colors, Appbar } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';

import { AuthContext } from '../components/context';
import { MaterialIndicator } from 'react-native-indicators';

const imageheight = Dimensions.get('screen').height;
const imagewidth = Dimensions.get('screen').width;

const HomeScreen = ({ route, navigation }) => {
	const [isLoading, setIsLoading] = useState(true);

	const a = useContext(AuthContext);

	
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
			region: a.regionValue,
			city: a.cityValue,
		});
	};

	const showStars = (ratingCount) => {
		let stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<View>
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
					padding: 15,
				}}>
				{stars}
			</View>
		);
	};

	return (
		<React.Fragment>
			<View style={styles.container}>				
				<StatusBar backgroundColor='#262262' barStyle='light-content' />
				<Appbar.Header
					style={{
						backgroundColor: '#262262',
						height: 0,
						marginTop: 0,
					}}></Appbar.Header>
				

				<View
					style={{
						flexDirection: 'row',
						flexBasis: 70,
						backgroundColor: 'rgba(233, 236, 239, 1.0)',
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
							backgroundColor='rgba(233, 236, 239, 1.0)'
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
					<MaterialIndicator color='#262262' />
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
										<Text accessibilityRole='button' style={styles.icontext}>
											{item}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
						{featuredServicesArray.length != 0 ? (
							<View
								style={{
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								<Text
									style={{
										fontSize: 18,
										marginVertical: 15,
										fontWeight: '900',
									}}>
									Servicios destacados
								</Text>
								<Swiper
									showsButtons={false}
									paginationStyle={{ margin: 0 }}
									height={300}
									// style={{ flexGrow:0.5}}
								>
									{featuredServicesArray.map((item) => {
										return (
											<Card
												style={{
													marginHorizontal: 10,
													borderWidth: 0.6,
													alignItems:'stretch',
													justifyContent:'center'
												}}
												onPress={() =>
													navigation.navigate('showFeaturedServices', {
														featured_service: item.service,
														region: a.regionValue,
														city: a.cityValue,
													})
												}>
												<Card.Cover
													source={{
														uri: 'https://alsocio.com/media/' + item.image,
													}}
												/>
												<Card.Content
													style={{
														padding:10
													}}>
													<Text style={{textAlign:'center'}}>{item.service}</Text>
												</Card.Content>
											</Card>
										);
									})}
								</Swiper>
							</View>
						) : null}

						{featuredReviewsArray.length != 0 ? (
							<View
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									marginVertical: 20,
								}}>
								<Text
									style={{
										fontSize: 18,
										marginVertical: 15,
										fontWeight: '900',
									}}>
									Reseñas Comentarios
								</Text>
								<Swiper showsButtons={false} height={215}>
									{featuredReviewsArray.map((item) => {
										return (
											<Card
												style={{
													marginHorizontal: 10,
													borderWidth: 0.6,
													alignItems:'stretch',
													justifyContent:'center'
												}}>
												<Card.Content
													style={{
														alignItems: 'center',
														justifyContent: 'center',
													}}>
													<Text style={styles.text}>
														{item.customer_username}
													</Text>
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
						) : null}
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
		fontSize: 10,
		fontWeight: '300',
		padding: 5,
		textAlign: 'center',
	},

	container: {
		flex: 1,
		// alignItems: "center",
		// justifyContent: "center",
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
		borderColor: '#262262',
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
		borderColor: '#262262',
		paddingVertical: 13,
		paddingHorizontal: 10,
		// height: 40,
		// marginBottom: 15,
	},
});
