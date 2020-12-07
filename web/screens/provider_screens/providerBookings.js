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
import { Appbar, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import { AuthContext } from '../../components/context';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const providerBookings = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.geop.tech/app/get-provider-bookings/', {
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
	}, []);

	return (
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
										alignSelf: 'flex-start',
										textAlign: 'left',
									}}>
									Customer Email - 
								</Text>
								<Text
									style={{
										fontSize: 13,
										fontWeight: '900',
										alignSelf: 'flex-end',
										textAlign: 'right',
										marginBottom:3,
										marginLeft:5
									}}>
									{item.customer_mail}
								</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service -</Text>
								<Text style={styles.rightLabel}>{item.service}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Quantity -</Text>
								<Text style={styles.rightLabel}>{item.quantity}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Cost -</Text>
								<Text style={styles.rightLabel}>${item.cost}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Additional Charges -</Text>
								<Text style={styles.rightLabel}>{item.additional_charges}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service Date -</Text>
								<Text style={styles.rightLabel}>{item.service_date}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service Time -</Text>
								<Text style={styles.rightLabel}>{item.service_time}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Address</Text>
								<Text style={styles.rightLabel}>{item.address}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>City</Text>
								<Text style={styles.rightLabel}>{item.city}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Region</Text>
								<Text style={styles.rightLabel}>{item.region}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Team Member</Text>
								<Text style={styles.rightLabel}>{item.team_member}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Booking Accepted</Text>
								<Text style={styles.rightLabel}>{item.booking_accepted}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<TouchableOpacity
									style={{
										backgroundColor: '#1a237e',
										width: 150,
										height: 35,
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
										backgroundColor: '#1a237e',
										width: 150,
										height: 35,
										marginBottom: 5,
										borderRadius: 5,
										marginLeft: 20,
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
										}}>
										Cancel Booking
									</Text>
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
							No Bookings
						</Text>
					</View>
				}
			/>
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
		fontWeight: '700',
		flexGrow: 1,
		textAlign: 'right',
		alignSelf: 'flex-end',
	},
});
