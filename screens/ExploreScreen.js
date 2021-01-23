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
	KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, DataTable, TextInput } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import { AuthContext } from '../components/context';
import { MaterialIndicator } from 'react-native-indicators';
import { AirbnbRating, Rating } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const ExploreScreen = ({ navigation }) => {
	const {	refresh } = useContext(AuthContext);
	const a = useContext(AuthContext)

	const [isLoading, setIsLoading] = useState(true);

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-bookings/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson)
				setIsLoading(false);
				setDetails(responseJson.bookings);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, [a.itemCount]);

	const [page, setPage] = React.useState(0);
	const from = page * itemsPerPage;
	const to = (page + 1) * itemsPerPage;

	const [showPickerModal, setShowPickerModal] = useState(false);

	const [confirm, setConfirm] = useState(false);

	const deleteBooking = (bookingId, username) => {
		setIsLoading(true);
		if (confirm) {
			let bookingdetails = new FormData();
			bookingdetails.append('booking_id', bookingId);
			bookingdetails.append('username', username);
			fetch('https://alsocio.com/app/decline-booking/', {
				method: 'POST',
				body: bookingdetails,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setDetails(responseJson.bookings);
					refresh();
					setIsLoading(false);
				})
				.catch((error) => console.error(error));
		}
	};

	const [currentDate, setCurrentDate] = useState('');

	useEffect(() => {
		var date1 = new Date().getDate(); //Current Date
		var month = new Date().getMonth() + 1; //Current Month
		var year = new Date().getFullYear(); //Current Year
		var hours = new Date().getHours(); //Current Hours
		var min = new Date().getMinutes(); //Current Minutes
		var sec = new Date().getSeconds(); //Current Seconds
		setCurrentDate(year + '/' + month + '/' + date1);
	}, []);

	const [date, setDate] = useState('');

	const [slot, setSlot] = useState([]);

	const [slotValue, setSlotValue] = useState();

	const [showEditModal, setShowEditModal] = useState(false);

	const [id, setId] = useState();

	const [bookingId, setBookingId] = useState();

	const pickeritem = (slotItem) => {
		let q = [...slotItem];
		return q.map((element) => {
			return <Picker.Item label={element} value={element} />;
		});
	};

	const [showReviewModal, setShowReviewModal] = useState(false);

	const [ratingCount, setRatingCount] = useState(1);

	const [review, setReview] = useState('');

	const showStars = (ratings, bookingId) => {
		let stars = [];
		for (let i = 1; i <= 5; i++) {
			if (ratings == null) {
				stars.push(
					<TouchableOpacity
						key={i}
						onPress={() => {
							setRatingCount(i),
								setShowReviewModal(true),
								setBookingId(bookingId);
						}}>
						{i <= ratingCount ? (
							<Icon
								name='md-star'
								color='#fbc02d'
								size={36}
								style={{ margin: 10 }}
							/>
						) : (
							<Icon
								name='md-star-outline'
								size={36}
								color='#000'
								style={{ margin: 10 }}
							/>
						)}
					</TouchableOpacity>
				);
			} else {
				stars.push(
					<TouchableOpacity
						key={i}
						onPress={() => {
							setRatingCount(i),
								setShowReviewModal(true),
								setBookingId(bookingId);
						}}>
						{i <= ratings ? (
							<Icon
								name='md-star'
								color='#fbc02d'
								size={36}
								style={{ margin: 10 }}
							/>
						) : (
							<Icon
								name='md-star-outline'
								size={36}
								color='#000'
								style={{ margin: 10 }}
							/>
						)}
					</TouchableOpacity>
				);
			}
		}

		return (
			<View
				style={{
					flexDirection: 'row',
					alignSelf: 'center',
				}}>
				{stars}
			</View>
		);
	};

	return a.UserName != null ? (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#262262',alignItems:'center', marginTop: 0 }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Reservaciones'
				/>
			</Appbar.Header>

			{/* To Delete Bookings */}
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
							shadowOpacity: 0.8,
							shadowRadius: 10,
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
								backgroundColor: '#262262',
							}}
							onPress={() => {
								deleteBooking(bookingId, a.UserName),
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
								si
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								borderRadius: 20,
								fontSize: 15,
								margin: 15,
								backgroundColor: '#262262',
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

			{/* To Edit Bookings */}
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
					<View style={{ flexDirection: 'row' }}>
						<DatePicker
							date={date}
							mode='date'
							placeholder={date}
							format='YYYY-MM-DD'
							minDate={currentDate}
							confirmBtnText='Confirm'
							cancelBtnText='Cancel'
							customStyles={{
								dateIcon: {
									position: 'absolute',
									left: 0,
									top: 4,
									marginLeft: 0,
								},
								dateInput: {
									marginLeft: 36,
								},
							}}
							onDateChange={(date) => {
								setDate(date);
								let get_Date = new Date(date);
								let day = get_Date.getDay();
								let slotDetails = new FormData();
								slotDetails.append('day', day);
								slotDetails.append('service_id', id);
								fetch('https://alsocio.com/app/get-time-slots/', {
									method: 'POST',
									body: slotDetails,
								})
									.then((response) => response.json())
									.then((responseJson) => {
										if (responseJson.slots == 'No Slots Available') {
											setSlot(['No Slots Available']);
										} else {
											setSlot(responseJson.slots);
										}
									});
							}}
						/>
						<Picker
							selectedValue={slotValue}
							style={{
								height: 40,
								width: 200,
								borderRadius: 10,
								backgroundColor: '#e0e0e0',
								fontSize: 30,
								textAlign: 'center',
								fontWeight: 'bold',
							}}
							onValueChange={(itemValue) => {
								setSlotValue(itemValue);
							}}
							multiple={false}>
							<Picker.Item label={slotValue} value={slotValue} />
							{pickeritem(slot)}
						</Picker>
					</View>
					<TouchableOpacity
						style={{
							borderRadius: 20,
							fontSize: 15,
							margin: 15,
							backgroundColor: '#262262',
						}}
						onPress={() => {
							setShowEditModal(!showEditModal);
							setIsLoading(true);
							let bookingdetails = new FormData();
							bookingdetails.append('booking_id', bookingId);
							bookingdetails.append('username', a.UserName);
							bookingdetails.append('service_date', date);
							bookingdetails.append('service_time', slotValue);
							fetch('https://alsocio.com/app/update-service-date-time/', {
								method: 'POST',
								body: bookingdetails,
							})
								.then((response) => response.json())
								.then((responseJson) => {
									setDetails(responseJson.bookings);
									setIsLoading(false);
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
							Guardar
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{/* For Ratings and Reviews */}
			<Modal
				animationType='fade'
				visible={showReviewModal}
				transparent={true}
				onRequestClose={() => {
					setShowReviewModal(!showReviewModal);
				}}>
				<View
					style={{
						flexGrow: 0.2,
						// alignSelf:'center',
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
						marginVertical: imageheight / 7,
					}}>
					<TouchableOpacity
						style={{
							alignSelf: 'flex-end',
						}}>
						<Icon.Button
							name='ios-close'
							size={25}
							backgroundColor='#fff'
							color='#000'
							style={{ padding: 15, textAlign: 'right' }}
							onPress={() => {
								setShowReviewModal(!showReviewModal);
							}}></Icon.Button>
					</TouchableOpacity>

					<View style={{ justifyContent: 'center' }}>
						<Text style={{ textAlign: 'center', fontSize: 20 }}>
							Rating - {ratingCount}/5
						</Text>

						<TextInput
							placeholder='Ingrese su reseña (opcional)'
							multiline={true}
							numberOfLines={4}
							style={{
								margin: 10,
								textAlign: 'center',
								paddingLeft: 10,
								borderColor: '#262262',
								color: '#000',
							}}
							onChangeText={(val) => {
								setReview(val);
							}}
						/>
					</View>
					<TouchableOpacity
						style={{
							borderRadius: 10,
							fontSize: 15,
							margin: 15,
							backgroundColor: '#262262',
						}}
						onPress={() => {
							if (ratingCount != 0) {
								setShowReviewModal(false)
								setIsLoading(true);
								let ratingDetails = new FormData();
								ratingDetails.append('username', a.UserName);
								ratingDetails.append('booking_id', bookingId);
								ratingDetails.append('rating', ratingCount);
								if (review != null) {
									ratingDetails.append('review', review);
								}
								fetch('https://alsocio.com/app/update-rating-review/', {
									method: 'POST',
									body: ratingDetails,
								})
									.then((response) => response.json())
									.then((responseJson) => {
										console.log(responseJson);
										setDetails(responseJson.bookings);
										setIsLoading(false);
									})
									.catch((error) => console.error(error));
							} else {
								setShowReviewModal(false);
							}
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
			</Modal>

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
									}}>
									<Text
										style={{
											fontSize: 18,
											fontWeight: '900',
											alignSelf: 'center',
										}}>
										{item.service_name}
									</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Por -</Text>
									<Text style={styles.rightLabel}>{item.company_name}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Costo -</Text>
									<Text style={styles.rightLabel}>${item.cost}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Cantidad -</Text>
									<Text style={styles.rightLabel}>{item.quantity}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Fecha de servicio -</Text>
									<Text style={styles.rightLabel}>{item.service_date}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Tiempo de servicio -</Text>
									<Text style={styles.rightLabel}>{item.service_time}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Estado -</Text>
									<Text style={styles.rightLabel}>{item.status}</Text>
								</View>
								<View
									style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Miembro del equipo</Text>
									<Text style={styles.rightLabel}>{item.team_member}</Text>
								</View>
								{item.status == 'Rejected' ? (
									<View style={{ flexGrow: 1, padding: 10 }}>
										<Text
											style={{
												textAlign: 'center',
												fontSize: 20,
												fontWeight: '700',
											}}>
											Cancelado
										</Text>
									</View>
								) : null}
								{item.rating != null
									? showStars(item.rating, item.booking_id)
									: null}
								{item.status == 'Completed' && item.rating == null
									? showStars(item.rating, item.booking_id)
									: null}
								{item.status != 'Completed' && item.status != 'Rejected' ? (
									<View
										style={{
											flexGrow: 1,
											flexDirection: 'row',
											paddingVertical: 10,
										}}>
										<TouchableOpacity
											style={{
												backgroundColor: '#262262',
												width: imagewidth / 3.65,
												height: 56,
												marginBottom: 5,
												borderRadius: 5,
												alignItems: 'center',
												justifyContent: 'center',
											}}
											onPress={() => {
												setDate(item.service_date);
												setBookingId(item.booking_id), setId(item.service_id);
												setSlotValue(item.service_time);
												setShowEditModal(true);
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
												setBookingId(item.booking_id), setConfirm(true);
												setShowPickerModal(true);
											}}>
											<Text
												style={{
													color: '#fff',
													alignSelf: 'center',
													textAlign: 'center',
													fontSize: 13,
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
												navigation.navigate('chatContainer', {
													provider_name: item.company_name,
													booking_id: item.booking_id,
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
								Sin reservas
							</Text>
						</View>
					}
				/>
			)}
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Appbar.Header style={{ backgroundColor: '#262262',alignItems:'center', marginTop: 0 }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Reservaciones'
				/>
			</Appbar.Header>
			<View>
				<TouchableOpacity
					style={{
						borderRadius: 20,
						fontSize: 15,
						margin: 15,
						backgroundColor: '#262262',
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
						Inicie sesión para ver sus reservas
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ExploreScreen;

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
});
