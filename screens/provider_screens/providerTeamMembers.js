import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	TouchableOpacity,
	Image,
	Modal,
} from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, IconButton, TextInput } from 'react-native-paper';
import { FlatList } from 'react-native';
import { AuthContext } from '../../components/context';
import { MaterialIndicator } from 'react-native-indicators';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const providerTeamMembers = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-provider-team-members/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setDetails(responseJson);
				console.log(responseJson)
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, []);

	const [showTeamMembersModal, setShowTeamMembersModal] = useState(false);

	const TeamMemberSchema = Yup.object().shape({
		first_name: Yup.string().required('Se requiere el primer nombre'),
		last_name: Yup.string().required('Se requiere apellido'),
		email: Yup.string()
			.email('Formato de correo inválido')
			.required('Correo electronico es requerido'),
		contact: Yup.string().required('Se requiere contacto'),
		uri: Yup.string().required('Se requiere imagen')
		// uri: Yup.string().required('Image is Required'),
	});

	let filename = null;
	let type = null;
	const uploadImage = async (properties) => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			// aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

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

	return (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#1a237e',alignItems:'center', marginTop: 0  }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Los miembros de su equipo'
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
				<View style={{ flex: 0.95 }}>
					<Modal
						animationType='fade'
						visible={showTeamMembersModal}
						transparent={true}
						onRequestClose={() => {
							setShowTeamMembersModal(!showTeamMembersModal);
						}}>
						<View
							style={{
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
										setShowTeamMembersModal(!showTeamMembersModal);
									}}></Icon.Button>
							</TouchableOpacity>
							
								<Formik
									initialValues={{
										first_name: '',
										last_name: '',
										email: '',
										contact: '',
										uri: '',
									}}
									onSubmit={(values) => {
										setIsLoading(true);
										setShowTeamMembersModal(false);
										let teamMemberDetails = new FormData();
										teamMemberDetails.append('username', a.UserName);
										teamMemberDetails.append('first_name', values.first_name);
										teamMemberDetails.append('last_name', values.last_name);
										teamMemberDetails.append('email', values.email);
										teamMemberDetails.append('contact', values.contact);
										if(values.uri==''||values.uri==null){
											teamMemberDetails.append('image', {
												uri: values.uri,
												name: '',
												type,
											});
											return;
										}
										teamMemberDetails.append('image', {
											uri: values.uri,
											name: filename,
											type,
										});
										fetch('https://alsocio.com/app/add-provider-team-member/', {
											method: 'POST',
											body: teamMemberDetails,
											headers: {
												'content-type': 'multipart/form-data',
											},
										})
											.then((response) => response.json())
											.then((responseJson) => {
												setDetails(responseJson);
												alert('Miembro del equipo agregado con éxito');
												setIsLoading(false);
											});
									}}
									validationSchema={TeamMemberSchema}>
									{(props) => (
										<View style={{ alignItems: 'center' }}>
											<View style={{ flexDirection: 'row' }}>
												<View>
													<TextInput
														style={styles.textInput}
														placeholder='Primer nombre'
														onBlur={() => props.setFieldTouched('first_name')}
														onChangeText={props.handleChange('first_name')}
														value={props.values.first_name}
													/>
													{props.touched.first_name && props.errors.first_name && (
														<Text
															style={{
																fontSize: 10,
																padding: 10,
																color: 'red',
															}}>
															{props.errors.first_name}
														</Text>
													)}
												</View>
												<View>
													<TextInput
														style={styles.textInput}
														placeholder='Apellido'
														onBlur={() => props.setFieldTouched('last_name')}
														onChangeText={props.handleChange('last_name')}
														value={props.values.last_name}
													/>
													{props.touched.last_name && props.errors.last_name && (
														<Text
															style={{
																fontSize: 10,
																padding: 10,
																color: 'red',
															}}>
															{props.errors.last_name}
														</Text>
													)}
												</View>
											</View>

											<View style={{ flexDirection: 'row' }}>
												<View>
													<TextInput
														style={styles.textInput}
														placeholder='Email'
														onBlur={() => props.setFieldTouched('email')}
														onChangeText={props.handleChange('email')}
														value={props.values.email}
													/>
													{props.touched.email && props.errors.email && (
														<Text
															style={{
																fontSize: 10,
																padding: 10,
																color: 'red',
															}}>
															{props.errors.email}
														</Text>
													)}
												</View>
												<View>
													<TextInput
														keyboardType={'numeric'}
														style={styles.textInput}
														placeholder='Número de contacto'
														onBlur={() => props.setFieldTouched('contact')}
														onChangeText={props.handleChange('contact')}
														value={props.values.contact}
													/>
													{props.touched.contact && props.errors.contact && (
														<Text
															style={{
																fontSize: 10,
																padding: 10,
																color: 'red',
															}}>
															{props.errors.contact}
														</Text>
													)}
												</View>
											</View>

											<View>
												<TouchableOpacity onPress={() => uploadImage(props)}>
													<Text
														style={{
															fontSize: 12,
															marginLeft: 10,
															marginTop: 10,
															textAlign: 'left',
															alignSelf: 'flex-start',
														}}>
														Cargar imagen
													</Text>
												</TouchableOpacity>
												<Card
													style={{
														borderWidth: 1,
														borderColor: '#ddd',
														borderRadius: 8,
														width: imagewidth / 1.5,
														margin: 10,
														fontSize: 15,
													}}
													onPress={() => uploadImage(props)}>
													<Text>{props.values.uri}</Text>
												</Card>
												{props.touched.uri && props.errors.uri && (
														<Text
															style={{
																fontSize: 10,
																padding: 10,
																color: 'red',
															}}>
															{props.errors.uri}
														</Text>
													)}

												<TouchableOpacity
													activeOpacity={0.7}
													style={{
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
						</View>
					</Modal>

					<FlatList
						data={details.team_members}
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
											padding: 15,
											borderBottomWidth: 0.45,
											flexDirection: 'row',
											alignItems: 'center',
										}}>
										<Text
											style={{
												flexGrow: 1,
												fontSize: 18,
												fontWeight: '900',
												alignSelf: 'center',
												textAlign: 'center',
											}}>
											{item.first_name + ' ' + item.last_name}
										</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Email - </Text>
										<Text style={styles.rightLabel}>{item.email}</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Contacto - </Text>
										<Text style={styles.rightLabel}>{item.contact}</Text>
									</View>
									<View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Imagen -</Text>
										{item.image != '' ? (
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
										) : (
											<Text style={styles.rightLabel}>
												No hay imagen disponible
											</Text>
										)}
									</View>
									{/* <View style={{ flexDirection: 'row', padding: 10 }}>
										<Text style={styles.leftLabel}>Servicio - </Text>
										<Text style={styles.rightLabel}>{item.service}</Text>
									</View> */}
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
									Sin miembros del equipo
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
						setShowTeamMembersModal(true);
					}}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default providerTeamMembers;

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
	textInput: {
		width: imagewidth / 3,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		fontSize: 12,
	},
});
