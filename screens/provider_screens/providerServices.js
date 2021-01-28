import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	StatusBar,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Image,
	KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	Appbar,
	Card,
	IconButton,
	TextInput,
	Checkbox,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../components/context';
import { MaterialIndicator } from 'react-native-indicators';
import { Formik } from 'formik';
import {} from 'react-native';
import { Platform } from 'react-native';
import * as Yup from 'yup';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const providerServices = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-provider-services/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setDetails(responseJson.services);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, [a.UserName]);

	//For Main Category Picker
	const [mainCategoryArray, setMainCategoryArray] = useState([]);

	const [mainCategoryValue, setMainCategoryValue] = useState();

	const showMainCategoryArray = () => {
		fetch('https://alsocio.com/app/get-main-categories/', {
			method: 'GET',
			// body: usercategory,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setMainCategoryArray(responseJson.main_categories);
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		{
			showMainCategoryArray();
		}
	}, []);

	const mainCategoryPicker = () => {
		return mainCategoryArray.map((element) => {
			return <Picker.Item label={element} value={element} />;
		});
	};

	//for Category Picker
	const [CategoryArray, setCategoryArray] = useState([]);

	const [CategoryValue, setCategoryValue] = useState();

	const showCategoryArray = () => {
		if (mainCategoryValue != null) {
			let usercategory = new FormData();
			usercategory.append('main_category', mainCategoryValue);
			fetch('https://alsocio.com/app/get-categories-subcategories/', {
				method: 'POST',
				body: usercategory,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setCategoryArray(Object.keys(responseJson.category_subcategory_dict));
				})
				.catch((error) => console.error(error));
		}
	};

	useEffect(() => {
		showCategoryArray();
	}, [mainCategoryValue]);

	const categoryPicker = () => {
		return CategoryArray.map((element) => {
			return <Picker.Item label={element} value={element} />;
		});
	};

	//for sub-category picker
	const [subCategoryArray, setSubCategoryArray] = useState([]);

	const [subCategoryValue, setSubCategoryValue] = useState();

	const showSubCategoryArray = () => {
		if (CategoryValue != null) {
			let usercategory = new FormData();
			usercategory.append('main_category', mainCategoryValue);
			usercategory.append('category', CategoryValue);
			fetch('https://alsocio.com/app/get-sub-categories/', {
				method: 'POST',
				body: usercategory,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setSubCategoryArray(responseJson.sub_categories);
				})
				.catch((error) => console.error(error));
		}
	};

	useEffect(() => {
		showSubCategoryArray();
	}, [CategoryValue]);

	const showSubCategoryPicker = () => {
		return subCategoryArray.map((element) => {
			return <Picker.Item label={element} value={element} />;
		});
	};

	const [showAddServicesModal, setShowAddServicesModal] = useState(false);

	let filename = null;
	let type = null;
	const uploadImage = async (properties) => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			// aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			properties.setFieldValue('uri', result.uri);

			// ImagePicker saves the taken photo to disk and returns a local URI to it
			let localUri = result.uri;
			filename = localUri.split('/').pop();

			// Infer the type of the image
			let match = /\.(\w+)$/.exec(filename);
			type = match ? `image/${match[1]}` : `image`;
		}
	};

	const AddServiceSchema = Yup.object().shape({
		main_category: Yup.string().required('La categoría principal es obligatoria'),
		category: Yup.string().required('La categoria es requerida'),
		sub_category: Yup.string().required('Se requiere una subcategoría'),
		service: Yup.string().required('El nombre del servicio es obligatorio'),
		service_cost: Yup.string().required('Service Subtotal Required'),
		includes: Yup.string().required('Incluye es obligatorio'),
		uri: Yup.string().required('Se requiere imagen'),
	});

	const addService = (parameters) => {
		setIsLoading(true);
		setShowAddServicesModal(false);
		let serviceDetails = new FormData();
		serviceDetails.append('username', a.UserName);
		serviceDetails.append('maincategory', parameters.main_category);
		serviceDetails.append('category', parameters.category);
		serviceDetails.append('subcategory', parameters.sub_category);
		serviceDetails.append('service', parameters.service);
		serviceDetails.append('cost', parseFloat(parameters.service_cost));
		serviceDetails.append('image', {
			uri: parameters.uri,
			name: filename,
			type,
		});
		serviceDetails.append('include', parameters.includes);
		serviceDetails.append('description', parameters.description);
		serviceDetails.append('requirements', parameters.additional_requirements);
		serviceDetails.append('discount', parseFloat(parameters.discount));
		if (parameters.additional_charges == true) {
			serviceDetails.append('additional_charges', 'Yes');
		} else {
			serviceDetails.append('additional_charges', 'No');
		}
		fetch('https://alsocio.com/app/add-provider-service/', {
			method: 'POST',
			body: serviceDetails,
			headers: {
				'content-type': 'multipart/form-data',
			},
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setDetails(responseJson.services);
				alert('Servicio agregado exitosamente');
				setIsLoading(false);
			});
	};

	return (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#262262',alignItems:'center', marginTop: 0  }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Sus servicios agregados'
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
						visible={showAddServicesModal}
						transparent={true}
						onRequestClose={() => {
							setShowAddServicesModal(!showAddServicesModal);
						}}>
						<View
							style={{
								flex: 0.99,
								backgroundColor: '#fff',
								shadowColor: '#000',
								marginTop: 30,
								marginHorizontal: 20,
								marginBottom: 5,
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
										setShowAddServicesModal(!showAddServicesModal);
									}}></Icon.Button>
							</TouchableOpacity>
							<ScrollView style={{ flexGrow: 1, padding: 10 }}>
								<Formik
									initialValues={{
										main_category: '',
										category: '',
										sub_category: '',
										service: '',
										service_cost: '',
										discount: 0,
										additional_requirements: '',
										includes: '',
										description: '',
										uri: '',
										rating: null,
										additional_charges: false,
										social_distancing: false,
									}}
									onSubmit={(values) => {
										addService(values);
									}}
									validationSchema={AddServiceSchema}>
									{(props) => (
										<View style={{ marginBottom: 15, flex: 0.8 }}>
											{/* for showing main-Category Picker */}
											<Picker
												style={{
													marginVertical: 10,
													textAlign: 'center',
													width: imagewidth / 1.5,
													borderRadius: 10,
													backgroundColor: '#e0e0e0',
												}}
												selectedValue={mainCategoryValue}
												onValueChange={(itemValue) => {
													setMainCategoryValue(itemValue);
													props.setFieldValue('main_category', itemValue);
												}}>
												<Picker.Item
													label='Seleccionar categoría principal'
													value=''
												/>
												{mainCategoryPicker()}
											</Picker>
											{props.touched.main_category &&
												props.errors.main_category && (
													<Text
														style={{ fontSize: 10, padding: 10, color: 'red' }}>
														{props.errors.main_category}
													</Text>
												)}
											{/* for showing Category Picker */}
											<Picker
												style={{
													marginVertical: 10,
													width: imagewidth / 1.5,
													borderRadius: 10,
													backgroundColor: '#e0e0e0',
												}}
												selectedValue={CategoryValue}
												onValueChange={(itemValue) => {
													setCategoryValue(itemValue);
													props.setFieldValue('category', itemValue);
												}}>
												<Picker.Item
													label='Selecciona una categoría'
													value=''
												/>
												{categoryPicker()}
											</Picker>
											{props.touched.category && props.errors.category && (
												<Text
													style={{ fontSize: 10, padding: 10, color: 'red' }}>
													{props.errors.category}
												</Text>
											)}
											{/* for showing Sub-Category Picker */}
											<Picker
												style={{
													marginVertical: 10,
													width: imagewidth / 1.5,
													borderRadius: 10,
													backgroundColor: '#e0e0e0',
												}}
												selectedValue={subCategoryValue}
												onValueChange={(itemValue) => {
													setSubCategoryValue(itemValue);
													props.setFieldValue('sub_category', itemValue);
												}}>
												<Picker.Item
													label='Seleccionar subcategoría'
													value=''
												/>
												{showSubCategoryPicker()}
											</Picker>
											{props.touched.sub_category &&
												props.errors.sub_category && (
													<Text
														style={{ fontSize: 10, padding: 10, color: 'red' }}>
														{props.errors.sub_category}
													</Text>
												)}

											<View style={{ flexDirection: 'row', marginBottom: 5 }}>
												<View>
													<TextInput
														style={styles.textInput}
														placeholder='Nombre del Servicio'
														onBlur={() => props.setFieldTouched('service')}
														onChangeText={props.handleChange('service')}
														value={props.values.service}
													/>
													{props.touched.service && props.errors.service && (
														<Text
															style={{
																fontSize: 10,
																padding: 10,
																color: 'red',
																width: imagewidth / 4,
															}}>
															{props.errors.service}
														</Text>
													)}
												</View>
												<View>
													<TextInput
														style={styles.textInput}
														keyboardType='numeric'
														placeholder='Costo'
														onBlur={() => props.setFieldTouched('service_cost')}
														onChangeText={props.handleChange('service_cost')}
														value={props.values.service_cost}
													/>
													{props.touched.service_cost &&
														props.errors.service_cost && (
															<Text
																style={{
																	fontSize: 10,
																	padding: 10,
																	color: 'red',
																	width: imagewidth / 4,
																}}>
																{props.errors.service_cost}
															</Text>
														)}
												</View>
												<View>
													<TextInput
														style={styles.textInput}
														keyboardType='numeric'
														placeholder='Descuento'
														onBlur={() => props.setFieldTouched('discount')}
														onChangeText={props.handleChange('discount')}
														value={props.values.discount}
													/>
												</View>
											</View>

											<View style={{ flexDirection: 'row' }}>
												<View>
													<TextInput
														multiline
														minHeight={20}
														style={styles.textArea}
														placeholder='Incluye'
														onBlur={() => props.setFieldTouched('includes')}
														onChangeText={props.handleChange('includes')}
														value={props.values.includes}
													/>
													{props.touched.includes && props.errors.includes && (
														<Text
															style={{
																fontSize: 10,
																padding: 10,
																color: 'red',
																width: imagewidth / 4,
															}}>
															{props.errors.includes}
														</Text>
													)}
												</View>
												<View>
													<TextInput
														multiline
														style={styles.textArea}
														placeholder='Descripción'
														onBlur={() => props.setFieldTouched('description')}
														onChangeText={props.handleChange('description')}
														value={props.values.description}
													/>
												</View>
												<View>
													<TextInput
														multiline
														style={styles.textArea}
														placeholder='Requirements'
														onBlur={() =>
															props.setFieldTouched('additional_requirements')
														}
														onChangeText={props.handleChange(
															'additional_requirements'
														)}
														value={props.values.additional_requirements}
													/>
												</View>
											</View>
											<TouchableOpacity onPress={() => uploadImage(props)}>
												<Text
													style={{
														fontSize: 12,
														marginLeft: 10,
														marginTop: 10,
													}}>
													Cargar imagen
												</Text>
											</TouchableOpacity>
											<Card
												style={{
													borderWidth: 1,
													borderColor: '#ddd',
													borderRadius: 8,

													fontSize: 15,
													margin: 10,
												}}
												onPress={() => uploadImage(props)}>
												<Text>{props.values.uri}</Text>
											</Card>
											{props.touched.uri && props.errors.uri && (
												<Text
													style={{ fontSize: 10, padding: 10, color: 'red' }}>
													{props.errors.uri}
												</Text>
											)}
											<View style={styles.checkbox}>
												<Checkbox
													color='#262262'
													value={props.values.additional_charges}
													status={
														props.values.additional_charges === true
															? 'checked'
															: 'unchecked'
													}
													onPress={() => {
														props.setFieldValue(
															'additional_charges',
															!props.values.additional_charges
														);
													}}
												/>
												<Text style={{ margin: 8 }}>Cargos adicionales</Text>
											</View>
											<View style={styles.checkbox}>
												<Checkbox
													color='#262262'
													value={props.values.social_distancing}
													status={
														props.values.social_distancing === true
															? 'checked'
															: 'unchecked'
													}
													onPress={() => {
														props.setFieldValue(
															'social_distancing',
															!props.values.social_distancing
														);
													}}
												/>
												<Text style={{ margin: 8 }}>
													Mantener el distanciamiento social
												</Text>
											</View>
											<TouchableOpacity
												activeOpacity={0.7}
												style={{
													borderRadius: 20,
													fontSize: 15,
													margin: 10,
													backgroundColor: '#262262',
												}}
												onPress={() => {
													props.handleSubmit();
												}}>
												<Text
													style={{
														alignSelf: 'center',
														fontSize: 15,
														fontWeight: 'bold',
														margin: 15,
														color: '#fff',
													}}>
													Enviar
												</Text>
											</TouchableOpacity>
										</View>
									)}
								</Formik>
							</ScrollView>
						</View>
					</Modal>

					<FlatList
						data={details}
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
												marginTop: 15,
												textAlign: 'center',
											}}>
											{item.company_name}
										</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Categoria principal -</Text>
										<Text style={styles.rightLabel}>{item.main_category}</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Categoría -</Text>
										<Text style={styles.rightLabel}>{item.category}</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Subcategoría -</Text>
										<Text style={styles.rightLabel}>{item.sub_category}</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Servicio -</Text>
										<Text style={styles.rightLabel}>{item.service}</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Costo del servicio -</Text>
										<Text style={styles.rightLabel}>${item.service_cost}</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Descuento - </Text>
										<Text style={styles.rightLabel}>${item.discount}</Text>
									</View>
									<View
										style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>
											Requerimientos adicionales-
										</Text>
										<Text
											style={
												(styles.rightLabel,
												{ width: imagewidth / 3.5, fontSize: 15 })
											}>
											{item.additional_requirements}
										</Text>
									</View>
									<View
										style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Incluye- </Text>
										<Text
											style={
												(styles.rightLabel,
												{ width: imagewidth / 3.5, fontSize: 15 })
											}>
											{item.includes}
										</Text>
									</View>
									<View
										style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Descripción- </Text>
										<Text
											style={
												(styles.rightLabel,
												{ width: imagewidth / 3.5, fontSize: 15 })
											}>
											{item.description}
										</Text>
									</View>
									<View
										style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Imagen -</Text>
										<Image
											style={{
												flexGrow: 1,
												width: 100,
												height: 100,
												marginBottom: 10,
											}}
											source={{
												uri: 'https:alsocio.com/media/' + item.img,
											}}
										/>
									</View>
									<View
										style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Calificaciones</Text>
										<Text style={styles.rightLabel}>{item.rating}</Text>
									</View>
									{item.additional_charges == true ? (
										<Text
											style={{
												fontSize: 10,
												padding: 10,
												color: 'red',
												flexGrow: 1,
												textAlign: 'right',
												alignSelf: 'flex-end',
											}}>
											*Puden aplicarse cargos adicionales
										</Text>
									) : null}
								</Card.Content>
							</Card>
						)}
						// extraData={cartCount}
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
									No se agregaron servicios!
								</Text>
							</View>
						}
					/>
				</View>
			)}
			<TouchableOpacity
				activeOpacity={0.7}
				// onPress={clickHandler}
				style={styles.touchableOpacityStyle}>
				<IconButton
					size={40}
					icon='plus'
					color='#fff'
					style={styles.floatingButtonStyle}
					onPress={() => {
						setShowAddServicesModal(true),
							setMainCategoryValue(''),
							setCategoryArray([]),
							setSubCategoryArray([]);
					}}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default providerServices;

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
		fontWeight: '500',
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
	checkbox: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
	},
	textInput: {
		width: imagewidth / 4,
		textAlign: 'left',
		height: 40,
		borderWidth: 0.5,
		fontSize: 10,
		fontWeight: '800',
		color: '#000',
	},
	textArea: {
		width: imagewidth / 4,
		textAlign: 'left',
		height: 60,
		borderWidth: 0.5,
		fontSize: 10,
		fontWeight: '800',
		color: '#000',
	},
});
