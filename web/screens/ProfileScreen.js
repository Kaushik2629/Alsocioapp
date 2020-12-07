import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
	Modal,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Appbar, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../components/context';

const imagewidth = Dimensions.get('screen').width;

const ProfileScreen = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.geop.tech/app/get-profile/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setDetails(responseJson);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, []);

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
	};

	useEffect(() => {
		{
			if (a.UserName != null) {
				showRegionOptions();
			}
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

	return a.UserName != null ? (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#1a237e' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Profile'
					subtitleStyle={{ marginBottom: 5 }}
				/>
				<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />
			</Appbar.Header>
			{a.Role == 'Customer' ? (
				<ScrollView>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 10,
						}}>
						<Card style={styles.card}>
							<Card.Content>
								<View
									style={{ flexGrow: 1, padding: 15, borderBottomWidth: 0.45 }}>
									<Text
										style={{
											fontSize: 18,
											fontWeight: '900',
											alignSelf: 'center',
										}}>
										{details.first_name} {details.last_name}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Email
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.email}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Contact
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.contact}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										City
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.city}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Region
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.region}
									</Text>
								</View>
							</Card.Content>
						</Card>
					</View>

					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 10,
							marginBottom: 20,
						}}>
						<Card style={styles.card}>
							<Card.Content>
								<Formik
									enableReinitialize
									initialValues={{
										first_name: `${details.first_name}`,
										last_name: `${details.last_name}`,
										email: `${details.email}`,
										region: `${details.region}`,
										city: `${details.city}`,
										contact: `${details.contact}`,
									}}
									onSubmit={(values) => {
										let userdetails = new FormData();
										userdetails.append('username', a.UserName);
										userdetails.append('first_name', values.first_name);
										userdetails.append('last_name', values.last_name);
										userdetails.append('contact', values.contact);
										userdetails.append('region', values.region);
										userdetails.append('city', values.city);
										fetch('https://alsocio.geop.tech/app/update-profile/', {
											method: 'POST',
											body: userdetails,
										})
											.then((response) => response.json())
											.then((responseJson) => {
												setDetails(responseJson);
											
											})
											.catch((error) => console.error(error));
									}}>
									{(props) => (
										<View>
											<View style={{ flexDirection: 'row' }}>
												<TextInput
													placeholderTextColor={'#000'}
													placeholder={details.first_name}
													style={styles.textInput}
													onBlur={() => props.setFieldTouched('first_name')}
													onChangeText={props.handleChange('first_name')}
													value={props.values.first_name}
												/>
												<TextInput
													placeholderTextColor={'#000'}
													placeholder={details.last_name}
													style={styles.textInput}
													onBlur={() => props.setFieldTouched('last_name')}
													onChangeText={props.handleChange('last_name')}
													value={props.values.last_name}
												/>
											</View>
											<View style={{ flexDirection: 'row' }}>
												<TextInput
													placeholderTextColor={'#000'}
													placeholder={`${details.contact}`}
													style={styles.textInput}
													onBlur={() => props.setFieldTouched('contact')}
													onChangeText={props.handleChange('contact')}
													value={props.values.contact}
													keyboardType={'numeric'}
												/>
												<TextInput
													placeholderTextColor={'#000'}
													placeholder={details.email}
													style={styles.textInput}
													onBlur={() => props.setFieldTouched('email')}
													onChangeText={props.handleChange('email')}
													value={props.values.email}
													keyboardType={'email-address'}
												/>
											</View>

											<TouchableOpacity
												onPress={() => setShowPickerModal(true)}
												style={styles.regionOptions}>
												<Text>{props.values.city}</Text>
											</TouchableOpacity>

											<TouchableOpacity
												style={{
													borderRadius: 20,
													fontSize: 15,
													margin: 15,
													backgroundColor: '#1a237e',
												}}
												onPress={() => props.handleSubmit()}>
												<Text
													style={{
														alignSelf: 'center',
														fontSize: 15,
														fontWeight: 'bold',
														margin: 15,
														color: '#fff',
														flexGrow: 1,
													}}>
													Edit Profile?
												</Text>
											</TouchableOpacity>

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
														{showPicker(props)}
														<Button
															title='Submit'
															color='#1a237e'
															style={{
																borderRadius: 20,
																fontSize: 15,
															}}
															onPress={() =>
																setShowPickerModal(!showPickerModal)
															}
														/>
													</View>
												</View>
											</Modal>
										</View>
									)}
								</Formik>
							</Card.Content>
						</Card>
					</View>
				</ScrollView>
			) : (
				<ScrollView>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 10,
						}}>
						<Card style={styles.card}>
							<Card.Content>
								<View
									style={{ flexGrow: 1, padding: 15, borderBottomWidth: 0.45 }}>
									<Text
										style={{
											fontSize: 18,
											fontWeight: '900',
											alignSelf: 'center',
										}}>
										{details.first_name} {details.last_name}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Email
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.email}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Contact
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.contact}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										City
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.city}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Region
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.region}
									</Text>
								</View>
								<View style={styles.info}>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-start',
											textAlign: 'left',
										}}>
										Company Name
									</Text>
									<Text
										style={{
											flexGrow: 1,
											alignSelf: 'flex-end',
											textAlign: 'right',
										}}>
										{details.company_name}
									</Text>
								</View>
							</Card.Content>
						</Card>
					</View>

					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 10,
							marginBottom: 20,
						}}>
						<Card style={styles.card}>
							<Card.Content>
								<Formik
									enableReinitialize
									initialValues={{
										first_name: `${details.first_name}`,
										last_name: `${details.last_name}`,
										email: `${details.email}`,
										region: `${details.region}`,
										city: `${details.city}`,
										contact: `${details.contact}`,
										companyName: `${details.company_name}`,
									}}
									onSubmit={(values) => {
										let userdetails = new FormData();
										userdetails.append('username', a.UserName);
										userdetails.append('first_name', values.first_name);
										userdetails.append('last_name', values.last_name);
										userdetails.append('contact', values.contact);
										userdetails.append('region', values.region);
										userdetails.append('city', values.city);
										userdetails.append('company_name', values.companyName);
										fetch('https://alsocio.geop.tech/app/update-profile/', {
											method: 'POST',
											body: userdetails,
										})
											.then((response) => response.json())
											.then((responseJson) => {
												setDetails(responseJson);
										
											})
											.catch((error) => console.error(error));
									}}>
									{(props) => (
										<View>
											<View style={{ flexDirection: 'row' }}>
												<TextInput
													placeholderTextColor={'#000'}
													placeholder={details.first_name}
													style={styles.textInput}
													onBlur={() => props.setFieldTouched('first_name')}
													onChangeText={props.handleChange('first_name')}
													value={props.values.first_name}
												/>
												<TextInput
													placeholderTextColor={'#000'}
													placeholder={details.last_name}
													style={styles.textInput}
													onBlur={() => props.setFieldTouched('last_name')}
													onChangeText={props.handleChange('last_name')}
													value={props.values.last_name}
												/>
											</View>
											<View style={{ flexDirection: 'row' }}>
												<TextInput
													placeholderTextColor={'#000'}
													placeholder={`${details.contact}`}
													style={styles.textInput}
													onBlur={() => props.setFieldTouched('contact')}
													onChangeText={props.handleChange('contact')}
													value={props.values.contact}
													keyboardType={'numeric'}
												/>
												<TextInput
													placeholderTextColor={'#000'}
													placeholder={details.email}
													style={styles.textInput}
													onBlur={() => props.setFieldTouched('email')}
													onChangeText={props.handleChange('email')}
													value={props.values.email}
													keyboardType={'email-address'}
												/>
											</View>

											<TextInput
												placeholderTextColor={'#000'}
												placeholder={details.company_name}
												style={{
													margin: 10,
													textAlign: 'center',
													paddingLeft: 10,
													height: 40,
													borderColor: '#1a237e',
													borderWidth: 1,
													borderRadius: 15,
													fontSize: 10,
													fontWeight: 'bold',
													color: '#000',
												}}
												onBlur={() => props.setFieldTouched('companyName')}
												onChangeText={props.handleChange('companyName')}
												value={props.values.companyName}
											/>

											<TouchableOpacity
												onPress={() => setShowPickerModal(true)}
												style={styles.regionOptions}>
												<Text>{props.values.city}</Text>
											</TouchableOpacity>

											<TouchableOpacity
												style={{
													borderRadius: 20,
													fontSize: 15,
													margin: 15,
													backgroundColor: '#1a237e',
												}}
												onPress={() => props.handleSubmit()}>
												<Text
													style={{
														alignSelf: 'center',
														fontSize: 15,
														fontWeight: 'bold',
														margin: 15,
														color: '#fff',
														flexGrow: 1,
													}}>
													Edit Profile?
												</Text>
											</TouchableOpacity>

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
														{showPicker(props)}
														<Button
															title='Submit'
															color='#1a237e'
															style={{
																borderRadius: 20,
																fontSize: 15,
															}}
															onPress={() =>
																setShowPickerModal(!showPickerModal)
															}
														/>
													</View>
												</View>
											</Modal>
										</View>
									)}
								</Formik>
							</Card.Content>
						</Card>
					</View>
				</ScrollView>
			)}
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Appbar.Header style={{ backgroundColor: '#1a237e' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Profile'
					subtitleStyle={{ marginBottom: 5 }}
				/>
				<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />
			</Appbar.Header>
			<View>
				<TouchableOpacity
					style={{
						borderRadius: 20,
						fontSize: 15,
						margin: 15,
						backgroundColor: '#1a237e',
					}}
					onPress={() => navigation.navigate('SignInScreen')}>
					<Text
						style={{
							alignSelf: 'center',
							fontSize: 15,
							fontWeight: 'bold',
							margin: 15,
							color: '#fff',
							flexGrow: 1,
						}}>
						Login to view your Profile
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	card: {
		width: imagewidth - 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 10,
		borderRadius: 10,
	},
	info: {
		flexDirection: 'row',
		paddingVertical: 15,
	},
	textInput: {
		width: 150,
		margin: 10,
		textAlign: 'left',
		paddingLeft: 10,
		height: 40,
		borderColor: '#1a237e',
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 10,
		fontWeight: 'bold',
		color: '#000',
	},
	regionOptions: {
		flexGrow: 1,
		height: 40,
		borderColor: '#1a237e',
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 10,
		fontWeight: 'bold',
		color: '#000',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#e0e0e0',
		marginTop: 20,
	},
});
