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
import ModalPicker from 'react-native-modal-picker';


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
		fetch('https://www.alsocio.com/app/get-provider-branches/', {
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

	

	const [showBranchesModal, setShowBranchesModal] = useState(false);

	
	//for region
	const [regionArray, setRegionArray] = useState([]);

	const [cityArray, setCityArray] = useState([]);

	const showRegionOptions = () => {
		let item = [];
		let region_array = [];
		let showCity_array = [];
		let showRegion_array = [];
		fetch('https://www.alsocio.com/app/get-city-region/', {
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

	const [cityList, setCityList] = useState([]);


	// const [regionValue, setRegionValue] = useState();

	// const [cityValue, setCityValue] = useState();

	const showPicker = (properties) => {
		return (
			<View style={{ justifyContent: 'space-around', padding: 10 }}>
				<View style={{ padding: 10 }}>
					<ModalPicker
						data={data}
						cancelText='end'
						// style={{padding:15, backgroundColor: 'green'}}
						selectStyle={{
							padding: 27,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						cancelTextStyle={{ fontSize: 25 }}
						initValue='Seleccione región'
						onChange={(option) => {
							// alert(option.label);
							// let index1 = regionArray.indexOf(option.label);
							properties.setFieldValue('region', option.label);
							let array = [cityArray[option.key]].toString();
							let city_array = array.split(',');
							console.log(city_array);
							setCityList(city_array);
						}}
					/>
				</View>
				<View style={{ padding: 10 }}>
					<ModalPicker
						selectStyle={{
							padding: 27,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						data={city_data}
						initValue='Ciudad selecta'
						onChange={(option) => {
							properties.setFieldValue('city', option.label);
						}}
					/>
				</View>
			</View>
		);
	};

	let temp = 0;
	const data = regionArray.map((element) => {
		return { key: temp++, label: element };
	});

	let temp1 = 0;
	const city_data = cityList.map((item) => {
		return { key: temp1++, label: item };
	});


	const BranchSchema = Yup.object().shape({
		region: Yup.string().required('La región es obligatoria'),
		city: Yup.string().required('Se requiere la ciudad'),
	});

	return (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#262262',alignItems:'center', marginTop: 0 }}>
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
					<MaterialIndicator color='#262262' />
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
								fetch('https://www.alsocio.com/app/add-provider-branch/', {
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
												backgroundColor: '#262262',
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
						ListEmptyComponent={
							<View
								style={{
									flex: 1,
									backgroundColor: '#e0e0e0',
									alignItems: 'center',
									justifyContent: 'center',
									padding: 20,
								}}>
								<Text
									style={{
										fontSize: 20,
										fontWeight: '700',
									}}>
									No se proporcionan sucursales
								</Text>
							</View>
						}
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
		backgroundColor: '#262262',
		width: 50,
		height: 50,
		//backgroundColor:'black'
	},
});
