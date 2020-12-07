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
import SearchBox from './SearchBox';
import { Dimensions } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Header } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from 'react-dom';
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import { Badge, Card } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';

import { AuthContext } from '../components/context'

const HomeScreen = ({ route, navigation }) => {

	const a = useContext(AuthContext)
	
	const imageheight = Dimensions.get('screen').height;
	const imagewidth = Dimensions.get('screen').width;

	const showcategory = async (category, key) => {
		navigation.navigate('SupportScreen', {
			category_name: category,
			region: regionValue,
			city: cityValue,
		});
	};

	//for region
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
		// return selectedRegion.map((element) => {
		// 	// return <option value={element}>{element}</option>;
		// });
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
			<View style={{ flexDirection: 'row', marginBottom: 15 }}>
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

	const TopLeftNavScreen = () => {
		return regionValue == '' || cityValue == '' ? (
			// <View style={{ flex: 1 }}>
			<Card
				style={{
					width: 180,
					borderWidth: 1,
					borderColor: '#ddd',
					borderRadius: 8,
					padding: 8,
					elevation: 15,
				}}>
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => setShowPickerModal(true)}>
						<Text>Select Your Location</Text>
					</TouchableOpacity>
					<TouchableOpacity>
						<Icon.Button
							name='ios-pin'
							size={20}
							color='#1a237e'
							backgroundColor='#fff'
							style={{ height: 10 }}
							onPress={() => {
								setShowPickerModal(true);
							}}></Icon.Button>
					</TouchableOpacity>
				</View>
			</Card>
		) : (
			// {/* </View> */}
			// <View style={{ flex: 1 }}>

			<View>
				<Card
					style={{
						width: 180,
						borderWidth: 1,
						borderColor: '#ddd',
						borderRadius: 8,
						padding: 8,
						elevation: 15,
					}}>
					<View style={{ flexDirection: 'row'}}>
						<TouchableOpacity
							style={{ alignSelf: 'center' }}
							onPress={() => setShowPickerModal(true)}>
							<Text style={{ fontSize: 12,textAlign:'center' }}>{cityValue}</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Icon.Button
								name='ios-pin'
								size={20}
								color='#1a237e'
								backgroundColor='#fff'
								style={{ height: 10, alignSelf: 'flex-end' }}
								onPress={() => {
									setShowPickerModal(true);
								}}></Icon.Button>
						</TouchableOpacity>
					</View>
				</Card>
			</View>

			// {/* </View> */}
		);
	};

	const fetchCartCount = () => {
		return a.itemCount != 0 ? (
			<Badge
				size={20}
				style={{
					backgroundColor: '#fff',
					position: 'absolute',
					top: 0,
					right: 0,
				}}>
				<Text style={{ color: '#000' }}>{a.itemCount}</Text>
			</Badge>
		) : null;
	};

	const checkUser = () => {
		return a.UserName == null ? (
			<Card
				style={{
					width: 150,
					borderWidth: 1,
					borderColor: '#ddd',
					borderRadius: 8,
					padding: 8,
					elevation: 15,
				}}>
				<View
					style={{
						flexDirection: 'row',
						backgroundColor: '#fff',
					}}>
					<FontAwesome
						name='user-o'
						color='#1a237e'
						size={15}
						style={{ alignSelf: 'center' }}
						onPress={() => navigation.navigate('SignInScreen')}
					/>
					<Text
						style={{
							fontSize: 12,
							color: '#1a237e',
							justifyContent: 'center',
							textAlign: 'left',
						}}
						onPress={() => navigation.navigate('SignInScreen')}>
						Login
					</Text>
					<FontAwesome
						name='plus'
						color='#1a237e'
						size={15}
						style={{ marginLeft: 25 }}
						onPress={() => navigation.navigate('SignUpScreen')}
					/>
					<Text
						style={{
							fontSize: 12,
							color: '#1a237e',
							justifyContent: 'center',
							textAlign: 'right',
						}}
						onPress={() => navigation.navigate('SignUpScreen')}>
						SignUp
					</Text>
				</View>
			</Card>
		) : (
			<Card
				style={{
					width: 150,
					borderWidth: 1,
					borderColor: '#ddd',
					borderRadius: 8,
					padding: 7,
					elevation: 15,
				}}>
				<Text
					style={{
						fontSize: 12,
						color: '#1a237e',
						alignSelf: 'center',
						textAlign: 'center',
					}}>
					Hi,{a.UserName}
				</Text>
			</Card>
		);
		
	};

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
				<Header
					statusBarProps={{ barStyle: 'light-content' }}
					barStyle='light-content' // or directly
					containerStyle={{
						backgroundColor: '#fff',
					}}
					leftComponent={TopLeftNavScreen()}
					leftContainerStyle={{ marginTop: 12 }}
					rightComponent={checkUser()}
					rightContainerStyle={{ marginTop: 12 }}
				/>
				<Header
					statusBarProps={{ barStyle: 'light-content' }}
					barStyle='light-content' // or directly
					containerStyle={{
						backgroundColor: '#1a237e',
						height: 80,
						width: imagewidth,
					}}
					leftComponent={
						<View
							style={{
								flexGrow: 1,
								flexDirection: 'row',
								marginBottom: 50,
								marginTop: 10,
								paddingVertical: 10,
								alignItems: 'flex-start',
							}}>
							<Icon.Button
								name='ios-menu'
								style={{ paddingVertical: 15 }}
								size={25}
								backgroundColor='#1a237e'
								onPress={() => navigation.openDrawer()}></Icon.Button>
							<Image
								source={require('../assets/icon.png')}
								style={{
									width: 110,
									height: 60,
									//borderRadius: 40 / 2,
								}}
							/>
						</View>
					}
					rightComponent={
						<View
							style={{
								marginTop: 10,
								flexGrow: 1,
								flexDirection: 'row',
								alignItems: 'center',
								transform: [{ translateY: -20 }],
							}}>
							<Icon.Button
								name='ios-cart'
								size={30}
								style={{ position: 'relative' }}
								color='#fff'
								backgroundColor='#1a237e'
								onPress={() => navigation.navigate('showCartitems')}>
								{fetchCartCount()}
							</Icon.Button>
						</View>
					}
				/>

				<ScrollView style={styles.scrollView}>
					<Image
						title='You are in Good Hands!'
						source={require('../assets/Encabezado_9Nov.png')}
						style={{
							width: imagewidth,
							height: 100,
						}}
					/>

					<View style={styles.servicesbox}>
						{/* <View style={styles.container}> */}

						<View style={styles.subcontainers}>
							<Grid>
								<Row>
									<Col
										style={styles.iconcontainer}
										name='Air Conditioning'
										onPress={(category, key) =>
											showcategory('Air Conditioner', 0)
										}>
										<Image
											value='Air Conditioning'
											style={styles.iconimage}
											source={require('../assets/service-icons/Air Conditioner.png')}
											Text='Air Conditioning'
										/>
										<Text accessibilityRole='button' style={[styles.icontext]}>
											Air Conditioner
										</Text>
									</Col>
									<Col
										style={styles.iconcontainer}
										name='Appliances'
										key={1}
										onPress={(category, key) => showcategory('Appliances', 1)}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Appliances.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Appliances
										</Text>
									</Col>
									<Col
										style={styles.iconcontainer}
										onPress={(category, key) =>
											showcategory('Cleaning Service', 3)
										}>
										<Image
											style={{ marginBottom: 10, width: 28, height: 28 }}
											source={require('../assets/service-icons/Cleaning Service.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Cleaning Services
										</Text>
									</Col>
								</Row>

								<Row>
									<Col
										style={styles.iconcontainer}
										onPress={(category, key) =>
											showcategory('Drill and Hang', 4)
										}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Drill and Hang.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Drill and Hang
										</Text>
									</Col>
									<Col
										style={styles.iconcontainer}
										onPress={(category, key) => showcategory('Electrician', 5)}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Electrician.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Electrician
										</Text>
									</Col>
									<Col
										style={styles.iconcontainer}
										onPress={(category, key) => showcategory('Errands', 6)}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Errands.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Errands
										</Text>
									</Col>
								</Row>

								<Row>
									<Col
										style={styles.iconcontainer}
										onPress={(category, key) =>
											showcategory('Massage Therapist', 8)
										}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Massage Therapist.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Massage Therapist
										</Text>
									</Col>
									<Col
										style={styles.iconcontainer}
										onPress={(category, key) =>
											showcategory('Personal Training', 9)
										}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Personal Training.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Personal Training
										</Text>
									</Col>
									<Col
										style={styles.iconcontainer}
										onPress={(category, key) => showcategory('Plumbing', 10)}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Plumbing.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Plumbing
										</Text>
									</Col>
								</Row>
								<Row>
									<Col
										style={styles.iconcontainer}
										onPress={(category, key) => showcategory('Remodeling', 11)}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Remodeling.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Remodeling
										</Text>
									</Col>

									<Col
										style={styles.iconcontainer}
										onPress={(category, key) => showcategory('Others', 14)}>
										<Image
											style={styles.iconimage}
											source={require('../assets/service-icons/Others.png')}
										/>
										<Text accessibilityRole='button' style={styles.icontext}>
											Others
										</Text>
									</Col>

									<Col style={styles.iconcontainer}></Col>
								</Row>
							</Grid>
						</View>
						{/* </View> */}
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
							style={{ fontSize: 18, paddingVertical: 25, fontWeight: '900' }}>
							Featured Services!
						</Text>

						<Swiper style={{ height: imageheight / 2.5 }} showsButtons={false}>
							<View>
								<Card
									style={{
										shadowColor: '#000',
										shadowOffset: { width: 0, height: 1 },
										shadowOpacity: 0.5,
										shadowRadius: 10,
										elevation: 15,
										margin: 10,
										borderRadius: 10,
									}}>
									<Card.Cover
										source={require('../assets/featured_services/product-electricity.jpg')}
									/>
									<Card.Content>
										<Text
											style={{
												textAlign: 'center',
												alignSelf: 'center',
												padding: 20,
											}}>
											Electricity
										</Text>
									</Card.Content>
								</Card>
							</View>
							<View>
								<Card
									style={{
										shadowColor: '#000',
										shadowOffset: { width: 0, height: 1 },
										shadowOpacity: 0.5,
										shadowRadius: 10,
										elevation: 15,
										margin: 10,
										borderRadius: 10,
									}}>
									<Card.Cover
										source={require('../assets/featured_services/product-electricity.jpg')}
									/>
									<Card.Content>
										<Text
											style={{
												textAlign: 'center',
												alignSelf: 'center',
												padding: 20,
											}}>
											Electricity
										</Text>
									</Card.Content>
								</Card>
							</View>
							<View>
								<Card
									style={{
										shadowColor: '#000',
										shadowOffset: { width: 0, height: 1 },
										shadowOpacity: 0.5,
										shadowRadius: 10,
										elevation: 15,
										margin: 10,
										borderRadius: 10,
									}}>
									<Card.Cover
										source={require('../assets/featured_services/product-electricity.jpg')}
									/>
									<Card.Content>
										<Text
											style={{
												textAlign: 'center',
												alignSelf: 'center',
												padding: 20,
											}}>
											Electricity
										</Text>
									</Card.Content>
								</Card>
							</View>
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
								paddingVertical: 20,
								fontWeight: '900',
							}}>
							Customer Reviews
						</Text>
						<Swiper style={{ height: imageheight / 4 }} showsButtons={false}>
							<Card style={styles.slide1}>
								<Card.Content>
									<Text style={styles.text}>ShaneSmith</Text>
									<Text
										style={{ textAlign: 'center', padding: 20, fontSize: 18 }}>
										Nice!
									</Text>
									<View
										style={{
											flexDirection: 'row',
											alignSelf: 'center',
										}}>
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
									</View>
								</Card.Content>
							</Card>
							<Card style={styles.slide1}>
								<Card.Content>
									<Text style={styles.text}>ShaneSmith</Text>
									<Text
										style={{ textAlign: 'center', padding: 20, fontSize: 18 }}>
										Nice!
									</Text>
									<View
										style={{
											flexDirection: 'row',
											alignSelf: 'center',
										}}>
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
									</View>
								</Card.Content>
							</Card>
							<Card style={styles.slide1}>
								<Card.Content>
									<Text style={styles.text}>ShaneSmith</Text>
									<Text
										style={{ textAlign: 'center', padding: 20, fontSize: 18 }}>
										Nice!
									</Text>
									<View
										style={{
											flexDirection: 'row',
											alignSelf: 'center',
										}}>
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
										<FontAwesome name='star' color='#fbc02d' size={20} />
									</View>
								</Card.Content>
							</Card>
						</Swiper>
					</View>
				</ScrollView>
			</View>
		</React.Fragment>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	iconcontainer: {
		padding: 10,
		alignItems: 'center',
	},
	iconimage: {
		width: 30,
		height: 30,
		marginBottom: 8,
	},
	icontext: {
		fontSize: 8,
		fontWeight: 'bold',
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
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 15,
		margin: 10,
		borderRadius: 10,
		borderWidth: 0.5,
		borderColor: '#000',
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
});

// const useStyles = makeStyles((theme) => ({
// 	formControl: {
// 		margin: theme.spacing(0),
// 		minWidth: 200,
// 	},
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
