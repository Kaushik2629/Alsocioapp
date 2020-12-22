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

const providerServices = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.geop.tech/app/get-provider-services/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setDetails(responseJson.services);
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
					title='Your Added Services'
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
									Company Name - 
								</Text>
								<Text
									style={{
										fontSize: 18,
										fontWeight: '900',
										alignSelf: 'flex-end',
										textAlign: 'right',
									}}>
									{item.company_name}
								</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Main Category -</Text>
								<Text style={styles.rightLabel}>{item.main_category}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Category -</Text>
								<Text style={styles.rightLabel}>{item.category}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Sub Category -</Text>
								<Text style={styles.rightLabel}>{item.sub_category}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service -</Text>
								<Text style={styles.rightLabel}>{item.service}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service Cost -</Text>
								<Text style={styles.rightLabel}>${item.service_cost}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Discount - </Text>
								<Text style={styles.rightLabel}>${item.discount}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Additional Requirements- </Text>
								<Text style={styles.rightLabel,{marginLeft:20,width:150,fontSize:15}}>{item.additional_requirements}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Includes- </Text>
								<Text style={styles.rightLabel,{marginLeft:10,width:150,fontSize:15}}>{item.includes}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Description- </Text>
								<Text style={styles.rightLabel,{marginLeft:10,width:150,fontSize:15}}>{item.description}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Image -</Text>
                                <Image
								style={{
                                    flexGrow:1,
									width: 100,
                                    height: 100,
                                    marginBottom:10
								}}
                                source={{ uri: 'https:alsocio.geop.tech/media/' + item.img }}
							/>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Ratings</Text>
								<Text style={styles.rightLabel}>{item.rating}</Text>
							</View>
                            <View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Additional Charges</Text>
								<Text style={styles.rightLabel}>{item.additional_charges}</Text>
							</View>
							{/* <View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
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
							</View> */}
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
							No Bookings
						</Text>
					</View>
				}
			/>
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
});
