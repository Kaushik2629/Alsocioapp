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
import { Appbar, Card, DataTable } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import { AuthContext } from '../components/context';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const ExploreScreen = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.geop.tech/app/get-bookings/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setDetails(responseJson.bookings);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, [a.UserName]);

	const [page, setPage] = React.useState(0);
	const from = page * itemsPerPage;
	const to = (page + 1) * itemsPerPage;

	const [showPickerModal, setShowPickerModal] = useState(false);

	const [confirm, setConfirm] = useState(false);

	const deleteBooking = (bookingId, username) => {
		if (confirm) {
			let bookingdetails = new FormData();
			bookingdetails.append('booking_id', bookingId);
			bookingdetails.append('username', username);
			fetch('https://alsocio.geop.tech/app/decline-booking/', {
				method: 'POST',
				body: bookingdetails,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setDetails(responseJson.bookings);
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

	return a.UserName != null ? (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#1a237e' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Your Bookings'
					subtitleStyle={{ marginBottom: 5 }}
				/>
				<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />
			</Appbar.Header>

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
							Do You want to cancel this booking?
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
							}}>
							<Text
								style={{
									alignSelf: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									margin: 15,
									color: '#fff',
								}}>
								Yes
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
								fetch('https://alsocio.geop.tech/app/get-time-slots/', {
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
							backgroundColor: '#1a237e',
						}}
						onPress={() => {
							let bookingdetails = new FormData();
							bookingdetails.append('booking_id', bookingId);
							bookingdetails.append('username', a.UserName);
							bookingdetails.append('service_date', date);
							bookingdetails.append('service_time', slotValue);
							fetch('https://alsocio.geop.tech/app/update-service-date-time/', {
								method: 'POST',
								body: bookingdetails,
							})
								.then((response) => response.json())
								.then((responseJson) => {
									setDetails(responseJson.bookings);
								})
								.catch((error) => console.error(error));
							setShowEditModal(!showEditModal);
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
							Save
						</Text>
					</TouchableOpacity>
				</View>
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
								<Text style={styles.leftLabel}>By -</Text>
								<Text style={styles.rightLabel}>{item.company_name}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Cost -</Text>
								<Text style={styles.rightLabel}>{item.cost}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Quantity -</Text>
								<Text style={styles.rightLabel}>{item.quantity}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service Date -</Text>
								<Text style={styles.rightLabel}>{item.service_date}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service Time -</Text>
								<Text style={styles.rightLabel}>{item.service_time}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Status -</Text>
								<Text style={styles.rightLabel}>{item.status}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Team Member</Text>
								<Text style={styles.rightLabel}>{item.team_member}</Text>
							</View>
							<View
								style={{
									flexGrow: 1,
									flexDirection: 'row',
									paddingVertical: 10,
								}}>
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
										Edit
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
										Cancel Booking
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
								fontWeight: '900',
								fontFamily: 'sans-serif-light',
							}}>
							No Bookings!
						</Text>
					</View>
				}
			/>
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Appbar.Header style={{ backgroundColor: '#1a237e' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Your Bookings'
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
						Login to view your Bookings
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
