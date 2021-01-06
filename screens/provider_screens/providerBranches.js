import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, DataTable, IconButton } from 'react-native-paper';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { AuthContext } from '../../components/context';
import { MaterialIndicator } from 'react-native-indicators';
import { Modal } from 'react-native';
import { Formik } from 'formik';
import { Picker } from '@react-native-community/picker';
import * as Yup from 'yup';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const providerBranches = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(true);

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-provider-branches/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setDetails(responseJson.branches);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, [a.UserName]);

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

	const [showBranchesModal, setShowBranchesModal] = useState(false);

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
				{properties.touched.region && properties.errors.region && (
					<Text
						style={{
							fontSize: 10,
							padding: 10,
							color: 'red',
						}}>
						{properties.errors.region}
					</Text>
				)}
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
				{properties.touched.city && properties.errors.city && (
					<Text
						style={{
							fontSize: 10,
							padding: 10,
							color: 'red',
						}}>
						{properties.errors.city}
					</Text>
				)}
			</View>
		);
	};

	const BranchSchema = Yup.object().shape({
		region: Yup.string().required('La región es obligatoria'),
		city: Yup.string().required('Se requiere la ciudad'),
	});

	return (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#1a237e',alignItems:'center', marginTop: 0 }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Tus Ramas'
				/>
			</Appbar.Header>

			{isLoading ? (
				<View
					style={{
						padding: 20,
						alignContent: 'center',
						justifyContent: 'center',
						marginTop: 20,
					}}>
					<MaterialIndicator color='#1a237e' />
				</View>
			) : (
				<View style={{ flex: 0.99 }}>
					<Modal
						animationType='fade'
						visible={showBranchesModal}
						transparent={true}
						onRequestClose={() => {
							setShowBranchesModal(!showBranchesModal);
						}}>
						<Formik
							initialValues={{
								region: '',
								city: '',
							}}
							onSubmit={(values) => {
								setIsLoading(true);
								setShowBranchesModal(false);
								let branchDetails = new FormData();
								branchDetails.append('username', a.UserName);
								branchDetails.append('region', values.region);
								branchDetails.append('city', values.city);
								fetch('https://alsocio.com/app/add-provider-branch/', {
									method: 'POST',
									body: branchDetails,
								})
									.then((response) => response.json())
									.then((responseJson) => {
										setDetails(responseJson.branches);
										alert('Rama agregada con éxito');
										setIsLoading(false);
									});
							}}
							validationSchema={BranchSchema}>
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
												setShowBranchesModal(!showBranchesModal);
											}}>
											<Icon.Button
												name='ios-close'
												size={25}
												backgroundColor='#fff'
												color='#000'
												style={{ padding: 15, textAlign: 'right' }}
												onPress={() => {
													setShowBranchesModal(!showBranchesModal);
												}}></Icon.Button>
										</TouchableOpacity>
										{showPicker(props)}
										<TouchableOpacity
											activeOpacity={0.7}
											style={{
												alignSelf: 'center',
												borderRadius: 15,
												margin: 10,
												backgroundColor: '#1a237e',
												width: imagewidth / 1.5,
											}}
											onPress={() => {
												props.handleSubmit();
											}}>
											<Text
												style={{
													alignSelf: 'center',
													fontSize: 12,
													fontWeight: 'bold',
													margin: 15,
													color: '#fff',
												}}>
												Enviar
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							)}
						</Formik>
					</Modal>
					<FlatList
						data={details}
						style={styles.flatlist}
						keyExtractor={(item, index) => item.id}
						renderItem={({ item }) => (
							<Card
								style={{
									width: imagewidth - 20,
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.5,
									shadowRadius: 10,
									elevation: 10,
									margin: 10,
									borderRadius: 10,
									marginBottom: 20,
								}}>
								<Card.Content>
									<View
										style={{
											flexGrow: 1,
											padding: 15,
											borderBottomWidth: 0.45,
											flexDirection: 'row',
										}}>
										<Text
											style={{
												flexGrow: 1,
												fontSize: 18,
												fontWeight: '900',
												alignSelf: 'flex-start',
												textAlign: 'left',
											}}>
											Ciudad -
										</Text>
										<Text
											style={{
												fontSize: 13,
												fontWeight: '900',
												alignSelf: 'flex-end',
												textAlign: 'right',
												marginBottom: 3,
												marginLeft: 5,
											}}>
											{item.city}
										</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Región - </Text>
										<Text style={styles.rightLabel}>{item.region}</Text>
									</View>
								</Card.Content>
							</Card>
						)}
					/>
				</View>
			)}
			<TouchableOpacity
				activeOpacity={0.7}
				style={styles.touchableOpacityStyle}>
				<IconButton
					size={40}
					icon='plus'
					color='#fff'
					style={styles.floatingButtonStyle}
					onPress={() => {
						setShowBranchesModal(true);
					}}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default providerBranches;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	flatlist: {
		// flex: 1,
		padding: 0,
	},
	leftLabel: {
		fontSize: 15,
		fontWeight: '700',
		flexGrow: 1,
		alignSelf: 'flex-start',
	},
	rightLabel: {
		fontSize: 15,
		fontWeight: '700',
		flexGrow: 1,
		textAlign: 'right',
		alignSelf: 'flex-end',
	},
	touchableOpacityStyle: {
		position: 'absolute',
		zIndex: 999,
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		right: 30,
		bottom: 30,
	},
	floatingButtonStyle: {
		resizeMode: 'contain',
		backgroundColor: '#1a237e',
		width: 50,
		height: 50,
		//backgroundColor:'black'
	},
});
