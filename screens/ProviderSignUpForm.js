import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	TouchableOpacity,
	Dimensions,
	TextInput,
	StyleSheet,
	Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Checkbox } from 'react-native-paper';
import { Field, Formik } from 'formik';
import * as Animatable from 'react-native-animatable';
import * as Yup from 'yup';
import { Picker } from '@react-native-community/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { UIActivityIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const ProvderSignUpForm = (props) => {

	const [isLoading, setIsLoading] = useState(false);

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
			showRegionOptions();
		}
	}, []);

	const [showPickerModal, setShowPickerModal] = useState(false);

	const [regionValue, setRegionValue] = useState();

	const [cityValue, setCityValue] = useState();

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
			<View style={{ flexDirection: 'row' }}>
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

	const regionDivision = () => {
		return cityValue == null ? (
			<TouchableOpacity
				style={styles.textInput}
				onPress={() => setShowPickerModal(true)}>
				<Text style={{ fontSize: 12, marginLeft: 10, marginTop: 10 }}>
					Select Your Region and City!
				</Text>
			</TouchableOpacity>
		) : (
			<TouchableOpacity
				style={styles.textInput}
				onPress={() => setShowPickerModal(true)}>
				<Text style={{ fontSize: 12, marginLeft: 10, marginTop: 10 }}>
					{regionValue},{cityValue}
				</Text>
			</TouchableOpacity>
		);
	};

	const [OTP, setOtp] = useState();

	const sendOtp = (properties) => {
		setIsLoading(true)
		if (properties.values.username == '' || properties.values.email == '') {
			alert('Email/Username is empty');
			return;
		}
		let register = new FormData();
		register.append('username', properties.values.username);
		register.append('email', properties.values.email);
		fetch('https://alsocio.geop.tech/app/send-otp/', {
			method: 'POST',
			body: register,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false)
				if (responseJson.user == 'OTP sent successfully') {
                    console.log(responseJson)
					setOtp(responseJson.otp);
					alert(responseJson.user);
				} else {
					alert(responseJson.user);
				}
			});
	};

	const [conditions, setConditions] = useState(false);

	const [giveEmails, setGiveEmails] = useState(false);

	const ProviderSignUpSchema = Yup.object().shape({
		company_name: Yup.string().required(' Company Name is Required'),
		first_name: Yup.string().required(' First Name is Required'),
		last_name: Yup.string().required('Last Name is Required'),
		region: Yup.string().required('Please Select Your Location'),
		city: Yup.string().required('Please Select Your City'),
		contact: Yup.string().min(5, 'Invalid!').required('Contact is Required'),
		username: Yup.string().required('Username is Required'),
		email: Yup.string().email('Invalid email').required('Required'),
		password: Yup.string()
			.required('No password provided.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		confirm_password: Yup.string()
			.required('Required.')
			.test('passwords-match', 'Passwords do not match!', function (
				value
			) {
				return this.parent.password === value;
			}),
		otp: Yup.string().required('No OTP provided.').min(4, 'Invalid Otp'),
	});

	const registerProvider = (parameters) => {
		setIsLoading(true)
		let userDetails = new FormData();
		userDetails.append('company_name', parameters.company_name);
		userDetails.append('first_name', parameters.first_name);
		userDetails.append('last_name', parameters.last_name);
		userDetails.append('city', parameters.city);
		userDetails.append('region', parameters.region);
		userDetails.append('email', parameters.email);
		userDetails.append('username', parameters.username);
		userDetails.append('password', parameters.confirm_password);
		userDetails.append('contact', parameters.contact);
		fetch('https://alsocio.geop.tech/app/provider-signup/', {
			method: 'POST',
			body: userDetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false)
				if (responseJson.signup == 'successful') {
                    console.log(responseJson)
					props.navigation.navigate('SignInScreen');
				}
			});
	};
	return (
		<View style={styles.container}>
			{isLoading ? (
				<Animatable.View
					style={{
						flex: 1,
						padding: 20,
						alignContent: 'center',
						justifyContent: 'center',
						alignSelf: 'center',
						padding: 20,
						marginTop: 50,
					}}>
					<UIActivityIndicator color='#1a237e' />
				</Animatable.View>
			) : null}
            <Text
					style={{
						marginTop:20,
						width: imagewidth,
						backgroundColor: '#0d47a1',
						textAlign: 'center',
                        padding: 20,
                        color:'#fff'
					}}>
					Provider Registration
				</Text>
			<Formik
				initialValues={{
					company_name: '',
					first_name: '',
					last_name: '',
					region: '',
					city: '',
					contact: '',
					username: '',
					email: '',
					otp: '',
					password: '',
					confirm_password: '',
					terms_conditions: false,
					email_updates: false,
				}}
				onSubmit={(values) => {
					registerProvider(values);
				}}
				validationSchema={ProviderSignUpSchema}>
				{(props) => (
					<Card style={styles.card}>
						<View style={{ marginTop: 15 }}>
							<ScrollView style={{ margin: 20 }}>
								<TextInput
									placeholder='Company Name'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('company_name')}
									onChangeText={props.handleChange('company_name')}
									value={props.values.company_name}
								/>
								{props.touched.company_name && props.errors.company_name && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.company_name}
									</Text>
								)}
								<TextInput
									placeholder='First Name'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('first_name')}
									onChangeText={props.handleChange('first_name')}
									value={props.values.first_name}
								/>
								{props.touched.first_name && props.errors.first_name && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.first_name}
									</Text>
								)}

								<TextInput
									placeholder='Last Name'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('last_name')}
									onChangeText={props.handleChange('last_name')}
									value={props.values.last_name}
								/>
								{props.touched.last_name && props.errors.last_name && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.last_name}
									</Text>
								)}
								{regionDivision()}
								{props.touched.region && props.errors.region && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.region}
									</Text>
								)}
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
												onPress={() => setShowPickerModal(!showPickerModal)}
											/>
										</View>
									</View>
								</Modal>

								<TextInput
									placeholder='Enter Contact'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('contact')}
									onChangeText={props.handleChange('contact')}
									value={props.values.contact}
									keyboardType={'numeric'}
								/>
								{props.touched.contact && props.errors.contact && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.contact}
									</Text>
								)}

								<TextInput
									placeholder='Enter UserName'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('username')}
									onChangeText={props.handleChange('username')}
									value={props.values.username}
								/>
								{props.touched.username && props.errors.username && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.username}
									</Text>
								)}

								<TextInput
									placeholder='Enter Email-Id'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('email')}
									onChangeText={props.handleChange('email')}
									value={props.values.email}
								/>
								{props.touched.email && props.errors.email && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.email}
									</Text>
								)}

								<TouchableOpacity
									style={styles.otp}
									onPress={() => {
										if(props.touched.email && props.errors.email){
											alert('Please enter a valid email!')
											return
										}
										sendOtp(props);
									}}>
									<Text
										style={[
											styles.textSign,
											{
												color: '#fff',
											},
										]}>
										Send Otp
									</Text>
								</TouchableOpacity>

								<TextInput
									placeholder='Enter OTP'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('otp')}
									onChangeText={props.handleChange('otp')}
									value={props.values.otp}
								/>
								{props.touched.otp && props.errors.otp && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.otp}
									</Text>
								)}

								<TextInput
									placeholder='Enter Password'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('password')}
									onChangeText={props.handleChange('password')}
									value={props.values.password}
									secureTextEntry={true}
								/>
								{props.touched.password && props.errors.password && (
									<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
										{props.errors.password}
									</Text>
								)}

								<TextInput
									placeholder='Confirm your Password'
									style={styles.textInput}
									onBlur={() => props.setFieldTouched('confirm_password')}
									onChangeText={props.handleChange('confirm_password')}
									value={props.values.confirm_password}
									secureTextEntry={true}
								/>
								{props.touched.confirm_password &&
									props.errors.confirm_password && (
										<Text style={{ fontSize: 10, padding: 10, color: 'red' }}>
											{props.errors.confirm_password}
										</Text>
									)}
								<View style={styles.checkbox}>
									<Checkbox
										color='#1a237e'
										value={props.values.terms_conditions}
										status={conditions === true ? 'checked' : 'unchecked'}
										onPress={() => {
											setConditions(!conditions),
												props.setFieldValue('terms_conditions', true);
										}}
									/>
									<Text style={styles.label}>Accept Terms and Conditions</Text>
								</View>
								<View style={styles.checkbox}>
									<Checkbox
										color='#1a237e'
										value={props.values.email_updates}
										status={giveEmails === true ? 'checked' : 'unchecked'}
										onPress={() => {
											setGiveEmails(!giveEmails),
												props.setFieldValue('email_updates', true);
										}}
									/>
									<Text style={styles.label}>
										I would like to get updates and promotions by Email
									</Text>
								</View>
								<TouchableOpacity
									style={styles.signIn}
									onPress={() => {
										if (props.values.otp == OTP) {
											props.handleSubmit();
										} else {
											alert('Please check OTP');
										}
									}}>
									<View style={styles.signIn}>
										<Text
											style={[
												styles.textSign,
												{
													color: '#fff',
												},
											]}>
											Sign Up
										</Text>
									</View>
								</TouchableOpacity>
							</ScrollView>
						</View>
					</Card>
				)}
			</Formik>
		</View>
	);
};
export default ProvderSignUpForm;

const styles = StyleSheet.create({
	container: {
		flex: 0.95,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom:5
	},
	text_header: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 30,
	},
	text_footer: {
		color: '#05375a',
		fontSize: 18,
	},
	action: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomColor: '#f2f2f2',
		paddingBottom: 5,
	},
	textInput: {
		margin: 10,
		textAlign: 'left',
		paddingLeft: 10,
		height: 40,
		borderColor: '#1a237e',
		borderWidth: 1,
		borderRadius: 15,
	},
	button: {
		alignItems: 'center',
		marginTop: 50,
	},

	textSign: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	textPrivate: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 20,
	},
	color_textPrivate: {
		color: 'grey',
	},
	otp: {
		width: '40%',
		height: 50,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1a237e',
		marginVertical: 25,
		borderRadius: 20,
	},
	card: {
		width: imagewidth - 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 10,
		elevation: 15,
		borderRadius: 10,
	},
	checkbox: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
	},
	label: {
		margin: 8,
	},
	signIn: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		backgroundColor: '#1a237e',
	},
});


