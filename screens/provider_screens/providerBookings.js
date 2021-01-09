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
} from 'react-native';
import { Picker } from '@react-native-community/picker';

import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import { AuthContext } from '../../components/context';
import { Formik } from 'formik';
import { MaterialIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const providerBookings = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-provider-bookings/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setDetails(responseJson.bookings);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, []);

	const [teamMembers, setTeamMembers] = useState([]);

	const fetchTeamMembers = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-provider-team-members/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setTeamMembers(responseJson.team_members);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchTeamMembers();
		}
	}, []);

	const [showPickerModal, setShowPickerModal] = useState(false);

	const [confirm, setConfirm] = useState(false);

	const deleteBooking = (bookingId, username) => {
		if (confirm) {
			setIsLoading(true);
			let bookingdetails = new FormData();
			bookingdetails.append('booking_id', bookingId);
			bookingdetails.append('username', username);
			fetch('https://alsocio.com/app/reject-booking/', {
				method: 'POST',
				body: bookingdetails,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setIsLoading(false);
					setDetails(responseJson.bookings);
				})
				.catch((error) => console.error(error));
		}
	};

	const [showEditModal, setShowEditModal] = useState(false);

	const [bookingId, setBookingId] = useState();

	const [teamMemberValue, setTeamMemberValue] = useState();

	const pickeritem = (teamMemberArray) => {
		let q = [...teamMemberArray];
		return q.map((element) => {
			return (
				<Picker.Item
					label={element.first_name + ' ' + element.last_name}
					value={element.id}
				/>
			);
		});
	};

	const [chargesModal, setChargesModal] = useState(false);

	const [completedModal, setCompletedModal] = useState(false);

	const showButtons = (bookingStatus, bookingId, Username) => {
		if (bookingStatus == null) {
			return (
				<View
					style={{ flexGrow: 1, flexDirection: 'row', paddingVertical: 10 }}>
					<TouchableOpacity
						style={{
							backgroundColor: '#1a237e',
							width: imagewidth / 3.65,
							height: 56,
							marginBottom: 5,
							borderRadius: 5,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={() => {
							setBookingId(bookingId), setShowEditModal(true);
						}}>
						<Text
							style={{
								color: '#fff',
								alignSelf: 'center',
								textAlign: 'center',
							}}>
							Aceptar
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: '#d32f2f',
							width: imagewidth / 3.65,
							height: 56,
							marginBottom: 5,
							borderRadius: 5,
							marginLeft: 10,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={() => {
							setBookingId(bookingId), setShowPickerModal(true);
						}}>
						<Text
							style={{
								color: '#fff',
								alignSelf: 'center',
								textAlign: 'center',
							}}>
							Cancelar reserva
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: '#e0e0e0',
							width: imagewidth / 3.65,
							height: 56,
							marginBottom: 5,
							borderRadius: 5,
							marginLeft: 10,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={() => {
							navigation.navigate('providerChatContainer', {
								customer_name: Username,
								booking_id: bookingId,
							});
						}}>
						<Icon
							name='ios-chatbubbles'
							size={25}
							backgroundColor='#e0e0e0'
							color='#bdbdbd'
							style={{ padding: 15, textAlign: 'right' }}
						/>
					</TouchableOpacity>
				</View>
			);
		}
		if (bookingStatus == 'Accepted') {
			return (
				<View
					style={{ flexGrow: 1, flexDirection: 'row', paddingVertical: 10 }}>
					<TouchableOpacity
						style={{
							backgroundColor: '#1a237e',
							width: imagewidth / 3.65,
							height: 56,
							marginBottom: 5,
							borderRadius: 5,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={() => {
							setBookingId(bookingId), setCompletedModal(true);
						}}>
						<Text
							style={{
								color: '#fff',
								alignSelf: 'center',
								textAlign: 'center',
							}}>
							Terminado
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: '#1a237e',
							width: imagewidth / 3.65,
							height: 56,
							marginBottom: 5,
							borderRadius: 5,
							marginLeft: 10,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={() => {
							setBookingId(bookingId), setChargesModal(true);
						}}>
						<Text
							style={{
								color: '#fff',
								alignSelf: 'center',
								textAlign: 'center',
							}}>
							Editar
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: '#e0e0e0',
							width: imagewidth / 3.65,
							height: 56,
							marginBottom: 5,
							borderRadius: 5,
							marginLeft: 10,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={() => {
							navigation.navigate('providerChatContainer', {
								customer_name: Username,
								booking_id: bookingId,
							});
						}}>
						<Icon
							name='ios-chatbubbles'
							size={25}
							backgroundColor='#e0e0e0'
							color='#bdbdbd'
							style={{ padding: 15, textAlign: 'right' }}
						/>
					</TouchableOpacity>
				</View>
			);
		}
		if (bookingStatus == 'Completed') {
			return (
				<Text
					style={{
						flexGrow: 1,
						fontSize: 18,
						fontWeight: '900',
						textAlign: 'center',
					}}>
					Terminado!
				</Text>
			);
		}
		if (bookingStatus == 'Rejected') {
			return null;
		}
	};

	const [askAgain, setAskAgain] = useState(false);

	const completeBooking = (bookingId, username) => {
		if (askAgain) {
			setCompletedModal(!completedModal);
			setIsLoading(true);
			let bookingdetails = new FormData();
			bookingdetails.append('booking_id', bookingId);
			bookingdetails.append('username', username);
			fetch('https://alsocio.com/app/complete-booking/', {
				method: 'POST',
				body: bookingdetails,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setIsLoading(false);
					setDetails(responseJson.bookings);
				})
				.catch((error) => console.error(error));
		}
	};

	return (
		<View style={styles.container}>
			<Appbar.Header
				style={{
					backgroundColor: '#1a237e',
					alignItems: 'center',
					marginTop: 0,
				}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content titleStyle={{ padding: 10 }} title='Tus Reservas' />
			</Appbar.Header>

			<Modal
				animationType='fade'
				visible={chargesModal}
				transparent={true}
				onRequestClose={() => {
					setChargesModal(!chargesModal);
				}}>
				<View
					style={{
						backgroundColor: '#fff',
						shadowColor: '#000',
						marginTop: 60,
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
								setChargesModal(!chargesModal);
							}}></Icon.Button>
					</TouchableOpacity>
					<Formik
						initialValues={{ additionalcost: '' }}
						onSubmit={(values) => {
							setIsLoading(true);
							setChargesModal(!chargesModal);
							let quoteDetails = new FormData();
							quoteDetails.append('username', a.UserName);
							quoteDetails.append('booking_id', bookingId);
							quoteDetails.append('additional_charges', values.additionalcost);
							fetch('https://alsocio.com/app/additional-charges/', {
								method: 'POST',
								body: quoteDetails,
							})
								.then((response) => response.json())
								.then((responseJson) => {
									setIsLoading(false);
									setDetails(responseJson.bookings);
								})
								.catch((error) => console.error(error));
						}}>
						{(props) => (
							<View>
								<TextInput
									minHeight={20}
									style={{
										borderWidth: 1,
										borderColor: '#ddd',
										borderRadius: 8,
										padding: 10,
										fontSize: 15,
										margin: 10,
										marginBottom: 20,
									}}
									placeholder='Enter Additional Cost'
									onChangeText={props.handleChange('additionalcost')}
									value={props.values.additionalcost}
									keyboardType={'numeric'}
								/>
								<Button
									title='Enviar'
									color='#1a237e'
									style={{
										borderRadius: 20,
										fontSize: 15,
									}}
									onPress={() => props.handleSubmit()}
								/>
							</View>
						)}
					</Formik>
				</View>
			</Modal>

			<Modal
				animationType='fade'
				visible={completedModal}
				transparent={true}
				onRequestClose={() => {
					setCompletedModal(!completedModal);
				}}>
				<View
					style={{
						marginTop: 60,
					}}>
					<View
						style={{
							backgroundColor: '#fff',
							shadowColor: '#000',
							marginTop: 200,
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
									setCompletedModal(!completedModal);
								}}></Icon.Button>
						</TouchableOpacity>
						<Text
							style={{
								alignSelf: 'center',
								fontSize: 15,
								fontWeight: 'bold',
								margin: 15,
							}}>
							¿Ha completado esta reserva?
						</Text>
						<TouchableOpacity
							style={{
								borderRadius: 20,
								fontSize: 15,
								margin: 15,
								backgroundColor: '#1a237e',
							}}
							onPress={() => {
								completeBooking(bookingId, a.UserName), setAskAgain(true);
							}}>
							<Text
								style={{
									alignSelf: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									margin: 15,
									color: '#fff',
								}}>
								Si
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								borderRadius: 20,
								fontSize: 15,
								margin: 15,
								backgroundColor: '#1a237e',
							}}
							onPress={() => {
								setAskAgain(false);
								setCompletedModal(!completedModal);
							}}>
							<Text
								style={{
									alignSelf: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									margin: 15,
									color: '#fff',
								}}>
								No
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<Modal
				animationType='fade'
				visible={showEditModal}
				transparent={true}
				onRequestClose={() => {
					setShowEditModal(!showEditModal);
				}}>
				<View
					style={{
						backgroundColor: '#fff',
						shadowColor: '#000',
						marginTop: 200,
						marginHorizontal: 20,
						borderRadius: 15,
						shadowOffset: {
							width: 2,
							height: 2,
						},
						padding: 10,
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						elevation: 15,
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
								setShowEditModal(!showEditModal);
							}}></Icon.Button>
					</TouchableOpacity>
					<Picker
						selectedValue={teamMemberValue}
						style={{
							padding: 20,
							borderRadius: 10,
							backgroundColor: '#e0e0e0',
							fontWeight: 'bold',
							fontSize: 30,
							flexGrow: 1,
							textAlign: 'center',
						}}
						onValueChange={(itemValue) => {
							setTeamMemberValue(itemValue);
						}}
						multiple={false}>
						<Picker.Item label='Select a Team Member' value='' />
						{pickeritem(teamMembers)}
					</Picker>

					<TouchableOpacity
						style={{
							borderRadius: 20,
							fontSize: 15,
							margin: 15,
							backgroundColor: '#1a237e',
						}}
						onPress={() => {
							// alert(bookingId)
							// alert(teamMemberValue)
							setIsLoading(true);
							setShowEditModal(!showEditModal);
							let bookingdetails = new FormData();
							bookingdetails.append('booking_id', bookingId);
							bookingdetails.append('username', a.UserName);
							bookingdetails.append('team_member', teamMemberValue);
							fetch('https://alsocio.com/app/accept-booking/', {
								method: 'POST',
								body: bookingdetails,
							})
								.then((response) => response.json())
								.then((responseJson) => {
									setIsLoading(false);
									setDetails(responseJson.bookings);
									setTeamMemberValue('');
								})
								.catch((error) => console.error(error));
						}}>
						<Text
							style={{
								alignSelf: 'center',
								fontSize: 15,
								fontWeight: 'bold',
								margin: 15,
								color: '#fff',
								flexGrow: 1,
							}}>
							Aceptar y asignar un miembro del equipo
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>

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
							marginTop: 200,
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
						<Text
							style={{
								alignSelf: 'center',
								fontSize: 15,
								fontWeight: 'bold',
								margin: 15,
							}}>
							¿Quieres cancelar esta reserva?
						</Text>
						<TouchableOpacity
							style={{
								borderRadius: 20,
								fontSize: 15,
								margin: 15,
								backgroundColor: '#1a237e',
							}}
							onPress={() => {
								deleteBooking(bookingId, a.UserName),
									setShowPickerModal(!showPickerModal);
								setConfirm(true);
							}}>
							<Text
								style={{
									alignSelf: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									margin: 15,
									color: '#fff',
								}}>
								Si
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								borderRadius: 20,
								fontSize: 15,
								margin: 15,
								backgroundColor: '#1a237e',
							}}
							onPress={() => {
								setConfirm(false);
								setShowPickerModal(!showPickerModal);
							}}>
							<Text
								style={{
									alignSelf: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									margin: 15,
									color: '#fff',
								}}>
								No
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

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
										{item.name}
									</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Servicio -</Text>
									<Text style={styles.rightLabel}>{item.service}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Cantidad -</Text>
									<Text style={styles.rightLabel}>{item.quantity}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Costo -</Text>
									<Text style={styles.rightLabel}>${item.cost}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Cargos adicionales -</Text>
									<Text style={styles.rightLabel}>
										{item.additional_charges}
									</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Service Date -</Text>
									<Text style={styles.rightLabel}>{item.service_date}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Tiempo de servicio -</Text>
									<Text style={styles.rightLabel}>{item.service_time}</Text>
								</View>
								<View
									style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Habla a</Text>
									<Text style={[styles.rightLabel, { width: 200 }]}>
										{item.address}
									</Text>
								</View>
								<View
									style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Ciudad</Text>
									<Text style={styles.rightLabel}>{item.city}</Text>
								</View>
								<View
									style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Región</Text>
									<Text style={styles.rightLabel}>{item.region}</Text>
								</View>
								<View
									style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Miembro del equipo</Text>
									<Text style={styles.rightLabel}>{item.team_member}</Text>
								</View>
								<View
									style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Reserva aceptada</Text>
									<Text style={styles.rightLabel}>{item.booking_accepted}</Text>
								</View>
								{showButtons(
									item.booking_accepted,
									item.booking_id,
									item.customer_mail
								)}
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
								Sin reservas
							</Text>
						</View>
					}
				/>
			)}
		</View>
	);
};

export default providerBookings;

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
});
