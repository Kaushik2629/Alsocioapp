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
	TouchableOpacity,
	Modal,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { MaterialIndicator } from 'react-native-indicators';
import { Appbar, Card,TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../components/context';
const imagewidth = Dimensions.get('screen').width;

const providerPaymentDetails = ({ navigation }) => {
	const a = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(true);
	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-provider-payout-details/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setDetails(responseJson.payout);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, [a.UserName]);

	const showPaymentDetails = () => {
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
		return (
		
					// <View
					// 	style={{
					// 		marginTop: 0,
					// 	}}>
						<View
							style={{
								backgroundColor: '#fff',
								shadowColor: '#000',
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
							<Formik
								enableReinitialize
								initialValues={{
									account_name: `${details.account_name}`,
									bank_name: `${details.bank_name}`,
									account_type: `${details.account_type}`,
									account_number: `${details.account_number}`,
									ruc: `${details.ruc}`,
								}}
								onSubmit={(values) => {
									setIsLoading(true)
									let userdetails = new FormData();
									userdetails.append('username', a.UserName);
									userdetails.append('account_name', values.account_name);
									userdetails.append('bank_name', values.bank_name);
									userdetails.append('account_type', values.account_type);
									userdetails.append('account_number', values.account_number);
									userdetails.append('ruc', values.ruc);
									fetch('https://alsocio.com/app/update-provider-payout-details/', {
										method: 'POST',
										body: userdetails,
									})
										.then((response) => response.json())
										.then((responseJson) => {
											setIsLoading(false)
											setDetails(responseJson.payout);
										})
										.catch((error) => console.error(error));
								}}
                                >
								{(props) => (
									<View>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
											Nombre de la cuenta
											</Text>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Nombre del banco
											</Text>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={props.values.account_name}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('account_name')}
												onChangeText={props.handleChange('account_name')}
												value={props.values.account_name}
											/>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={props.values.bank_name}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('bank_name')}
												onChangeText={props.handleChange('bank_name')}
												value={props.values.bank_name}
											/>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Número de cuenta
											</Text>
											<Text
												style={{
													flexGrow: 1,
													paddingHorizontal: 20,
													alignSelf: 'center',
												}}>
												Tipo de cuenta
											</Text>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={props.values.account_number}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('account_number')}
												onChangeText={props.handleChange('account_number')}
												value={props.values.account_number}
												keyboardType={'numeric'}
											/>
											<TextInput
												placeholderTextColor={'#000'}
												placeholder={props.values.account_type}
												style={styles.textInput}
												onBlur={() => props.setFieldTouched('account_type')}
												onChangeText={props.handleChange('account_type')}
												value={props.values.account_type}
											/>
										</View>
										<Text style={{ alignSelf: 'center' }}>RUC</Text>
										<TextInput
											placeholderTextColor={'#000'}
											placeholder={props.values.ruc}
											style={{
												margin: 10,
												textAlign: 'center',
												paddingLeft: 10,
												height: 40,
												borderColor: '#262262',
												borderWidth: 1,
												fontSize: 10,
												fontWeight: 'bold',
												color: '#000',
											}}
											onBlur={() => props.setFieldTouched('ruc')}
											onChangeText={props.handleChange('ruc')}
											value={props.values.ruc}
										/>
										
										<TouchableOpacity
											activeOpacity={0.7}
											style={{
												borderRadius: 20,
												fontSize: 15,
												margin: 15,
												backgroundColor: '#262262',
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
												Guardar cambios
											</Text>
										</TouchableOpacity>										
									</View>
								)}
							</Formik>
						</View>
					// </View>
			
		);
	};

	return (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#262262',alignItems:'center', marginTop: 0  }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Detalles de pago'
				/>
			</Appbar.Header>
			<View style={{marginTop:15}}>
			{showPaymentDetails()}
			</View>
		</View>
	);
};

export default providerPaymentDetails;

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
		width: imagewidth/2.7,
		margin: 10,
		textAlign: 'left',
		paddingLeft: 10,
		height: 40,
		borderColor: '#262262',
		borderWidth: 1,
		fontSize: 10,
		fontWeight: 'bold',
		color: '#000',
	},
});

